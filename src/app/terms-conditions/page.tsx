import LegalLayout from '@/components/LegalLayout';

export default function TermsConditions() {
  return (
    <LegalLayout title="Terms & Conditions">
      <section className="space-y-8 text-slate-300">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Expirely app, you agree to be bound by these Terms and Conditions. 
            If you do not agree with any part of these terms, you may not use our services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">2. AI Accuracy & Analytics Disclaimer</h2>
          <p className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 font-medium text-slate-200 mb-4">
            IMPORTANT: Dates detected by our AI scanning system are estimates. Users should always verify the physical label on a product for safety. Expirely is not responsible for any issues arising from incorrect date detection.
          </p>
          <p>
            While we strive for high accuracy in our AI-based scanning, recipe suggestions, and waste savings metrics, these features are provided for informational and motivational purposes only.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Savings Analytics:</strong> The Waste Savings Dashboard estimates money saved based on user-entered prices or standard product valuations. We make no guarantees of exact financial savings or calculations.</li>
            <li><strong>Daily Reminders:</strong> Alert delivery relies on push notification protocols (APNs, FCM) and device settings. We do not guarantee alert delivery times or receipt. Always check physical products for fresh status.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">3. Use Of Service</h2>
          <p>
            Expirely grants you a personal, non-transferable license to use the app for household inventory management.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree not to use the service for any illegal or unauthorized purpose.</li>
            <li><strong>Family / Shared Inventory:</strong> When creating or joining a household, you acknowledge that all invited members will have shared access and permissions to add, edit, or delete items within that shared inventory. Expirely is not liable for data modified or deleted by household members you invite.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">4. Limitations of Liability</h2>
          <p>
            In no event shall Expirely or its developers be liable for any direct, indirect, incidental, or consequential damages arising 
            out of the use or inability to use the service, even if notified of such possibility.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">5. Modifications to Service</h2>
          <p>
            We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part of it) 
            with or without notice.
          </p>
        </div>

        <div className="pt-8 text-slate-500 italic">
          Last Updated: June 24, 2026
        </div>
      </section>
    </LegalLayout>
  );
}
