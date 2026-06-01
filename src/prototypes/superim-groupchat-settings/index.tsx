/**
 * @name GroupChatSettings Page
 * @description Group chat settings page with member management, group info editing, and permissions
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member';
  isOnline?: boolean;
}

interface GroupInfo {
  name: string;
  description: string;
  avatar: string;
  createdAt: string;
  memberCount: number;
  announcement?: string;
  announcementDate?: string;
}

type SendMessagePermission = 'all' | 'admin';
type GroupType = 'public' | 'private';

const mockGroup: GroupInfo = {
  name: 'Design Team',
  description: 'A place for designers to share ideas and collaborate on projects.',
  avatar: 'DT',
  createdAt: 'Jan 15, 2024',
  memberCount: 12,
  announcement: '🎉 Welcome to Design Team! Please share your ideas freely.',
  announcementDate: 'Jan 15, 2024',
};

const mockMembers: Member[] = [
  { id: '1', name: 'You', avatar: 'ME', role: 'owner', isOnline: true },
  { id: '2', name: 'Amara Okafor', avatar: 'AO', role: 'admin', isOnline: true },
  { id: '3', name: 'Kwame Nkrumah', avatar: 'KN', role: 'member', isOnline: false },
  { id: '4', name: 'Zara Mensah', avatar: 'ZM', role: 'member', isOnline: true },
  { id: '5', name: 'Kofi Annan', avatar: 'KA', role: 'member', isOnline: false },
  { id: '6', name: 'Amina Jalloh', avatar: 'AJ', role: 'member', isOnline: true },
];

const GroupChatSettingsPage: React.FC = () => {
  const [group, setGroup] = useState<GroupInfo>(mockGroup);
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [showEditName, setShowEditName] = useState(false);
  const [showEditDescription, setShowEditDescription] = useState(false);
  const [_, _a] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTransferOwnerConfirm, setShowTransferOwnerConfirm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberActions, setShowMemberActions] = useState(false);
  const [editName, setEditName] = useState(group.name);
  const [editDescription, setEditDescription] = useState(group.description);
  const [sendPermission, setSendPermission] = useState<SendMessagePermission>('all');
  const [showSendPermissionMenu, setShowSendPermissionMenu] = useState(false);
  const [groupType, setGroupType] = useState<GroupType>('public');
  const [showGroupTypeMenu, setShowGroupTypeMenu] = useState(false);
  const [_b, _c] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState(group.announcement || '');
  const [showEditAnnouncement, setShowEditAnnouncement] = useState(false);
  const [showClearAnnouncementConfirm, setShowClearAnnouncementConfirm] = useState(false);

  const currentUser = members.find(m => m.name === 'You');
  const isOwner = currentUser?.role === 'owner';
  const isAdmin = currentUser?.role === 'admin' || isOwner;

  const handleSaveName = () => {
    setGroup(prev => ({ ...prev, name: editName }));
    setShowEditName(false);
  };

  const handleSaveDescription = () => {
    setGroup(prev => ({ ...prev, description: editDescription }));
    setShowEditDescription(false);
  };

  const handleMemberAction = (action: 'promote' | 'demote' | 'remove' | 'transfer') => {
    if (!selectedMember) return;

    switch (action) {
      case 'promote':
        setMembers(prev => prev.map(m =>
          m.id === selectedMember.id ? { ...m, role: 'admin' } : m
        ));
        break;
      case 'demote':
        setMembers(prev => prev.map(m =>
          m.id === selectedMember.id ? { ...m, role: 'member' } : m
        ));
        break;
      case 'remove':
        setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
        break;
      case 'transfer':
        setMembers(prev => prev.map(m => {
          if (m.id === selectedMember.id) return { ...m, role: 'owner' };
          if (m.role === 'owner') return { ...m, role: 'admin' };
          return m;
        }));
        break;
    }
    setShowMemberActions(false);
    setShowTransferOwnerConfirm(false);
    setSelectedMember(null);
  };

  const owner = members.find(m => m.role === 'owner');
  const admins = members.filter(m => m.role === 'admin');
  const regularMembers = members.filter(m => m.role === 'member');

  return (
    <div className="h-full bg-[var(--surface-container-low)]">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-body-lg font-semibold text-[var(--on-surface)] flex-1">Group Info</h1>
        </div>
      </header>

      <div className="pb-8">
        {/* Group Avatar & Name */}
        <div className="px-4 py-6 flex flex-col items-center">
          {/* Avatar with edit button */}
          <button
            onClick={() => console.log('Edit avatar')}
            className="relative w-24 h-24 mb-4 group"
          >
            <div className="w-24 h-24 bg-[var(--secondary)] rounded-full flex items-center justify-center text-[var(--on-secondary)] text-3xl font-bold transition-opacity group-hover:opacity-80">
              {group.avatar}
            </div>
            {/* Camera icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </button>

          {/* Group name with edit button */}
          <button
            onClick={() => setShowEditName(true)}
            className="flex items-center gap-2"
          >
            <h2 className="text-headline-sm font-semibold text-[var(--on-surface)]">{group.name}</h2>
            <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <p className="text-body-sm text-[var(--on-surface-variant)] mt-1">{group.memberCount} members</p>
        </div>

        {/* Description */}
        <div className="px-4 mb-6">
          <button
            onClick={() => setShowEditDescription(true)}
            className="w-full text-left p-4 bg-[var(--surface-container)] rounded-2xl hover:bg-[var(--surface-container-high)] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-label-sm text-[var(--on-surface-variant)] mb-1">Description</p>
                <p className="text-body-md text-[var(--on-surface)]">{group.description}</p>
              </div>
              <svg className="w-5 h-5 text-[var(--on-surface-variant)] flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </button>
        </div>

        {/* Announcement */}
        <div className="px-4 mb-6">
          <div className="bg-[var(--primary-fixed)] rounded-2xl overflow-hidden">
            {/* Announcement Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--primary-fixed-dim)]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--on-primary-fixed)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span className="text-label-sm font-medium text-[var(--on-primary-fixed)]">Announcement</span>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowEditAnnouncement(true)}
                  className="p-1.5 hover:bg-[var(--primary-fixed-dim)]/40 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4 text-[var(--on-primary-fixed)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Announcement Content */}
            {group.announcement ? (
              <div className="px-4 py-3">
                <p className="text-body-md text-[var(--on-primary-fixed)]">{group.announcement}</p>
                {group.announcementDate && (
                  <p className="text-label-xs text-[var(--on-primary-fixed-variant)] mt-2">
                    {group.announcementDate}
                  </p>
                )}
                {isAdmin && (
                  <button
                    onClick={() => setShowClearAnnouncementConfirm(true)}
                    className="mt-3 text-label-sm text-[var(--error)] hover:opacity-80 transition-opacity"
                  >
                    Clear Announcement
                  </button>
                )}
              </div>
            ) : (
              <div className="px-4 py-4">
                <p className="text-body-md text-[var(--on-primary-fixed)] opacity-60">No announcement</p>
                {isAdmin && (
                  <button
                    onClick={() => setShowEditAnnouncement(true)}
                    className="mt-2 text-label-sm text-[var(--on-primary-fixed)] hover:opacity-80 transition-opacity"
                  >
                    Add Announcement
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Members Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-title-sm font-semibold text-[var(--on-surface)]">Members</h3>
            <a
              href="/superim-contact-selection"
              className="flex items-center gap-1 px-3 py-1.5 bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)] rounded-full text-label-md font-medium hover:bg-[var(--primary-fixed-dim)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </a>
          </div>

          {/* Owner */}
          {owner && (
            <div className="mb-4">
              <p className="text-label-xs text-[var(--on-surface-variant)] uppercase tracking-wide mb-2 px-1">
                Owner
              </p>
              <div className="bg-[var(--surface-container)] rounded-2xl overflow-hidden">
                <div className="w-full flex items-center gap-3 px-4 py-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-[var(--tertiary-container)] rounded-full flex items-center justify-center text-[var(--on-tertiary-container)] font-semibold">
                      {owner.avatar}
                    </div>
                    {owner.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--surface-container)]" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-body-md font-medium text-[var(--on-surface)]">
                      {owner.name} <span className="text-label-xs text-[var(--on-surface-variant)]">(You)</span>
                    </p>
                    <p className="text-label-xs text-[var(--tertiary)]">Owner</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admins */}
          {admins.length > 0 && (
            <div className="mb-4">
              <p className="text-label-xs text-[var(--on-surface-variant)] uppercase tracking-wide mb-2 px-1">
                {admins.length} Admin{admins.length > 1 ? 's' : ''}
              </p>
              <div className="bg-[var(--surface-container)] rounded-2xl overflow-hidden">
                {admins.map((member, index) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      setSelectedMember(member);
                      setShowMemberActions(true);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container-high)] transition-colors ${
                      index !== admins.length - 1 ? 'border-b border-[var(--outline-variant)]' : ''
                    }`}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] font-semibold">
                        {member.avatar}
                      </div>
                      {member.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--surface-container)]" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-body-md font-medium text-[var(--on-surface)]">
                        {member.name}
                      </p>
                      <p className="text-label-xs text-[var(--secondary)]">Admin</p>
                    </div>
                    {isOwner && (
                      <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Regular Members */}
          <div>
            <p className="text-label-xs text-[var(--on-surface-variant)] uppercase tracking-wide mb-2 px-1">
              {regularMembers.length} Member{regularMembers.length !== 1 ? 's' : ''}
            </p>
            <div className="bg-[var(--surface-container)] rounded-2xl overflow-hidden">
              {regularMembers.map((member, index) => (
                <button
                  key={member.id}
                  onClick={() => {
                    setSelectedMember(member);
                    setShowMemberActions(true);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container-high)] transition-colors ${
                    index !== regularMembers.length - 1 ? 'border-b border-[var(--outline-variant)]' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-[var(--secondary-container)] rounded-full flex items-center justify-center text-[var(--on-secondary-container)] font-semibold">
                      {member.avatar}
                    </div>
                    {member.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--surface-container)]" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-body-md font-medium text-[var(--on-surface)]">{member.name}</p>
                    <p className="text-label-xs text-[var(--on-surface-variant)]">{member.isOnline ? 'Online' : 'Last seen recently'}</p>
                  </div>
                  <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Group Settings */}
        <div className="px-4 mb-6">
          <h3 className="text-title-sm font-semibold text-[var(--on-surface)] mb-3">Settings</h3>
          <div className="bg-[var(--surface-container)] rounded-2xl overflow-hidden">
            <button
              onClick={() => isAdmin && setShowSendPermissionMenu(true)}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[var(--surface-container-high)] transition-colors border-b border-[var(--outline-variant)]"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-body-md text-[var(--on-surface)]">Send Messages</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-label-md text-[var(--on-surface-variant)]">
                  {sendPermission === 'all' ? 'All members' : 'Only admins'}
                </span>
                {isAdmin && (
                  <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            </button>
            <button
              onClick={() => isOwner && setShowGroupTypeMenu(true)}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[var(--surface-container-high)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-body-md text-[var(--on-surface)]">Group Type</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-label-md text-[var(--on-surface-variant)]">
                  {groupType === 'public' ? 'Public' : 'Private'}
                </span>
                {isOwner && (
                  <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="px-4">
          <div className="bg-[var(--surface-container)] rounded-2xl overflow-hidden">
            <button 
              onClick={() => setShowLeaveConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--surface-container-high)] transition-colors text-[var(--error)] border-b border-[var(--outline-variant)]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-body-md font-medium">Leave Group</span>
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--surface-container-high)] transition-colors text-[var(--error)]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-body-md font-medium">Delete Group</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Name Dialog */}
      {showEditName && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-4">Edit Group Name</h3>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--surface-container)] rounded-xl text-body-md text-[var(--on-surface)] border border-[var(--outline-variant)] focus:border-[var(--primary)] focus:outline-none mb-6"
              placeholder="Group name"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditName(group.name);
                  setShowEditName(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveName}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Description Dialog */}
      {showEditDescription && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-4">Edit Description</h3>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--surface-container)] rounded-xl text-body-md text-[var(--on-surface)] border border-[var(--outline-variant)] focus:border-[var(--primary)] focus:outline-none mb-6 resize-none"
              placeholder="Group description"
              rows={3}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditDescription(group.description);
                  setShowEditDescription(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDescription}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Actions Dialog */}
      {showMemberActions && selectedMember && (
        <div className="absolute inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-[var(--surface-container-lowest)] rounded-t-3xl w-full max-w-[420px] overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Member Info Header */}
            <div className="px-5 py-4 border-b border-[var(--outline-variant)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[var(--secondary-container)] rounded-full flex items-center justify-center text-[var(--on-secondary-container)] font-semibold text-lg">
                  {selectedMember.avatar}
                </div>
                <div>
                  <h3 className="text-title-md font-semibold text-[var(--on-surface)]">{selectedMember.name}</h3>
                  <p className="text-label-sm text-[var(--on-surface-variant)]">
                    {selectedMember.role === 'owner' ? 'Owner' : selectedMember.role === 'admin' ? 'Admin' : 'Member'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="py-2">
              {/* Promote to Admin - only for members */}
              {selectedMember.role === 'member' && isOwner && (
                <button
                  onClick={() => handleMemberAction('promote')}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-body-lg">Make Admin</span>
                </button>
              )}

              {/* Demote to Member - only for admins */}
              {selectedMember.role === 'admin' && isOwner && (
                <button
                  onClick={() => handleMemberAction('demote')}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span className="text-body-lg">Dismiss Admin</span>
                </button>
              )}

              {/* Transfer Ownership - only owner can do this */}
              {isOwner && selectedMember.role !== 'owner' && (
                <button
                  onClick={() => setShowTransferOwnerConfirm(true)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="text-body-lg">Transfer Ownership</span>
                </button>
              )}

              {/* Remove from Group */}
              {isAdmin && selectedMember.role !== 'owner' && (
                <button
                  onClick={() => handleMemberAction('remove')}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--surface-container)] transition-colors text-[var(--error)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                  </svg>
                  <span className="text-body-lg">Remove from Group</span>
                </button>
              )}
            </div>

            {/* Cancel */}
            <div className="px-4 pb-4 pt-2">
              <button
                onClick={() => {
                  setShowMemberActions(false);
                  setSelectedMember(null);
                }}
                className="w-full py-3.5 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-body-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Group Confirmation */}
      {showLeaveConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Leave Group</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              Are you sure you want to leave "{group.name}"? You won't receive any new messages.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLeaveConfirm(false);
                  console.log('Left group');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Group Confirmation */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Delete Group</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              This will permanently delete "{group.name}" and all messages. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  console.log('Group deleted');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Ownership Confirmation */}
      {showTransferOwnerConfirm && selectedMember && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Transfer Ownership</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              Are you sure you want to transfer ownership to {selectedMember.name}? You will become an admin.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTransferOwnerConfirm(false);
                  setSelectedMember(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMemberAction('transfer')}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Permission Dialog */}
      {showSendPermissionMenu && (
        <div className="absolute inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-[var(--surface-container-lowest)] rounded-t-3xl w-full max-w-[420px] overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--outline-variant)]">
              <h3 className="text-title-lg font-semibold text-[var(--on-surface)]">Send Messages</h3>
              <button
                onClick={() => setShowSendPermissionMenu(false)}
                className="p-2 -mr-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Options */}
            <div className="py-1">
              {[
                { value: 'all' as const, label: 'All members', desc: 'Everyone can send messages' },
                { value: 'admin' as const, label: 'Only admins', desc: 'Only admins can send messages' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSendPermission(option.value);
                    setShowSendPermissionMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                >
                  <div className="text-left">
                    <span className="text-body-lg block">{option.label}</span>
                    <span className="text-label-sm text-[var(--on-surface-variant)]">{option.desc}</span>
                  </div>
                  {sendPermission === option.value && (
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Group Type Dialog */}
      {showGroupTypeMenu && (
        <div className="absolute inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-[var(--surface-container-lowest)] rounded-t-3xl w-full max-w-[420px] overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--outline-variant)]">
              <h3 className="text-title-lg font-semibold text-[var(--on-surface)]">Group Type</h3>
              <button
                onClick={() => setShowGroupTypeMenu(false)}
                className="p-2 -mr-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Options */}
            <div className="py-1">
              {[
                { value: 'public' as const, label: 'Public', desc: 'Anyone can find and join this group' },
                { value: 'private' as const, label: 'Private', desc: 'Only invited members can join' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setGroupType(option.value);
                    setShowGroupTypeMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--surface-container)] transition-colors text-[var(--on-surface)]"
                >
                  <div className="text-left">
                    <span className="text-body-lg block">{option.label}</span>
                    <span className="text-label-sm text-[var(--on-surface-variant)]">{option.desc}</span>
                  </div>
                  {groupType === option.value && (
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Announcement Dialog */}
      {showEditAnnouncement && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-4">
              {group.announcement ? 'Edit Announcement' : 'Add Announcement'}
            </h3>
            <textarea
              value={editAnnouncement}
              onChange={(e) => setEditAnnouncement(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--surface-container)] rounded-xl text-body-md text-[var(--on-surface)] border border-[var(--outline-variant)] focus:border-[var(--primary)] focus:outline-none mb-6 resize-none"
              placeholder="Enter announcement..."
              rows={4}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditAnnouncement(group.announcement || '');
                  setShowEditAnnouncement(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setGroup(prev => ({
                    ...prev,
                    announcement: editAnnouncement,
                    announcementDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  }));
                  setShowEditAnnouncement(false);
                }}
                disabled={!editAnnouncement.trim()}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] text-label-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Announcement Confirmation */}
      {showClearAnnouncementConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Clear Announcement</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              Are you sure you want to clear the announcement? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearAnnouncementConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setGroup(prev => ({ ...prev, announcement: undefined, announcementDate: undefined }));
                  setEditAnnouncement('');
                  setShowClearAnnouncementConfirm(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Component = GroupChatSettingsPage;
export default Component;
