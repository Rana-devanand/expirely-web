import { Quote, Star } from 'lucide-react';
import Reveal from './Reveal';

// Shows ONLY real feedback. Add genuine quotes (with the person's permission)
// to data/landing/testimonials.json, for example:
//   { "name": "Their name", "role": "City or role (optional)", "rating": 5, "quote": "Their words." }
// While the list is empty this section renders nothing.
export type Testimonial = {
  name: string;
  role?: string;
  rating?: number;
  quote: string;
};

interface TestimonialsProps {
  data: {
    testimonials: {
      badge: string;
      title: string;
      items: Testimonial[];
    };
  };
}

export default function Testimonials({ data }: TestimonialsProps) {
  const { testimonials } = data;
  if (!testimonials.items.length) return null;

  return (
    <section id="reviews" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{testimonials.badge}</span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {testimonials.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.items.map((item, i) => (
            <Reveal key={`${item.name}-${i}`} delay={(i % 3) * 0.07}>
              <figure className="glass-card flex h-full flex-col rounded-3xl p-7">
                <Quote className="h-7 w-7 text-[#7FB0FF]/60" />
                {item.rating ? (
                  <div className="mt-4 flex gap-0.5" aria-label={`${item.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${s < (item.rating ?? 0) ? 'fill-[#F7B955] text-[#F7B955]' : 'text-white/20'}`}
                      />
                    ))}
                  </div>
                ) : null}
                <blockquote className="mt-4 flex-1 text-sm font-medium leading-relaxed text-white/80">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-white/10 pt-4">
                  <div className="text-sm font-extrabold text-white">{item.name}</div>
                  {item.role ? <div className="text-xs font-semibold text-white/50">{item.role}</div> : null}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
