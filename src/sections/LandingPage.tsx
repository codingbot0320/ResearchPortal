import React from 'react';
import { MouseEventHandler } from 'react';

interface LandingPageProps {
    onCtaClick: MouseEventHandler<HTMLButtonElement>;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCtaClick }) => {
    return (
        <div id="landing-page" className="text-center">
            <div className="relative w-screen h-[500px] overflow-hidden -mx-6">
                <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover z-0">
                    <source src="/bg3.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gray-900 opacity-60 z-10"></div>
                
                <div className="relative z-20 px-6 py-20 flex flex-col justify-center items-center h-full text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 font-merriweather">A New Paradigm in Academic Collaboration</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto font-lato">Create or join a research group and collaborate with students and researchers all over the world!</p>
                    <button id="cta-login-button" className="mt-8 bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition" onClick={onCtaClick}>Get Started</button>
                </div>
            </div>
            
            <div className="mt-20">
                <h2 className="text-3xl font-bold text-white mb-6 font-merriweather">Our Mission</h2>
                {/* Removed bg-white class from this parent div */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white rounded-lg shadow-md mission-card">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1a2 2 0 01-2 2H7a2 2 0 01-2-2V4zM5 8a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" /></svg>
                        <h3 className="font-bold text-xl text-gray-800 mb-2 font-merriweather">Connect & Collaborate</h3>
                        <p className="text-sm text-gray-500 font-lato">Easily find and connect with students and professors based on your research interests and skills.</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md mission-card">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.637.391 1 1 0 01.12.924l-1.026 3.65a1 1 0 01-1.222.685l-1.802-.5a1 1 0 01-.62.883l-3.328 1.428a1 1 0 01-.966-.02l-2.853-1.63a1 1 0 01-.282-1.455l3.245-3.618a1 1 0 011.082-.266l2.128.587a1 1 0 01.635-.392l1.026-3.65a1 1 0 011.222-.685l1.802.5a1 1 0 01.62-.883l3.328-1.428a1 1 0 01.966.02l2.853 1.63a1 1 0 01.282 1.455l-3.245 3.618a1 1 0 01-1.082.266l-2.128-.587zM7.5 7a.5.5 0 00-.5.5v2.5a.5.5 0 001 0V7.5a.5.5 0 00-.5-.5z" clipRule="evenodd" /></svg>
                        <h3 className="font-bold text-xl text-gray-800 mb-2 font-merriweather">Advance Your Research</h3>
                        <p className="text-sm text-gray-500 font-lato">Access AI-powered tools and a rich library of resources to streamline your research process.</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md mission-card">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 012 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clipRule="evenodd" /></svg>
                        <h3 className="font-bold text-xl text-gray-800 mb-2 font-merriweather">Publish & Succeed</h3>
                        <p className="text-sm text-gray-500 font-lato">Get expert guidance, publication support, and a verifiable record of your work.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;