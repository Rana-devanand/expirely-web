import Image from 'next/image';
import { Check } from 'lucide-react';
import Reveal from './Reveal';

const ITEMS = [
  {
    image: '/images/ai/receipt_scan_hand.svg',
    tag: 'Receipt scanner',
    title: 'Add a whole shopping trip in one go',
    description:
      'Hold your phone over a grocery receipt and Expirely picks out the items for you. They show up on screen as a list, so you can review and add them in one step instead of typing each one.',
    points: [
      'Read the items straight from the receipt photo',
      'Review and correct anything before it is saved',
      'Set expiry dates for the whole trip in one go',
    ],
  },
  {
    image: '/images/ai/recipe_gen.png',
    tag: 'Recipe generator',
    title: 'Cook with what you already have',
    description:
      'Get recipe ideas built around your inventory, starting with the items that expire first, so ingredients end up on the plate and not in the bin.',
    points: [
      'Ideas based on the items in your inventory',
      'Items closest to expiry come first',
      'Fewer extra trips to the shop',
    ],
  },
  {
    image: '/images/ai/meal_planner.png',
    tag: 'Meal planner',
    title: 'Plan the week around your fridge',
    description:
      'Line up meals for the days ahead using what is already in stock. You buy less, and what you buy gets used on time.',
    points: [
      'Plan meals for the days ahead',
      'Use up what is already at home first',
      'Add what is missing to your shopping list',
    ],
  },
  {
    image: '/images/ai/nutrition_insight.png',
    tag: 'Nutrition insights',
    title: 'Know more about what you eat',
    description:
      'See helpful nutrition details for the products you track, so choosing what to use first is also a healthier choice.',
    points: [
      'Nutrition details for the products you track',
      'Compare options before you cook',
      'Healthier choices without extra effort',
    ],
  },
  {
    image: '/images/ai/storage_guru.png',
    tag: 'Storage guru',
    title: 'Make food last longer',
    description:
      'Get practical tips on how and where to store each product, whether that is the fridge, the freezer or the pantry.',
    points: [
      'Tips for the fridge, freezer and pantry',
      'Keep produce fresh for longer',
      'Less spoilage, less money wasted',
    ],
  },
];

// Alternating rows: image on the left, then on the right, and so on.
export default function AiShowcase({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section id="more-features" className="px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        {showHeader && (
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Smart tools</span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              More than a reminder app
            </h2>
            <p className="mt-4 text-base font-medium text-white/70">
              Helpful tools that turn your inventory into meals, plans and savings.
            </p>
          </Reveal>
        )}

        <div className="mt-14 space-y-14 md:space-y-20">
          {ITEMS.map((item, i) => (
            <Reveal key={item.tag}>
              <div
                className={`grid items-center gap-8 md:grid-cols-[320px_1fr] md:gap-12 ${
                  i % 2 === 1 ? 'md:grid-cols-[1fr_320px] md:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-3xl border border-white/10 shadow-[0_24px_70px_-30px_rgba(42,98,190,0.6)]">
                  <Image
                    src={item.image}
                    alt={item.tag}
                    fill
                    unoptimized={item.image.endsWith('.svg')}
                    sizes="320px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#7FB0FF]">{item.tag}</span>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">{item.title}</h3>
                  <p className="mt-4 text-base font-medium leading-relaxed text-white/70">{item.description}</p>
                  <ul className="mt-5 space-y-2.5">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm font-semibold text-white/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7FB0FF]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
