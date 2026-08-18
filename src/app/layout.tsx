import type { Metadata } from 'next';
import './globals.css';
import { RoleProvider } from '@/hooks/useRole';
import DashboardLayout from '@/components/layout/DashboardLayout';

export const metadata: Metadata = {
  title: 'CloudMetrics — Business Analytics Platform',
  description: 'Professional SaaS analytics dashboard for tracking revenue, users, traffic, and conversions in real time.',
  keywords: ['analytics', 'dashboard', 'SaaS', 'business intelligence', 'metrics'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <RoleProvider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </RoleProvider>
      </body>
    </html>
  );
}

