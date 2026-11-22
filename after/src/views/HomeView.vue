<script setup>
import { ref, computed } from 'vue';
import { useBlogStorage } from '../composables/useBlogStorage';
import PostCard from '../components/PostCard.vue';
import { Search, X, Sparkles, Filter, Compass } from 'lucide-vue-next';

const emit = defineEmits(['openCreateModal']);

const { posts } = useBlogStorage();

const searchQuery = ref('');
const selectedCategory = ref('All');

const categories = ['All', 'Tech', 'Design', 'Lifestyle', 'Productivity'];

// Live filtering by category and search (title, excerpt, content, tags)
const filteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const category = selectedCategory.value;

  return posts.value.filter((post) => {
    // Category match
    const matchesCategory =
      category === 'All' ||
      (post.category && post.category.toLowerCase() === category.toLowerCase());

    if (!matchesCategory) return false;

    // Search query match
    if (!query) return true;

    const inTitle = (post.title || '').toLowerCase().includes(query);
    const inExcerpt = (post.excerpt || '').toLowerCase().includes(query);
    const inContent = (post.content || '').toLowerCase().includes(query);
    const inTags = (post.tags || []).some((tag) =>
      tag.toLowerCase().includes(query)
    );
    const inAuthor = (post.author?.name || '').toLowerCase().includes(query);

    return inTitle || inExcerpt || inContent || inTags || inAuthor;
  });
});

const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'All';
};
</script>

<template>
  <div class="home-view">
    <!-- Hero / Intro Banner -->
    <section class="hero-section">
      <div class="container hero-container">
        <div class="hero-content">
          <div class="hero-tag">
            <Sparkles :size="14" class="hero-tag-icon" />
            <span>The Independent Review</span>
          </div>
          <h1 class="hero-heading">
            Stories, craft, and ideas that shape our digital world.
          </h1>
          <p class="hero-subheading">
            Explore deep dives on modern engineering, minimalist design systems, cognitive ergonomics, and the art of intentional living.
          </p>
        </div>

        <!-- Search & Category Filter Controls -->
        <div class="filter-controls">
          <!-- Search Bar -->
          <div class="search-bar-wrap">
            <Search :size="18" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title, topic, tags, or content..."
              class="search-input"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="clear-search-btn"
              @click="searchQuery = ''"
              aria-label="Clear search"
            >
              <X :size="16" />
            </button>
          </div>

          <!-- Category Pills -->
          <div class="category-pills" role="tablist">
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              class="category-pill"
              :class="{ active: selectedCategory === cat }"
              @click="selectedCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Feed Section -->
    <main class="feed-section">
      <div class="container">
        <!-- Feed Header / Active Status -->
        <div class="feed-meta-bar">
          <div class="feed-count">
            <span class="count-number">{{ filteredPosts.length }}</span>
            <span class="count-label">
              {{ filteredPosts.length === 1 ? 'article available' : 'articles available' }}
            </span>
            <span v-if="selectedCategory !== 'All'" class="filter-tag">
              in <strong>{{ selectedCategory }}</strong>
            </span>
            <span v-if="searchQuery.trim()" class="search-tag">
              matching "<strong>{{ searchQuery }}</strong>"
            </span>
          </div>

          <button
            v-if="searchQuery.trim() || selectedCategory !== 'All'"
            type="button"
            class="reset-filter-btn"
            @click="clearFilters"
          >
            Clear filters
          </button>
        </div>

        <!-- Posts Grid -->
        <div v-if="filteredPosts.length > 0" class="posts-grid">
          <PostCard
            v-for="post in filteredPosts"
            :key="post.id"
            :post="post"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-icon-wrap">
            <Compass :size="36" />
          </div>
          <h2 class="empty-title">No articles found</h2>
          <p class="empty-description">
            We couldn't find any articles matching your search query or selected category.
          </p>
          <div class="empty-actions">
            <button type="button" class="btn btn-outline" @click="clearFilters">
              Clear All Filters
            </button>
            <button type="button" class="btn btn-primary" @click="emit('openCreateModal')">
              + Write a New Post
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  padding-block-end: 4rem;
}

/* Hero Section */
.hero-section {
  padding-block: 3.5rem 2rem;
  background-color: var(--bg-surface);
  border-block-end: 1px solid var(--border-light);
  transition: background-color var(--transition-normal);
}

.hero-container {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}

.hero-content {
  max-inline-size: 780px;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin-block-end: 0.75rem;
}

.hero-tag-icon {
  color: var(--accent);
}

.hero-heading {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 1.25rem + 3vw, 3rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-block-end: 1rem;
  text-wrap: balance;
}

.hero-subheading {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
  text-wrap: pretty;
  max-inline-size: 65ch;
}

/* Controls */
.filter-controls {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.search-bar-wrap {
  position: relative;
  max-inline-size: 620px;
  inline-size: 100%;
}

.search-icon {
  position: absolute;
  inset-inline-start: 1.125rem;
  inset-block-start: 50%;
  translate: 0 -50%;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  inline-size: 100%;
  padding-block: 0.875rem;
  padding-inline: 3rem 2.75rem;
  font-size: 0.9375rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-full);
  color: var(--text-primary);
  outline: none;
  transition: all var(--transition-fast);

  &:focus-visible {
    border-color: var(--accent);
    background-color: var(--bg-surface);
    box-shadow: 0 0 0 3px var(--accent-subtle);
  }
}

.clear-search-btn {
  position: absolute;
  inset-inline-end: 1rem;
  inset-block-start: 50%;
  translate: 0 -50%;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);

  &:hover {
    color: var(--text-primary);
  }
}

/* Category Pills with flex-wrap: balance */
.category-pills {
  display: flex;
  flex-wrap: wrap;
  flex-wrap: balance;
  align-items: center;
  gap: 0.5rem;
  padding-block-end: 0.25rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.category-pill {
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  font-weight: 500;
  padding-block: 0.45rem;
  padding-inline: 1rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);

  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-tertiary);
  }

  &.active {
    background-color: var(--text-primary);
    color: var(--bg-primary);
  }
}

/* Feed Section */
.feed-section {
  padding-block-start: 2.5rem;
}

.feed-meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 2rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feed-count {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.count-number {
  font-weight: 700;
  color: var(--text-primary);
}

.filter-tag, .search-tag {
  color: var(--text-secondary);
}

.reset-filter-btn {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
}

/* Responsive Grid with min(100%, ...) */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  gap: 2rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding-block: 5rem;
  padding-inline: 2rem;
  background-color: var(--bg-surface);
  border: 1px dashed var(--border-medium);
  border-radius: var(--radius-lg);
  max-inline-size: 580px;
  margin-inline: auto;
  margin-block: 2rem;
}

.empty-icon-wrap {
  inline-size: 4rem;
  block-size: 4rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-secondary);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline: auto;
  margin-block-end: 1.5rem;
}

.empty-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-block-end: 0.5rem;
  text-wrap: balance;
}

.empty-description {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-block-end: 1.75rem;
  text-wrap: pretty;
}

.empty-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
