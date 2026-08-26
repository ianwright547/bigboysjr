import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Privacy Policy | Big Boys Junk Removal</title>
        <meta name="description" content="How Big Boys Junk Removal collects, uses, and protects your personal information when you book junk removal services." />
        <link rel="canonical" href="https://bigboysjr.com/privacy" />
        <meta property="og:title" content="Privacy Policy | Big Boys Junk Removal" />
        <meta property="og:description" content="How we collect, use, and protect your personal information." />
        <meta property="og:url" content="https://bigboysjr.com/privacy" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8 -ml-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: April 12, 2026</p>

        <div className="prose prose-green max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>When you use our junk removal booking service, we may collect the following information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Contact Information:</strong> Name, phone number, and email address.</li>
              <li><strong>Service Details:</strong> Items for removal, load size, pricing preferences, zip code, and scheduling information.</li>
              <li><strong>Usage Data:</strong> How you interact with our website, including pages visited and actions taken.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide and schedule junk removal services.</li>
              <li>Send booking confirmations and service updates via SMS and email.</li>
              <li>Respond to your inquiries and callback requests.</li>
              <li>Improve our website and services.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. SMS & Communications</h2>
            <p>
              By providing your phone number, you consent to receive service-related SMS messages, including booking
              confirmations and updates. You can opt out of marketing communications at any time by following the
              unsubscribe instructions in our messages or contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your data with trusted third-party service
              providers who assist us in operating our business (e.g., SMS delivery, email services), and only to the
              extent necessary to provide our services to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information from unauthorized access,
              alteration, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in
              this policy or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Opt out of marketing communications.</li>
              <li>Lodge a complaint with a data protection authority.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Cookies</h2>
            <p>
              Our website may use cookies and similar technologies to enhance your browsing experience. You can
              control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
              updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="tel:+14706603559" className="text-primary hover:underline font-medium">
                (470) 660-3559
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
