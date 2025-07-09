// src/components/theme-provider.jsx
import { ThemeProvider } from 'next-themes';

export default function AppThemeProvider({ children }) {
  return (
    <ThemeProvider
      attribute="class" // Adds class="light" or "dark" to html
      defaultTheme="system"
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
}
