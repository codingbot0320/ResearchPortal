import React from 'react';

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

interface GroupCardProps {
    group: Group;
    isAuthenticated: boolean;
    currentUser: { name: string } | null;
    onJoinClick: (groupTitle: string) => void;
    onVisitProfileClick: () => void;
    onEditClick: (group: Group) => void;
    onDeleteClick: (groupTitle: string) => void; // Added this prop
}

const GroupCard: React.FC<GroupCardProps> = ({ group, isAuthenticated, currentUser, onJoinClick, onVisitProfileClick, onEditClick, onDeleteClick }) => {
    const isMember = isAuthenticated && currentUser && group.members.includes(currentUser.name);
    const isCreator = isAuthenticated && currentUser?.name === group.creator;
    const isFull = group.members.length >= group.memberLimit;
    
    const joinButton = isFull ? (
        <span className="text-sm text-red-600 font-semibold">Group is Full</span>
    ) : isMember ? (
        <span className="text-sm text-green-600 font-semibold">Joined</span>
    ) : (
        <button className="join-group-btn bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm shadow-md hover:bg-blue-700 transition" onClick={() => onJoinClick(group.title)}>
            Join Research Group
        </button>
    );

    return (
        <div className="group-card bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>Created on: {group.createdDate}</span>
                </div>
                <span className={`text-sm font-semibold ${isFull ? 'text-red-600' : 'text-gray-600'}`}>
                    {group.members.length} / {group.memberLimit} Members
                </span>
            </div>
            <h3 className="font-bold text-xl text-gray-800 mt-2">{group.title}</h3>
            <div className="flex items-center space-x-3 mt-4">
                <img src={group.avatar} className="profile-image" alt="Creator avatar" />
                <span className="text-sm font-medium text-gray-600">{group.creator}</span>
            </div>
            <p className="text-sm text-gray-500 mt-4">{group.description}</p>
            <div className="flex justify-end space-x-3 mt-6">
                {isCreator && (
                    <>
                        <button className="edit-group-btn bg-yellow-400 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm shadow-md hover:bg-yellow-500 transition" onClick={() => onEditClick(group)}>
                            Edit Group
                        </button>
                        <button className="delete-group-btn bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm shadow-md hover:bg-red-700 transition" onClick={() => onDeleteClick(group.title)}>
                            Delete Group
                        </button>
                    </>
                )}
                <button className="visit-profile-btn bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 transition" onClick={() => onVisitProfileClick()}>
                    Visit Profile
                </button>
                {joinButton}
            </div>
        </div>
    );
};

export default GroupCard;