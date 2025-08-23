import React, { useState } from 'react';
import Modal from '../components/Modal';

interface ResearchTopic {
    title: string;
    description: string;
    professor: string;
    applicants: { name: string, email: string }[];
}

interface ProfessorDashboardProps {
    isAuthenticated: boolean;
    onOpenAuthModal: (mode: 'login' | 'signup') => void;
    onPostResearch: (researchTopic: ResearchTopic) => void;
    currentUser: { name: string, email: string } | null;
}

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ isAuthenticated, onOpenAuthModal, onPostResearch, currentUser }) => {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [researchData, setResearchData] = useState<ResearchTopic[]>([]);

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        
        const form = e.target as HTMLFormElement;
        const title = (form.elements.namedItem('research-title') as HTMLInputElement)?.value;
        const description = (form.elements.namedItem('research-description') as HTMLTextAreaElement)?.value;
        
        const newResearch: ResearchTopic = {
            title,
            description,
            professor: currentUser.name,
            applicants: []
        };

        onPostResearch(newResearch);
        setIsPostModalOpen(false);
        setResearchData([...researchData, newResearch]); // Optimistically update state
        alert(`Research topic "${newResearch.title}" posted successfully!`);
    };

    return (
        <main className="md:col-span-1">
            <h1 className="text-3xl font-bold text-white">Professor Dashboard</h1>
            <p className="text-white mt-1">Post your research topics for students to apply to.</p>
            
            <div className="flex justify-end mt-4">
                <button
                    onClick={() => isAuthenticated ? setIsPostModalOpen(true) : onOpenAuthModal('login')}
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    + Post New Research
                </button>
            </div>
            
            <div id="research-topics-container" className="mt-6 space-y-4">
                {researchData.length > 0 ? (
                    researchData.map((topic, index) => (
                        <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="font-bold text-xl text-gray-800">{topic.title}</h3>
                            <p className="text-sm text-gray-500 mt-2">{topic.description}</p>
                            <p className="text-xs text-gray-400 mt-2">Posted by: {topic.professor}</p>
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold text-gray-800">Applicants:</h4>
                                {topic.applicants.length > 0 ? (
                                    <ul className="list-disc list-inside text-gray-600">
                                        {topic.applicants.map((applicant, idx) => (
                                            <li key={idx}>{applicant.name} ({applicant.email})</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">No students have applied yet.</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-white">You have not posted any research topics yet.</p>
                )}
            </div>

            {/* Post Research Modal */}
            <Modal title="Post a New Research Topic" isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)}>
                <form className="space-y-4" onSubmit={handlePostSubmit}>
                    <div>
                        <label htmlFor="research-title" className="block text-gray-700 font-medium mb-1">Research Title</label>
                        <input type="text" id="research-title" name="research-title" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                    </div>
                    <div>
                        <label htmlFor="research-description" className="block text-gray-700 font-medium mb-1">Description</label>
                        <textarea id="research-description" name="research-description" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">Post Research</button>
                </form>
            </Modal>
        </main>
    );
};

export default ProfessorDashboard;