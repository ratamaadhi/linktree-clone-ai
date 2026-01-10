import * as React from 'react';
import { redirect } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

export default function DashboardPage() {
  const { data: session } = authClient.useSession();

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            You are signed in as {session.user.name || session.user.email}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Your Bio Pages</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Create and manage your bio pages here
          </p>
          <button
            className="w-full rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={() => (window.location.href = '/bio-pages')}
          >
            Go to Bio Pages
          </button>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            <button
              className="w-full rounded-md bg-secondary px-4 py-3 font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
              onClick={() => (window.location.href = '/bio-pages/new')}
            >
              Create New Bio Page
            </button>
            <button
              className="w-full rounded-md border border-input bg-background px-4 py-3 font-medium text-foreground transition-colors hover:bg-accent"
              onClick={() => (window.location.href = '/analytics')}
            >
              View Analytics
            </button>
          </div>
        </div>

        <div className="rounded-lg border p-6 md:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Your recent bio page activity
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 shrink-0 rounded-full bg-primary/20" />
              <div className="flex-1">
                <p className="font-medium">No recent activity</p>
                <p className="text-sm text-muted-foreground">
                  Start creating bio pages to see your activity here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
