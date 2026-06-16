import Hero from "@/components/home/hero";
import TrustedBy from "@/components/home/trusted-by";
import Features from "@/components/home/features";
import TemplatesMarketplace from "@/components/home/templates-marketplace";
import Pricing from "@/components/home/pricing";
import Testimonials from "@/components/home/testimonials";
import FAQ from "@/components/home/faq";
import CTA from "@/components/home/cta";
import Footer from "@/components/home/footer";
import Navbar from "@/components/layout/navbar";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <TemplatesMarketplace />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
