import { Bell, Search, UserCircle } from 'lucide-react';

export const AdminHeader = () => {
    return (
        <header className="fixed top-0 left-64 right-0 z-10 flex h-20 items-center justify-between border-b border-neutral-200/80 bg-white/80 px-8 backdrop-blur-sm">
            <div>
                
                <Search className="h-5 w-5 text-neutral-500" />
            </div>
            <div className="flex items-center space-x-6">
                <Bell className="h-5 w-5 text-neutral-500" />
                <UserCircle className="h-7 w-7 text-neutral-600" />
            </div>
        </header>
    );
};