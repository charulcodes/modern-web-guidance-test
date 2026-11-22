<script setup>
import { defineEmits } from 'vue';
import { useTheme } from '../composables/useTheme';
import { BookOpen, Sun, Moon, PenSquare } from 'lucide-vue-next';

defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['openCreateModal', 'update:searchQuery']);

const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <header class="navbar">
    <div class="container navbar-inner">
      <!-- Brand Logo -->
      <router-link to="/" class="brand">
        <div class="brand-icon">
          <BookOpen :size="22" stroke-width="2.2" />
        </div>
        <div class="brand-text">
          <span class="brand-title">CHRONICLE</span>
          <span class="brand-sub">Editorial & Perspectives</span>
        </div>
      </router-link>

      <!-- Right Actions -->
      <div class="nav-actions">
        <!-- Write Post Button -->
        <button
          type="button"
          class="btn btn-primary write-btn"
          @click="emit('openCreateModal')"
        >
          <PenSquare :size="16" />
          <span>Write Post</span>
        </button>

        <!-- Theme Toggle -->
        <button
          type="button"
          class="btn btn-outline btn-icon theme-toggle"
          @click="toggleTheme"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <Sun v-if="isDark" :size="18" class="theme-icon sun" />
          <Moon v-else :size="18" class="theme-icon moon" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(251, 251, 251, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-light);
  transition: background-color var(--transition-normal), border-color var(--transition-normal);
}

[data-theme="dark"] .navbar {
  background-color: rgba(9, 9, 11, 0.88);
}

.navbar-inner {
  height: 4.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  user-select: none;
}

.brand-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  background-color: var(--text-primary);
  color: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast);
}

.brand:hover .brand-icon {
  transform: rotate(-4deg) scale(1.04);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.1;
  color: var(--text-primary);
}

.brand-sub {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.write-btn {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

.theme-toggle {
  width: 2.375rem;
  height: 2.375rem;
  color: var(--text-secondary);
}

.theme-toggle:hover {
  color: var(--text-primary);
}

.theme-icon {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.theme-toggle:hover .theme-icon {
  transform: rotate(20deg);
}

@media (max-width: 640px) {
  .brand-sub {
    display: none;
  }
  .write-btn span {
    display: none;
  }
  .write-btn {
    padding: 0.5rem;
  }
}
</style>
