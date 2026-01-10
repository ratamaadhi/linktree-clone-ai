'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';

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
      <div className="flex min-h-screen flex-col items-center px-4">
        <div className="flex w-full flex-1 flex-col">
          <header className="mb-8 flex items-center justify-between px-8 py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">
                  B
                </span>
              </div>
              <span className="text-xl font-bold">BioLink Pro</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </header>

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
