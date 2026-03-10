import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin Dashboard | Overview",
  description: "Real-time analytics and management dashboard for Expirely administration.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
