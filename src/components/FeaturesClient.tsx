'use client';

import { motion } from 'framer-motion';
import { Clock, Bell, Scan, History, Shield, Package } from 'lucide-react';

const iconMap: Record<string, any> = {
  Clock,
  Bell,
  Scan,
  History,
  Shield,
  Package,
};

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesClientProps {
  badge: string;
  title: string;
  description: string;
  items: FeatureItem[];
}

export default function FeaturesClient({ badge, title, description, items }: FeaturesClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-emerald-400 font-bold tracking-widest text-[10px] uppercase mb-3"
        >
          {badge}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl md:text-4xl font-extrabold text-slate-50 mb-4"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 max-w-xl mx-auto text-base"
        >
          {description}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const IconComponent = iconMap[item.icon] || Package;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -3 }}
              className="bg-slate-900/50 p-6 rounded-[20px] shadow-sm border border-slate-800 hover:border-emerald-500/30 hover:shadow-emerald-500/5 transition-all group"
            >
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-500 transition-colors duration-300">
                <IconComponent className="w-5 h-5 text-emerald-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-50 mb-2.5">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed text-[13px]">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
