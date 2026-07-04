import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../i18n';
import { LanguageSync } from './language-sync';
import { SupabaseBootstrap } from './supabase-bootstrap';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <LanguageSync />
        <SupabaseBootstrap />
        {children}
      </QueryClientProvider>
    </I18nextProvider>
  );
}
