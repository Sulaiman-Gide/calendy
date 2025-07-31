import { Theme } from '../types';

export const lightTheme: Theme = {
  primary: '#0ea5e9', // Blue
  secondary: '#14b8a6', // Teal
  background: '#f8fafc',
  surface: '#ffffffcc', // Glassmorphism (light)
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
};

export const darkTheme: Theme = {
  primary: '#14b8a6', // Teal (accent)
  secondary: '#0ea5e9', // Blue (secondary accent)
  background: '#101624', // Deep dark
  surface: 'rgba(30,41,59,0.85)', // Glassmorphism (dark)
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
  success: '#22d3ee',
  error: '#f87171',
  warning: '#fbbf24',
};

export const colors = {
  eventColors: [
    '#14b8a6', // Teal
    '#0ea5e9', // Blue
    '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#84cc16', // Lime
    '#f97316', // Orange
  ],
};
