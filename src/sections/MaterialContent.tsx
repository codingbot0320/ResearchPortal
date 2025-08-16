import React, { useState } from 'react';
import Modal from '../components/Modal';

interface MaterialContentProps {
    isAuthenticated: boolean;
    onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

const MaterialContent: React.FC<MaterialContentProps> = ({ isAuthenticated, onOpenAuthModal }) => {
    const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
    const [isGuidesModalOpen, setIsGuidesModalOpen] = useState(false);
    const [isCitingModalOpen, setIsCitingModalOpen] = useState(false);
    const [isProposalsModalOpen, setIsProposalsModalOpen] = useState(false);

    const handleButtonClick = (modalName: string) => {
        if (!isAuthenticated) {
            onOpenAuthModal('login');
            return;
        }

        if (modalName === 'templates') {
            setIsTemplatesModalOpen(true);
        } else if (modalName === 'guides') {
            setIsGuidesModalOpen(true);
        } else if (modalName === 'citing') {
            setIsCitingModalOpen(true);
        } else if (modalName === 'proposals') {
            setIsProposalsModalOpen(true);
        }
    };

    return (
        <section id="material-content" className="md:col-span-1">
            <h1 className="text-3xl font-bold text-white">Research Materials</h1>
            <p className="text-white mt-1">Access a curated library of templates, guides, and sample papers to assist your research journey.</p>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Paper Templates</h2>
                    <p className="text-sm text-gray-500">Download templates for different journal formats and paper types.</p>
                    <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition" onClick={() => handleButtonClick('templates')}>Browse Templates</button>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Submission Guides</h2>
                    <p className="text-sm text-gray-500">Get step-by-step guides on how to submit your paper to various publishers.</p>
                    <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition" onClick={() => handleButtonClick('guides')}>View Guides</button>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Citing & Referencing Guides</h2>
                    <p className="text-sm text-gray-500">Learn proper citation styles for APA, MLA, Chicago, and more.</p>
                    <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition" onClick={() => handleButtonClick('citing')}>Explore Guides</button>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Research Proposal Templates</h2>
                    <p className="text-sm text-gray-500">Find templates and examples for creating compelling research proposals.</p>
                    <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition" onClick={() => handleButtonClick('proposals')}>Get Templates</button>
                </div>
            </div>

            {/* Paper Templates Modal */}
            <Modal title="Paper Templates" isOpen={isTemplatesModalOpen} onClose={() => setIsTemplatesModalOpen(false)}>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">APA 7th Edition Template</h3>
                            <p className="text-sm text-gray-500">The standard format for psychology and social sciences.</p>
                        </div>
                        <a href="/templates/apa_template.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">IEEE Paper Template</h3>
                            <p className="text-sm text-gray-500">A two-column template for engineering and computer science papers.</p>
                        </div>
                        <a href="/templates/ieee_template.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Nature Journal Template</h3>
                            <p className="text-sm text-gray-500">A specialized template for submissions to the Nature family of journals.</p>
                        </div>
                        <a href="/templates/nature_template.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Medical Case Report Template</h3>
                            <p className="text-sm text-gray-500">Structured template for writing a medical case report.</p>
                        </div>
                        <a href="/templates/medical_template.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">PhD Thesis LaTeX Template</h3>
                            <p className="text-sm text-gray-500">A comprehensive LaTeX template for writing a doctoral thesis.</p>
                        </div>
                        <a href="/templates/thesis_latex.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                </div>
            </Modal>

            {/* Submission Guides Modal */}
            <Modal title="Submission Guides" isOpen={isGuidesModalOpen} onClose={() => setIsGuidesModalOpen(false)}>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">General Journal Submission Checklist</h3>
                            <p className="text-sm text-gray-500">A step-by-step checklist to ensure your paper is ready for submission.</p>
                        </div>
                        <a href="/guides/submission_checklist.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Elsevier Submission Guide</h3>
                            <p className="text-sm text-gray-500">Detailed guide on how to use the Elsevier online submission portal.</p>
                        </div>
                        <a href="/guides/elsevier_guide.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Springer Nature Guide</h3>
                            <p className="text-sm text-gray-500">Instructions for submitting to journals published by Springer Nature.</p>
                        </div>
                        <a href="/guides/springer_guide.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Cover Letter Best Practices</h3>
                            <p className="text-sm text-gray-500">Sample cover letters and tips for writing a compelling one.</p>
                        </div>
                        <a href="/guides/cover_letter_guide.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Navigating Peer Review</h3>
                            <p className="text-sm text-gray-500">A guide on how to respond to reviewer comments professionally.</p>
                        </div>
                        <a href="/guides/peer_review_guide.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                </div>
            </Modal>

            {/* Citing & Referencing Guides Modal */}
            <Modal title="Citing & Referencing Guides" isOpen={isCitingModalOpen} onClose={() => setIsCitingModalOpen(false)}>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">APA 7th Edition Guide</h3>
                            <p className="text-sm text-gray-500">Complete guide to using APA style for in-text citations and references.</p>
                        </div>
                        <a href="/guides/apa_guide.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">MLA 9th Edition Guide</h3>
                            <p className="text-sm text-gray-500">The latest guide for formatting your Works Cited page in MLA style.</p>
                        </div>
                        <a href="/guides/mla_guide.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Chicago Manual of Style Guide</h3>
                            <p className="text-sm text-gray-500">A guide to the notes-and-bibliography system used in history and humanities.</p>
                        </div>
                        <a href="/guides/chicago_guide.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Citation Management Tool Guide</h3>
                            <p className="text-sm text-gray-500">Instructions on using tools like Zotero and Mendeley to manage your sources.</p>
                        </div>
                        <a href="/guides/zotero_guide.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Plagiarism Prevention Checklist</h3>
                            <p className="text-sm text-gray-500">A checklist to help you avoid plagiarism in your research papers.</p>
                        </div>
                        <a href="/guides/plagiarism_checklist.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                </div>
            </Modal>

            {/* Research Proposal Templates Modal */}
            <Modal title="Research Proposal Templates" isOpen={isProposalsModalOpen} onClose={() => setIsProposalsModalOpen(false)}>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Standard Research Proposal Template</h3>
                            <p className="text-sm text-gray-500">A general template that includes sections for your Introduction, Literature Review, Methodology, and Timeline.</p>
                        </div>
                        <a href="/templates/proposal_template.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Grant Proposal Template</h3>
                            <p className="text-sm text-gray-500">Tailored for seeking funding, this template emphasizes sections on project budget, a clear statement of work, and expected impact.</p>
                        </div>
                        <a href="/templates/grant_proposal.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Science Project Proposal Template</h3>
                            <p className="text-sm text-gray-500">A focused template for science-related projects and experiments.</p>
                        </div>
                        <a href="/templates/science_proposal.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Social Science Proposal Template</h3>
                            <p className="text-sm text-gray-500">Structured for social science research, including sections on ethics.</p>
                        </div>
                        <a href="/templates/social_science_proposal.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Thesis Proposal Template</h3>
                            <p className="text-sm text-gray-500">A comprehensive template for students preparing a thesis or dissertation.</p>
                        </div>
                        <a href="/templates/thesis_proposal.txt" download className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition">Download</a>
                    </div>
                </div>
            </Modal>
        </section>
    );
};

export default MaterialContent;