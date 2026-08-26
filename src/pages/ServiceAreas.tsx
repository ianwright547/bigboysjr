import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Truck, CheckCircle2, Clock, Building2 } from "lucide-react";
import Seo from "@/components/Seo";
import { CITIES } from "@/data/cities";
import { Button } from "@/components/ui/button";
import RealJobGallery from "@/components/RealJobGallery";
import { JOB_PROJECTS } from "@/data/jobPhotos";

const ServiceAreas = () => (
  <main className="pt-16">
    <Seo
      title="Junk Removal Service Areas Near Atlanta | Big Boys"
      description="Find local Big Boys junk removal service across Atlanta, Suwanee, Buford, Lawrenceville, Marietta, Decatur, Roswell, and surrounding Georgia communities."
      path="/service-areas"
      geoPlace="Atlanta"
      schemas={[{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Junk Removal Service Areas Near Atlanta",
        url: "https://bigboysjr.com/service-areas",
      }]}
    />

    <section className="bg-foreground text-background py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <MapPin className="w-10 h-10 text-primary mx-auto mb-4" />
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5">Junk Removal Service Areas Near Atlanta</h1>
        <p className="text-lg text-background/75 max-w-2xl mx-auto">
          Local crews serve homes, apartments, businesses, and job sites throughout Metro Atlanta and nearby North Georgia communities.
        </p>
      </div>
    </section>

    <section className="py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mb-9">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Choose your city</p>
          <h2 className="text-3xl font-bold mb-3">Local availability and neighborhood coverage</h2>
          <p className="text-muted-foreground leading-relaxed">
            Select the page closest to your property for local service details and nearby communities. If your town is not listed, call us or enter your ZIP code to check availability.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CITIES.map((city) => (
            <Link key={city.slug} to={`/${city.slug}`} className="group rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5" /></span>
                <div>
                  <h2 className="text-lg font-bold group-hover:text-primary transition-colors">Junk Removal in {city.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">Serving {city.nearbyAreas.slice(0, 3).join(", ")} and nearby areas</p>
                  <span className="inline-flex items-center text-primary text-sm font-semibold mt-3">View {city.name} service <ArrowRight className="w-4 h-4 ml-1" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <RealJobGallery
      projects={JOB_PROJECTS.slice(5, 8)}
      eyebrow="Work completed across our routes"
      heading="Real Pickups From Metro Atlanta Properties"
      description="Our service-area pages connect you with city-specific availability, while these photos show the residential and outdoor projects our crews handle every week."
      className="border-y border-border"
    />

    <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Coverage built around real routes</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How Local Junk Removal Availability Works</h2>
          <p className="text-muted-foreground leading-relaxed">Availability is based on your ZIP code, project size, access, and the crew’s route for the day. Entering accurate details helps us reserve enough truck space and time.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: MapPin, title: "Check your exact ZIP", text: "City boundaries and mailing addresses do not always match. The pricing flow confirms whether your property is within the active service radius." },
            { icon: Clock, title: "Choose a practical window", text: "Same-day and next-day service may be available. Larger cleanouts often benefit from an earlier time window and more detailed planning." },
            { icon: Building2, title: "Share property access", text: "Apartments, gated communities, offices, and managed properties may require parking instructions, elevator reservations, or an authorized contact." },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6">
              <Icon className="w-7 h-7 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
          <h3 className="text-xl font-bold mb-4">Every local pickup includes</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["Upfront scope confirmation", "Lifting and loading", "Haul-away and disposal", "A tidy pickup area"].map((item) => <p key={item} className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />{item}</p>)}
          </div>
        </div>
      </div>
    </section>

    <section className="py-14 bg-muted/40 border-y border-border">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Truck className="w-9 h-9 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-3">Not sure whether we reach your address</h2>
        <p className="text-muted-foreground mb-7">Enter your ZIP code in the pricing tool. You can check coverage before selecting items or booking a pickup.</p>
        <Button asChild size="lg" className="rounded-xl"><Link to="/book">Check my ZIP code <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
      </div>
    </section>
  </main>
);

export default ServiceAreas;
