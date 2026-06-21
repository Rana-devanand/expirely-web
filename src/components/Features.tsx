import FeaturesClient from './FeaturesClient';

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesProps {
  data: {
    features: {
      badge: string;
      title: string;
      description: string;
      items: FeatureItem[];
    };
  };
}

export default function Features({ data }: FeaturesProps) {
  const { features } = data;

  return (
    <section id="features" className="relative py-24" style={{ background: 'linear-gradient(180deg, #080d1e 0%, #0d1225 100%)' }}>
      <FeaturesClient
        badge={features.badge}
        title={features.title}
        description={features.description}
        items={features.items}
      />
    </section>
  );
}
