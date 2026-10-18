import Reveal from './Reveal';

interface HowItWorksProps {
  data: {
    howItWorks: {
      badge: string;
      title: string;
      description: string;
      steps: { number: string; title: string; description: string }[];
    };
  };
}

export default function HowItWorks({ data }: HowItWorksProps) {
  const { howItWorks } = data;

  return (
    <section id="how-it-works" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{howItWorks.badge}</span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {howItWorks.title}
          </h2>
          <p className="mt-4 text-base font-medium text-white/70">{howItWorks.description}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {howItWorks.steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.08}>
              <div className="glass-card relative h-full overflow-hidden rounded-3xl p-7">
                <span className="text-6xl font-black leading-none text-[#7FB0FF]/15">{step.number}</span>
                <h3 className="mt-3 text-lg font-extrabold text-white">{step.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
