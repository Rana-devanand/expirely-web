import CompareTable from './CompareTable';
import Reveal from './Reveal';
import { PREMIUM_ENABLED } from '@/lib/flags';

// "How we compare" block for the home page.
export default function CompareSection() {
  return (
    <section id="compare" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">How we compare</span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">How we compare</h2>
          <p className="mt-4 text-base font-medium text-white/70">
            Most expiry trackers make you type each product in. Expirely reads the pack for you.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <CompareTable
            ctaHref={PREMIUM_ENABLED ? '/pay' : '/onboarding'}
            ctaLabel={PREMIUM_ENABLED ? 'Start free trial' : 'Get started free'}
          />
        </Reveal>

        <p className="mt-4 text-center text-xs font-medium text-white/45">
          Competitor details come from their public App Store listings, checked in October 2026. Features and prices change, and
          all names belong to their owners.
        </p>
      </div>
    </section>
  );
}
