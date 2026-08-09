import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Lenis from 'lenis';
import { queryClient } from '@lib/queryClient';
import { ThemeProvider, useTheme } from '@context/ThemeContext';
import { AuthProvider } from '@context/AuthContext';
import AppRouter from '@router/index';
import CustomCursor from '@components/common/CustomCursor';
import ErrorBoundary from '@components/common/ErrorBoundary';

/**
 * Initializes Lenis smooth scroll globally. Runs once at the App level
 * so every route benefits from the same buttery scroll physics without
 * re-instantiating per page. Respects prefers-reduced-motion.
 */
function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}

/** Toast styling follows the active theme's CSS variables automatically. */
function ThemedToaster() {
  const { mode } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgb(var(--color-surface-elevated))',
          color: 'rgb(var(--color-text-primary))',
          border: '1px solid rgb(var(--color-border))',
          fontSize: '0.875rem',
          borderRadius: '0.75rem',
        },
        success: { iconTheme: { primary: 'rgb(var(--color-success))', secondary: mode === 'dark' ? '#000' : '#fff' } },
        error: { iconTheme: { primary: 'rgb(var(--color-danger))', secondary: mode === 'dark' ? '#000' : '#fff' } },
      }}
    />
  );
}

function AppShell() {
  useSmoothScroll();
  return (
    <>
      <CustomCursor />
      <ThemedToaster />
      <AppRouter />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <AppShell />
            </AuthProvider>
          </ThemeProvider>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
