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
            <li><strong>Product Data:</strong> Names, categories, and expiry dates of items you track in your inventory.</li>
            <li><strong>AI-Processed Data:</strong> When you scan a receipt, our AI processes the image to extract product names and dates. Receipt images are used solely for this extraction process.</li>
            <li><strong>Camera & Photo Library:</strong> We request access to your camera and photo library specifically for scanning receipts and updating your user profile picture.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">3. Device Permissions & Notifications</h2>
          <p>Our mobile app requires specific permissions to function effectively:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Push Notifications:</strong> We use notifications to alert you when products are nearing their "Best Before" dates. You can manage these in your device settings.</li>
            <li><strong>Background Services:</strong> Minimal background processing is used to sync your inventory and ensure timely alerts.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">4. How We Use Your Information</h2>
          <p>We use the collected data for various purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>To provide and maintain our service, including secure cloud synchronization.</li>
            <li>To generate AI-powered recipe suggestions and nutritional insights.</li>
            <li>To provide customer support and improve user experience through anonymous usage analytics.</li>
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
          Last Updated: March 10, 2026
        </div>
      </section>
    </LegalLayout>
  );
}
