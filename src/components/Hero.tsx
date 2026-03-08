import HeroContent from './HeroContent';
import HeroMockup from './HeroMockup';

interface HeroProps {
  data: {
    hero: {
      badge: string;
      title: string;
      highlight: string;
      description: string;
      buttons: {
        primary: { text: string; link: string };
        secondary: { text: string; link: string };
      };
      image: string;
    };
  };
}

export default function Hero({ data }: HeroProps) {
  const { hero } = data;

  return (
    <section className="relative pt-20 pb-20 overflow-hidden bg-[#020617]">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#10b981]/10 rounded-bl-[200px] -z-10 blur-3xl opacity-50" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left Column: Content (Client-side animations) */}
          <HeroContent
            badge={hero.badge}
            title={hero.title}
            highlight={hero.highlight}
            description={hero.description}
            primaryButton={hero.buttons.primary}
            secondaryButton={hero.buttons.secondary}
          />

          {/* Right Column: Visual Mockup (Client-side animations) */}
          <HeroMockup />

        </div>
      </div>
    </section>
  );
}
