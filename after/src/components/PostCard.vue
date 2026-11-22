<script setup>
import { computed } from 'vue';
import { Heart, MessageSquare, Clock, Calendar } from 'lucide-vue-next';
import { useBlogStorage } from '../composables/useBlogStorage';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const { isPostLiked, toggleLike } = useBlogStorage();

const liked = computed(() => isPostLiked(props.post.id));

const formattedDate = computed(() => {
  if (!props.post.publishedAt) return '';
  const date = new Date(props.post.publishedAt);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
});

const categoryClass = computed(() => {
  const cat = (props.post.category || '').toLowerCase();
  if (cat.includes('tech')) return 'badge-tech';
  if (cat.includes('design')) return 'badge-design';
  if (cat.includes('prod')) return 'badge-productivity';
  if (cat.includes('life')) return 'badge-lifestyle';
  return 'badge-tech';
});

const handleLikeClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleLike(props.post.id);
};
</script>

<template>
  <article class="post-card">
    <!-- Clickable router link container -->
    <router-link :to="`/post/${post.slug || post.id}`" class="card-link" :aria-label="post.title">
      <!-- Cover Image -->
      <div class="card-image-wrap">
        <img
          :src="post.coverImage"
          :alt="post.title"
          class="card-image"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'"
        />
        <span class="badge card-category" :class="categoryClass">
          {{ post.category }}
        </span>
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <div class="card-meta">
          <span class="meta-item">
            <Calendar :size="13" />
            <span>{{ formattedDate }}</span>
          </span>
          <span class="meta-dot">&bull;</span>
          <span class="meta-item">
            <Clock :size="13" />
            <span>{{ post.readTime }}</span>
          </span>
        </div>

        <h3 class="card-title">{{ post.title }}</h3>

        <p class="card-excerpt">{{ post.excerpt }}</p>

        <!-- Card Footer -->
        <div class="card-footer">
          <!-- Author -->
          <div class="author-info">
            <img
              :src="post.author.avatar"
              :alt="post.author.name"
              class="author-avatar"
              loading="lazy"
              onerror="this.src='https://api.dicebear.com/7.x/initials/svg?seed=Author'"
            />
            <div class="author-details">
              <span class="author-name">{{ post.author.name }}</span>
            </div>
          </div>

          <!-- Stats (Likes & Comments) -->
          <div class="card-stats">
            <!-- Like Button -->
            <button
              type="button"
              class="stat-btn like-btn"
              :class="{ 'is-liked': liked }"
              @click="handleLikeClick"
              :title="liked ? 'Unlike post' : 'Like post'"
              :aria-label="liked ? 'Unlike post' : 'Like post'"
            >
              <Heart
                :size="15"
                :class="{ 'animate-heart': liked }"
                :fill="liked ? 'currentColor' : 'none'"
              />
              <span class="stat-count">{{ post.likes || 0 }}</span>
            </button>

            <!-- Comments Count -->
            <div class="stat-badge" title="Comments">
              <MessageSquare :size="15" />
              <span class="stat-count">{{ post.comments ? post.comments.length : 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </article>
</template>

<style scoped>
.post-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal);
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--border-medium);
}

.card-link {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: var(--bg-secondary);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.post-card:hover .card-image {
  transform: scale(1.03);
}

.card-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-sm);
}

.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text-primary);
  margin-bottom: 0.625rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--transition-fast);
}

.post-card:hover .card-title {
  color: var(--accent);
}

.card-excerpt {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
  gap: 0.75rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
}

.author-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  object-fit: cover;
  flex-shrink: 0;
}

.author-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-stats {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.stat-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  background: none;
  border: 1px solid transparent;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.8125rem;
  transition: all var(--transition-fast);
}

.stat-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.stat-btn.is-liked {
  color: var(--like-color);
  background-color: var(--like-subtle);
}

.stat-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  color: var(--text-muted);
  font-size: 0.8125rem;
  padding: 0.25rem 0.375rem;
}

.stat-count {
  font-weight: 500;
}
</style>
