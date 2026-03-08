import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Get Started | Interactive Onboarding",
  description: "Learn how Expirely helps you manage your inventory and stay ahead of expiry dates.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
