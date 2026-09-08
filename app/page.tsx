import { MarketingNav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { TrustedBy } from "@/components/marketing/trusted-by";
import { ProductSteps } from "@/components/marketing/product-steps";
import { Testimonial } from "@/components/marketing/testimonial";
import { Results } from "@/components/marketing/results";
import { CreatorPosts } from "@/components/marketing/creator-posts";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";
import { Footer } from "@/components/marketing/footer";

export default function LandingPage() {
  return (
    <div className="bg-white">
      <MarketingNav />
      <Hero />
      <TrustedBy />
      <ProductSteps />
      <Testimonial />
      <Results />
      <CreatorPosts />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}
