import React from 'react';

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal fixed inset-0 bg-gray-900 bg-opacity-70 z-50 items-center justify-center p-4 modal-active">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative">
                <button id="close-modal-btn" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition" onClick={onClose}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default Modal;