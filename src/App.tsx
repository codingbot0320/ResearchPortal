import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import LandingPage from './sections/LandingPage';
import DashboardContent from './sections/DashboardContent';
import YourGroupsContent from './sections/YourGroupsContent';
import PublishPaperContent from './sections/PublishPaperContent';
import AiServicesContent from './sections/AiServicesContent';
import MaterialContent from './sections/MaterialContent';
import ConnectContent from './sections/ConnectContent';
import ChatbotPage from './sections/ChatbotPage';
import LoadingSpinner from './components/LoadingSpinner';

interface Group {
    title: string;
    createdDate: string;
    creator: string;
    description: string;
    avatar: string;
    members: string[];
    applicants: string[];
    memberLimit: number;
}

interface User {
    name: string;
    role: string;
    email: string;
    id: number;
}

const App: React.FC = () => {
    const [groupsData, setGroupsData] = useState<Group[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentSection, setCurrentSection] = useState('home');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [authStatus, setAuthStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false); // New state for show/hide password

    const fetchGroups = () => {
        setIsLoading(true);
        fetch('/api/groups')
            .then(response => response.json())
            .then(data => {
                setGroupsData(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            setIsAuthenticated(true);
            setCurrentSection('available');
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            setIsAuthenticated(true);
            setCurrentSection('available');
        } else {
            localStorage.removeItem('currentUser');
            setIsAuthenticated(false);
            setCurrentSection('home');
        }
    }, [currentUser]);

    const handleLoginClick = () => {
        setAuthMode('login');
        setIsAuthModalOpen(true);
    };

    const handleSignupClick = () => {
        setAuthMode('signup');
        setIsAuthModalOpen(true);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentSection('home');
        window.location.reload(); 
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
        const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;
        const name = email?.split('@')[0];
        
        let role = 'student';
        if (authMode === 'signup') {
            const roleElement = form.elements.namedItem('role') as RadioNodeList;
            if (roleElement) {
                role = roleElement.value;
            }
        }
        
        if (email && password) {
            const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
            const body = { email, password, name, role };
            
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                const data = await response.json();

                if (response.ok) {
                    setCurrentUser(data.user);
                    setIsAuthModalOpen(false);
                    setAuthStatus('');
                } else {
                    setAuthStatus(data.message || data.error || 'Authentication failed.');
                }
            } catch (error) {
                console.error('Authentication Error:', error);
                setAuthStatus('An error occurred. Please try again.');
            }
        } else {
            setAuthStatus('Please fill out all fields.');
        }
    };
    
    const handleForgotPassword = () => {
        alert("A password reset link has been sent to your email (simulated).");
    };

    const handleNavClick = (sectionId: string) => {
        if (isAuthenticated) {
            setCurrentSection(sectionId);
        } else {
            setAuthMode('login');
            setIsAuthModalOpen(true);
        }
    };

    const handleSidebarClick = (sectionId: string) => {
        if (isAuthenticated) {
            setCurrentSection(sectionId);
        } else {
            setAuthMode('login');
            setIsAuthModalOpen(true);
        }
    };

    const handleJoinGroup = (groupTitle: string, applicationData: any) => {
        if (!isAuthenticated || !currentUser) return;

        fetch(`/api/groups/${groupTitle}/apply`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(applicationData), 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            fetchGroups();
            alert(`Your application to join the group has been submitted!`);
        })
        .catch(error => console.error('Error submitting application:', error));
    };

    const handleCreateGroup = (newGroup: Group) => {
        fetch('/api/groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newGroup),
        })
        .then(response => response.json())
        .then(() => {
            fetchGroups();
            alert(`New group "${newGroup.title}" created successfully!`);
        })
        .catch(error => console.error('Error creating group:', error));
    };

    const handleEditGroup = (groupTitle: string, newDescription: string) => {
        fetch(`/api/groups/${groupTitle}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: newDescription }),
        })
        .then(() => {
            fetchGroups();
            alert(`Group "${groupTitle}" has been updated.`);
        })
        .catch(error => console.error('Error updating group:', error));
    };
    
    const handleDeleteGroup = (groupTitle: string) => {
        if (!isAuthenticated || !currentUser) return;

        if (window.confirm(`Are you sure you want to delete the group "${groupTitle}"?`)) {
            fetch(`/api/groups/${groupTitle}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                fetchGroups();
                alert(`Group "${groupTitle}" has been deleted.`);
            })
            .catch(error => console.error('Error deleting group:', error));
        }
    };

    const handleOpenChatbot = () => {
        if (isAuthenticated) {
            setCurrentSection('chatbot');
        } else {
            handleLoginClick();
        }
    };

    const renderContent = () => {
        if (!isAuthenticated) {
            return <LandingPage onCtaClick={handleSignupClick} />;
        }
        
        if (isLoading) {
            return (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">Loading groups from the server...</p>
                </div>
            );
        }

        switch (currentSection) {
            case 'available':
                return (
                    <DashboardContent 
                        groupsData={groupsData} 
                        isAuthenticated={isAuthenticated} 
                        currentUser={currentUser} 
                        onJoinGroup={handleJoinGroup} 
                        onCreateGroup={handleCreateGroup} 
                        onOpenAuthModal={handleLoginClick} 
                        onEditGroup={handleEditGroup}
                        onDeleteGroup={handleDeleteGroup}
                    />
                );
            case 'your-groups':
                return <YourGroupsContent groupsData={groupsData} isAuthenticated={isAuthenticated} currentUser={currentUser} />;
            case 'publish-paper':
                return <PublishPaperContent 
                          isAuthenticated={isAuthenticated}
                          onOpenAuthModal={handleLoginClick}
                       />;
            case 'ai-services':
                return <AiServicesContent isAuthenticated={isAuthenticated} onOpenAuthModal={handleLoginClick} onOpenChatbot={handleOpenChatbot} />;
            case 'material':
                return <MaterialContent isAuthenticated={isAuthenticated} onOpenAuthModal={handleLoginClick} />;
            case 'connect':
                return <ConnectContent isAuthenticated={isAuthenticated} onOpenAuthModal={handleLoginClick} onNavClick={handleNavClick} />;
            case 'chatbot':
                return <ChatbotPage isAuthenticated={isAuthenticated} onOpenAuthModal={handleLoginClick} />;
            default:
                return <LandingPage onCtaClick={handleSignupClick} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header 
                isAuthenticated={isAuthenticated} 
                currentUser={currentUser} 
                onLoginClick={handleLoginClick} 
                onSignupClick={handleSignupClick} 
                onLogoutClick={handleLogout} 
                onNavClick={handleNavClick} 
            />

            <div className={`flex-grow pt-16 ${isAuthenticated ? 'authenticated-bg' : ''}`}>
                <div className={`container mx-auto px-6`}>
                    {isAuthenticated ? (
                        <div id="authenticated-dashboard" className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
                            <Sidebar activeSection={currentSection} onSidebarClick={handleSidebarClick} currentUser={currentUser} />
                            <div className="md:col-span-1">
                                {renderContent()}
                            </div>
                        </div>
                    ) : (
                        renderContent()
                    )}
                </div>
            </div>
            
            <Modal title={authMode === 'login' ? 'Log In' : 'Sign Up'} isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
                <form id="auth-form" className="space-y-4" onSubmit={handleAuthSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
                        <input type="email" id="email" name="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    {/* Password input with show/hide functionality */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            id="password" 
                            name="password" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            required 
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414L5.586 7H4a1 1 0 100 2h1.586l3.707 3.707a1 1 0 001.414 0l.586-.586L15 15a1 1 0 101.414-1.414L10 8.414V7h1.586l3.707 3.707a1 1 0 001.414 0L19 13.586V10a1 1 0 00-1-1h-1.586l-3.707-3.707a1 1 0 00-1.414 0L7 4.586V3a1 1 0 00-1-1zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {authMode === 'login' && (
                        <div className="text-sm mt-1 text-right">
                            <a href="#" onClick={handleForgotPassword} className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                                Forgot Password?
                            </a>
                        </div>
                    )}
                    
                    {authMode === 'signup' && (
                        <div id="role-selection" className="space-y-2">
                            <label className="block text-gray-700 font-medium mb-1">I am a...</label>
                            <div className="flex items-center space-x-4">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="role" value="student" className="form-radio text-blue-500" defaultChecked />
                                    <span className="ml-2 text-gray-700">Student</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input type="radio" name="role" value="professor" className="form-radio text-blue-500" />
                                    <span className="ml-2 text-gray-700">Professor</span>
                                </label>
                            </div>
                        </div>
                    )}
                    <button type="submit" id="submit-auth-button" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">{authMode === 'login' ? 'Log In' : 'Sign Up'}</button>
                </form>
                {authStatus && <p className="mt-4 text-center text-red-500">{authStatus}</p>}
            </Modal>

            <footer className="mt-12 py-8 bg-gray-800 text-white">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; 2025 ResearchConnect. All rights reserved.</p>
                    <p className="mt-2 text-sm">Contact us at <a href="mailto:contact@researchconnect.com" className="text-blue-400 hover:underline">contact@researchconnect.com</a></p>
                </div>
            </footer>
        </div>
    );
};

export default App;