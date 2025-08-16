import React from 'react';

interface SidebarProps {
    activeSection: string;
    onSidebarClick: (sectionId: string) => void;
    currentUser: { name: string, role: string } | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSidebarClick, currentUser }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const isProfessor = currentUser?.role === 'professor';
    const isConnectActive = activeSection === 'connect';

    return (
        <aside className="bg-sidebar-bg p-6 rounded-lg shadow-lg flex flex-col h-full sticky top-[100px]">
            {currentUser && (
                <div className="flex items-center mb-6 border-b pb-4 border-gray-200">
                    <img
                        src={`https://placehold.co/48x48/FCD34D/374151?text=${currentUser.name.charAt(0).toUpperCase()}`}
                        alt="User Avatar"
                        className="w-12 h-12 rounded-full border-2 border-yellow-400"
                    />
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">{getGreeting()},</p>
                        <h2 className="text-lg font-bold text-white">{currentUser.name}!</h2>
                    </div>
                </div>
            )}

            <nav className="flex-grow space-y-2">
                {isProfessor ? (
                    <button
                        onClick={() => onSidebarClick('professor-dashboard')}
                        className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200 ${activeSection === 'professor-dashboard' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-white hover:bg-gray-700'}`}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197h3"></path></svg>
                        <span>Available Groups</span>
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => onSidebarClick('available')}
                            className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200 ${activeSection === 'available' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-white hover:bg-gray-700'}`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h3m-3 4h3"></path></svg>
                            <span>Available Groups</span>
                        </button>
                        <button
                            onClick={() => onSidebarClick('your-groups')}
                            className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200 ${activeSection === 'your-groups' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-white hover:bg-gray-700'}`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h-1a1 1 0 01-1-1v-2a1 1 0 011-1h1a1 1 0 011 1v2a1 1 0 01-1 1zM9 20h-1a1 1 0 01-1-1v-2a1 1 0 011-1h1a1 1 0 011 1v2a1 1 0 01-1 1zM7 16h10M7 12h10M7 8h10"></path></svg>
                            <span>Your Groups</span>
                        </button>
                    </>
                )}
                <button
                    onClick={() => onSidebarClick('publish-paper')}
                    className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200 ${activeSection === 'publish-paper' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-white hover:bg-gray-700'}`}
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.467 9.5 4.5 8 4.5 6.49 4.5 5.168 5.467 4 6.253v13m8-13c1.168-.786 2.5-1.753 4-1.753 1.5 0 2.832.967 4 1.753v13m-4-13c-1.168-.786-2.5-1.753-4-1.753S9.168 5.467 8 6.253M20 13v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1m16 4v-1a2 2 0 01-2-2H6a2 2 0 01-2-2v-1m16 4H4"></path></svg>
                    <span>Publish Paper</span>
                </button>
                <button
                    onClick={() => onSidebarClick('ai-services')}
                    className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200 ${activeSection === 'ai-services' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-white hover:bg-gray-700'}`}
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 10v4m14-4v4M3 8h4m0 8H3m18-8h-4m0 8h4M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"></path></svg>
                    <span>AI Services</span>
                </button>
                <button
                    onClick={() => onSidebarClick('material')}
                    className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200 ${activeSection === 'material' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-white hover:bg-gray-700'}`}
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.467 9.5 4.5 8 4.5 6.49 4.5 5.168 5.467 4 6.253v13m8-13c1.168-.786 2.5-1.753 4-1.753 1.5 0 2.832.967 4 1.753v13m-4-13c-1.168-.786-2.5-1.753-4-1.753S9.168 5.467 8 6.253M20 13v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1m16 4v-1a2 2 0 01-2-2H6a2 2 0 01-2-2v-1m16 4H4"></path></svg>
                    <span>Research Materials</span>
                </button>
                <button
                    onClick={() => onSidebarClick('connect')}
                    className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200 ${isConnectActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-white hover:bg-gray-700'}`}
                >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <span>Connect & Support</span>
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;