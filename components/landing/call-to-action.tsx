import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <section className="px-4 py-20 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to Share Your Story?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join thousands of creators using BioLink Pro to connect with their
          audience.
        </p>
        <div className="mt-10">
          <Button size="lg" asChild>
            <Link href="/sign-up">Create Your Free Bio Page</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
