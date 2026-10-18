import type { Metadata } from 'next';
import Link from 'next/link';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Cancellation and Refund Policy',
  description:
    'How to cancel your Expirely Premium subscription, what happens afterwards, and when you can get a refund.',
};

const SUPPORT_EMAIL = 'dev.cloudapp93@gmail.com';

const SECTIONS: { title: string; body?: string; bullets?: string[] }[] = [
  {
    title: '1. Overview',
    body: 'Expirely is free to use. Premium is an optional paid subscription, billed monthly or yearly in US dollars. This policy explains how to cancel, what happens when you do, and when we refund a payment. Payments are processed by Dodo Payments, our payment partner and merchant of record.',
  },
  {
    title: '2. Cancel any time',
    bullets: [
      'You can cancel at any time. There is no cancellation fee and no minimum term.',
      'Sign in on the Expirely website, open Subscription, and choose Cancel subscription. Confirm when asked.',
      'If you subscribed through the app, use Go Premium or Subscription in the app menu to open your account page on the website, then cancel there.',
      'Cancelling stops the next renewal. You are not charged again.',
    ],
  },
  {
    title: '3. What happens after you cancel',
    bullets: [
      'Premium stays active until the end of the period you already paid for. After that your account returns to the Free plan.',
      'Nothing is deleted. Your products, reminders and history stay in your account.',
      'You can change your mind before the period ends: choose Keep my subscription on the Subscription page and it will renew as usual.',
      'You can subscribe again at any time.',
    ],
  },
  {
    title: '4. Free trials',
    body: 'First-time subscribers get a 7-day free trial. The checkout page shows the trial length and the date of the first charge before you confirm. Cancel before the trial ends and you will not be charged anything. The free trial is offered once per account, so if you subscribed before, your plan starts and is charged straight away.',
  },
  {
    title: '5. Refunds',
    body: 'We want you to be happy with Premium. Our refund rules are:',
    bullets: [
      'Within 7 days of a payment (the first payment or a renewal) you can ask for a full refund, as long as you have not made heavy use of Premium features in that time. Write to us at the address below.',
      'Accidental double charges, charges after a cancellation that was completed in time, and billing errors are always refunded in full.',
      'After 7 days, payments for a period that has already started are not refunded. You can still cancel, and you keep access until the period ends.',
      'Approved refunds go back to the original payment method through Dodo Payments. Your bank may take 5 to 10 business days to show it.',
      'When a refund is approved we may end Premium on your account straight away.',
      'These rules do not limit any rights you have under the consumer laws where you live.',
    ],
  },
  {
    title: '6. Failed or missed payments',
    body: 'If a renewal payment fails, we or our payment partner may try again for a short time. If it still does not go through, your plan returns to Free. You can subscribe again whenever you want.',
  },
  {
    title: '7. Price changes',
    body: 'If we change the price, we tell you before it applies to your next renewal. You can cancel before that renewal if you do not agree.',
  },
  {
    title: '8. Taxes',
    body: 'The amount shown at checkout is the amount you pay. Taxes such as VAT or sales tax are collected by our payment partner where they apply and are shown before you confirm.',
  },
  {
    title: '9. Deleting your account',
    body: 'If you have an active subscription, cancel it first. The app will ask you to cancel before it lets you delete the account, so you are never charged after the account is gone.',
  },
  {
    title: '10. Contact us',
    body: `For cancellation help or a refund request, email ${SUPPORT_EMAIL} from the address on your account and include the date of the payment. We aim to reply within 2 business days.`,
  },
];

export default function CancellationPolicy() {
  return (
    <LegalLayout title="Cancellation and Refund Policy">
      <section className="space-y-8 text-white/70">
        <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-white/80">
          Try Premium free for 7 days, cancel in a few clicks, keep Premium until the end of the period you paid for, and ask for
          a refund within 7 days of a payment. Details below.
        </p>

        {SECTIONS.map((section) => (
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

        <p>
          See also our{' '}
          <Link href="/terms-conditions" className="font-bold text-[#7FB0FF] underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="font-bold text-[#7FB0FF] underline">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="pt-4 italic text-white/70">Last Updated: October 18, 2026</div>
      </section>
    </LegalLayout>
  );
}
