import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Secure access to the Expirely administration dashboard.",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
