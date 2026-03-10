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
    <section id="how-it-works" className="py-24 bg-[#020617]">
      <HowItWorksClient 
        badge={howItWorks.badge}
        title={howItWorks.title}
        steps={howItWorks.steps}
      />
    </section>
  );
}
