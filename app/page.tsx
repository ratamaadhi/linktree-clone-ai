import HeroSection from '@/components/landing/hero-section';
import Features from '@/components/landing/features-1';
import { CallToAction } from '@/components/landing/call-to-action';

export default function Home() {
  return (
    <>
      <HeroSection />
      <Features />
      <CallToAction />
    </>
  );
}
