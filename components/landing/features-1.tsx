import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Layers, Palette, BarChart3, Link2, Eye, Globe } from 'lucide-react';
import { ReactNode } from 'react';

const features = [
  {
    icon: Layers,
    title: 'Multiple Bio Pages',
    description:
      'Create unlimited bio pages for different purposes and audiences.',
  },
  {
    icon: Palette,
    title: 'Advanced Themes',
    description:
      'Customize every detail with powerful theme options and styles.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track clicks and engagement with detailed analytics.',
  },
  {
    icon: Link2,
    title: 'Link Management',
    description:
      'Organize and update your links effortlessly with drag-and-drop.',
  },
  {
    icon: Eye,
    title: 'Live Preview',
    description: 'See changes instantly with our live preview mode.',
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Use your own domain for complete brand consistency.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-32 dark:bg-transparent">
      <div className="@container mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-balance lg:text-5xl">
            Everything You Need to Share Your Story
          </h2>
          <p className="mt-4 text-muted-foreground">
            Powerful features to help you connect with your audience.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-sm gap-6 *:text-center sm:grid-cols-2 md:mt-16 lg:max-w-none @min-4xl:max-w-full @min-4xl:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="group shadow-zinc-950/5">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <feature.icon className="size-6" aria-hidden />
                </CardDecorator>

                <h3 className="mt-6 font-medium">{feature.title}</h3>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 mask-radial-from-40% mask-radial-to-60% duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-50"
    />

    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l bg-background">
      {children}
    </div>
  </div>
);
