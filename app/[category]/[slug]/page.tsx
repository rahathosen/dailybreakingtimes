import { ArticleHeader } from "@/components/article/article-header"
import { ArticleContent } from "@/components/article/article-content"
import { ArticleFooter } from "@/components/article/article-footer"
import { RelatedArticles } from "@/components/article/related-articles"
import { MostViewedArticles } from "@/components/article/most-viewed-articles"
import { RecentArticles } from "@/components/article/recent-articles"
import { Separator } from "@/components/ui/separator"

// This would come from a database or API in a real application
const getArticleData = (category: string, slug: string) => {
  return {
    title: "Global Leaders Reach Historic Climate Agreement at Summit",
    category: "News",
    subcategory: "World",
    author: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=96&width=96",
      role: "Senior Political Correspondent",
    },
    publishedAt: "May 15, 2023",
    readTime: "8 min",
    tags: ["Climate Change", "Global Summit", "Environment", "Politics"],
    featuredImage: "/placeholder.svg?height=600&width=1200",
    content: `
      <p>In a landmark decision that could reshape global climate policy for decades to come, world leaders have committed to ambitious carbon reduction targets, signaling a new era in international climate cooperation.</p>
      
      <p>The agreement, reached after five days of intense negotiations at the Global Climate Summit, includes substantial financial commitments to support developing nations in their transition to cleaner energy sources.</p>
      
      <h2>Unprecedented Cooperation</h2>
      
      <p>"This is a historic moment," said UN Secretary-General António Guterres. "For the first time, we have a truly global commitment that includes concrete actions, not just aspirational goals."</p>
      
      <p>The agreement calls for a 50% reduction in global carbon emissions by 2030 and net-zero emissions by 2050. It also establishes a $100 billion annual fund to help developing countries adapt to climate change and invest in renewable energy infrastructure.</p>
      
      <p>Key points of the agreement include:</p>
      
      <ul>
        <li>Phasing out coal power in developed nations by 2030</li>
        <li>Ending subsidies for fossil fuels globally by 2025</li>
        <li>Protecting 30% of land and ocean areas by 2030</li>
        <li>Creating a carbon pricing mechanism to be implemented by 2024</li>
      </ul>
      
      <h2>Challenges Ahead</h2>
      
      <p>Despite the optimism surrounding the agreement, challenges remain. Implementation will require significant policy changes at national levels, and some industry groups have already expressed concerns about the pace of the transition.</p>
      
      <p>"The real test will be turning these commitments into action," said climate scientist Dr. Maria Rodriguez. "We've seen ambitious agreements before, but follow-through has often been lacking."</p>
      
      <p>The agreement includes a robust monitoring and reporting system, with countries required to submit progress reports every two years. A compliance committee will review these reports and has the authority to recommend corrective actions.</p>
      
      <h2>Economic Implications</h2>
      
      <p>Economists predict that the agreement will accelerate the already rapid growth in renewable energy sectors. "This creates certainty for investors," said economist James Chen. "We expect to see a significant shift in capital from fossil fuels to clean energy over the next decade."</p>
      
      <p>Stock markets responded positively to the news, with renewable energy companies seeing substantial gains. However, traditional energy companies experienced mixed results, with those already investing in clean energy alternatives performing better than those heavily focused on fossil fuels.</p>
      
      <h2>Public Response</h2>
      
      <p>Public reaction has been largely positive, with environmental groups calling the agreement a crucial step forward. Climate activists, while celebrating the agreement, emphasized that continued pressure would be necessary to ensure governments fulfill their commitments.</p>
      
      <p>"This is a victory for the millions of young people who have been demanding action," said youth climate activist Sofia Patel. "But our work is far from over. We'll be watching closely to make sure these promises become reality."</p>
      
      <p>As world leaders return to their respective countries, the focus now shifts to developing the national policies and legislation needed to implement the agreement. The first major test will come next year, when countries are required to submit their detailed plans for achieving the 2030 targets.</p>
    `,
    relatedArticles: [
      {
        id: 1,
        title: "Climate Scientists React to New Global Agreement",
        excerpt: "Leading climate researchers share their perspectives on whether the new targets are achievable.",
        image: "/placeholder.svg?height=300&width=600&text=Climate",
        category: "Science",
        publishedAt: "2 hours ago",
        slug: "climate-scientists-react",
      },
      {
        id: 2,
        title: "How the Climate Agreement Will Affect Global Markets",
        excerpt: "Financial analysts predict major shifts in investment patterns following the historic climate deal.",
        image: "/placeholder.svg?height=300&width=600&text=Markets",
        category: "Business",
        publishedAt: "5 hours ago",
        slug: "climate-agreement-markets",
      },
      {
        id: 3,
        title: "The Technology Behind Carbon Capture Innovations",
        excerpt: "New technologies that could help countries meet their ambitious carbon reduction targets.",
        image: "/placeholder.svg?height=300&width=600&text=Technology",
        category: "Technology",
        publishedAt: "1 day ago",
        slug: "carbon-capture-innovations",
      },
      {
        id: 4,
        title: "Environmental Activists Celebrate Climate Deal Victory",
        excerpt: "Grassroots organizations worldwide are celebrating the new climate agreement as a major win.",
        image: "/placeholder.svg?height=300&width=600&text=Activism",
        category: "Society",
        publishedAt: "1 day ago",
        slug: "activists-celebrate-climate-deal",
      },
    ],
    mostViewedArticles: [
      {
        id: 1,
        title: "Tech Giants Unveil Revolutionary AI Platform",
        image: "/placeholder.svg?height=200&width=200&text=AI",
        category: "Technology",
        publishedAt: "1 day ago",
        slug: "tech-giants-ai-platform",
        views: 24560,
      },
      {
        id: 2,
        title: "Markets Surge as Central Bank Announces New Policy",
        image: "/placeholder.svg?height=200&width=200&text=Markets",
        category: "Business",
        publishedAt: "2 days ago",
        slug: "markets-surge-central-bank",
        views: 18720,
      },
      {
        id: 3,
        title: "Major Breakthrough in Cancer Research Announced",
        image: "/placeholder.svg?height=200&width=200&text=Health",
        category: "Health",
        publishedAt: "3 days ago",
        slug: "breakthrough-cancer-research",
        views: 15340,
      },
      {
        id: 4,
        title: "Historic Peace Deal Signed in Middle East Conflict",
        image: "/placeholder.svg?height=200&width=200&text=Politics",
        category: "Politics",
        publishedAt: "2 days ago",
        slug: "peace-deal-middle-east",
        views: 12890,
      },
      {
        id: 5,
        title: "Olympic Committee Announces Host City for 2036 Games",
        image: "/placeholder.svg?height=200&width=200&text=Sports",
        category: "Sports",
        publishedAt: "4 days ago",
        slug: "olympic-host-city-2036",
        views: 10450,
      },
    ],
    recentArticles: [
      {
        id: 1,
        title: "New Economic Policy to Boost Small Businesses",
        image: "/placeholder.svg?height=200&width=200&text=Economy",
        category: "Business",
        publishedAt: "3 hours ago",
        slug: "economic-policy-small-business",
      },
      {
        id: 2,
        title: "Scientists Discover New Species in Amazon Rainforest",
        image: "/placeholder.svg?height=200&width=200&text=Science",
        category: "Science",
        publishedAt: "5 hours ago",
        slug: "new-species-amazon-rainforest",
      },
      {
        id: 3,
        title: "Film Festival Announces Award Winners",
        image: "/placeholder.svg?height=200&width=200&text=Arts",
        category: "Arts",
        publishedAt: "8 hours ago",
        slug: "film-festival-winners",
      },
      {
        id: 4,
        title: "Government Announces Emergency Response to Flooding",
        image: "/placeholder.svg?height=200&width=200&text=Weather",
        category: "Weather",
        publishedAt: "10 hours ago",
        slug: "emergency-response-flooding",
      },
    ],
  }
}

export default function ArticlePage({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params
  const article = getArticleData(category, slug)

  return (
    <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <article className="space-y-8">
            <ArticleHeader
              title={article.title}
              category={article.category}
              subcategory={article.subcategory}
              author={article.author}
              publishedAt={article.publishedAt}
              readTime={article.readTime}
              tags={article.tags}
              featuredImage={article.featuredImage}
            />

            <ArticleContent content={article.content} />

            <ArticleFooter />
          </article>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <MostViewedArticles articles={article.mostViewedArticles} />
          <RecentArticles articles={article.recentArticles} />
        </div>
      </div>

      <Separator className="my-12" />

      <RelatedArticles articles={article.relatedArticles} />
    </main>
  )
}
