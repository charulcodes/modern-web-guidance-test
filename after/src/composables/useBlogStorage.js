import { ref, watch } from 'vue';
import { INITIAL_POSTS } from '../data/samplePosts';

const STORAGE_KEY_POSTS = 'chronicle_blog_posts_v1';
const STORAGE_KEY_LIKES = 'chronicle_liked_posts_v1';
const STORAGE_KEY_USER_COMMENTS = 'chronicle_user_comment_ids_v1';
const STORAGE_KEY_AUTHOR_NAME = 'chronicle_saved_author_name_v1';

// Shared state across the app
const posts = ref([]);
const likedPostIds = ref([]);
const userCommentIds = ref([]);
const savedAuthorName = ref('Guest');
const isInitialized = ref(false);

function initStorage() {
  if (isInitialized.value) return;

  // 1. Initialize posts
  try {
    const storedPosts = localStorage.getItem(STORAGE_KEY_POSTS);
    if (storedPosts) {
      const parsed = JSON.parse(storedPosts);
      if (Array.isArray(parsed) && parsed.length > 0) {
        posts.value = parsed;
      } else {
        posts.value = JSON.parse(JSON.stringify(INITIAL_POSTS));
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts.value));
      }
    } else {
      posts.value = JSON.parse(JSON.stringify(INITIAL_POSTS));
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts.value));
    }
  } catch (e) {
    console.error('Failed to parse posts from localStorage:', e);
    posts.value = JSON.parse(JSON.stringify(INITIAL_POSTS));
  }

  // 2. Initialize likes
  try {
    const storedLikes = localStorage.getItem(STORAGE_KEY_LIKES);
    likedPostIds.value = storedLikes ? JSON.parse(storedLikes) : [];
  } catch (e) {
    likedPostIds.value = [];
  }

  // 3. Initialize user-created comments
  try {
    const storedUserComments = localStorage.getItem(STORAGE_KEY_USER_COMMENTS);
    userCommentIds.value = storedUserComments ? JSON.parse(storedUserComments) : [];
  } catch (e) {
    userCommentIds.value = [];
  }

  // 4. Initialize saved author name
  try {
    const storedName = localStorage.getItem(STORAGE_KEY_AUTHOR_NAME);
    if (storedName && storedName.trim()) {
      savedAuthorName.value = storedName.trim();
    }
  } catch (e) {
    savedAuthorName.value = 'Guest';
  }

  isInitialized.value = true;
}

// Keep localStorage in sync whenever posts change
watch(
  posts,
  (newPosts) => {
    try {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(newPosts));
    } catch (e) {
      console.error('Failed to save posts to localStorage:', e);
    }
  },
  { deep: true }
);

// Keep likedPostIds in sync
watch(
  likedPostIds,
  (newLikes) => {
    try {
      localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(newLikes));
    } catch (e) {
      console.error('Failed to save likes to localStorage:', e);
    }
  },
  { deep: true }
);

// Keep userCommentIds in sync
watch(
  userCommentIds,
  (newComments) => {
    try {
      localStorage.setItem(STORAGE_KEY_USER_COMMENTS, JSON.stringify(newComments));
    } catch (e) {
      console.error('Failed to save user comment IDs to localStorage:', e);
    }
  },
  { deep: true }
);

// Keep savedAuthorName in sync
watch(savedAuthorName, (newName) => {
  try {
    if (newName && newName.trim()) {
      localStorage.setItem(STORAGE_KEY_AUTHOR_NAME, newName.trim());
    }
  } catch (e) {
    console.error('Failed to save author name to localStorage:', e);
  }
});

export function useBlogStorage() {
  initStorage();

  // Check if a post is liked by this client
  const isPostLiked = (postId) => {
    return likedPostIds.value.includes(postId);
  };

  // Toggle like
  const toggleLike = (postId) => {
    const post = posts.value.find((p) => p.id === postId);
    if (!post) return false;

    const alreadyLiked = likedPostIds.value.includes(postId);
    if (alreadyLiked) {
      // Unlike
      likedPostIds.value = likedPostIds.value.filter((id) => id !== postId);
      post.likes = Math.max(0, (post.likes || 1) - 1);
      return false;
    } else {
      // Like
      likedPostIds.value.push(postId);
      post.likes = (post.likes || 0) + 1;
      return true;
    }
  };

  // Find post by slug or ID
  const getPostBySlug = (slug) => {
    return posts.value.find((p) => p.slug === slug || p.id === slug);
  };

  // Add comment
  const addComment = (postId, { authorName, content }) => {
    const post = posts.value.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    const cleanName = (authorName && authorName.trim()) || 'Guest';
    const cleanContent = (content && content.trim()) || '';

    if (!cleanContent) {
      throw new Error('Comment cannot be empty');
    }

    savedAuthorName.value = cleanName;

    const commentId = 'c-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const newComment = {
      id: commentId,
      authorName: cleanName,
      content: cleanContent,
      createdAt: new Date().toISOString(),
      isUserCreated: true
    };

    if (!post.comments) {
      post.comments = [];
    }

    // Add to beginning (newest first)
    post.comments.unshift(newComment);

    // Track that this client created this comment
    userCommentIds.value.push(commentId);

    return newComment;
  };

  // Delete comment
  const deleteComment = (postId, commentId) => {
    const post = posts.value.find((p) => p.id === postId);
    if (!post || !post.comments) return false;

    post.comments = post.comments.filter((c) => c.id !== commentId);
    userCommentIds.value = userCommentIds.value.filter((id) => id !== commentId);
    return true;
  };

  // Check if current user can delete this comment
  const canDeleteComment = (commentId) => {
    return userCommentIds.value.includes(commentId);
  };

  // Create new post
  const createPost = ({ title, category, authorName, authorRole, coverImage, content, tags }) => {
    const cleanTitle = (title && title.trim()) || 'Untitled Article';
    const cleanCategory = (category && category.trim()) || 'Tech';
    const cleanAuthor = (authorName && authorName.trim()) || savedAuthorName.value || 'Anonymous Writer';
    const cleanRole = (authorRole && authorRole.trim()) || 'Contributing Author';
    const cleanContent = (content && content.trim()) || '';
    
    savedAuthorName.value = cleanAuthor;

    // Generate URL-friendly slug
    const baseSlug = cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'article';
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // Calculate approximate read time (average 200 words per minute)
    const wordCount = cleanContent.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = `${minutes} min read`;

    // Process tags
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => t.trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);
    }
    if (processedTags.length === 0) {
      processedTags = [cleanCategory];
    }

    // Default covers based on category if empty
    const defaultCovers = {
      Tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
      Design: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80',
      Lifestyle: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80',
      Productivity: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80'
    };

    const cleanCover = (coverImage && coverImage.trim()) || defaultCovers[cleanCategory] || defaultCovers.Tech;

    // Create excerpt from content
    const plainText = cleanContent.replace(/[#*`_>\[\]]/g, '').trim();
    const excerpt = plainText.length > 160 ? plainText.slice(0, 157) + '...' : plainText || 'Read the full article...';

    const newPost = {
      id: 'post-' + Date.now(),
      title: cleanTitle,
      slug: uniqueSlug,
      category: cleanCategory,
      author: {
        name: cleanAuthor,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanAuthor)}&backgroundColor=0284c7,2563eb,4f46e5,7c3aed`,
        role: cleanRole
      },
      publishedAt: new Date().toISOString(),
      readTime,
      coverImage: cleanCover,
      excerpt,
      content: cleanContent,
      tags: processedTags,
      likes: 0,
      comments: []
    };

    posts.value.unshift(newPost);
    return newPost;
  };

  // Reset demo data
  const resetDemoData = () => {
    posts.value = JSON.parse(JSON.stringify(INITIAL_POSTS));
    likedPostIds.value = [];
    userCommentIds.value = [];
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts.value));
    localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_USER_COMMENTS, JSON.stringify([]));
  };

  return {
    posts,
    likedPostIds,
    savedAuthorName,
    isPostLiked,
    toggleLike,
    getPostBySlug,
    addComment,
    deleteComment,
    canDeleteComment,
    createPost,
    resetDemoData
  };
}
