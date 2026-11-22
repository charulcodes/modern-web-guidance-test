<script setup>
import { ref } from 'vue';
import { useBlogStorage } from '../composables/useBlogStorage';
import { useToast } from '../composables/useToast';
import { RotateCcw, Heart, BookOpen } from 'lucide-vue-next';

const { resetDemoData } = useBlogStorage();
const { showToast } = useToast();

const isConfirming = ref(false);

const handleReset = () => {
  if (!isConfirming.value) {
    isConfirming.value = true;
    setTimeout(() => {
      isConfirming.value = false;
    }, 4000);
    return;
  }

  resetDemoData();
  isConfirming.value = false;
  showToast('Demo data restored to initial state!', 'success');
};
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logo">
            <BookOpen :size="18" />
            <span>CHRONICLE</span>
          </div>
          <p class="footer-tagline">
            An independent, local-first editorial journal celebrating thoughtful ideas in technology, design, and human focus.
          </p>
        </div>

        <div class="footer-controls">
          <button
            type="button"
            class="btn btn-outline reset-btn"
            :class="{ 'confirming': isConfirming }"
            @click="handleReset"
            :title="isConfirming ? 'Click again to confirm reset' : 'Restore original sample posts & clear local data'"
          >
            <RotateCcw :size="14" :class="{ 'spin-icon': isConfirming }" />
            <span>{{ isConfirming ? 'Click again to Confirm Reset' : 'Reset Demo Data' }}</span>
          </button>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-meta">
          Built with Vue 3 Composition API & Vite. Data persists entirely via client-side <code>localStorage</code>.
        </p>
        <p class="footer-copy">
          &copy; {{ new Date().getFullYear() }} Chronicle. Crafting modern web experiences.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-block-start: auto;
  border-block-start: 1px solid var(--border-light);
  background-color: var(--bg-surface);
  padding-block: 3rem 2rem;
  transition: background-color var(--transition-normal), border-color var(--transition-normal);
}

.footer-inner {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-brand {
  max-inline-size: 440px;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  margin-block-end: 0.625rem;
  text-wrap: balance;
}

.footer-tagline {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.55;
  text-wrap: pretty;
}

.footer-controls {
  display: flex;
  align-items: center;
}

.reset-btn {
  font-size: 0.8125rem;
  padding-block: 0.5rem;
  padding-inline: 0.875rem;
  color: var(--text-muted);
  border-color: var(--border-medium);
  transition: all var(--transition-fast);

  &:hover {
    color: var(--text-primary);
    border-color: var(--text-primary);
  }

  &.confirming {
    border-color: #ef4444;
    color: #ef4444;
    background-color: var(--like-subtle);
  }
}

.spin-icon {
  rotate: 0deg;
  @media (prefers-reduced-motion: no-preference) {
    animation: spin 1s infinite linear;
  }
}

@keyframes spin {
  from { rotate: 0deg; }
  to { rotate: -360deg; }
}

.footer-bottom {
  padding-block-start: 1.5rem;
  border-block-start: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  color: var(--text-muted);
  flex-wrap: wrap;
  gap: 0.75rem;
}

.footer-bottom code {
  font-family: var(--font-mono);
  background-color: var(--bg-secondary);
  padding-block: 0.15rem;
  padding-inline: 0.35rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

@media (width <= 640px) {
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
