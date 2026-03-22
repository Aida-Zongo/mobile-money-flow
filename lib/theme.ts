export type Theme = 'light' | 'dark' | 'system';

export const getTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('mf_theme') as Theme) || 'light';
};

export const setTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mf_theme', theme);
  applyTheme(theme);
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;

  let isDark = false;
  if (theme === 'dark') {
    isDark = true;
  } else if (theme === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  if (isDark) {
    root.style.setProperty('--bg', '#0F1117');
    root.style.setProperty('--bg-card', '#1A1D23');
    root.style.setProperty('--bg-sidebar', '#13161C');
    root.style.setProperty('--text-main', '#F0F2F8');
    root.style.setProperty('--text-muted', '#8A94A6');
    root.style.setProperty('--border', '#2A2D35');
    root.style.setProperty('--bg-hover', '#1E2128');
    root.style.setProperty('--bg-input', '#1E2128');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.style.setProperty('--bg', '#F5F7F5');
    root.style.setProperty('--bg-card', '#FFFFFF');
    root.style.setProperty('--bg-sidebar', '#FFFFFF');
    root.style.setProperty('--text-main', '#1A1D23');
    root.style.setProperty('--text-muted', '#8A94A6');
    root.style.setProperty('--border', '#E2EAE7');
    root.style.setProperty('--bg-hover', '#F5F7F5');
    root.style.setProperty('--bg-input', '#FAFBFC');
    root.removeAttribute('data-theme');
  }
};
