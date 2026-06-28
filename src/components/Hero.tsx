import HeroContent from './HeroContent';

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
    <section className="relative overflow-hidden pt-32 pb-24" style={{ background: 'var(--gradient-hero)' }}>

      {/* ── Grid backdrop ── */}
      <div className="pointer-events-none absolute inset-0 z-0 grid-backdrop opacity-70" />

      {/* ── Purple glow blobs ── */}
      <div className="glow-blob top-0 right-0 h-[500px] w-[500px]" style={{ background: 'rgba(168,85,247,0.18)' }} />
      <div className="glow-blob -top-24 -left-24 h-[400px] w-[400px]" style={{ background: 'rgba(99,102,241,0.14)' }} />
      <div className="glow-blob bottom-0 left-1/2 h-[300px] w-[700px] -translate-x-1/2" style={{ background: 'rgba(139,92,246,0.10)' }} />

      {/* ── Animated SVG Waves (purple palette) ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Wave 1 — large, slow */}
        <svg
          className="absolute -bottom-2 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: '340px' }}
        >
          <path
            d="M0,192 C180,256 360,128 540,160 C720,192 900,288 1080,256 C1260,224 1350,128 1440,160 L1440,320 L0,320 Z"
            fill="rgba(168,85,247,0.07)"
            style={{ animation: 'waveMove1 10s ease-in-out infinite alternate' }}
          />
        </svg>

        {/* Wave 2 — medium speed, indigo */}
        <svg
          className="absolute -bottom-2 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: '260px' }}
        >
          <path
            d="M0,224 C240,160 480,288 720,224 C960,160 1200,256 1440,192 L1440,320 L0,320 Z"
            fill="rgba(99,102,241,0.08)"
            style={{ animation: 'waveMove2 13s ease-in-out infinite alternate' }}
          />
        </svg>

        {/* Wave 3 — small, fast, violet */}
        <svg
          className="absolute -bottom-2 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: '190px' }}
        >
          <path
            d="M0,256 C360,192 720,320 1080,256 C1260,224 1380,280 1440,240 L1440,320 L0,320 Z"
            fill="rgba(192,132,252,0.06)"
            style={{ animation: 'waveMove3 8s ease-in-out infinite alternate' }}
          />
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl justify-center">
          <HeroContent
            badge={hero.badge}
            title={hero.title}
            highlight={hero.highlight}
            description={hero.description}
            primaryButton={hero.buttons.primary}
            secondaryButton={hero.buttons.secondary}
          />
        </div>
      </div>

      <style>{`
        @keyframes waveMove1 {
          0%   { d: path("M0,192 C180,256 360,128 540,160 C720,192 900,288 1080,256 C1260,224 1350,128 1440,160 L1440,320 L0,320 Z"); }
          100% { d: path("M0,224 C200,160 400,256 600,192 C800,128 1000,240 1200,208 C1320,192 1400,160 1440,176 L1440,320 L0,320 Z"); }
        }
        @keyframes waveMove2 {
          0%   { d: path("M0,224 C240,160 480,288 720,224 C960,160 1200,256 1440,192 L1440,320 L0,320 Z"); }
          100% { d: path("M0,200 C300,264 600,160 900,232 C1100,280 1300,200 1440,220 L1440,320 L0,320 Z"); }
        }
        @keyframes waveMove3 {
          0%   { d: path("M0,256 C360,192 720,320 1080,256 C1260,224 1380,280 1440,240 L1440,320 L0,320 Z"); }
          100% { d: path("M0,280 C280,220 560,300 840,260 C1080,224 1280,268 1440,248 L1440,320 L0,320 Z"); }
        }
        @keyframes rotateArc {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
