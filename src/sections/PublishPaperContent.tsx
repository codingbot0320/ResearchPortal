import React from 'react';

interface PublishPaperContentProps {
    isAuthenticated: boolean;
    onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

const PublishPaperContent: React.FC<PublishPaperContentProps> = ({ isAuthenticated, onOpenAuthModal }) => {
    const handleButtonClick = (action: 'standard' | 'premium') => {
        if (!isAuthenticated) {
            onOpenAuthModal('login');
            return;
        }

        handlePayment(action);
    };
    
    const handlePayment = async (action: 'standard' | 'premium') => {
        const amount = action === 'standard' ? 9900 : 29900;
        const description = action === 'standard' ? "Standard Publishing Plan" : "Premium Guidance Plan";

        try {
            const response = await fetch('/api/payments/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount }),
            });
            const order = await response.json();

            const options = {
                key: 'YOUR_RAZORPAY_KEY_ID',
                amount: order.amount,
                currency: order.currency,
                name: "ResearchConnect",
                description,
                order_id: order.id,
                handler: function (response: any) {
                    alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com",
                },
                theme: {
                    color: "#FCD34D",
                },
            };
            
            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                alert("Payment failed: " + response.error.description);
            });
            rzp1.open();

        } catch (error) {
            console.error("Payment error:", error);
            alert("An error occurred during payment. Please try again.");
        }
    };

    return (
        <section id="publish-paper-content" className="md:col-span-1">
            <h1 className="text-3xl font-bold text-white">Publish Paper</h1>
            <p className="text-white mt-1">Get expert guidance to publish your research papers in top journals and conferences.</p>
            <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Pricing for Our Services</h2>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                        <h3 className="font-bold text-lg text-gray-800">Standard Publishing</h3>
                        <p className="text-2xl font-bold text-blue-600 my-2">$99</p>
                        <ul className="text-sm text-gray-500 list-disc list-inside text-left">
                            <li>Basic manuscript review</li>
                            <li>Submission formatting assistance</li>
                            <li>Basic journal selection guidance</li>
                        </ul>
                        <button
                            className="mt-4 bg-yellow-400 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-yellow-500 transition"
                            onClick={() => handleButtonClick('standard')}
                        >
                            Buy Now
                        </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                        <h3 className="font-bold text-lg text-gray-800">Premium Guidance</h3>
                        <p className="text-2xl font-bold text-blue-600 my-2">$299</p>
                        <ul className="text-sm text-gray-500 list-disc list-inside text-left">
                            <li>Detailed expert review</li>
                            <li>One-on-one consultation</li>
                            <li>Strategic journal/conference selection</li>
                            <li>Full submission support</li>
                        </ul>
                        <button
                            className="mt-4 bg-yellow-400 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-yellow-500 transition"
                            onClick={() => handleButtonClick('premium')}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PublishPaperContent;
