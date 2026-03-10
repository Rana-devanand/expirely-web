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
    <section id="features" className="py-24 bg-[#020617]">
      <FeaturesClient 
        badge={features.badge}
        title={features.title}
        description={features.description}
        items={features.items}
      />
    </section>
  );
}
