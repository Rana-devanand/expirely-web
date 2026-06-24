'use client';

import LegalLayout from '@/components/LegalLayout';
import Link from 'next/link';
import { 
  Smartphone, 
  User, 
  Trash2, 
  CheckCircle2, 
  Mail, 
  ChevronRight,
  AlertTriangle 
} from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Open Expirely App',
    desc: 'Launch the Expirely mobile application on your iOS or Android device. Ensure you are signed in to the account you wish to delete.',
    icon: Smartphone,
    iconColor: 'text-purple-400',
  },
  {
    num: '02',
    title: 'Go to Profile Settings',
    desc: 'Tap the Profile icon (or the gear settings icon) located in the navigation header or tab menu to open your profile page.',
    icon: User,
    iconColor: 'text-indigo-400',
  },
  {
    num: '03',
    title: 'Select "Delete Account"',
    desc: 'Scroll down to the bottom of your account configuration options and tap the red "Delete Account" button.',
    icon: Trash2,
    iconColor: 'text-rose-400',
  },
  {
    num: '04',
    title: 'Confirm Permanently',
    desc: 'Confirm the action in the safety dialog. Once you tap "Confirm Delete", your database records and session will be permanently erased.',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
  },
];

export default function DeleteAccountPage() {
  return (
    <LegalLayout title="Delete Your Account">
      <div className="space-y-10 text-slate-300">
        <p className="text-base leading-relaxed">
          We are sorry to see you go. If you wish to delete your Expirely mobile app account and erase all associated personal data, you can do so directly within the app or by submitting a manual request.
        </p>

        {/* Warning Callout */}
        <div className="bg-rose-500/10 border-l-4 border-rose-500 p-5 rounded-r-lg space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-bold">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Important: Account Deletion is Permanent</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            This action is irreversible. Once your account is deleted, all inventory items, notifications, settings, history, and records are permanently removed from our databases.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-100">Step-by-Step Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div 
                  key={idx}
                  className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Step {step.num}
                    </span>
                    <IconComponent className={`w-5 h-5 ${step.iconColor}`} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-200">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alternative Email Deletion */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <h2 className="text-2xl font-bold text-slate-100">Alternative: Request Deletion via Email</h2>
          <p className="text-sm leading-relaxed">
            If you have uninstalled the app or are unable to log in, you can request account deletion by emailing our support team at <a href="mailto:dev.cloudapp93@gmail.com" className="text-emerald-400 hover:underline">dev.cloudapp93@gmail.com</a>. 
          </p>
          <p className="text-sm leading-relaxed">
            Please make sure to write from the email address associated with your Expirely account. We will process your deletion request manually within 48 hours.
          </p>
          
          <div className="pt-2">
            <Link
              href="mailto:dev.cloudapp93@gmail.com?subject=Expirely%20Account%20Deletion%20Request&body=Hello%20Expirely%20Team%2C%0D%0A%0D%0APlease%20permanently%20delete%20my%20account%20and%20all%20associated%20data%20from%20your%20servers.%0D%0A%0D%0ARegistered%20Account%20Email%3A%20%5BType%20your%20registered%20email%20here%5D%0D%0A%0D%0AThank%20you%20for%20your%20assistance%21"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-sm font-semibold border border-slate-700"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              Email Deletion Request
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}
