    import React, { useState, useRef, useEffect } from 'react';
    import LoadingSpinner from '../components/LoadingSpinner';

    interface ChatbotPageProps {
        isAuthenticated: boolean;
        onOpenAuthModal: (mode: 'login' | 'signup') => void;
    }

    const ChatbotPage: React.FC<ChatbotPageProps> = ({ isAuthenticated, onOpenAuthModal }) => {
        const [chatHistory, setChatHistory] = useState<{ sender: string; message: string }[]>([]);
        const [chatInput, setChatInput] = useState('');
        const [loadingChat, setLoadingChat] = useState(false);

        const chatEndRef = useRef<HTMLDivElement>(null);

        // Auto scroll
        useEffect(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, [chatHistory]);

        const generateResponse = (input: string) => {
            const msg = input.toLowerCase();

            if (msg.includes("hello") || msg.includes("hi")) {
                return "Hello! 👋 How can I help you with your research today?";
            }
            if (msg.includes("research topic")) {
                return "Here are some trending research topics:\n• AI in Healthcare\n• Blockchain Security\n• Climate Change Analytics\n• Cybersecurity";
            }
            if (msg.includes("publish") || msg.includes("paper")) {
                return "To publish a paper:\n1. Choose a journal\n2. Format properly\n3. Submit online\n4. Wait for peer review";
            }
            if (msg.includes("team") || msg.includes("collaborate")) {
                return "You can join or create research teams on this platform based on shared interests.";
            }
            if (msg.includes("ai") || msg.includes("machine learning")) {
                return "AI fields you can explore:\n• NLP\n• Computer Vision\n• Deep Learning\n• Generative AI";
            }
            if (msg.includes("help")) {
                return "I can help with:\n• Research ideas\n• Paper writing\n• Collaboration\n• Tech guidance";
            }

            return "🤔 I'm not sure about that. Try asking about research, AI, teams, or publishing!";
        };

        const handleChatSubmit = (e: React.FormEvent) => {
            e.preventDefault();

            if (!isAuthenticated) {
                onOpenAuthModal('login');
                return;
            }

            if (chatInput.trim() === '') return;

            const userMessage = chatInput;

            const newUserMessage = { sender: 'user', message: userMessage };
            setChatHistory(prev => [...prev, newUserMessage]);

            setChatInput('');
            setLoadingChat(true);

            setTimeout(() => {
                const botReply = generateResponse(userMessage);

                const aiResponse = { sender: 'ai', message: botReply };
                setChatHistory(prev => [...prev, aiResponse]);

                setLoadingChat(false);
            }, 1000);
        };

        return (
            <main className="md:col-span-1">
                <h1 className="text-3xl font-bold text-white">AI Chatbot</h1>
                <p className="text-white mt-1">Ask anything about research, AI, or collaboration.</p>

                <div className="mt-6 p-6 bg-white rounded-lg shadow-md flex flex-col h-[600px]">

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 border rounded-lg bg-gray-50 space-y-3">

                        {chatHistory.length === 0 && (
                            <p className="text-gray-500 text-center">
                                Start chatting with your AI assistant 🚀
                            </p>
                        )}

                        {chatHistory.map((chat, index) => (
                            <div
                                key={index}
                                className={`max-w-[75%] p-3 rounded-xl text-sm ${
                                    chat.sender === 'user'
                                        ? 'ml-auto bg-blue-600 text-white'
                                        : 'mr-auto bg-gray-200 text-gray-800'
                                }`}
                            >
                                {chat.message}
                            </div>
                        ))}

                        {loadingChat && <LoadingSpinner />}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleChatSubmit} className="mt-4 flex space-x-2">
                        <input
                            type="text"
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ask something..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </main>
        );
    };

    export default ChatbotPage;