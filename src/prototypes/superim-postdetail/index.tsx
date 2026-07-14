/**
 * @name PostDetail Page
 * @description Post detail page with comments and interactions
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  images: string[];
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

const mockPost: Post = {
  id: '1',
  author: { name: 'Amara Okafor', avatar: '' },
  content: 'Beautiful sunset at the beach today! 🌅 Nothing beats the view from Lagos coast. The golden hour here is absolutely magical. Who else loves watching the sunset by the ocean?',
  images: ['', '', ''],
  timestamp: '2 hours ago',
  likes: 24,
  comments: 5,
  isLiked: true,
  isSaved: false,
};

const mockComments: Comment[] = [
  {
    id: '1',
    author: { name: 'Kwame Asante', avatar: '' },
    content: 'Absolutely stunning! 🌅 I need to visit Lagos soon.',
    timestamp: '1 hour ago',
    likes: 8,
    isLiked: true,
  },
  {
    id: '2',
    author: { name: 'Chioma Nnamdi', avatar: '' },
    content: 'The colors are incredible! Thanks for sharing this beautiful moment.',
    timestamp: '45 min ago',
    likes: 5,
    isLiked: false,
    replies: [
      {
        id: '2-1',
        author: { name: 'Amara Okafor', avatar: '' },
        content: 'Thank you Chioma! It was truly breathtaking in person.',
        timestamp: '30 min ago',
        likes: 2,
        isLiked: false,
      },
    ],
  },
  {
    id: '3',
    author: { name: 'Oluwaseun Adeyemi', avatar: '' },
    content: 'Which beach is this? Looks amazing!',
    timestamp: '20 min ago',
    likes: 3,
    isLiked: false,
  },
];

const PostDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState<Post>(mockPost);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (replyingTo && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [replyingTo]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLikePost = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    }));
  };

  const handleSavePost = () => {
    setPost(prev => ({ ...prev, isSaved: !prev.isSaved }));
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === commentId
              ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
              : reply
          ),
        };
      }
      return comment;
    }));
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: { name: 'You', avatar: '' },
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };

    if (replyingTo) {
      setComments(comments.map(comment => {
        if (comment.id === replyingTo) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newCommentObj],
          };
        }
        return comment;
      }));
      setReplyingTo(null);
    } else {
      setComments([...comments, newCommentObj]);
    }

    setNewComment('');
    setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageGallery(true);
  };

  const shareOptions = [
    { id: 'forward', label: 'Forward to...', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
    { id: 'copy', label: 'Copy Link', icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'other', label: 'Share via...', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' },
  ];

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-headline-md text-[var(--primary)]">Post</h1>
          </div>
          <button 
            onClick={() => setShowShareMenu(true)}
            className="p-2 -mr-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Post Content */}
        <div className="bg-[var(--surface-container-lowest)]">
          {/* Author */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--on-primary)] font-semibold">
              {getInitials(post.author.name)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--on-surface)]">{post.author.name}</h3>
              <p className="text-label-sm text-[var(--on-surface-variant)]">{post.timestamp}</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            <p className="text-body-lg text-[var(--on-surface)] leading-relaxed">{post.content}</p>
          </div>

          {/* Images */}
          {post.images.length > 0 && (
            <div className={`px-4 pb-3 grid gap-1 ${
              post.images.length === 1 ? 'grid-cols-1' :
              post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}>
              {post.images.map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className="aspect-square bg-[var(--surface-container)] rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <svg className="w-10 h-10 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="px-4 py-2 flex items-center justify-between border-t border-[var(--outline-variant)]/50">
            <div className="flex items-center gap-4">
              <span className="text-label-sm text-[var(--on-surface-variant)]">
                <span className="font-semibold text-[var(--on-surface)]">{post.likes}</span> likes
              </span>
              <span className="text-label-sm text-[var(--on-surface-variant)]">
                <span className="font-semibold text-[var(--on-surface)]">{post.comments}</span> comments
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex border-t border-[var(--outline-variant)]">
            <button
              onClick={handleLikePost}
              className={`flex-1 flex items-center justify-center gap-2 py-3 hover:bg-[var(--surface-container-low)] transition-colors ${
                post.isLiked ? 'text-[var(--secondary)]' : 'text-[var(--on-surface-variant)]'
              }`}
            >
              <svg className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-label-md font-medium">Like</span>
            </button>
            <button
              onClick={() => setShowShareMenu(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-label-md font-medium">Share</span>
            </button>
            <button
              onClick={handleSavePost}
              className={`flex-1 flex items-center justify-center gap-2 py-3 hover:bg-[var(--surface-container-low)] transition-colors ${
                post.isSaved ? 'text-[var(--secondary)]' : 'text-[var(--on-surface-variant)]'
              }`}
            >
              <svg className="w-5 h-5" fill={post.isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="text-label-md font-medium">Save</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-3 bg-[var(--surface-container-lowest)]">
          <div className="px-4 py-3 border-b border-[var(--outline-variant)]">
            <h3 className="text-body-lg font-semibold text-[var(--on-surface)]">
              Comments ({comments.length})
            </h3>
          </div>

          <div className="divide-y divide-[var(--outline-variant)]/50">
            {comments.map((comment) => (
              <div key={comment.id}>
                <div className="px-4 py-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-[var(--primary-container)] rounded-full flex items-center justify-center text-[var(--on-primary-container)] text-sm font-semibold flex-shrink-0">
                      {getInitials(comment.author.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--on-surface)] text-sm">{comment.author.name}</span>
                        <span className="text-label-sm text-[var(--on-surface-variant)]">{comment.timestamp}</span>
                      </div>
                      <p className="text-body-md text-[var(--on-surface)] mt-1">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-1 text-label-sm ${
                            comment.isLiked ? 'text-[var(--secondary)]' : 'text-[var(--on-surface-variant)]'
                          }`}
                        >
                          <svg className="w-4 h-4" fill={comment.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {comment.likes > 0 && comment.likes}
                        </button>
                        <button
                          onClick={() => handleReply(comment.id)}
                          className="text-label-sm text-[var(--on-surface-variant)] hover:text-[var(--secondary)] transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies?.map((reply) => (
                  <div key={reply.id} className="px-4 py-3 pl-14 bg-[var(--surface-container-low)]/50">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--on-primary)] text-xs font-semibold flex-shrink-0">
                        {getInitials(reply.author.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[var(--on-surface)] text-sm">{reply.author.name}</span>
                          <span className="text-label-sm text-[var(--on-surface-variant)]">{reply.timestamp}</span>
                        </div>
                        <p className="text-body-md text-[var(--on-surface)] mt-1">{reply.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <button
                            onClick={() => handleLikeComment(reply.id)}
                            className={`flex items-center gap-1 text-label-sm ${
                              reply.isLiked ? 'text-[var(--secondary)]' : 'text-[var(--on-surface-variant)]'
                            }`}
                          >
                            <svg className="w-4 h-4" fill={reply.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {reply.likes > 0 && reply.likes}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface-container-lowest)] border-t border-[var(--outline-variant)] px-4 py-3 safe-area-pb">
        {replyingTo && (
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-label-sm text-[var(--secondary)]">
              Replying to comment...
            </span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-label-sm text-[var(--on-surface-variant)] hover:text-[var(--error)]"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--on-primary)] text-sm font-semibold flex-shrink-0">
            ME
          </div>
          <div className="flex-1 flex items-center gap-2 bg-[var(--surface-container-low)] rounded-full px-4 py-2">
            <input
              ref={commentInputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
              placeholder={replyingTo ? 'Write a reply...' : 'Write a comment...'}
              className="flex-1 bg-transparent text-body-md text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none"
            />
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className={`p-1.5 rounded-full transition-colors ${
                newComment.trim()
                  ? 'text-[var(--secondary)] hover:bg-[var(--secondary-container)]'
                  : 'text-[var(--outline)] cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <div 
          className="absolute inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setShowImageGallery(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="aspect-square bg-[var(--surface-container)] rounded-lg flex items-center justify-center max-w-full max-h-full">
              <svg className="w-20 h-20 text-[var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <button 
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white"
              onClick={() => setShowImageGallery(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {post.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Menu Modal */}
      {showShareMenu && (
        <div 
          className="absolute inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setShowShareMenu(false)}
        >
          <div 
            className="bg-[var(--surface-container-lowest)] w-full sm:w-80 sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-ambient-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-[var(--outline-variant)]">
              <h3 className="text-body-lg font-semibold text-[var(--on-surface)] text-center">Share</h3>
            </div>
            <div className="p-2">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-container-low)] rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={option.icon} />
                  </svg>
                  <span className="text-body-md text-[var(--on-surface)]">{option.label}</span>
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-[var(--outline-variant)]">
              <button
                onClick={() => setShowShareMenu(false)}
                className="w-full py-3 text-body-md text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Component = PostDetailPage;
export default Component;
