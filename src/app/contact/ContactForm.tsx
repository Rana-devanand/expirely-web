'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

// No server involved: this opens the visitor's email app with the message
// filled in, addressed to our support inbox.
export default function ContactForm({ email }: { email: string }) {
  const [name, setName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [message, setMessage] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Expirely support${name ? ` from ${name}` : ''}`;
    const body = `${message}\n\n${name ? `Name: ${name}\n` : ''}${fromEmail ? `Reply to: ${fromEmail}` : ''}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const field =
    'w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-medium text-white outline-none transition placeholder:text-white/40 focus:border-[#7FB0FF]/60 focus:ring-2 focus:ring-[#7FB0FF]/20';

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">
            Name
          </label>
          <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="c-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">
            Your email
          </label>
          <input
            id="c-email"
            type="email"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            className={field}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="c-msg" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">
          Message
        </label>
        <textarea
          id="c-msg"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={field}
          placeholder="How can we help?"
        />
      </div>
      <button type="submit" className="btn-primary w-full !py-4">
        <Send className="h-4 w-4" />
        Send message
      </button>
      <p className="text-center text-xs font-medium text-white/45">This opens your email app with the message ready to send.</p>
    </form>
  );
}
