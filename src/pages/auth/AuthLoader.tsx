

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from './api';
import { toast } from 'sonner';
import Spinner from '@/components/ui/spinner';
import { useNavigate } from 'react-router-dom';

export const AuthLoader = ({ children }: React.PropsWithChildren) => {
    const { token, user, setUser, setLoading, isLoading } = useAuthStore();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            if (!token || user) return;
            setLoading(true);
            try {
                const { data: user } = await authApi.getUserProfile();
                setUser(user, token);
                if (user.role === 'admin') {
                    navigate('/admin');
                }
            } catch (err) {
                toast.error('Session expired!');
                setUser(null, null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Spinner />
                <p className="ml-2 text-muted-foreground">Authenticating user...</p>
            </div>
        );
    }

    return <>{children}</>;
};

