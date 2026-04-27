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
    currentUser: { name: string; role: string; email: string; id: number } | null;
    onJoinClick: (groupTitle: string, applicationData: any) => void;
    onVisitProfileClick: () => void;
    onEditClick: (group: Group) => void;
    onDeleteClick: (groupTitle: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
    group,
    isAuthenticated,
    currentUser,
    onJoinClick,
    onVisitProfileClick,
    onEditClick,
    onDeleteClick,
}) => {
    const isCreator = currentUser && group.creator === currentUser.name;
    const isMember = currentUser && group.members.includes(currentUser.name);
    const hasApplied = currentUser && group.applicants.includes(currentUser.name);

    const handleJoinClick = () => {
        if (!isAuthenticated || !currentUser) return;
        const applicationData = {
            applicantName: currentUser.name,
            applicantEmail: currentUser.email || '',
            message: `I would like to join the group "${group.title}".`,
        };
        onJoinClick(group.title, applicationData);
    };

    return (
        <div className="bg-white shadow-2xl rounded-[30px] p-6 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Created on {group.createdDate}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-900">{group.title}</h3>
                </div>
                <div className="text-sm text-slate-500 font-medium">{group.members.length} / {group.memberLimit} Members</div>
            </div>
            <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-300 text-slate-900 flex items-center justify-center text-lg font-semibold">
                    {group.creator.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="text-base font-semibold text-slate-900">{group.creator}</p>
                    <p className="text-sm text-slate-500">{group.description}</p>
                </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    {hasApplied && <span className="text-amber-600 font-medium">Application Pending</span>}
                    {isMember && <span className="text-emerald-600 font-medium">Member</span>}
                </div>
                <div className="flex flex-wrap gap-3 justify-end">
                    <button
                        onClick={onVisitProfileClick}
                        className="rounded-full border border-slate-300 px-5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                        Visit Profile
                    </button>
                    {!isMember && !hasApplied && !isCreator && (
                        <button
                            onClick={handleJoinClick}
                            className="rounded-full bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700 transition"
                        >
                            Join Research Group
                        </button>
                    )}
                </div>
            </div>
            {isCreator && (
                <div className="mt-6 flex gap-3 justify-end">
                    <button
                        onClick={() => onEditClick(group)}
                        className="rounded-full bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600 transition"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDeleteClick(group.title)}
                        className="rounded-full bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 transition"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default GroupCard;