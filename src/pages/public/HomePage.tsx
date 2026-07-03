import { HelmetProvider, Helmet } from 'react-helmet-async'
import { HeroSection } from '@/features/home/HeroSection'
import { PropertyCategories } from '@/features/home/PropertyCategories'
import { FeaturedProperties } from '@/features/home/FeaturedProperties'
import { WhyChooseUs } from '@/features/home/WhyChooseUs'
import { StatsSection } from '@/features/home/StatsSection'
import { TestimonialsSection } from '@/features/home/TestimonialsSection'
import { LatestBlogs } from '@/features/home/LatestBlogs'
import { CTASection } from '@/features/home/CTASection'

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>J+ Jaidad Group – Premium Real Estate Pakistan</title>
        <meta name="description" content="Pakistan's premier real estate group. Find luxury residential, commercial, and investment properties in Lahore, Islamabad, and Karachi." />
        <meta property="og:title" content="J+ Jaidad Group – Premium Real Estate Pakistan" />
        <meta property="og:type" content="website" />
      </Helmet>

      <HeroSection />
      <PropertyCategories />
      <FeaturedProperties />
      <WhyChooseUs />
      <StatsSection />
      <TestimonialsSection />
      <LatestBlogs />
      <CTASection />
    </>
  )
}
