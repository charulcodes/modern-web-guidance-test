import { ref, onMounted } from 'vue';

const THEME_STORAGE_KEY = 'chronicle_theme_mode';
const isDark = ref(false);

export function useTheme() {
  const applyTheme = (dark) => {
    isDark.value = dark;
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
    } catch (e) {
      console.error('Failed to store theme preference:', e);
    }
  };

  const initTheme = () => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        applyTheme(stored === 'dark');
      } else {
        // Fall back to system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark);
      }
    } catch (e) {
      applyTheme(false);
    }
  };

  const toggleTheme = () => {
    applyTheme(!isDark.value);
  };

  return {
    isDark,
    initTheme,
    toggleTheme
  };
}
