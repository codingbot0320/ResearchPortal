import React, { useState } from 'react';

interface ConnectContentProps {
    isAuthenticated: boolean;
    onOpenAuthModal: (mode: 'login' | 'signup') => void;
    onNavClick: (sectionId: string) => void;
}

const ConnectContent: React.FC<ConnectContentProps> = ({ isAuthenticated, onOpenAuthModal, onNavClick }) => {
    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('contact-name') as HTMLInputElement)?.value;
        const email = (form.elements.namedItem('contact-email') as HTMLInputElement)?.value;
        const message = (form.elements.namedItem('contact-message') as HTMLTextAreaElement)?.value;

        if (name && email && message) {
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message }),
                });

                if (response.ok) {
                    alert('Message sent successfully!');
                    form.reset();
                } else {
                    alert('Failed to send message. Please try again.');
                }
            } catch (error) {
                console.error('Failed to send message:', error);
                alert('An error occurred. Please try again.');
            }
        }
    };

    const faqData = [
        {
            question: "How do I create a new research group?",
            answer: "You can create a new research group from the 'Available Groups' page on your dashboard. Simply click the '+ Create Group' button, fill in the details, and your group will be live."
        },
        {
            question: "Can I collaborate with professors from other universities?",
            answer: "Yes, ResearchConnect is designed for global collaboration. You can join or create groups with students and professors from any university, based on shared research interests."
        },
        {
            question: "What are the AI services available?",
            answer: "We offer an AI-powered 'Smart Summarizer' to get quick summaries of research papers, and a 'Smart Chatbot' for real-time research assistance."
        },
        {
            question: "Is my personal data secure?",
            answer: "Yes, we prioritize your security. All data is stored in a secure backend database, and sensitive information is handled with care. We do not share your data with third parties without your consent."
        },
        // --- New FAQs added below ---
        {
            question: "How can I edit my user profile?",
            answer: "You can edit your user profile details by navigating to the 'Your Profile' section (accessible via your user menu in the top-right corner). From there, you can update your information and research interests."
        },
        {
            question: "What is the process for applying to a group?",
            answer: "To apply to a group, click the 'Join Research Group' button on any group card. A modal will pop up asking for your details, including your name, email, and a simulated resume. Once submitted, the group creator will review your application."
        },
        {
            question: "How do I report a group or user?",
            answer: "If you encounter inappropriate content or behavior, you can use our built-in reporting tool. Navigate to the user's profile or group page and click 'Report'. Our moderation team will review the submission."
        }
        // --- End of new FAQs ---
    ];

    const toggleFaq = (index: number) => {
        setFaqOpen(faqOpen === index ? null : index);
    };

    return (
        <section id="connect-content" className="md:col-span-1">
            <h1 className="text-3xl font-bold text-white">Contact Us</h1>
            <p className="text-white mt-1">We'd love to hear from you. Fill out the form below to get in touch with our team.</p>
            
            <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Send us a message</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="contact-name" className="block text-gray-700 font-medium mb-1">Your Name</label>
                        <input type="text" id="contact-name" name="contact-name" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                    </div>
                    <div>
                        <label htmlFor="contact-email" className="block text-gray-700 font-medium mb-1">Your Email</label>
                        <input type="email" id="contact-email" name="contact-email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                    </div>
                    <div>
                        <label htmlFor="contact-message" className="block text-gray-700 font-medium mb-1">Your Message</label>
                        <textarea id="contact-message" name="contact-message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required></textarea>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition">Send Message</button>
                </form>
            </div>

            <div className="mt-6 p-6 bg-white rounded-lg shadow-md grid md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Links</h2>
                    <ul className="space-y-2 text-gray-700 list-disc list-inside">
                        <li><a href="#" className="hover:underline" onClick={() => onNavClick('available')}>Join a Research Group</a></li>
                        <li><a href="#" className="hover:underline" onClick={() => onNavClick('ai-services')}>Browse AI Services</a></li>
                        <li><a href="#" className="hover:underline" onClick={() => onNavClick('publish-paper')}>Explore Publication Guides</a></li>
                        <li><a href="#" className="hover:underline" onClick={() => onNavClick('material')}>Read Our Blog</a></li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Our Details</h2>
                    <ul className="space-y-2 text-gray-700">
                        <li><strong>Email:</strong> support@researchportalhub.com</li>
                        <li><strong>Phone:</strong> +91 98765 43210</li>
                        <li><strong>Address:</strong> Innovation Center, IIT Madras Research Park, Chennai, India</li>
                    </ul>
                </div>
            </div>

            <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <div key={index} className="border-b border-gray-200">
                            <button
                                className="flex justify-between items-center w-full py-4 text-left text-lg font-semibold text-gray-700"
                                onClick={() => toggleFaq(index)}
                            >
                                <span>{faq.question}</span>
                                <svg className={`w-5 h-5 transition-transform ${faqOpen === index ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {faqOpen === index && (
                                <div className="py-2 text-gray-600">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ConnectContent;