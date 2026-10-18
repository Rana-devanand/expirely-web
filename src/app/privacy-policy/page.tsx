import LegalLayout from '@/components/LegalLayout';
import policy from '../../../data/privacy-policy.json';

type Section = { title: string; body?: string; bullets?: string[] };

// Same text as the mobile app (Mobile-app/src/constants/privacyPolicy.json): update both together.
export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <section className="space-y-8 text-white/70">
        <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-white/80">{policy.intro}</p>

        {(policy.sections as Section[]).map((section) => (
          <div key={section.title}>
            <h2 className="mb-4 text-2xl font-bold text-white">{section.title}</h2>
            {section.body && <p>{section.body}</p>}
            {section.bullets && (
              <ul className="mt-4 list-disc space-y-2 pl-6">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="pt-8 italic text-white/70">Last Updated: {policy.updated}</div>
      </section>
    </LegalLayout>
  );
}
