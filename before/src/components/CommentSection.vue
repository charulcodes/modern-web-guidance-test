<script setup>
import { ref, computed } from 'vue';
import { useBlogStorage } from '../composables/useBlogStorage';
import { useToast } from '../composables/useToast';
import { Send, Trash2, MessageSquare, User, CornerDownRight } from 'lucide-vue-next';

const props = defineProps({
  postId: {
    type: String,
    required: true
  },
  comments: {
    type: Array,
    default: () => []
  }
});

const { addComment, deleteComment, canDeleteComment, savedAuthorName } = useBlogStorage();
const { showToast } = useToast();

const authorInput = ref(savedAuthorName.value === 'Guest' ? '' : savedAuthorName.value);
const commentInput = ref('');
const isSubmitting = ref(false);
const commentToDelete = ref(null);

// Get Initials for avatar
const getInitials = (name) => {
  if (!name || !name.trim()) return 'G';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Generates consistent pastel background from name
const getAvatarBg = (name) => {
  const colors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#db2777', '#0891b2', '#4f46e5'];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Friendly relative time calculation
const formatRelativeTime = (isoString) => {
  if (!isoString) return 'recently';
  const now = new Date();
  const past = new Date(isoString);
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 45) return 'Just now';
  if (diffSec < 3600) {
    const mins = Math.floor(diffSec / 60);
    return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffSec < 604800) {
    const days = Math.floor(diffSec / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Submit Comment
const handleCommentSubmit = () => {
  if (!commentInput.value.trim()) {
    showToast('Please type a comment before posting.', 'error');
    return;
  }

  isSubmitting.value = true;
  try {
    const name = authorInput.value.trim() || 'Guest';
    addComment(props.postId, {
      authorName: name,
      content: commentInput.value.trim()
    });
    commentInput.value = '';
    showToast('Comment published successfully!', 'success');
  } catch (err) {
    showToast(err.message || 'Failed to post comment', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// Delete Comment
const handleDelete = (commentId) => {
  const success = deleteComment(props.postId, commentId);
  if (success) {
    showToast('Comment deleted', 'info');
  } else {
    showToast('Failed to delete comment', 'error');
  }
  commentToDelete.value = null;
};
</script>

<template>
  <section class="comments-section" id="comments">
    <div class="comments-header">
      <div class="comments-title-wrap">
        <MessageSquare :size="20" class="comments-icon" />
        <h3 class="comments-title">
          Discussion
          <span class="comments-count">({{ comments.length }})</span>
        </h3>
      </div>
      <p class="comments-subtitle">
        Join the conversation. No account or login required—your comments persist locally in this browser.
      </p>
    </div>

    <!-- Comment Form -->
    <form @submit.prevent="handleCommentSubmit" class="comment-form">
      <div class="form-row-author">
        <div class="author-input-wrapper">
          <User :size="16" class="input-icon" />
          <input
            v-model="authorInput"
            type="text"
            placeholder="Display Name (default: Guest)"
            class="input author-input"
            maxlength="40"
          />
        </div>
        <span class="author-hint">Saved for your future comments</span>
      </div>

      <div class="textarea-wrapper">
        <textarea
          v-model="commentInput"
          placeholder="Share your thoughts, insights, or constructive feedback..."
          class="textarea comment-textarea"
          rows="3"
          maxlength="1000"
          required
        ></textarea>
      </div>

      <div class="form-actions">
        <span class="char-count" :class="{ 'char-warning': commentInput.length > 900 }">
          {{ commentInput.length }}/1000
        </span>
        <button
          type="submit"
          class="btn btn-primary submit-comment-btn"
          :disabled="!commentInput.trim() || isSubmitting"
        >
          <Send :size="15" />
          <span>Post Comment</span>
        </button>
      </div>
    </form>

    <!-- Comments List -->
    <div class="comments-list">
      <div v-if="comments.length === 0" class="no-comments">
        <MessageSquare :size="32" class="empty-icon" />
        <p class="empty-text">No comments yet. Be the first to share your perspective!</p>
      </div>

      <transition-group name="comment-fade" tag="div" class="comments-stack">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment-card"
          :class="{ 'user-authored': canDeleteComment(comment.id) }"
        >
          <!-- Avatar -->
          <div
            class="comment-avatar"
            :style="{ backgroundColor: getAvatarBg(comment.authorName) }"
          >
            {{ getInitials(comment.authorName) }}
          </div>

          <!-- Comment Body -->
          <div class="comment-content-wrap">
            <div class="comment-meta">
              <div class="comment-author-badge">
                <span class="comment-author">{{ comment.authorName }}</span>
                <span v-if="canDeleteComment(comment.id)" class="you-badge">You</span>
              </div>
              <div class="comment-time-actions">
                <span class="comment-time">{{ formatRelativeTime(comment.createdAt) }}</span>
                
                <!-- Delete Button (Only for comments created in this browser session) -->
                <button
                  v-if="canDeleteComment(comment.id)"
                  type="button"
                  class="btn-delete-comment"
                  @click="handleDelete(comment.id)"
                  title="Delete your comment"
                  aria-label="Delete your comment"
                >
                  <Trash2 :size="14" />
                </button>
              </div>
            </div>

            <p class="comment-text">{{ comment.content }}</p>
          </div>
        </div>
      </transition-group>
    </div>
  </section>
</template>

<style scoped>
.comments-section {
  margin-top: 3.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid var(--border-light);
}

.comments-header {
  margin-bottom: 1.75rem;
}

.comments-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.375rem;
}

.comments-icon {
  color: var(--accent);
}

.comments-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.comments-count {
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-muted);
}

.comments-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Comment Form */
.comment-form {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  margin-bottom: 2.5rem;
  box-shadow: var(--shadow-sm);
}

.form-row-author {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.author-input-wrapper {
  position: relative;
  max-width: 280px;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.author-input {
  padding-left: 2.5rem;
  font-size: 0.875rem;
}

.author-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.textarea-wrapper {
  margin-bottom: 0.75rem;
}

.comment-textarea {
  min-height: 90px;
  font-size: 0.9375rem;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.char-count {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.char-warning {
  color: #ef4444;
}

.submit-comment-btn {
  font-size: 0.875rem;
  padding: 0.5rem 1.125rem;
}

/* Comments List */
.no-comments {
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  color: var(--text-muted);
}

.empty-icon {
  margin-bottom: 0.75rem;
  opacity: 0.6;
}

.empty-text {
  font-size: 0.9375rem;
}

.comments-stack {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.comment-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.comment-card.user-authored {
  border-left: 3px solid var(--accent);
}

.comment-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  user-select: none;
}

.comment-content-wrap {
  flex: 1;
  min-width: 0;
}

.comment-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}

.comment-author-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-author {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.you-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-full);
  background-color: var(--accent-subtle);
  color: var(--accent);
  text-transform: uppercase;
}

.comment-time-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.comment-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.btn-delete-comment {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.btn-delete-comment:hover {
  color: #ef4444;
  background-color: var(--like-subtle);
}

.comment-text {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Animations */
.comment-fade-enter-active,
.comment-fade-leave-active {
  transition: all 0.3s ease;
}

.comment-fade-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.comment-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
