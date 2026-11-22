<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBlogStorage } from '../composables/useBlogStorage';
import { useToast } from '../composables/useToast';
import { X, Image, Tag, User, Sparkles, Eye, Edit3, Send } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);
const router = useRouter();

const { createPost, savedAuthorName } = useBlogStorage();
const { showToast } = useToast();

const activeTab = ref('editor'); // 'editor' | 'preview'

const form = reactive({
  title: '',
  category: 'Tech',
  authorName: savedAuthorName.value === 'Guest' ? '' : savedAuthorName.value,
  authorRole: '',
  coverImage: '',
  tags: '',
  content: ''
});

const categories = ['Tech', 'Design', 'Lifestyle', 'Productivity'];

// Unsplash presets for convenience
const coverPresets = [
  {
    name: 'Tech Abstract',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80'
  },
  {
    name: 'Design Editorial',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80'
  },
  {
    name: 'Desk & Coffee',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80'
  },
  {
    name: 'Scenic Travel',
    url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80'
  }
];

const selectPreset = (url) => {
  form.coverImage = url;
};

const wordCount = computed(() => {
  return form.content.split(/\s+/).filter(Boolean).length;
});

const estimatedReadTime = computed(() => {
  const mins = Math.max(1, Math.ceil(wordCount.value / 200));
  return `${mins} min read`;
});

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  if (!form.title.trim()) {
    showToast('Please enter an article title.', 'error');
    return;
  }
  if (!form.content.trim()) {
    showToast('Please write some content for your article.', 'error');
    return;
  }

  try {
    const newPost = createPost({
      title: form.title,
      category: form.category,
      authorName: form.authorName,
      authorRole: form.authorRole,
      coverImage: form.coverImage,
      content: form.content,
      tags: form.tags
    });

    showToast(`Published "${newPost.title}"!`, 'success');

    // Reset form
    form.title = '';
    form.content = '';
    form.tags = '';
    form.authorRole = '';
    activeTab.value = 'editor';

    emit('close');
    router.push(`/post/${newPost.slug}`);
  } catch (err) {
    showToast(err.message || 'Failed to create post', 'error');
  }
};
</script>

<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
      <div class="modal-dialog">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="header-titles">
            <h2 class="modal-title">Publish an Article</h2>
            <p class="modal-subtitle">Share your insights with Chronicle readers</p>
          </div>

          <div class="header-actions">
            <!-- Tabs: Write / Preview -->
            <div class="tab-toggle">
              <button
                type="button"
                class="tab-btn"
                :class="{ active: activeTab === 'editor' }"
                @click="activeTab = 'editor'"
              >
                <Edit3 :size="14" />
                <span>Write</span>
              </button>
              <button
                type="button"
                class="tab-btn"
                :class="{ active: activeTab === 'preview' }"
                @click="activeTab = 'preview'"
              >
                <Eye :size="14" />
                <span>Preview</span>
              </button>
            </div>

            <!-- Close button -->
            <button
              type="button"
              class="btn-icon-close"
              @click="handleClose"
              aria-label="Close modal"
            >
              <X :size="20" />
            </button>
          </div>
        </div>

        <!-- Modal Body: Editor Tab -->
        <div v-show="activeTab === 'editor'" class="modal-body">
          <form @submit.prevent="handleSubmit" id="create-post-form">
            <!-- Title -->
            <div class="form-group">
              <label class="form-label" for="post-title">Article Title *</label>
              <input
                id="post-title"
                v-model="form.title"
                type="text"
                placeholder="e.g., The Future of Distributed Systems and Fine-Grained Reactivity"
                class="input title-input"
                required
              />
            </div>

            <!-- Category & Author Row -->
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="post-category">Category</label>
                <select id="post-category" v-model="form.category" class="select">
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="post-author">Author Name</label>
                <input
                  id="post-author"
                  v-model="form.authorName"
                  type="text"
                  placeholder="Your Name (defaults to saved name)"
                  class="input"
                />
              </div>
            </div>

            <!-- Author Role & Tags -->
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="post-role">Author Role / Bio</label>
                <input
                  id="post-role"
                  v-model="form.authorRole"
                  type="text"
                  placeholder="e.g., Design Technologist & Writer"
                  class="input"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="post-tags">Tags (comma-separated)</label>
                <input
                  id="post-tags"
                  v-model="form.tags"
                  type="text"
                  placeholder="Architecture, WebDev, Design"
                  class="input"
                />
              </div>
            </div>

            <!-- Cover Image URL & Quick Presets -->
            <div class="form-group">
              <label class="form-label" for="post-cover">
                Cover Image URL (Unsplash or web image)
              </label>
              <input
                id="post-cover"
                v-model="form.coverImage"
                type="url"
                placeholder="https://images.unsplash.com/..."
                class="input"
              />
              <div class="cover-presets">
                <span class="preset-label">Quick presets:</span>
                <button
                  v-for="preset in coverPresets"
                  :key="preset.name"
                  type="button"
                  class="preset-chip"
                  @click="selectPreset(preset.url)"
                >
                  {{ preset.name }}
                </button>
              </div>
            </div>

            <!-- Content Area -->
            <div class="form-group">
              <div class="content-label-row">
                <label class="form-label" for="post-content">Article Body *</label>
                <span class="content-meta">
                  {{ wordCount }} words &bull; ~{{ estimatedReadTime }}
                </span>
              </div>
              <textarea
                id="post-content"
                v-model="form.content"
                placeholder="Write your article here... Markdown headings (###), quotes (>), lists, and code blocks are supported."
                class="textarea content-textarea"
                rows="9"
                required
              ></textarea>
            </div>
          </form>
        </div>

        <!-- Modal Body: Preview Tab -->
        <div v-show="activeTab === 'preview'" class="modal-body preview-mode">
          <div class="preview-banner" v-if="form.coverImage">
            <img :src="form.coverImage" alt="Preview cover" class="preview-img" />
          </div>
          <div class="preview-header">
            <span class="badge badge-tech">{{ form.category }}</span>
            <h1 class="preview-title">{{ form.title || 'Untitled Article' }}</h1>
            <div class="preview-author-bar">
              <span>By {{ form.authorName || 'Guest Author' }}</span>
              <span class="dot">&bull;</span>
              <span>{{ estimatedReadTime }}</span>
            </div>
          </div>
          <div class="preview-body">
            <p v-if="!form.content.trim()" class="preview-placeholder">
              Nothing to preview yet. Switch to the 'Write' tab to add your thoughts.
            </p>
            <div v-else class="preview-content-text">
              {{ form.content }}
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-outline" @click="handleClose">
            Cancel
          </button>
          <button
            type="submit"
            form="create-post-form"
            class="btn btn-primary"
            :disabled="!form.title.trim() || !form.content.trim()"
          >
            <Send :size="16" />
            <span>Publish Article</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgb(0 0 0 / 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-dialog {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  inline-size: 100%;
  max-inline-size: 760px;
  max-block-size: 90dvh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
  overflow: clip;
}

.modal-header {
  padding-block: 1.5rem;
  padding-inline: 1.75rem;
  border-block-end: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.modal-title {
  font-family: var(--font-serif);
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  text-wrap: balance;
}

.modal-subtitle {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-block-start: 0.25rem;
  text-wrap: pretty;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tab-toggle {
  display: flex;
  background-color: var(--bg-secondary);
  padding: 0.25rem;
  border-radius: var(--radius-full);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding-block: 0.35rem;
  padding-inline: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);

  &.active {
    background-color: var(--bg-surface);
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }
}

.btn-icon-close {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.375rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast), background-color var(--transition-fast);

  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-secondary);
  }
}

.modal-body {
  padding: 1.75rem;
  overflow-y: auto;
  scrollbar-gutter: stable;
  overscroll-behavior: contain;
  flex: 1;
}

.form-group {
  margin-block-end: 1.25rem;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-block-end: 0.375rem;
}

.title-input {
  font-size: 1.05rem;
  font-weight: 500;
}

.cover-presets {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-block-start: 0.5rem;
  flex-wrap: wrap;
}

.preset-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.preset-chip {
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  padding-block: 0.2rem;
  padding-inline: 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    color: var(--text-primary);
    border-color: var(--border-medium);
    background: var(--bg-tertiary);
  }
}

.content-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 0.375rem;
}

.content-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.content-textarea {
  min-block-size: 180px;
  font-family: var(--font-sans);
  line-height: 1.6;
}

/* Preview tab styling */
.preview-mode {
  padding: 2rem;
}

.preview-banner {
  inline-size: 100%;
  max-block-size: 220px;
  border-radius: var(--radius-md);
  overflow: clip;
  margin-block-end: 1.5rem;
}

.preview-img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

.preview-title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  margin-block: 0.75rem 0.5rem;
  color: var(--text-primary);
  text-wrap: balance;
}

.preview-author-bar {
  font-size: 0.875rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-block-end: 1.5rem;
}

.preview-content-text {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--text-secondary);
  white-space: pre-wrap;
  text-wrap: pretty;
  overflow-wrap: break-word;
}

.preview-placeholder {
  color: var(--text-muted);
  font-style: italic;
}

.modal-footer {
  padding-block: 1.25rem;
  padding-inline: 1.75rem;
  border-block-start: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  background-color: var(--bg-surface);
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (width <= 640px) {
  .form-grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
