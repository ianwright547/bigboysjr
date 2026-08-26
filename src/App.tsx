import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home.tsx";
import { CITIES } from "./data/cities";

// Lazy-load every non-home route so the initial bundle stays tiny.
const Book = lazy(() => import("./pages/Book.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const RequestCallback = lazy(() => import("./pages/RequestCallback.tsx"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsOfService = lazy(() => import("./pages/TermsOfService.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const Services = lazy(() => import("./pages/Services.tsx"));
const ServiceAreas = lazy(() => import("./pages/ServiceAreas.tsx"));
const JunkRemovalCostAtlanta = lazy(() => import("./pages/blog/JunkRemovalCostAtlanta.tsx"));
const SameDayVsDumpster = lazy(() => import("./pages/blog/SameDayVsDumpster.tsx"));
const WhatItemsCanBeRemoved = lazy(() => import("./pages/blog/WhatItemsCanBeRemoved.tsx"));
const DeclutterGarageFast = lazy(() => import("./pages/blog/DeclutterGarageFast.tsx"));
const EstateCleanoutChecklistAtlanta = lazy(() => import("./pages/blog/EstateCleanoutChecklistAtlanta.tsx"));
const PrepareForJunkRemovalPickup = lazy(() => import("./pages/blog/PrepareForJunkRemovalPickup.tsx"));
const FurnitureRemovalAtlantaGuide = lazy(() => import("./pages/blog/FurnitureRemovalAtlantaGuide.tsx"));
const ApplianceRemovalAtlantaGuide = lazy(() => import("./pages/blog/ApplianceRemovalAtlantaGuide.tsx"));
const FurnitureRemoval = lazy(() => import("./pages/services/FurnitureRemoval.tsx"));
const ApplianceRemoval = lazy(() => import("./pages/services/ApplianceRemoval.tsx"));
const MattressRemoval = lazy(() => import("./pages/services/MattressRemoval.tsx"));
const HotTubRemoval = lazy(() => import("./pages/services/HotTubRemoval.tsx"));
const JunkRemoval = lazy(() => import("./pages/services/JunkRemoval.tsx"));
const Cleanouts = lazy(() => import("./pages/services/Cleanouts.tsx"));
const YardWaste = lazy(() => import("./pages/services/YardWaste.tsx"));
const ConstructionDebris = lazy(() => import("./pages/services/ConstructionDebris.tsx"));
const CommercialJunkRemoval = lazy(() => import("./pages/services/CommercialJunkRemoval.tsx"));
const WholePropertyCleanouts = lazy(() => import("./pages/services/WholePropertyCleanouts.tsx"));
const CityLandingPage = lazy(() => import("./pages/CityLandingPage.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/book" element={<Book />} />
                <Route path="/services" element={<Services />} />
                <Route path="/service-areas" element={<ServiceAreas />} />
                {/* City Landing Pages */}
                {CITIES.map((city) => (
                  <Route key={city.slug} path={`/${city.slug}`} element={<CityLandingPage city={city} />} />
                ))}
                <Route path="/request-callback" element={<RequestCallback />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                {/* Blog */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/how-much-does-junk-removal-cost-atlanta" element={<JunkRemovalCostAtlanta />} />
                <Route path="/blog/same-day-junk-removal-vs-dumpster-rental" element={<SameDayVsDumpster />} />
                <Route path="/blog/what-items-can-be-recycled-or-removed" element={<WhatItemsCanBeRemoved />} />
                <Route path="/blog/how-to-declutter-your-garage-fast" element={<DeclutterGarageFast />} />
                <Route path="/blog/estate-cleanout-checklist-atlanta" element={<EstateCleanoutChecklistAtlanta />} />
                <Route path="/blog/how-to-prepare-for-junk-removal-pickup" element={<PrepareForJunkRemovalPickup />} />
                <Route path="/blog/furniture-removal-atlanta-guide" element={<FurnitureRemovalAtlantaGuide />} />
                <Route path="/blog/appliance-removal-disposal-atlanta" element={<ApplianceRemovalAtlantaGuide />} />
                {/* Services */}
                <Route path="/services/furniture-removal" element={<FurnitureRemoval />} />
                <Route path="/services/appliance-removal" element={<ApplianceRemoval />} />
                <Route path="/services/mattress-removal" element={<MattressRemoval />} />
                <Route path="/services/hot-tub-removal" element={<HotTubRemoval />} />
                <Route path="/services/junk-removal" element={<JunkRemoval />} />
                <Route path="/services/cleanouts" element={<Cleanouts />} />
                <Route path="/services/yard-waste-removal" element={<YardWaste />} />
                <Route path="/services/construction-debris" element={<ConstructionDebris />} />
                <Route path="/services/commercial-junk-removal" element={<CommercialJunkRemoval />} />
                <Route path="/services/whole-property-cleanouts" element={<WholePropertyCleanouts />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
