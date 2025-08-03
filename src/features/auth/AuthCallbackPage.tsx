// src/features/auth/AuthCallbackPage.tsx

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getUserProfile } from './api';
import { toast } from 'sonner';
import Spinner from '@/components/ui/spinner';

export const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser, setLoading } = useAuthStore();

    const token = searchParams.get('token');

    useEffect(() => {
        const handleLogin = async () => {
            if (!token) {
                toast.error('Not found token!');
                navigate('/login');
                return;
            }

            try {
                // Lưu token tạm vào store trước
                setLoading(true);
                useAuthStore.setState({ token });

                const { data: user } = await getUserProfile();
                setUser(user, token);
                toast.success('Login successfully!');
                navigate('/');
            } catch (err) {
                toast.error('Error when login Google!');
                setUser(null, null);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        handleLogin();
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Spinner />
            <p className="text-muted-foreground mt-2">Authenticating login with Google...</p>
        </div>
    );
};
