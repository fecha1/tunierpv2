'use client';

// @project
import { Feature20 } from '@/blocks/feature';
import { Hero17 } from '@/blocks/hero';
import LazySection from '@/components/LazySection';

// @data
import {
  metrics,
  clientele,
  cta4,
  cta5,
  faq,
  feature20,
  feature18,
  hero,
  howItWorks,
  trustBadges,
  integration,
  pricing,
  testimonial
} from './data';

/***************************  PAGE - MAIN  ***************************/

export default function Main() {

  return (
    <>
      {/* 1. Hero — first impression (above fold, eagerly loaded) */}
      <Hero17 {...hero} />

      {/* 2. Features bento grid — immediately show value */}
      <Feature20 {...feature20} />

      {/* 3. How it works — timeline simplicity */}
      <LazySection
        sections={[
          { importFunc: () => import('@/blocks/other/HowItWorks'), props: howItWorks }
        ]}
        offset="300px"
        placeholderHeight={500}
      />

      {/* 4. Metrics + Integration (sectors) */}
      <LazySection
        sections={[
          { importFunc: () => import('@/blocks/metrics').then((m) => ({ default: m.Metrics5 })), props: metrics },
          { importFunc: () => import('@/blocks/integration').then((m) => ({ default: m.Integration2 })), props: integration }
        ]}
        offset="300px"
      />

      {/* 5. Dashboard preview tabs + CTA */}
      <LazySection
        sections={[
          { importFunc: () => import('@/blocks/feature').then((m) => ({ default: m.Feature18 })), props: feature18 },
          { importFunc: () => import('@/blocks/cta').then((m) => ({ default: m.Cta4 })), props: cta4 }
        ]}
        offset="300px"
      />

      {/* 6. Trust & Security badges */}
      <LazySection
        sections={[
          { importFunc: () => import('@/blocks/other/TrustBadges'), props: trustBadges }
        ]}
        offset="300px"
        placeholderHeight={300}
      />

      {/* 7. Testimonials + Clientele + Pricing */}
      <LazySection
        sections={[
          { importFunc: () => import('@/blocks/testimonial').then((m) => ({ default: m.Testimonial10 })), props: testimonial },
          { importFunc: () => import('@/blocks/clientele').then((m) => ({ default: m.Clientele3 })), props: clientele },
          { importFunc: () => import('@/blocks/pricing').then((m) => ({ default: m.Pricing9 })), props: pricing }
        ]}
        offset="300px"
      />

      {/* 8. Final CTA + FAQ */}
      <LazySection
        sections={[
          { importFunc: () => import('@/blocks/cta').then((m) => ({ default: m.Cta5 })), props: cta5 },
          { importFunc: () => import('@/blocks/faq').then((m) => ({ default: m.Faq6 })), props: faq }
        ]}
        offset="300px"
      />
    </>
  );
}
