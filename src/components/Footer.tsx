import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Mail } from 'lucide-react';
import { PREMIUM_ENABLED } from '@/lib/flags';

interface FooterProps {
  data: {
    footer: {
      cta: { title: string; description: string; button: { text: string; link: string } };
      brand: { name: string; description: string };
      links: { title: string; items: { name: string; href: string }[] }[];
      contact: { title: string; email: string; adminLogin: string };
      copyright: string;
    };
  };
  // Pages that already end with their own call to action can hide this one.
  hideCta?: boolean;
}

// Full-width footer: the bands run edge to edge, content is centered inside.
export default function Footer({ data, hideCta = false }: FooterProps) {
  const { footer } = data;

  return (
    <footer className="mt-16 w-full border-t border-white/10 bg-black">
      {!hideCta && (
        <div className="relative w-full overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#1E50A2] via-[#17408A] to-[#0E2147] px-4 py-16 text-center sm:px-6">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#F09199]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-[#895B8A]/35 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{footer.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-base font-medium text-white/80">{footer.cta.description}</p>
            <Link
              href={footer.cta.button.link}
              className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-extrabold text-[#0E2147] transition hover:-translate-y-0.5 active:scale-95"
            >
              {footer.cta.button.text}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative h-9 w-9 overflow-hidden rounded-xl">
                <Image src="/logo1.png" alt="Expirely" fill className="object-cover" />
              </span>
              <span className="text-lg font-extrabold text-white">{footer.brand.name}</span>
            </Link>
            <p className="max-w-xs text-sm font-medium leading-relaxed text-white/60">{footer.brand.description}</p>
            <a
              href={`mailto:${footer.contact.email}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 text-[#7FB0FF]" />
              {footer.contact.email}
            </a>
          </div>

          {footer.links.map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.items
                  .filter((link) => PREMIUM_ENABLED || link.href !== '/pricing')
                  .map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-semibold text-white/60 transition-colors hover:text-white"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-white/45">© {footer.copyright}</p>
          <p className="text-xs font-semibold text-white/45">Made to help you waste less.</p>
        </div>
      </div>
    </footer>
  );
}
