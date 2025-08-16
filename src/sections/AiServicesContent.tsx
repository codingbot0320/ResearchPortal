import React, { useState } from 'react';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

interface User {
    name: string;
    role: string;
    hasPaid?: boolean;
}

interface AiServicesContentProps {
    isAuthenticated: boolean;
    onOpenAuthModal: (mode: 'login' | 'signup') => void;
    onOpenChatbot: () => void;
}

const AiServicesContent: React.FC<AiServicesContentProps> = ({ isAuthenticated, onOpenAuthModal, onOpenChatbot }) => {
    const [isSummarizerModalOpen, setIsSummarizerModalOpen] = useState(false);
    const [summarizerResult, setSummarizerResult] = useState('');
    const [loadingSummarizer, setLoadingSummarizer] = useState(false);

    const handleSummarize = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            onOpenAuthModal('login');
            return;
        }

        const textToSummarize = (e.target as HTMLFormElement)['text-to-summarize'].value;
        if (!textToSummarize) return;
        
        setLoadingSummarizer(true);
        setSummarizerResult('');
        
        try {
            const response = await fetch('/api/ai/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToSummarize }),
            });
            const data = await response.json();
            
            if (response.ok) {
                setSummarizerResult(data.summary);
            } else {
                alert(data.error || 'Failed to generate summary.');
            }
        } catch (error) {
            console.error('Frontend summarization error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoadingSummarizer(false);
        }
    };

    return (
        <section id="ai-services-content" className="md:col-span-1">
            <h1 className="text-3xl font-bold text-white">AI Services</h1>
            <p className="text-white mt-1">Leverage our AI tools to enhance your research and collaboration.</p>

            <div className="mt-6 p-6 bg-white rounded-lg shadow-md flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Need help with your research?</h2>
                    <p className="text-sm text-gray-500 mt-2">Get instant assistance from our AI chatbot.</p>
                </div>
                <button
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition"
                    onClick={onOpenChatbot}>
                    Get Help
                </button>
            </div>
            
            <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Smart Summarizer</h2>
                <p className="text-sm text-gray-500 mt-2">Upload a research paper or paste text to get a concise summary.</p>
                <button id="open-summarizer-button" className="mt-4 bg-yellow-400 text-gray-800 font-semibold py-2 px-6 rounded-md shadow-md hover:bg-yellow-500 transition" onClick={() => isAuthenticated ? setIsSummarizerModalOpen(true) : onOpenAuthModal('login')}>🌟 Try Summarizer</button>
            </div>

            <Modal title="🌟 Smart Summarizer" isOpen={isSummarizerModalOpen} onClose={() => setIsSummarizerModalOpen(false)}>
                <form id="summarizer-form" className="space-y-4" onSubmit={handleSummarize}>
                    <div>
                        <label htmlFor="text-to-summarize" className="block text-gray-700 font-medium mb-1">Paste your text below</label>
                        <textarea id="text-to-summarize" rows={8} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Paste the content of a research paper, article, or abstract here."></textarea>
                    </div>
                    <button type="submit" id="summarize-button" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">Summarize</button>
                </form>
                {loadingSummarizer && <LoadingSpinner />}
                {summarizerResult && (
                    <div id="summary-result" className="p-4 bg-gray-100 rounded-lg mt-4">
                        <h3 className="font-bold text-gray-800">Summary:</h3>
                        <p className="mt-2">{summarizerResult}</p>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default AiServicesContent;