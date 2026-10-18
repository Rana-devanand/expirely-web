import {
  BarChart3,
  Bell,
  ChefHat,
  Clock,
  Package,
  Scan,
  ShoppingCart,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Reveal from './Reveal';

const ICONS: Record<string, LucideIcon> = {
  Clock,
  Bell,
  Scan,
  ChefHat,
  Users,
  ShoppingCart,
  BarChart3,
  Package,
};

interface FeaturesProps {
  data: {
    features: {
      badge: string;
      title: string;
      description: string;
      items: { icon: string; title: string; description: string }[];
    };
  };
}

export default function Features({ data }: FeaturesProps) {
  const { features } = data;

  return (
    <section id="features" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{features.badge}</span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {features.title}
          </h2>
          <p className="mt-4 text-base font-medium text-white/70">{features.description}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.items.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Package;
            return (
              <Reveal key={item.title} delay={(i % 4) * 0.06}>
                <div className="glass-card glass-card-hover h-full rounded-3xl p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-[#7FB0FF] shadow-sm">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-base font-extrabold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-white/70">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
