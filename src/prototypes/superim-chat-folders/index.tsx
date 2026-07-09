/**
 * @name ChatFolders Page
 * @description Manage chat folders: create, edit, delete and select chats
 * @mode axure
 */

import { useState } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface ChatOption {
  id: string;
  name: string;
  isGroup: boolean;
  initials: string;
}

interface Folder {
  id: string;
  name: string;
  chatIds: string[];
}

const mockAllChats: ChatOption[] = [
  { id: '1', name: 'Amara Okafor', isGroup: false, initials: 'AO' },
  { id: '2', name: 'Design Team', isGroup: true, initials: 'DT' },
  { id: '3', name: 'Chioma Nnamdi', isGroup: false, initials: 'CN' },
  { id: '4', name: 'Family Group', isGroup: true, initials: 'FG' },
  { id: '5', name: 'Oluwaseun Adeyemi', isGroup: false, initials: 'OA' },
  { id: '6', name: 'Tech Support', isGroup: false, initials: 'TS' },
  { id: '7', name: 'Amina Ibrahim', isGroup: false, initials: 'AI' },
];

const mockFolders: Folder[] = [
  { id: 'f1', name: 'Work', chatIds: ['2', '6'] },
  { id: 'f2', name: 'Family', chatIds: ['4'] },
];

const ChatFoldersPage: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderName, setFolderName] = useState('');
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingFolder(null);
    setFolderName('');
    setSelectedChatIds([]);
    setIsModalOpen(true);
  };

  const openEdit = (folder: Folder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setSelectedChatIds([...folder.chatIds]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFolder(null);
    setFolderName('');
    setSelectedChatIds([]);
  };

  const toggleChat = (chatId: string) => {
    setSelectedChatIds((prev) =>
      prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId]
    );
  };

  const handleSave = () => {
    const trimmed = folderName.trim();
    if (!trimmed) return;
    if (editingFolder) {
      setFolders((prev) =>
        prev.map((f) =>
          f.id === editingFolder.id ? { ...f, name: trimmed, chatIds: selectedChatIds } : f
        )
      );
    } else {
      const newFolder: Folder = {
        id: `f${Date.now()}`,
        name: trimmed,
        chatIds: selectedChatIds,
      };
      setFolders((prev) => [...prev, newFolder]);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!deleteFolderId) return;
    setFolders((prev) => prev.filter((f) => f.id !== deleteFolderId));
    setDeleteFolderId(null);
  };

  const getChatCountLabel = (count: number) => `${count} chat${count === 1 ? '' : 's'}`;

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
              <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-headline-md text-[var(--primary)]">Chat Folders</h1>
          </div>
          <button
            onClick={openCreate}
            className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </header>

      {/* Folder List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 bg-[var(--surface-container-low)] rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[var(--on-surface-variant)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <p className="text-title-md font-semibold text-[var(--on-surface)] mb-1">No folders yet</p>
            <p className="text-body-md text-[var(--on-surface-variant)] text-center">Tap + to create your first folder</p>
          </div>
        ) : (
          folders.map((folder) => (
            <div
              key={folder.id}
              draggable
              onDragStart={() => setDraggedId(folder.id)}
              onDragOver={(e) => {
                e.preventDefault();
                if (folder.id !== draggedId) setDragOverId(folder.id);
              }}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(e) => {
                e.preventDefault();
                if (!draggedId || draggedId === folder.id) return;
                setFolders((prev) => {
                  const fromIndex = prev.findIndex((f) => f.id === draggedId);
                  const toIndex = prev.findIndex((f) => f.id === folder.id);
                  if (fromIndex === -1 || toIndex === -1) return prev;
                  const next = [...prev];
                  const [removed] = next.splice(fromIndex, 1);
                  next.splice(toIndex, 0, removed);
                  return next;
                });
                setDraggedId(null);
                setDragOverId(null);
              }}
              onDragEnd={() => {
                setDraggedId(null);
                setDragOverId(null);
              }}
              className={`bg-[var(--surface-container-lowest)] rounded-2xl p-4 shadow-ambient-sm border transition-all ${
                dragOverId === folder.id ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20 translate-y-1' : 'border-[var(--outline-variant)]/50'
              } ${draggedId === folder.id ? 'opacity-50' : 'opacity-100'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-1 cursor-grab active:cursor-grabbing text-[var(--on-surface-variant)]/60" title="Drag to reorder">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
                    </svg>
                  </div>
                  <div className="w-12 h-12 bg-[var(--primary-container)] rounded-xl flex items-center justify-center text-[var(--on-primary-container)] font-semibold">
                    {folder.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-body-lg font-semibold text-[var(--on-surface)]">{folder.name}</h3>
                    <p className="text-label-sm text-[var(--on-surface-variant)]">{getChatCountLabel(folder.chatIds.length)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(folder)}
                    className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
                    aria-label="Edit folder"
                  >
                    <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteFolderId(folder.id)}
                    className="p-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
                    aria-label="Delete folder"
                  >
                    <svg className="w-5 h-5 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pl-8">
                {folder.chatIds.length === 0 ? (
                  <span className="text-label-sm text-[var(--on-surface-variant)]/60">No chats in this folder</span>
                ) : (
                  folder.chatIds.map((chatId) => {
                    const chat = mockAllChats.find((c) => c.id === chatId);
                    if (!chat) return null;
                    return (
                      <span
                        key={chatId}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--surface-container)] rounded-full text-label-sm text-[var(--on-surface)]"
                      >
                        <span className="w-4 h-4 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[10px] text-[var(--on-primary-container)] font-semibold">
                          {chat.initials.slice(0, 1)}
                        </span>
                        {chat.name}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface-container-lowest)] rounded-t-3xl max-h-[85%] flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--outline-variant)]">
              <h3 className="text-title-lg font-semibold text-[var(--on-surface)]">
                {editingFolder ? 'Edit Folder' : 'New Folder'}
              </h3>
              <button onClick={closeModal} className="p-2 -mr-2 hover:bg-[var(--surface-container)] rounded-full transition-colors">
                <svg className="w-5 h-5 text-[var(--on-surface-variant)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-label-sm text-[var(--on-surface-variant)] mb-2">Folder Name</label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g. Work, Family"
                  className="w-full px-4 py-3 bg-[var(--surface-container-low)] rounded-xl text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                />
              </div>

              <div>
                <label className="block text-label-sm text-[var(--on-surface-variant)] mb-2">Select Chats</label>
                <div className="bg-[var(--surface-container-low)] rounded-xl overflow-hidden">
                  {mockAllChats.map((chat, index) => (
                    <button
                      key={chat.id}
                      onClick={() => toggleChat(chat.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        index !== mockAllChats.length - 1 ? 'border-b border-[var(--outline-variant)]/50' : ''
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedChatIds.includes(chat.id)
                          ? 'bg-[var(--primary)] border-[var(--primary)]'
                          : 'border-[var(--outline)]'
                      }`}>
                        {selectedChatIds.includes(chat.id) && (
                          <svg className="w-4 h-4 text-[var(--on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="w-10 h-10 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] text-sm font-semibold">
                        {chat.initials}
                      </div>
                      <div className="flex-1">
                        <p className="text-body-md font-medium text-[var(--on-surface)]">{chat.name}</p>
                        <p className="text-label-xs text-[var(--on-surface-variant)]">{chat.isGroup ? 'Group' : 'Contact'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[var(--outline-variant)]">
              <button
                onClick={handleSave}
                disabled={!folderName.trim()}
                className="w-full py-3.5 rounded-xl text-body-lg font-semibold transition-all bg-[var(--primary)] text-[var(--on-primary)] disabled:bg-[var(--surface-container)] disabled:text-[var(--on-surface-variant)] disabled:cursor-not-allowed"
              >
                {editingFolder ? 'Save Changes' : 'Create Folder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteFolderId && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl w-full max-w-[320px] p-6">
            <h3 className="text-title-md font-semibold text-[var(--on-surface)] mb-2">Delete Folder</h3>
            <p className="text-body-md text-[var(--on-surface-variant)] mb-6">
              Are you sure you want to delete this folder? The chats inside will not be deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteFolderId(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--surface-container)] text-[var(--on-surface)] text-label-lg font-medium hover:bg-[var(--surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--error)] text-[var(--on-error)] text-label-lg font-medium hover:opacity-90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Component = ChatFoldersPage;
export default Component;
