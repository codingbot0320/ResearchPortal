import React, { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

interface ChatbotPageProps {
    isAuthenticated: boolean;
    onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

const ChatbotPage: React.FC<ChatbotPageProps> = ({ isAuthenticated, onOpenAuthModal }) => {
    const [chatHistory, setChatHistory] = useState<{ sender: string; message: string }[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [loadingChat, setLoadingChat] = useState(false);
    
    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            onOpenAuthModal('login');
            return;
        }
        if (chatInput.trim() === '') return;

        const newUserMessage = { sender: 'user', message: chatInput };
        setChatHistory(prevChat => [...prevChat, newUserMessage]);
        setChatInput('');
        setLoadingChat(true);

        setTimeout(() => {
            const aiResponse = { sender: 'ai', message: `Hello! I am an AI assistant. How can I help with your research, ${chatInput}?` };
            setChatHistory(prevChat => [...prevChat, aiResponse]);
            setLoadingChat(false);
        }, 1500);
    };

    return (
        <main className="md:col-span-1">
            <h1 className="text-3xl font-bold text-white">AI Chatbot</h1>
            <p className="text-white mt-1">Ask our AI assistant any questions you have about your research.</p>

            <div className="mt-6 p-6 bg-white rounded-lg shadow-md flex flex-col h-[600px]">
                <div className="flex-1 overflow-y-auto p-4 border rounded-lg bg-gray-50">
                    {chatHistory.length > 0 ? (
                        chatHistory.map((chat, index) => (
                            <div key={index} className={`mb-2 p-2 rounded-lg text-sm ${chat.sender === 'user' ? 'bg-blue-100 text-right ml-auto' : 'bg-gray-200 text-left mr-auto'}`}>
                                <p className="font-semibold">{chat.sender === 'user' ? 'You' : 'AI'}:</p>
                                <p>{chat.message}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">Start a conversation with our AI assistant!</p>
                    )}
                    {loadingChat && <LoadingSpinner />}
                </div>
                
                <form className="mt-4 flex space-x-2" onSubmit={handleChatSubmit}>
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">
                        Send
                    </button>
                </form>
            </div>
        </main>
    );
};

export default ChatbotPage;