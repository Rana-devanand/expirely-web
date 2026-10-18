import Image from 'next/image';
import Link from 'next/link';
import { Check, Minus, X } from 'lucide-react';

// "How we compare": Expirely stands out as a raised card on the left, the other apps sit in a
// quiet panel on the right. Cells only say what the apps' public App Store listings say:
// a dash means the listing does not say.
type State = 'yes' | 'no' | 'partial' | 'unknown';

type Row = { feature: string; expirely: State; others: [State, State, State] };

const COMPETITORS = ['NoWaste', 'Pantry Days', 'Fridgely'];

const ROWS: Row[] = [
  { feature: 'Free to start', expirely: 'yes', others: ['yes', 'yes', 'yes'] },
  { feature: 'Barcode scanning in the free plan', expirely: 'yes', others: ['no', 'partial', 'unknown'] },
  { feature: 'No item cap on the free plan', expirely: 'yes', others: ['partial', 'no', 'unknown'] },
  { feature: 'AI photo scan fills the whole form', expirely: 'yes', others: ['unknown', 'unknown', 'unknown'] },
  { feature: 'Expiry estimated from the manufacturing date', expirely: 'yes', others: ['unknown', 'unknown', 'partial'] },
  { feature: 'Ingredients and allergens from the label', expirely: 'yes', others: ['unknown', 'unknown', 'unknown'] },
  { feature: 'PDF inventory reports', expirely: 'yes', others: ['unknown', 'unknown', 'partial'] },
];

function Mark({ state }: { state: State }) {
  if (state === 'yes')
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-400">
        <Check className="h-4 w-4" strokeWidth={3} aria-label="Yes" />
      </span>
    );
  if (state === 'no')
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-400/15 text-rose-400">
        <X className="h-4 w-4" strokeWidth={3} aria-label="No" />
      </span>
    );
  if (state === 'partial')
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-400/15 text-amber-300">
        <Minus className="h-4 w-4" strokeWidth={3} aria-label="Partly" />
      </span>
    );
  return <span className="text-sm font-bold text-white/25" aria-label="Not listed">?</span>;
}

export default function CompareTable({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const last = ROWS.length - 1;

  return (
    <div className="overflow-x-auto pb-2">
      <div className="mx-auto min-w-[760px] max-w-5xl">
        <div className="grid grid-cols-[1.5fr_repeat(3,1fr)] items-stretch">
          {/* Header row */}
          <div className="rounded-t-2xl border border-b-0 border-emerald-400/30 bg-gradient-to-b from-emerald-400/20 to-emerald-400/10 px-6 pb-4 pt-6">
            <div className="flex items-center gap-3">
              <span className="relative h-9 w-9 overflow-hidden rounded-lg">
                <Image src="/logo1.png" alt="Expirely" fill className="object-cover" />
              </span>
              <span className="text-lg font-black text-white">Expirely</span>
            </div>
          </div>
          {COMPETITORS.map((name) => (
            <div key={name} className="flex items-end justify-center bg-white/[0.03] px-3 pb-4 pt-6 text-center">
              <span className="text-sm font-extrabold text-white/70">{name}</span>
            </div>
          ))}

          {/* Feature rows */}
          {ROWS.map((row, i) => (
            <div key={row.feature} className="contents">
              <div
                className={`flex items-center gap-3 border-x border-emerald-400/30 bg-gradient-to-b from-emerald-400/10 to-emerald-400/10 px-6 py-4 ${
                  i === last ? '' : 'border-b border-b-white/[0.06]'
                }`}
              >
                <Mark state={row.expirely} />
                <span className="text-sm font-bold text-white">{row.feature}</span>
              </div>
              {row.others.map((state, j) => (
                <div
                  key={`${row.feature}-${j}`}
                  className={`flex items-center justify-center bg-white/[0.03] px-3 py-4 ${
                    i === last ? '' : 'border-b border-white/[0.06]'
                  }`}
                >
                  <Mark state={state} />
                </div>
              ))}
            </div>
          ))}

          {/* Footer row: plan and button */}
          <div className="rounded-b-2xl border border-t-0 border-emerald-400/30 bg-gradient-to-b from-emerald-400/10 to-emerald-400/20 px-6 pb-6 pt-5">
            <p className="text-sm font-bold text-white/70">
              <span className="text-2xl font-black text-white">Free</span> to start
            </p>
            <p className="mt-0.5 text-xs font-semibold text-white/55">Premium from $2.99 a month</p>
            <Link href={ctaHref} className="btn-primary mt-4 w-full !rounded-lg !py-3 !text-sm !shadow-none hover:!shadow-none">
              {ctaLabel}
            </Link>
          </div>
          {COMPETITORS.map((name) => (
            <div key={`foot-${name}`} className="flex items-start justify-center bg-white/[0.03] px-3 pt-6 text-center text-[11px] font-semibold text-white/45">
              Free, with paid upgrades
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-white/50">
        <span className="flex items-center gap-2"><Mark state="yes" /> Yes</span>
        <span className="flex items-center gap-2"><Mark state="partial" /> Partly or limited</span>
        <span className="flex items-center gap-2"><Mark state="no" /> No</span>
        <span className="flex items-center gap-2"><Mark state="unknown" /> Not stated in the public listing</span>
      </div>
    </div>
  );
}
