<script setup>
import { useToast } from '../composables/useToast';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next';

const { toasts, removeToast } = useToast();
</script>

<template>
  <div class="toast-container" aria-live="polite">
    <transition-group name="toast-anim">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="`toast-${toast.type || 'info'}`"
      >
        <div class="toast-icon">
          <CheckCircle2 v-if="toast.type === 'success'" :size="18" />
          <AlertCircle v-else-if="toast.type === 'error'" :size="18" />
          <Info v-else :size="18" />
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button
          type="button"
          class="toast-close"
          @click="removeToast(toast.id)"
          aria-label="Dismiss toast"
        >
          <X :size="14" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  inset-block-end: 1.5rem;
  inset-inline-end: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-inline-size: 400px;
  inline-size: min(400px, calc(100% - 3rem));
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-block: 0.875rem;
  padding-inline: 1rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  color: var(--text-primary);
  font-size: 0.875rem;
  backdrop-filter: blur(8px);
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-info .toast-icon {
  color: var(--accent);
}

.toast-message {
  flex: 1;
  line-height: 1.4;
  font-weight: 500;
  text-wrap: pretty;
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background-color var(--transition-fast);

  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-secondary);
  }
}

/* Transitions with Individual Transform Properties */
.toast-anim-enter-active,
.toast-anim-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              translate 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              scale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-anim-enter-from {
  opacity: 0;
  @media (prefers-reduced-motion: no-preference) {
    translate: 0 20px;
    scale: 0.95;
  }
}

.toast-anim-leave-to {
  opacity: 0;
  @media (prefers-reduced-motion: no-preference) {
    translate: 100% 0;
    scale: 0.9;
  }
}
</style>
