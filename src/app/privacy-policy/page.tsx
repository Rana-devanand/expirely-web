import LegalLayout from '@/components/LegalLayout';

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <section className="space-y-8 text-slate-300">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">1. Introduction</h2>
          <p>
            Welcome to Expirely. We value your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application and website.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">2. Information We Collect</h2>
          <p>We collect information to provide better services to all our users. This includes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Account Information:</strong> Name, email address, and profile details provided during registration or Google Sign-In.</li>
            <li><strong>Product & Usage Data:</strong> Names, categories, purchase pricing, and expiry dates of items you track, along with usage outcomes (e.g., whether products were fully used, partially used, or wasted) to construct your analytics dashboard.</li>
            <li><strong>Family / Shared Household Data:</strong> If you join a shared household, your registered display name, email, and specific inventory actions (such as adding, consuming, or wasting products) will be visible to other household members.</li>
            <li><strong>Shopping List Data:</strong> Items, check status, quantities, and creation times for products added to your smart shopping lists.</li>
            <li><strong>AI-Processed Data:</strong> When you scan a receipt, our AI processes the image to extract product names and dates. Receipt images are used solely for this extraction process.</li>
            <li><strong>Camera & Photo Library:</strong> We request access to your camera and photo library specifically for scanning receipts and updating your user profile picture.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">3. Device Permissions & Notifications</h2>
          <p>Our mobile app requires specific permissions to function effectively:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Push Notifications & Reminders:</strong> We use push notifications to send daily reminder alerts about products needing attention. To support this scheduling, we save your notification preferences, reminder times, and device timezone.</li>
            <li><strong>Background Services:</strong> Minimal background processing is used to sync your inventory and ensure timely alerts.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">4. How We Use Your Information</h2>
          <p>We use the collected data for various purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>To provide and maintain our service, including secure cloud synchronization.</li>
            <li>To manage household memberships and synchronize inventory status in real-time across family members.</li>
            <li>To generate AI-powered recipe suggestions and nutritional insights.</li>
            <li>To provide customer support and improve user experience through anonymous usage analytics.</li>
            <li>To construct financial and environmental summaries for your Waste Savings Dashboard.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">5. Data Security</h2>
          <p>
            The security of your data is important to us. We use industry-standard encryption (SSL/TLS) and secure database systems (Supabase/Firebase) 
            to protect your personal information.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">6. Third-Party Services</h2>
          <p>
            We may use trusted third-party services to facilitate our operations:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Google:</strong> For authentication and secure sign-in.</li>
            <li><strong>Cloud Providers:</strong> For secure data storage and image processing.</li>
          </ul>
        </div>

        <div className="pt-8 text-slate-500 italic">
          Last Updated: June 24, 2026
        </div>
      </section>
    </LegalLayout>
  );
}
