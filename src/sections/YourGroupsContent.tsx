import React from 'react';
import GroupCard from '../components/GroupCard';

interface Group {
    title: string;
    createdDate: string;
    creator: string;
    description: string;
    avatar: string;
    members: string[];
    applicants: string[];
    memberLimit: number; // This property was likely missing.
}

interface YourGroupsContentProps {
    groupsData: Group[];
    isAuthenticated: boolean;
    currentUser: { name: string } | null;
}

const YourGroupsContent: React.FC<YourGroupsContentProps> = ({ groupsData, isAuthenticated, currentUser }) => {
    const myJoinedGroups = isAuthenticated && currentUser ? groupsData.filter(group => group.members.includes(currentUser.name)) : [];

    return (
        <section id="your-groups-content" className="md:col-span-1">
            <h1 className="text-3xl font-bold text-white">Your Groups</h1>
            <p className="text-white mt-1">These are the research groups you have joined.</p>
            <div id="my-groups-container" className="mt-6 space-y-4">
                {myJoinedGroups.length > 0 ? (
                    myJoinedGroups.map(group => (
                        <div key={group.title} className="group-card bg-white p-6 rounded-lg shadow-md">
                            <h3 className="font-bold text-xl text-white">{group.title}</h3>
                            <p className="text-sm text-white mt-2">You are a member of this group.</p>
                        </div>
                    ))
                ) : (
                    <p className="text-white">You have not joined any groups yet.</p>
                )}
            </div>
        </section>
    );
};

export default YourGroupsContent;