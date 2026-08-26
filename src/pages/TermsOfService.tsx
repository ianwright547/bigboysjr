import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Terms of Service | Big Boys Junk Removal</title>
        <meta name="description" content="The terms governing your use of Big Boys Junk Removal's booking platform and pickup services across metro Atlanta." />
        <link rel="canonical" href="https://bigboysjr.com/terms" />
        <meta property="og:title" content="Terms of Service | Big Boys Junk Removal" />
        <meta property="og:description" content="The terms governing use of our booking platform and pickup services." />
        <meta property="og:url" content="https://bigboysjr.com/terms" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8 -ml-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: April 12, 2026</p>

        <div className="prose prose-green max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Big Boys Junk Removal website and services, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Services</h2>
            <p>
              Big Boys Junk Removal provides residential and commercial junk removal services. Service availability
              depends on your location and scheduling. We reserve the right to refuse service at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Booking & Pricing</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Prices provided through our online booking tool are estimates and may change based on actual load size and item types upon arrival.</li>
              <li>Final pricing is confirmed on-site before any work begins.</li>
              <li>You have the right to decline the final price with no obligation.</li>
              <li>Payment is due upon completion of the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Cancellations</h2>
            <p>
              You may cancel or reschedule a booking at any time before the scheduled service window. We appreciate
              advance notice so we can accommodate other customers. No cancellation fees apply.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Prohibited Items</h2>
            <p>
              We cannot accept hazardous materials, including but not limited to: asbestos, chemicals, paint,
              biological waste, and other materials prohibited by local regulations. Our team will advise you on-site
              if any items cannot be removed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Liability</h2>
            <p>
              Big Boys Junk Removal takes reasonable care when performing services on your property. However, we are
              not liable for pre-existing damage or conditions. Any claims for property damage must be reported within
              24 hours of service completion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Communication Consent</h2>
            <p>
              By providing your phone number or email, you consent to receive service-related communications
              including booking confirmations, reminders, and updates. You may opt out of marketing messages at any
              time via our{" "}
              <Link to="/unsubscribe" className="text-primary hover:underline font-medium">
                unsubscribe page
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Intellectual Property</h2>
            <p>
              All content on this website:including text, graphics, logos, and software:is the property of Big Boys
              Junk Removal and protected by applicable intellectual property laws. You may not reproduce or
              distribute any content without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Big Boys Junk Removal shall not be liable for any indirect,
              incidental, or consequential damages arising from your use of our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms of Service at any time. Changes will be posted on this page
              with an updated revision date. Continued use of our services constitutes acceptance of the revised
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">11. Contact Us</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at{" "}
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

export default TermsOfService;
