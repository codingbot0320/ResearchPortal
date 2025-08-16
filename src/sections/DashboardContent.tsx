import React, { useState } from 'react';
import GroupCard from '../components/GroupCard';
import Modal from '../components/Modal';

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

interface DashboardContentProps {
    groupsData: Group[];
    isAuthenticated: boolean;
    currentUser: { name: string, role: string } | null;
    onJoinGroup: (groupTitle: string, applicationData: any) => void;
    onCreateGroup: (newGroup: Group) => void;
    onOpenAuthModal: (mode: 'login' | 'signup') => void;
    onEditGroup: (groupTitle: string, newDescription: string) => void;
    onDeleteGroup: (groupTitle: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ groupsData, isAuthenticated, currentUser, onJoinGroup, onCreateGroup, onOpenAuthModal, onEditGroup, onDeleteGroup }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [joiningGroup, setJoiningGroup] = useState<string | null>(null);

    const filteredGroups = groupsData.filter(group =>
        group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateGroupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const title = (form.elements.namedItem('group-title') as HTMLInputElement).value;
        const description = (form.elements.namedItem('group-description') as HTMLTextAreaElement).value;
        const memberLimit = parseInt((form.elements.namedItem('member-limit') as HTMLInputElement).value, 10);

        if (currentUser && !isNaN(memberLimit) && memberLimit > 0) {
            const newGroup: Group = {
                title,
                description,
                createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                creator: currentUser.name,
                avatar: `https://placehold.co/48x48/FCD34D/374151?text=${currentUser.name.charAt(0).toUpperCase()}`,
                members: [currentUser.name],
                applicants: [],
                memberLimit: memberLimit
            };
            onCreateGroup(newGroup);
            setIsCreateModalOpen(false);
            alert(`New group "${title}" created successfully!`);
        } else {
             alert('Please enter a valid member limit.');
        }
    };
    
    const handleEditGroupClick = (group: Group) => {
        setEditingGroup(group);
        setIsEditModalOpen(true);
    };

    const handleEditGroupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingGroup) {
            const form = e.target as HTMLFormElement;
            const newDescription = (form.elements.namedItem('edited-description') as HTMLTextAreaElement).value;
            onEditGroup(editingGroup.title, newDescription);
            setIsEditModalOpen(false);
            setEditingGroup(null);
            alert(`Group "${editingGroup.title}" has been updated.`);
        }
    };

    const handleJoinGroupClick = (groupTitle: string) => {
        if (!isAuthenticated) {
            onOpenAuthModal('login');
            return;
        }
        setJoiningGroup(groupTitle);
        setIsJoinModalOpen(true);
    };
    
    const handleJoinFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('applicant-name') as HTMLInputElement)?.value;
        const email = (form.elements.namedItem('applicant-email') as HTMLInputElement)?.value;
        const phone = (form.elements.namedItem('applicant-phone') as HTMLInputElement)?.value;
        const resume = 'resume-file.pdf';

        if (name && email && phone && joiningGroup) {
            const applicationData = { name, email, phone, resume };
            onJoinGroup(joiningGroup, applicationData);
            setIsJoinModalOpen(false);
            setJoiningGroup(null);
        }
    };

    return (
        <main id="dashboard-content" className="md:col-span-1">
            <h1 className="text-2xl font-bold text-white">Create or join a research group</h1>
            <p className="text-white mt-1">Collaborate with students and researchers all over the world!</p>
            <div className="mt-6 flex items-center space-x-4">
                <div className="relative flex-1">
                    <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                    </div>
                </div>
                <button className="create-group-btn bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition" onClick={() => isAuthenticated ? setIsCreateModalOpen(true) : onOpenAuthModal('login')}>
                    + Create Group
                </button>
            </div>
            <div id="group-cards-container" className="mt-6 space-y-4">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map(group => (
                        <GroupCard
                            key={group.title}
                            group={group}
                            isAuthenticated={isAuthenticated}
                            currentUser={currentUser}
                            onJoinClick={handleJoinGroupClick}
                            onVisitProfileClick={() => setIsProfileModalOpen(true)}
                            onEditClick={handleEditGroupClick}
                            onDeleteClick={onDeleteGroup}
                        />
                    ))
                ) : (
                    <p className="text-white">No groups found.</p>
                )}
            </div>
            <Modal title="Create a New Research Group" isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <form id="create-group-form" className="space-y-4" onSubmit={handleCreateGroupSubmit}>
                    <div>
                        <label htmlFor="group-title" className="block text-gray-700 font-medium mb-1">Group Title</label>
                        <input type="text" id="group-title" name="group-title" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="group-description" className="block text-gray-700 font-medium mb-1">Description</label>
                        <textarea id="group-description" name="group-description" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="member-limit" className="block text-gray-700 font-medium mb-1">Member Limit</label>
                        <input type="number" id="member-limit" name="member-limit" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">Create Group</button>
                </form>
            </Modal>
            <Modal title={`Edit Group: ${editingGroup?.title}`} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <form className="space-y-4" onSubmit={handleEditGroupSubmit}>
                    <div>
                        <label htmlFor="edited-description" className="block text-gray-700 font-medium mb-1">Description</label>
                        <textarea id="edited-description" name="edited-description" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue={editingGroup?.description} required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">Save Changes</button>
                </form>
            </Modal>
            <Modal title={`Apply to Join: ${joiningGroup}`} isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)}>
                <form id="join-group-form" className="space-y-4" onSubmit={handleJoinFormSubmit}>
                    <div>
                        <label htmlFor="applicant-name" className="block text-gray-700 font-medium mb-1">Full Name</label>
                        <input type="text" id="applicant-name" name="applicant-name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="applicant-email" className="block text-gray-700 font-medium mb-1">Email ID</label>
                        <input type="email" id="applicant-email" name="applicant-email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="applicant-phone" className="block text-gray-700 font-medium mb-1">Phone Number</label>
                        <input type="tel" id="applicant-phone" name="applicant-phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="applicant-resume" className="block text-gray-700 font-medium mb-1">Resume (simulated upload)</label>
                        <input type="file" id="applicant-resume" name="applicant-resume" className="w-full text-gray-700 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">Submit Application</button>
                </form>
            </Modal>
            <Modal title="Profile" isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}>
                <p className="text-sm text-gray-600">Simulated profile for the group creator. In a real app, this would show detailed user information.</p>
            </Modal>
        </main>
    );
};

export default DashboardContent;