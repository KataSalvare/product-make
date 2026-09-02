/**
 * @name 敏感词库
 *
 * @description
 * SuperIM 敏感词库管理页面。
 *
 * @usage
 * 访问路径: /admin/messages/sensitive-words
 *
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './style.css';

interface Word {
  id: number;
  word: string;
  category: string;
  addTime: string;
}

const mockWords: Word[] = [
  { id: 1, word: '敏感词1', category: 'political', addTime: '2025-01-20' },
  { id: 2, word: '敏感词2', category: 'porn', addTime: '2025-01-21' },
  { id: 3, word: '敏感词3', category: 'violence', addTime: '2025-01-22' },
  { id: 4, word: '敏感词4', category: 'ad', addTime: '2025-01-23' },
];

const categories = [
  { id: 'all', name: '全部' },
  { id: 'political', name: '政治' },
  { id: 'porn', name: '色情' },
  { id: 'violence', name: '暴力' },
  { id: 'ad', name: '广告' },
];

export default function Component() {
  const [words, setWords] = useState<Word[]>(mockWords);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [batchInput, setBatchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('political');

  const filteredWords = filter === 'all' ? words : words.filter(w => w.category === filter);

  const handleDelete = (id: number) => {
    if (confirm('确定要删除该敏感词吗？')) {
      setWords(words.filter(w => w.id !== id));
    }
  };

  const handleOpenModal = () => {
    setBatchInput('');
    setSelectedCategory('political');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBatchInput('');
  };

  const handleBatchAdd = () => {
    if (!batchInput.trim()) return;

    const newWords = batchInput
      .split(/[\n,，]/)
      .map(w => w.trim())
      .filter(w => w.length > 0);

    if (newWords.length === 0) return;

    const now = new Date().toISOString().split('T')[0];
    const addedWords: Word[] = newWords.map((word, index) => ({
      id: Date.now() + index,
      word,
      category: selectedCategory,
      addTime: now,
    }));

    setWords([...words, ...addedWords]);
    handleCloseModal();
  };

  return (
    <div className="h-full bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">SuperIM Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">A</span>
            </div>
            <span className="text-sm text-gray-700">管理员</span>
          </div>
        </div>
      </header>

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">敏感词库</h2>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
            >
              <Plus size={18} />
              添加敏感词
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === cat.id ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">敏感词</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">分类</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">添加时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredWords.map(word => (
                  <tr key={word.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{word.word}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        word.category === 'political' ? 'bg-red-100 text-red-700' :
                        word.category === 'porn' ? 'bg-pink-100 text-pink-700' :
                        word.category === 'violence' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {word.category === 'political' ? '政治' :
                         word.category === 'porn' ? '色情' :
                         word.category === 'violence' ? '暴力' : '广告'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{word.addTime}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(word.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* 批量添加敏感词弹窗 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal} />
          <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 shadow-xl">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">批量添加敏感词</h3>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 表单内容 */}
            <div className="p-6 space-y-4">
              {/* 分类选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  敏感词分类 <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="political">政治</option>
                  <option value="porn">色情</option>
                  <option value="violence">暴力</option>
                  <option value="ad">广告</option>
                </select>
              </div>

              {/* 敏感词输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  敏感词列表 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  placeholder="请输入敏感词，支持批量添加：&#10;1. 每行一个敏感词&#10;2. 或使用逗号分隔多个敏感词&#10;&#10;例如：&#10;敏感词1&#10;敏感词2&#10;敏感词3&#10;&#10;或：敏感词1,敏感词2,敏感词3"
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
                <p className="mt-2 text-xs text-gray-500">
                  提示：将添加 {batchInput.split(/[\n,，]/).filter(w => w.trim()).length} 个敏感词
                </p>
              </div>

              {/* 按钮组 */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleBatchAdd}
                  disabled={!batchInput.trim()}
                  className="px-4 py-2 bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  确认添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
