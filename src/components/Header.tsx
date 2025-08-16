import React from 'react';

interface HeaderProps {
    isAuthenticated: boolean;
    currentUser: { name: string } | null;
    onLoginClick: () => void;
    onSignupClick: () => void;
    onLogoutClick: () => void;
    onNavClick: (sectionId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, currentUser, onLoginClick, onSignupClick, onLogoutClick }) => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-caribbean Current shadow-sm">
            <nav className="container mx-auto px-6 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {/* Placeholder for your logo with increased size */}
                    <img src="bg4.png" alt="ResearchConnect Logo" className="w-14 h-14"/>
                    {/* Increased the font size of the text */}
                    <a href="#" className="font-bold text-xl text-white-800" >ResearchPortal</a>
                </div>
                <div className="flex items-center space-x-4">
                    {!isAuthenticated ? (
                        <div id="auth-buttons" className="space-x-2">
                            <button id="login-button" className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-md text-sm hover:bg-gray-300 transition" onClick={onLoginClick}>Log In</button>
                            <button id="signup-button" className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-md text-sm hover:bg-blue-700 transition" onClick={onSignupClick}>Sign Up</button>
                        </div>
                    ) : (
                        <div id="user-info" className="space-x-2 items-center flex">
                            <span id="welcome-message" className="text-white font-medium text-sm">Welcome, {currentUser?.name}!</span>
                            <button id="logout-button" className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-md text-sm hover:bg-gray-300 transition" onClick={onLogoutClick}>Log Out</button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;