<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBlogStorage } from '../composables/useBlogStorage';
import { useToast } from '../composables/useToast';
import CommentSection from '../components/CommentSection.vue';
import {
  ArrowLeft,
  Heart,
  Calendar,
  Clock,
  Share2,
  Tag,
  BookmarkCheck,
  Check
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const { posts, getPostBySlug, isPostLiked, toggleLike } = useBlogStorage();
const { showToast } = useToast();

const currentPost = computed(() => {
  const param = route.params.slug;
  return getPostBySlug(param);
});

const liked = computed(() => {
  if (!currentPost.value) return false;
  return isPostLiked(currentPost.value.id);
});

const formattedDate = computed(() => {
  if (!currentPost.value?.publishedAt) return '';
  const date = new Date(currentPost.value.publishedAt);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
});

const categoryClass = computed(() => {
  const cat = (currentPost.value?.category || '').toLowerCase();
  if (cat.includes('tech')) return 'badge-tech';
  if (cat.includes('design')) return 'badge-design';
  if (cat.includes('prod')) return 'badge-productivity';
  if (cat.includes('life')) return 'badge-lifestyle';
  return 'badge-tech';
});

// Format markdown paragraphs & blocks into clean HTML structure
const formattedParagraphs = computed(() => {
  if (!currentPost.value?.content) return [];
  // Split on double newlines
  const blocks = currentPost.value.content.split(/\n\n+/);
  return blocks.map((raw) => {
    const trimmed = raw.trim();
    if (trimmed.startsWith('### ')) {
      return { type: 'h3', text: trimmed.replace(/^###\s+/, '') };
    }
    if (trimmed.startsWith('## ')) {
      return { type: 'h2', text: trimmed.replace(/^##\s+/, '') };
    }
    if (trimmed.startsWith('> ')) {
      return { type: 'quote', text: trimmed.replace(/^>\s+/, '').replace(/\n>\s*/g, ' ') };
    }
    if (trimmed.startsWith('```')) {
      const codeClean = trimmed.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');
      return { type: 'code', text: codeClean };
    }
    if (trimmed.startsWith('1. ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const lines = trimmed.split('\n').map((l) => l.replace(/^(\d+\.|\-|\*)\s+/, '').trim());
      return { type: 'list', items: lines, ordered: trimmed.startsWith('1. ') };
    }
    return { type: 'p', text: trimmed };
  });
});

const handleLike = () => {
  if (!currentPost.value) return;
  const isNowLiked = toggleLike(currentPost.value.id);
  if (isNowLiked) {
    showToast('Liked this article!', 'success', 2000);
  }
};

const handleShare = async () => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!', 'info');
    } else {
      showToast('URL: ' + window.location.href, 'info');
    }
  } catch (err) {
    showToast('Could not copy link to clipboard', 'error');
  }
};
</script>

<template>
  <div v-if="currentPost" class="post-detail-view">
    <!-- Back Navigation Bar -->
    <div class="back-bar">
      <div class="container">
        <button type="button" class="back-btn" @click="router.push('/')">
          <ArrowLeft :size="16" />
          <span>Back to Articles</span>
        </button>
      </div>
    </div>

    <!-- Article Header -->
    <header class="article-header">
      <div class="container article-container">
        <!-- Category & Read Time -->
        <div class="header-meta">
          <span class="badge" :class="categoryClass">
            {{ currentPost.category }}
          </span>
          <span class="meta-dot">&bull;</span>
          <span class="read-time-item">
            <Clock :size="13" />
            <span>{{ currentPost.readTime }}</span>
          </span>
        </div>

        <!-- Title -->
        <h1 class="article-title">{{ currentPost.title }}</h1>

        <!-- Excerpt Subtitle -->
        <p class="article-lead">{{ currentPost.excerpt }}</p>

        <!-- Author Bar & Actions -->
        <div class="author-action-bar">
          <div class="author-profile">
            <img
              :src="currentPost.author.avatar"
              :alt="currentPost.author.name"
              class="author-avatar-large"
              loading="lazy"
              onerror="this.src='https://api.dicebear.com/7.x/initials/svg?seed=Author'"
            />
            <div class="author-details">
              <span class="author-name-large">{{ currentPost.author.name }}</span>
              <span class="author-meta-text">
                {{ currentPost.author.role }} &bull; Published on {{ formattedDate }}
              </span>
            </div>
          </div>

          <div class="article-actions">
            <!-- Like Button -->
            <button
              type="button"
              class="btn-like-article"
              :class="{ 'is-liked': liked }"
              @click="handleLike"
              :title="liked ? 'Liked! Click to unlike' : 'Like this story'"
            >
              <Heart
                :size="18"
                :class="{ 'animate-heart': liked }"
                :fill="liked ? 'currentColor' : 'none'"
              />
              <span class="like-number">{{ currentPost.likes || 0 }}</span>
            </button>

            <!-- Share Button -->
            <button
              type="button"
              class="btn-action-icon"
              @click="handleShare"
              title="Share article link"
              aria-label="Share article link"
            >
              <Share2 :size="18" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Cover Image Banner -->
    <div class="cover-banner-wrapper">
      <div class="container article-container">
        <div class="banner-frame">
          <img
            :src="currentPost.coverImage"
            :alt="currentPost.title"
            class="banner-image"
            onerror="this.src='https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80'"
          />
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <article class="article-body-wrapper">
      <div class="container article-container">
        <div class="article-body">
          <template v-for="(block, idx) in formattedParagraphs" :key="idx">
            <h2 v-if="block.type === 'h2'" class="body-h2">
              {{ block.text }}
            </h2>

            <h3 v-else-if="block.type === 'h3'" class="body-h3">
              {{ block.text }}
            </h3>

            <blockquote v-else-if="block.type === 'quote'" class="body-quote">
              <p>{{ block.text }}</p>
            </blockquote>

            <pre v-else-if="block.type === 'code'" class="body-code"><code>{{ block.text }}</code></pre>

            <ul v-else-if="block.type === 'list' && !block.ordered" class="body-list">
              <li v-for="(item, i) in block.items" :key="i">{{ item }}</li>
            </ul>

            <ol v-else-if="block.type === 'list' && block.ordered" class="body-ordered-list">
              <li v-for="(item, i) in block.items" :key="i">{{ item }}</li>
            </ol>

            <p v-else class="body-p">
              {{ block.text }}
            </p>
          </template>
        </div>

        <!-- Tags List -->
        <div class="tags-section">
          <div class="tags-list">
            <span
              v-for="tag in currentPost.tags"
              :key="tag"
              class="tag-pill"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- Floating / Sticky Like Banner -->
        <div class="bottom-engagement-bar">
          <div class="engagement-text">
            Did you enjoy reading this perspective?
          </div>
          <button
            type="button"
            class="btn-like-article btn-large"
            :class="{ 'is-liked': liked }"
            @click="handleLike"
          >
            <Heart
              :size="20"
              :class="{ 'animate-heart': liked }"
              :fill="liked ? 'currentColor' : 'none'"
            />
            <span>{{ liked ? 'You Liked This Story' : 'Like This Story' }}</span>
            <span class="like-counter-bubble">{{ currentPost.likes || 0 }}</span>
          </button>
        </div>

        <!-- Comments Section -->
        <CommentSection
          :post-id="currentPost.id"
          :comments="currentPost.comments || []"
        />
      </div>
    </article>
  </div>

  <!-- Post Not Found Fallback -->
  <div v-else class="post-not-found container">
    <h2>Article Not Found</h2>
    <p>The story you are looking for may have been removed or does not exist.</p>
    <router-link to="/" class="btn btn-primary">
      <ArrowLeft :size="16" />
      <span>Return to Feed</span>
    </router-link>
  </div>
</template>

<style scoped>
.post-detail-view {
  padding-block-end: 5rem;
}

.article-container {
  max-inline-size: 820px;
  margin-inline: auto;
}

/* Back bar */
.back-bar {
  padding-block: 1.5rem 0.5rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  padding-block: 0.375rem;
  padding-inline: 0;
  translate: 0 0;
  transition: color var(--transition-fast), translate var(--transition-fast);

  &:hover {
    color: var(--text-primary);
    @media (prefers-reduced-motion: no-preference) {
      translate: -3px 0;
    }
  }
}

/* Header */
.article-header {
  padding-block: 1.5rem 2rem;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-block-end: 1.25rem;
}

.meta-dot {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.read-time-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.article-title {
  font-family: var(--font-serif);
  font-size: clamp(2.25rem, 1.5rem + 3.5vw, 3.25rem);
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-block-end: 1.25rem;
  text-wrap: balance;
}

.article-lead {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-block-end: 2rem;
  text-wrap: pretty;
  max-inline-size: 75ch;
}

/* Author action bar */
.author-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1.25rem;
  border-block-start: 1px solid var(--border-light);
  border-block-end: 1px solid var(--border-light);
  gap: 1rem;
  flex-wrap: wrap;
}

.author-profile {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.author-avatar-large {
  inline-size: 2.75rem;
  block-size: 2.75rem;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name-large {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.author-meta-text {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.article-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-like-article {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-medium);
  padding-block: 0.5rem;
  padding-inline: 1rem;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
  }

  &.is-liked {
    color: var(--like-color);
    background-color: var(--like-subtle);
    border-color: color-mix(in oklab, var(--like-color) 30%, transparent);
  }
}

.btn-action-icon {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-medium);
  inline-size: 2.375rem;
  block-size: 2.375rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-secondary);
  }
}

/* Banner Frame */
.cover-banner-wrapper {
  margin-block: 1.5rem 2.5rem;
}

.banner-frame {
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  max-block-size: 480px;
  border-radius: var(--radius-lg);
  overflow: clip;
  box-shadow: var(--shadow-md);
  background-color: var(--bg-secondary);
}

.banner-image {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

/* Article Body Typography */
.article-body-wrapper {
  padding-block-start: 1rem;
}

.article-body {
  font-family: var(--font-serif);
  font-size: 1.1875rem;
  line-height: 1.85;
  color: var(--text-primary);
  max-inline-size: 70ch;
}

.body-p {
  margin-block-end: 1.75rem;
  text-wrap: pretty;
  overflow-wrap: break-word;
}

.body-h2 {
  font-family: var(--font-sans);
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-block: 2.75rem 1rem;
  color: var(--text-primary);
  text-wrap: balance;
}

.body-h3 {
  font-family: var(--font-sans);
  font-size: 1.375rem;
  font-weight: 600;
  margin-block: 2.25rem 0.875rem;
  color: var(--text-primary);
  text-wrap: balance;
}

.body-quote {
  font-style: italic;
  font-size: 1.25rem;
  line-height: 1.6;
  border-inline-start: 3px solid var(--accent);
  padding-block: 0.75rem;
  padding-inline-start: 1.5rem;
  margin-block: 2.25rem;
  color: var(--text-secondary);
  text-wrap: pretty;
}

.body-code {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  overflow-x: auto;
  line-height: 1.5;
  margin-block: 2rem;
  color: var(--text-primary);
}

.body-list, .body-ordered-list {
  padding-inline-start: 1.5rem;
  margin-block-end: 1.75rem;
}

.body-list li, .body-ordered-list li {
  margin-block-end: 0.625rem;
  text-wrap: pretty;
}

/* Tags */
.tags-section {
  margin-block-start: 2.5rem;
  padding-block-start: 1.5rem;
  border-block-start: 1px solid var(--border-light);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-pill {
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  font-weight: 500;
  padding-block: 0.35rem;
  padding-inline: 0.75rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}

/* Bottom Engagement Bar */
.bottom-engagement-bar {
  margin-block-start: 3rem;
  padding: 2rem;
  border-radius: var(--radius-lg);
  background-color: var(--bg-surface);
  border: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.engagement-text {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  text-wrap: balance;
}

.btn-large {
  padding-block: 0.75rem;
  padding-inline: 1.5rem;
  font-size: 0.9375rem;
}

.like-counter-bubble {
  background: color-mix(in oklab, var(--text-primary) 8%, transparent);
  padding-block: 0.15rem;
  padding-inline: 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 600;
}

/* Not Found */
.post-not-found {
  text-align: center;
  padding-block: 6rem;
  padding-inline: 1.5rem;
}

.post-not-found h2 {
  font-family: var(--font-serif);
  font-size: 2rem;
  margin-block-end: 1rem;
  text-wrap: balance;
}

.post-not-found p {
  color: var(--text-secondary);
  margin-block-end: 2rem;
  text-wrap: pretty;
}
</style>
