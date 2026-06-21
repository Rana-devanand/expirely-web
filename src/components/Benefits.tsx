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
    <section id="benefits" className="relative py-24" style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #080d1e 100%)' }}>
      <BenefitsClient 
        badge={benefits.badge}
        title={benefits.title}
        items={benefits.items}
      />
    </section>
  );
}
