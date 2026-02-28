import { HeroSection } from '@/components/landing/hero-section'
import { FeaturedProperties } from '@/components/landing/featured-properties'
import { RankingsPreview } from '@/components/landing/rankings-preview'
import { NeighborGraph } from '@/components/landing/neighbor-graph'
import { BTSPortfolio } from '@/components/landing/bts-portfolio'
import { InvestmentLegends } from '@/components/landing/investment-legends'
import { MapPreview } from '@/components/landing/map-preview'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedProperties />
      <RankingsPreview />
      <NeighborGraph />
      <BTSPortfolio />
      <InvestmentLegends />
      <MapPreview />
      <Footer />
    </div>
  )
}
