import Link from 'next/link';
import Image from 'next/image';
import { Mail, ChevronRight } from 'lucide-react';

interface FooterProps {
  data: {
    footer: {
      cta: {
        title: string;
        description: string;
        button: { text: string; link: string };
      };
      brand: {
        name: string;
        description: string;
      };
      links: {
        title: string;
        items: { name: string; href: string }[];
      }[];
      contact: {
        title: string;
        email: string;
        adminLogin: string;
      };
      copyright: string;
    };
  };
}

export default function Footer({ data }: FooterProps) {
  const { footer } = data;

  return (
    <footer className="bg-[#020617] border-t border-slate-800">
      {/* Pre-footer CTA */}
      <div className="py-24 bg-slate-900/40 border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-50 mb-7 tracking-tight">
            {footer.cta.title}
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            {footer.cta.description}
          </p>
          <Link href={footer.cta.button.link} className="bg-[#10b981] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#059669] transition-all flex items-center gap-2 mx-auto w-fit shadow-xl shadow-emerald-900/20 hover:-translate-y-1 active:scale-95 group">
            {footer.cta.button.text}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-500/10 w-9 h-9 rounded-xl group-hover:bg-emerald-500/20 transition-all overflow-hidden relative">
                <Image src="/logo.png" alt="Expirely" fill className="object-cover" />
              </div>
              <span className="text-xl font-bold text-slate-50">
                {footer.brand.name}
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {footer.brand.description}
            </p>
          </div>

          {/* Dynamic Links */}
          {footer.links.map((group, index) => (
            <div key={index} className="space-y-6">
              <h4 className="font-bold text-slate-50">{group.title}</h4>
              <ul className="space-y-4">
                {group.items.map((link, lIndex) => (
                  <li key={lIndex}>
                    <Link href={link.href} className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-50">{footer.contact.title}</h4>
            <ul className="space-y-4">
              <li>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{footer.contact.email}</span>
                </div>
              </li>
              <li>
                <button className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">
                  {footer.contact.adminLogin}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-center items-center gap-4 text-center">
          <p className="text-slate-500 text-xs">
            © {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
