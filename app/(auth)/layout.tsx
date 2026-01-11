'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { AuthHeader } from '@/components/landing/auth-header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  React.useEffect(() => {
    if (session) {
      router.replace('/dashboard');
    }
  }, [session, router]);

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-background to-muted">
      <AuthHeader />

      <div className="flex min-h-screen flex-col items-center px-4 pt-24">
        <div className="flex w-full flex-1 flex-col">
          <main className="flex flex-1 items-center">{children}</main>

          <footer className="mt-8 py-4 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} BioLink Pro. All rights
              reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
