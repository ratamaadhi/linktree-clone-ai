'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verifying, setVerifying] = React.useState(false);
  const [verified, setVerified] = React.useState(false);

  React.useEffect(() => {
    async function verifyEmail() {
      if (!token) return;

      setVerifying(true);
      try {
        await authClient.verifyEmail({
          query: {
            token,
          },
        });

        setVerified(true);
        toast.success('Email verified successfully!');
      } finally {
        setVerifying(false);
      }
    }

    verifyEmail();
  }, [token]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Invalid Verification Link</CardTitle>
            <CardDescription>
              The verification link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/sign-in">Back to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {verifying
              ? 'Verifying your email address...'
              : verified
                ? 'Your email has been verified!'
                : 'Email verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {verifying ? (
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          ) : verified ? (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  You can now sign in to your account
                </p>
                <Button asChild className="w-full">
                  <Link href="/sign-in">Go to Sign In</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                The verification link may have expired. Please request a new
                verification email.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-in">Back to Sign In</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
