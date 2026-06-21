import HowItWorksClient from './HowItWorksClient';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  data: {
    howItWorks: {
      badge: string;
      title: string;
      steps: Step[];
    };
  };
}

export default function HowItWorks({ data }: HowItWorksProps) {
  const { howItWorks } = data;

  return (
    <section id="how-it-works" className="relative py-24" style={{ background: 'linear-gradient(180deg, #0d1225 0%, #0a0f1e 100%)' }}>
      <HowItWorksClient
        badge={howItWorks.badge}
        title={howItWorks.title}
        steps={howItWorks.steps}
      />
    </section>
  );
}
