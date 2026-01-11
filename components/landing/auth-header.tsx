'use client';
import Link from 'next/link';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';

interface AuthHeaderProps {
  signInLink?: string;
  signUpLink?: string;
}

export function AuthHeader({
  signInLink = '/sign-in',
  signUpLink = '/sign-up',
}: AuthHeaderProps) {
  return (
    <header>
      <nav className="fixed z-20 w-full px-2">
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border bg-background/50 px-6 py-3 shadow-sm backdrop-blur-lg transition-all duration-300 lg:px-12">
          <div className="flex items-center justify-between">
            <Link href="/" aria-label="home" className="flex items-center">
              <Logo />
            </Link>

            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href={signInLink}>Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={signUpLink}>Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
