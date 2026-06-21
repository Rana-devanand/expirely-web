import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Mail } from 'lucide-react';

interface FooterProps {
  data: {
    footer: {
      cta: { title: string; description: string; button: { text: string; link: string }; };
      brand: { name: string; description: string; };
      links: { title: string; items: { name: string; href: string }[]; }[];
      contact: { title: string; email: string; adminLogin: string; };
      copyright: string;
    };
  };
}

export default function Footer({ data }: FooterProps) {
  const { footer } = data;

  return (
    <footer className="border-t" style={{ borderColor: 'rgba(168,85,247,0.15)', background: 'var(--navy-950)' }}>
      {/* CTA strip */}
      <div className="relative overflow-hidden border-b py-16"
        style={{ borderColor: 'rgba(168,85,247,0.15)', background: 'rgba(168,85,247,0.06)' }}>
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[200px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
          style={{ background: 'rgba(168,85,247,0.15)' }} />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-2xl font-extrabold tracking-tight md:text-4xl"
            style={{ color: 'var(--color-text)' }}>
            {footer.cta.title}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed md:text-base"
            style={{ color: 'var(--color-text-muted)' }}>
            {footer.cta.description}
          </p>
          <Link
            href="/onboarding"
            className="group mx-auto flex w-fit items-center gap-2 rounded-full px-8 py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 active:scale-95"
            style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-brand-lg)' }}
          >
            Get Started Free
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Footer grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="group flex items-center gap-2">
              <div className="relative h-9 w-9 overflow-hidden rounded-xl border"
                style={{ borderColor: 'rgba(168,85,247,0.25)', background: 'rgba(168,85,247,0.1)' }}>
                <Image src="/logo1.png" alt="Expirely" fill className="object-cover" />
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                {footer.brand.name}
              </span>
            </Link>
            <p className="max-w-xs text-[13px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {footer.brand.description}
            </p>
          </div>

          {/* Link groups */}
          {footer.links.map((group, index) => (
            <div key={index} className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.items.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href}
                      className="text-sm transition-colors hover:opacity-90"
                      style={{ color: 'var(--color-text-muted)' }}
                      // onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--brand-400)'}
                      // onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)'}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
              {footer.contact.title}
            </h4>
            <ul className="space-y-3">
              <li>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <Mail className="h-4 w-4" style={{ color: 'var(--brand-400)' }} />
                  <span>{footer.contact.email}</span>
                </div>
              </li>
              <li>
                <Link href="/admin/login"
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  // onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--brand-400)'}
                  // onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)'}
                >
                  {footer.contact.adminLogin}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-4 border-t pt-8 text-center md:flex-row"
          style={{ borderColor: 'rgba(168,85,247,0.12)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>© {footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
