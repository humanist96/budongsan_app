import { HeroSection } from '@/components/landing/hero-section'
import { FeaturedProperties } from '@/components/landing/featured-properties'
import { RankingsPreview } from '@/components/landing/rankings-preview'
import { MiniQuiz } from '@/components/landing/mini-quiz'
import { MapPreview } from '@/components/landing/map-preview'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedProperties />
      <RankingsPreview />
      <MiniQuiz />
      <MapPreview />
      <Footer />
    </div>
  )
}
