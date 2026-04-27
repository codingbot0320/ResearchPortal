import React from 'react';

interface User {
    name: string;
    role: string;
    email: string;
    id: number;
}

interface SidebarProps {
    activeSection: string;
    onSidebarClick: (sectionId: string) => void;
    currentUser: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSidebarClick, currentUser }) => {
    const menuItems = [
        { id: 'available', label: 'Available Groups' },
        { id: 'your-groups', label: 'Your Groups' },
        { id: 'publish-paper', label: 'Publish Paper' },
        { id: 'ai-services', label: 'AI Services' },
        { id: 'material', label: 'Research Materials' },
        { id: 'connect', label: 'Connect & Support' },
        { id: 'chatbot', label: 'Chatbot' },
    ];

    return (
        <aside className="bg-slate-800/95 text-white shadow-xl rounded-[32px] p-6 min-h-[640px]">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-xl font-bold">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="text-sm text-slate-300">Good evening,</p>
                    <p className="text-xl font-semibold leading-tight">{currentUser?.name}!</p>
                </div>
            </div>
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSidebarClick(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-3xl transition duration-200 ${
                            activeSection === item.id
                                ? 'bg-slate-700 text-white shadow-inner'
                                : 'text-slate-200 hover:bg-slate-700/70 hover:text-white'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
            {currentUser && (
                <div className="mt-10 rounded-3xl bg-slate-900/80 p-5 border border-slate-700">
                    <h3 className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-4">Profile</h3>
                    <p className="text-white font-semibold">{currentUser.name}</p>
                    <p className="text-slate-400 text-sm mt-1">{currentUser.role}</p>
                    <p className="text-slate-400 text-sm mt-2">{currentUser.email}</p>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;