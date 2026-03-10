import BenefitsClient from './BenefitsClient';

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

interface BenefitsProps {
  data: {
    benefits: {
      badge: string;
      title: string;
      items: BenefitItem[];
    };
  };
}

export default function Benefits({ data }: BenefitsProps) {
  const { benefits } = data;

  return (
    <section id="benefits" className="py-24 bg-slate-50/30">
      <BenefitsClient 
        badge={benefits.badge}
        title={benefits.title}
        items={benefits.items}
      />
    </section>
  );
}
