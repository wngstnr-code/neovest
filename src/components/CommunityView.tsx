/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MessageSquare, 
  Heart, 
  Share2, 
  Bookmark, 
  Plus, 
  TrendingUp, 
  Send,
  MoreVertical,
  Flame,
  Globe,
  Compass,
  TrendingDown,
  X,
  Target,
  Sparkles,
  Award
} from 'lucide-react';
import { Screen, UserProfile } from '../types';

export interface CommunityComment {
  id: string;
  author: string;
  avatarUrl?: string;
  timeAgo: string;
  content: string;
  likes: number;
  hasLiked?: boolean;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorRole?: string;
  avatarUrl?: string;
  timeAgo: string;
  category: string;
  title: string;
  content: string;
  likes: number;
  commentsCount: number;
  comments: CommunityComment[];
  tags: string[];
  stockTag?: string;
  sentiment?: 'Bullish' | 'Bearish' | 'Neutral';
  hasLiked?: boolean;
  hasBookmarked?: boolean;
}

interface CommunityViewProps {
  userProfile: UserProfile;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  selectedPostId: string | null;
  setSelectedPostId: (id: string | null) => void;
}

// Initial mock data mirroring the exact user visuals and assets
const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Budi Investor',
    authorRole: 'Top Contributor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    timeAgo: '2 hours ago',
    category: 'Equities',
    title: 'Analisa BBCA Menjelang Dividen',
    content: "Menjelang pembagian dividen tahun ini, saya melihat pergerakan harga saham BBCA cukup menarik. Secara historis, selalu ada 'dividend play' di mana harga cenderung naik mendekati cum date.\n\nNamun, perlu diperhatikan juga kondisi makro ekonomi saat ini. Suku bunga yang stabil memberikan angin segar bagi sektor perbankan, namun potensi perlambatan kredit juga perlu diwaspadai.\n\nMenurut pandangan saya, bagi investor jangka panjang, BBCA tetap menjadi pilihan yang solid. Bagaimana pendapat teman-teman? Apakah ada yang berencana akumulasi sebelum cum date?",
    likes: 245,
    commentsCount: 42,
    tags: ['#BBCA', '#Dividen', '#Bullish'],
    stockTag: 'BBCA',
    sentiment: 'Bullish',
    hasLiked: false,
    hasBookmarked: false,
    comments: [
      {
        id: 'comment-1',
        author: 'Siti Trader',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        timeAgo: '1 hr ago',
        content: 'Setuju banget! Biasanya saya akumulasi 1 bulan sebelum RUPS. Sejauh ini strateginya cukup berhasil.',
        likes: 12,
        hasLiked: false
      },
      {
        id: 'comment-2',
        author: 'Agus Bear',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        timeAgo: '45 mins ago',
        content: 'Hati-hati jebakan dividen trap. Seringkali setelah ex-date harganya turun lebih dalam dari dividen yang didapat.',
        likes: 5,
        hasLiked: false
      }
    ]
  },
  {
    id: 'post-2',
    author: 'David Chen',
    authorRole: 'Top Contributor',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    timeAgo: '2 hours ago',
    category: 'Equities',
    title: "Thoughts on BBCA's Q3 Earnings Report?",
    content: "Just finished reviewing the latest earnings call. Impressive loan growth, but NIM seems to be tightening slightly. Are you guys adding to your position or holding? The current valuation feels a bit stretched to me, but their asset quality is unmatched.",
    likes: 24,
    commentsCount: 12,
    tags: ['#BBCA', '#Earnings', '#Neutral'],
    stockTag: 'BBCA',
    sentiment: 'Neutral',
    hasLiked: false,
    hasBookmarked: false,
    comments: [
      {
        id: 'comment-3',
        author: 'Yusuf Saham',
        timeAgo: '1 hr ago',
        content: 'Secara PBV memang sudah agak mahal dibanding bank BUMN lain, tapi ROE-nya memang paling konsisten.',
        likes: 3,
        hasLiked: false
      }
    ]
  },
  {
    id: 'post-3',
    author: 'Sarah Jenkins',
    authorRole: 'Advisor',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    timeAgo: '5 hours ago',
    category: 'Bonds',
    title: 'SBN Retail SR019 Allocation',
    content: 'The coupon rate for SR019 looks solid at 5.95%. I\'m planning to shift some of my cash reserves here for the fixed income. Anyone else maxing out their quota early? Seems like a safer bet amidst current market volatility.',
    likes: 48,
    commentsCount: 26,
    tags: ['#SBN', '#SR019', '#FixedIncome'],
    stockTag: 'SBN',
    sentiment: 'Bullish',
    hasLiked: false,
    hasBookmarked: false,
    comments: []
  }
];

export default function CommunityView({ 
  userProfile, 
  currentScreen, 
  onNavigate,
  selectedPostId,
  setSelectedPostId
}: CommunityViewProps) {
  // Post states
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  
  // Navigation internal mode
  const [filterTag, setFilterTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  
  // Create post form state
  const [newPostTitle, setNewPostTitle] = useState<string>('');
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [newPostStock, setNewPostStock] = useState<string>('BBCA');
  const [newPostSentiment, setNewPostSentiment] = useState<'Bullish' | 'Bearish' | 'Neutral'>('Bullish');
  const [newPostCategory, setNewPostCategory] = useState<string>('Equities');
  
  // Comment typing state
  const [typedComment, setTypedComment] = useState<string>('');

  // Likes and bookmarks toggler
  const handleLikePost = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          hasLiked: !p.hasLiked,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const handleBookmarkPost = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          hasBookmarked: !p.hasBookmarked
        };
      }
      return p;
    }));
  };

  // Create post submittal
  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('Teks judul dan isi postingan tidak boleh kosong.');
      return;
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: userProfile.fullName,
      authorRole: 'Top Contributor',
      timeAgo: 'Just now',
      category: newPostCategory,
      title: newPostTitle,
      content: newPostContent,
      likes: 1,
      commentsCount: 0,
      tags: [`#${newPostStock}`, `#${newPostSentiment}`],
      stockTag: newPostStock,
      sentiment: newPostSentiment,
      comments: [],
      hasLiked: true
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowCreateModal(false);
  };

  // Add Comment submittal
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedComment.trim() || !selectedPostId) return;

    const newComment: CommunityComment = {
      id: `comment-${Date.now()}`,
      author: userProfile.fullName,
      timeAgo: 'Just now',
      content: typedComment,
      likes: 0
    };

    setPosts(prev => prev.map(p => {
      if (p.id === selectedPostId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));

    setTypedComment('');
  };

  const activePost = posts.find(p => p.id === selectedPostId);

  // Filtering posts based on search and buttons
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterTag === 'All') return matchesSearch;
    return post.stockTag === filterTag && matchesSearch;
  });

  // Trending Topics List
  const trendingTopics = [
    {
      domain: 'Macro Economy',
      title: 'BI Rate Holds at 6.00%',
      desc: 'Bank Indonesia decides to maintain the 7-Day Reverse Repo Rate to maintain stability of Rupiah...',
      cmts: 142,
      tag: 'Hot',
      bgClass: 'from-blue-50 to-indigo-50 border-blue-100',
      textClass: 'text-blue-500'
    },
    {
      domain: 'Crypto Asset',
      title: 'BTC Halving Countdown',
      desc: 'Miners are adjusting and predictions showing historical trend models are very bullish as supply constraints kick in...',
      cmts: 89,
      tag: 'Crypto',
      bgClass: 'from-amber-50 to-yellow-50 border-amber-100',
      textClass: 'text-amber-500'
    },
    {
      domain: 'Tech Sector',
      title: 'AI Boom in Indonesia',
      desc: 'Leading data centers are expanding in Jakarta with growing computing power demand across all national systems...',
      cmts: 54,
      tag: 'AI',
      bgClass: 'from-teal-50 to-emerald-50 border-teal-100',
      textClass: 'text-teal-600'
    }
  ];

  // Helper inside comments like
  const handleLikeComment = (commentId: string) => {
    if (!selectedPostId) return;
    setPosts(prev => prev.map(p => {
      if (p.id === selectedPostId) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id === commentId) {
              return {
                ...c,
                hasLiked: !c.hasLiked,
                likes: c.hasLiked ? c.likes - 1 : c.likes + 1
              };
            }
            return c;
          })
        };
      }
      return p;
    }));
  };

  // Rendering screen
  if (currentScreen === 'CommunityPostDetail' && activePost) {
    return (
      <div className="h-full flex flex-col bg-surface-bg select-none">
        {/* Header detailed */}
        <div className="h-14 bg-white border-b border-gray-100 px-4 flex items-center justify-between shadow-sm shrink-0 z-10 pt-4">
          <button 
            onClick={() => onNavigate('Community')} 
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all"
            id="community-back-btn"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <span className="text-sm font-extrabold text-blue-900 tracking-tight">NeoVest Community</span>
          <button className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable content detail */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-20">
          
          {/* Sentiment Banner */}
          {activePost.sentiment && (
            <div className={`mb-4 rounded-2xl p-3 border-l-4 flex items-center justify-between text-xs font-bold leading-normal ${
              activePost.sentiment === 'Bullish' 
                ? 'bg-emerald-50 text-emerald-800 border-l-emerald-500' 
                : activePost.sentiment === 'Bearish'
                ? 'bg-rose-50 text-rose-800 border-l-rose-500'
                : 'bg-amber-50 text-amber-800 border-l-amber-500'
            }`}>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>{activePost.stockTag} Sentiment: {activePost.sentiment}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activePost.sentiment === 'Bullish' ? 'bg-emerald-100' : activePost.sentiment === 'Bearish' ? 'bg-rose-100' : 'bg-amber-100'
              }`}>
                {activePost.sentiment === 'Bullish' ? '80% Bullish' : activePost.sentiment === 'Bearish' ? '65% Bearish' : '55% Neutral'}
              </span>
            </div>
          )}

          {/* Core thread article */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 soft-shadow mb-6">
            
            {/* Author bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {activePost.avatarUrl ? (
                    <img 
                      src={activePost.avatarUrl} 
                      alt="" 
                      className="w-11 h-11 rounded-full object-cover border border-gray-100"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-11 h-11 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                      {activePost.author.charAt(0)}
                    </div>
                  )}
                  {activePost.authorRole === 'Advisor' && (
                    <div className="absolute -bottom-1 -right-1 bg-accent p-0.5 rounded-full border border-white">
                      <Award className="w-3.5 h-3.5 text-dark-blue fill-dark-blue" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-950 flex items-center gap-1">
                    {activePost.author}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold">
                    {activePost.timeAgo} {activePost.authorRole && `• ${activePost.authorRole}`}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={(e) => handleBookmarkPost(activePost.id, e)}
                className={`w-9 h-9 rounded-full flex items-center justify-center border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all ${
                  activePost.hasBookmarked ? 'bg-amber-50 text-accent-dark' : 'text-gray-400'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${activePost.hasBookmarked ? 'fill-accent' : ''}`} />
              </button>
            </div>

            {/* Core post titles */}
            <h1 className="text-sm font-black text-slate-900 leading-snug mb-3">
              {activePost.title}
            </h1>

            {/* Paragraph block content */}
            <div className="text-[11px] text-gray-650 leading-relaxed font-semibold whitespace-pre-wrap">
              {activePost.content}
            </div>

            {/* Hash Tag Badges */}
            <div className="flex flex-wrap gap-1.5 mt-5">
              {activePost.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    tag.includes('Bullish') 
                      ? 'bg-emerald-50 text-emerald-800' 
                      : tag.includes('Bearish') 
                      ? 'bg-rose-50 text-rose-800' 
                      : 'bg-blue-50 text-primary'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Social action feedback panel */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-5">
              <button 
                onClick={(e) => handleLikePost(activePost.id, e)}
                className={`flex items-center gap-1.5 text-xs font-bold leading-none ${
                  activePost.hasLiked ? 'text-rose-600' : 'text-gray-450 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${activePost.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{activePost.likes}</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-gray-450 font-bold leading-none">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span>{activePost.comments.length} Comments</span>
              </div>

              <button 
                onClick={() => alert('Post link copied to clipboard! Share it with your network.')}
                className="flex items-center gap-1.5 text-xs text-gray-455 font-bold leading-none hover:text-primary transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

          </div>

          {/* Heading Divider comments section */}
          <div className="mb-3 px-1 flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 tracking-tight">
              Comments ({activePost.comments.length})
            </span>
            <span className="text-[10px] text-gray-400 font-bold">Terbaru</span>
          </div>

          {/* Comments Lists */}
          <div className="flex flex-col gap-3">
            {activePost.comments.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-3xl border border-gray-100 p-5 p-8 text-xs text-gray-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-200 stroke-[1.5]" />
                <p className="font-semibold">Belum ada diskusi di komentar. Jadilah yang pertama memberikan pandangan!</p>
              </div>
            ) : (
              activePost.comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-3xl p-4.5 border border-gray-105 soft-shadow flex gap-3">
                  <div className="shrink-0">
                    {comment.avatarUrl ? (
                      <img 
                        src={comment.avatarUrl} 
                        alt="" 
                        className="w-9 h-9 rounded-full object-cover border border-gray-100"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-bold text-xs">
                        {comment.author.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-gray-900">{comment.author}</span>
                      <span className="text-[9px] text-gray-400 font-bold">{comment.timeAgo}</span>
                    </div>

                    <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-4 mt-3 pt-1">
                      <button className="text-[9px] text-primary font-extrabold hover:underline">
                        Reply
                      </button>
                      <button 
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-1 text-[10px] font-bold ${
                          comment.hasLiked ? 'text-rose-600' : 'text-gray-400'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${comment.hasLiked ? 'fill-rose-500' : ''}`} />
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Floating Add Comment Sticky Bar at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 flex gap-2.5 items-center z-30">
          <div className="flex-1 bg-gray-50 border border-gray-150 rounded-2xl px-4 py-2 flex items-center">
            <input 
              type="text" 
              placeholder="Tulis komentar Anda..." 
              value={typedComment}
              onChange={(e) => setTypedComment(e.target.value)}
              className="w-full text-xs bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
            />
          </div>
          <button 
            type="button"
            onClick={handleAddComment}
            className="w-9 h-9 rounded-2xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-all shrink-0 shadow-sm active:scale-95"
            id="send-comment-btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    );
  }

  // ELSE rendering primary dashboard feed screen
  return (
    <div className="h-full flex flex-col bg-surface-bg select-none relative">
      
      {/* Header bar community feed */}
      <div className="h-14 bg-white border-b border-gray-100 px-4 flex items-center justify-between shadow-sm shrink-0 z-10 pt-4">
        {/* Elegant Simple Heading for Community */}
        <div className="flex items-center gap-2">
          {userProfile.fullName ? (
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-black">
              {userProfile.fullName.substring(0, 2).toUpperCase()}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary text-white" />
          )}
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider">Community</span>
        </div>
        
        {/* Toggle list action search */}
        <div className="relative flex items-center max-w-[130px] bg-gray-50 border border-gray-150 rounded-full py-1.5 px-3.5 ml-auto">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-1.5" />
          <input 
            type="text" 
            placeholder="Cari Post..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-[10px] text-gray-800 placeholder-gray-400 font-bold"
          />
        </div>
      </div>

      {/* Main Core scroll viewport */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 touch-pan-y">
        
        {/* Horizontal scroll trending discussions section */}
        <div className="my-5">
          <div className="px-5 mb-3 flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-accent fill-accent" />
              <span>Trending Topics</span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold">24h Volume</span>
          </div>

          <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-5 py-1">
            {trendingTopics.map((topic, index) => (
              <div 
                key={index} 
                className={`min-w-[240px] max-w-[240px] bg-gradient-to-br bg-white p-4.5 rounded-3xl border border-gray-100 soft-shadow flex flex-col justify-between shrink-0 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer`}
                onClick={() => {
                  // Setup temporary mock navigation details
                  const findMatchedCode = index === 0 ? 'post-1' : index === 1 ? 'post-3' : 'post-2';
                  setSelectedPostId(findMatchedCode);
                  onNavigate('CommunityPostDetail');
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md">
                      {topic.domain}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <Flame className="w-2.5 h-2.5" /> {topic.tag}
                    </span>
                  </div>

                  <h3 className="text-xs font-black text-slate-900 line-clamp-1 mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                    {topic.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100/60 pt-3 mt-4 text-[9px] font-bold text-gray-400">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-gray-400" />
                    <span>{topic.cmts} Comments</span>
                  </span>
                  <span className="text-teal-600 font-black">Join Live &gt;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal filter chips */}
        <div className="px-5 mb-4 scroll-smooth">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
            {['All', 'BBCA', 'SBN', 'TLKM', 'BMRI'].map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`text-[9px] font-black px-3.5 py-1.5 rounded-full border transition-all active:scale-[0.96] shrink-0 uppercase tracking-wider ${
                  filterTag === tag 
                    ? 'bg-primary border-primary text-white shadow-sm' 
                    : 'bg-white border-gray-100 text-gray-500 hover:text-gray-900'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Latest discussions listing */}
        <div className="px-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1">
              <Compass className="w-4 h-4 text-primary" />
              <span>Latest Discussions</span>
            </span>
            <button 
              onClick={() => {
                // Shuffle filter tag order or show alert
                alert('Menampilkan postingan terkini dari investor NeoVest!');
              }}
              className="text-[10px] text-primary font-black hover:underline"
            >
              Filter
            </button>
          </div>

          {/* Cards of Posts */}
          <div className="flex flex-col gap-4">
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center text-xs text-gray-500 soft-shadow">
                <Search className="w-10 h-10 mx-auto text-gray-200 mb-2" />
                <p className="font-semibold">Tidak ditemukan hasil postingan yang sesuai.</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => {
                    setSelectedPostId(post.id);
                    onNavigate('CommunityPostDetail');
                  }}
                  className="bg-white rounded-3xl p-5 border border-gray-100 soft-shadow hover:scale-[1.01] transition-all cursor-pointer"
                >
                  {/* Author line info */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      {post.avatarUrl ? (
                        <img 
                          src={post.avatarUrl} 
                          alt="" 
                          className="w-10 h-10 rounded-full object-cover border border-gray-100/50"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">
                          {post.author.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-black text-gray-950 block">{post.author}</span>
                        <span className="text-[10px] text-gray-400 font-bold block">{post.timeAgo}</span>
                      </div>
                    </div>

                    <span className="text-[9px] text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-lg border border-gray-100 font-extrabold uppercase tracking-wide">
                      {post.category}
                    </span>
                  </div>

                  {/* Core Content */}
                  <h3 className="text-xs font-black text-gray-950 line-clamp-2 leading-relaxed mb-1 hover:text-primary transition-all">
                    {post.title}
                  </h3>
                  <p className="text-[10px] font-semibold text-gray-500 line-clamp-3 leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* Footer actions block */}
                  <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                    <button 
                      onClick={(e) => handleLikePost(post.id, e)}
                      id={`like-${post.id}`}
                      className={`flex items-center gap-1 text-[10px] font-bold ${
                        post.hasLiked ? 'text-rose-600' : 'text-gray-400 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${post.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      <span>{post.comments.length || post.commentsCount} Comments</span>
                    </span>

                    <button 
                      onClick={(e) => handleBookmarkPost(post.id, e)}
                      id={`bookmark-${post.id}`}
                      className={`p-1 rounded-full ${
                        post.hasBookmarked ? 'text-accent-dark' : 'text-gray-400'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${post.hasBookmarked ? 'fill-accent' : ''}`} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sentiment Widget on Community screen */}
        <div className="px-5 mt-6 mb-12">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 soft-shadow">
            <div className="flex items-center justify-between mb-4.5">
              <span className="text-xs font-black text-slate-900 tracking-tight">Community Sentiment</span>
              <span className="text-[9px] text-teal-600 font-black">Terbaca Live</span>
            </div>

            <div className="flex flex-col gap-4">
              
              {/* BBCA */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-black mb-1.5">
                  <div className="flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="w-6 h-6 rounded-md bg-blue-50 text-primary border border-blue-100 flex items-center justify-center font-extrabold text-[8px]">
                      BCA
                    </span>
                    <span>BBCA</span>
                  </div>
                  <span className="text-emerald-600">78% Bullish</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: '78%' }} />
                  <div className="bg-rose-500 h-full transition-all" style={{ width: '22%' }} />
                </div>
              </div>

              {/* TLKM */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-black mb-1.5">
                  <div className="flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center font-extrabold text-[8px]">
                      TLK
                    </span>
                    <span>TLKM</span>
                  </div>
                  <span className="text-rose-600">65% Bearish</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: '35%' }} />
                  <div className="bg-rose-500 h-full transition-all" style={{ width: '65%' }} />
                </div>
              </div>

              {/* BMRI */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-black mb-1.5">
                  <div className="flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-extrabold text-[8px]">
                      MRI
                    </span>
                    <span>BMRI</span>
                  </div>
                  <span className="text-amber-500">55% Neutral</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-amber-400 h-full transition-all" style={{ width: '55%' }} />
                  <div className="bg-gray-200 h-full transition-all" style={{ width: '45%' }} />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Button (FAB) at bottom-right of the viewport frame */}
      <button 
        onClick={() => setShowCreateModal(true)}
        className="absolute bottom-20 right-5 w-12 h-12 bg-accent hover:bg-accent-dark text-dark-blue rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all z-30"
        id="create-discussion-fab"
        title="Buat Diskusi"
      >
        <Plus className="w-6 h-6 text-dark-blue stroke-[3.2]" />
      </button>

      {/* modal create discussion */}
      {showCreateModal && (
        <div className="absolute inset-0 bg-dark-blue/60 backdrop-blur-xs flex items-end justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl rounded-b-3xl w-full max-w-sm p-5 shadow-2xl animate-fadeIn duration-200 border border-gray-150 flex flex-col gap-4">
            
            {/* Header modal */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-black text-slate-900 tracking-tight">Buat Postingan Diskusi Baru</span>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Input fields */}
            <form onSubmit={handleSubmitPost} className="flex flex-col gap-3">
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Judul Diskusi</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Analisa Dividen BBRI kuartal ini..." 
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-205 rounded-xl outline-none placeholder-gray-400 text-gray-800 focus:border-primary shrink-0"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Pilih Isu Saham / Tag</label>
                <select 
                  value={newPostStock}
                  onChange={(e) => setNewPostStock(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-205 rounded-xl bg-white outline-none text-gray-800"
                >
                  <option value="BBCA">BBCA - Bank Central Asia</option>
                  <option value="TLKM">TLKM - Telkom Indonesia</option>
                  <option value="BMRI">BMRI - Bank Mandiri</option>
                  <option value="BBRI">BBRI - Bank Rakyat Indonesia</option>
                  <option value="ADRO">ADRO - Adaro Energy Tbk.</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Kategori</label>
                  <select 
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-gray-205 rounded-xl bg-white outline-none text-gray-800"
                  >
                    <option value="Equities">Equities</option>
                    <option value="Bonds">Bonds</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Macro">Macro</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Analisa Sentimen</label>
                  <select 
                    value={newPostSentiment}
                    onChange={(e) => setNewPostSentiment(e.target.value as any)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-gray-205 rounded-xl bg-white outline-none text-gray-800"
                  >
                    <option value="Bullish">Bullish (Optimis Naik)</option>
                    <option value="Neutral">Neutral (Konsolidasi)</option>
                    <option value="Bearish">Bearish (Prediksi Turun)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Pendapat / Analisa Anda</label>
                <textarea 
                  rows={4}
                  placeholder="Tuliskan ulasan analisa teknikal, fundamental atau sekadar diskusi di sini..." 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-205 rounded-xl outline-none placeholder-gray-400 text-gray-800 focus:border-primary resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-full text-xs font-bold shadow active:scale-95 transition-all mt-2.5"
                id="submit-discussion-post-btn"
              >
                Kirim Postingan &amp; Publikasi
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
