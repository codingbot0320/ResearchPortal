import React from 'react';

interface User {
    name: string;
    role: string;
    email: string;
    id: number;
}

interface HeaderProps {
    isAuthenticated: boolean;
    currentUser: User | null;
    onLoginClick: () => void;
    onSignupClick: () => void;
    onLogoutClick: () => void;
    onNavClick: (sectionId: string) => void;
}

const Header: React.FC<HeaderProps> = () => {
    return (
        <header className="bg-slate-900 text-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-6 py-3">
                <h1 className="text-2xl font-bold text-white">ResearchConnect</h1>
            </div>
        </header>
    );
};

export default Header;