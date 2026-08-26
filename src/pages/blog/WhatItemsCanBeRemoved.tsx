import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Seo from "@/components/Seo";

const WhatItemsCanBeRemoved = () => (
  <>
    <Seo
      title="What Items Can Junk Removal Companies Take in Atlanta?"
      description="Learn which furniture, appliances, household items, yard debris, and renovation materials Atlanta junk removal crews can take."
      path="/blog/what-items-can-be-recycled-or-removed"
      type="article"
    />
    <Helmet>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "What Items Can Be Recycled or Removed?",
        description: "What junk removal companies in Atlanta accept, what gets recycled, and what needs special disposal.",
        image: "https://bigboysjr.com/social-preview.png",
        datePublished: "2026-04-10",
        dateModified: "2026-04-10",
        author: { "@type": "Organization", name: "Big Boys Junk Removal" },
        publisher: { "@type": "Organization", name: "Big Boys Junk Removal", logo: { "@type": "ImageObject", url: "https://bigboysjr.com/logo-128.png" } },
        mainEntityOfPage: "https://bigboysjr.com/blog/what-items-can-be-recycled-or-removed"
      })}</script>
    </Helmet>
    <article className="max-w-3xl mx-auto px-4 py-16 sm:py-24 prose prose-slate max-w-none">
      <Link to="/blog" className="inline-flex items-center text-sm text-primary font-medium mb-8 no-underline hover:underline">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Blog
      </Link>
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground">What Items Can Junk Removal Companies Take in Atlanta?</h1>
      <p className="text-sm text-muted-foreground">Updated March 28, 2026 • 4 min read</p>

      <p className="text-muted-foreground leading-relaxed">One of the most common questions we get is "Can you take this?" The short answer: if you can point to it, we can probably haul it. Here's a complete guide to what junk removal companies in Atlanta can: and can't: take.</p>

      <h2 className="text-2xl font-bold text-foreground mt-8">Items We Remove</h2>
      <ul className="text-muted-foreground space-y-1">
        <li><strong>Furniture:</strong> Couches, tables, chairs, dressers, bookshelves, bed frames</li>
        <li><strong>Appliances:</strong> Refrigerators, washers, dryers, ovens, dishwashers, microwaves</li>
        <li><strong>Mattresses:</strong> All sizes including box springs</li>
        <li><strong>Electronics:</strong> TVs, monitors, computers, printers</li>
        <li><strong>Yard waste:</strong> Branches, leaves, dirt, sod, mulch</li>
        <li><strong>Construction debris:</strong> Drywall, lumber, tile, carpet, roofing</li>
        <li><strong>Miscellaneous:</strong> Toys, clothing, boxes, exercise equipment, grills</li>
      </ul>

      <h2 className="text-2xl font-bold text-foreground mt-8">Items That Get Recycled</h2>
      <p className="text-muted-foreground">At Big Boys Junk Removal, we're committed to keeping as much as possible out of landfills:</p>
      <ul className="text-muted-foreground space-y-1">
        <li>Metal appliances and scrap metal → recycling facility</li>
        <li>Electronics → certified e-waste recycler</li>
        <li>Usable furniture and clothing → local charities and donation centers</li>
        <li>Wood and yard waste → composting facilities</li>
        <li>Cardboard and paper → recycling</li>
      </ul>

      <h2 className="text-2xl font-bold text-foreground mt-8">Items We Can't Take</h2>
      <ul className="text-muted-foreground space-y-1">
        <li>Hazardous materials (paint, chemicals, solvents)</li>
        <li>Asbestos-containing materials</li>
        <li>Biohazardous waste (medical waste, bodily fluids)</li>
        <li>Propane tanks (full)</li>
        <li>Certain automotive fluids</li>
      </ul>
      <p className="text-muted-foreground">Not sure? Just ask: we'll let you know before your booking.</p>

      <h2 className="text-2xl font-bold text-foreground mt-8">How to Prepare Items for Pickup</h2>
      <p className="text-muted-foreground">You generally do not need to carry bulky items outside. Identify everything that should go, remove personal documents and valuables, empty loose contents where appropriate, and tell the crew about stairs, elevators, gates, parking, or disassembly needs. For appliances, disconnect utilities before the scheduled pickup when required.</p>

      <h2 className="text-2xl font-bold text-foreground mt-8">What if an Item Is Not Listed?</h2>
      <p className="text-muted-foreground">Use the custom-item option in the booking flow or request a callback. A description and photo can help the team review unusual dimensions, weight, materials, and access before confirming the job. Hazardous or regulated materials may require a specialized disposal provider.</p>

      <h2 className="text-2xl font-bold text-foreground mt-8">Choose the Right Removal Service</h2>
      <p className="text-muted-foreground">Browse options for <Link to="/services/furniture-removal">furniture removal</Link>, <Link to="/services/appliance-removal">appliance removal</Link>, <Link to="/services/yard-waste-removal">yard waste removal</Link>, and <Link to="/services/construction-debris">construction debris</Link>. Atlanta customers can also review the <Link to="/atlanta">local service page</Link> before booking.</p>

      <div className="mt-8 not-prose">
        <Button asChild size="lg" className="h-14 px-10 text-lg rounded-xl font-semibold">
          <Link to="/book">See What We Can Remove for You <ArrowRight className="w-5 h-5 ml-1" /></Link>
        </Button>
      </div>
    </article>
  </>
);

export default WhatItemsCanBeRemoved;
