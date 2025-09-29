import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import {
  ChartBarIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  TruckIcon,
  EyeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Supplier Analytics - Procur",
  description:
    "Gain powerful insights into your produce business with Procur's comprehensive analytics platform. Track performance, understand trends, and make data-driven decisions.",
};

export default function SupplierAnalyticsPage() {
  const analyticsFeatures = [
    {
      title: "Sales Performance",
      description: "Comprehensive insights into your revenue and sales trends",
      icon: CurrencyDollarIcon,
      features: [
        "Revenue tracking and forecasting",
        "Product-wise sales analysis",
        "Seasonal performance patterns",
        "Growth rate calculations",
        "Profit margin analysis",
      ],
    },
    {
      title: "Customer Intelligence",
      description: "Deep understanding of your buyer behavior and preferences",
      icon: UserGroupIcon,
      features: [
        "Customer segmentation analysis",
        "Buying pattern identification",
        "Repeat customer tracking",
        "Customer lifetime value",
        "Preference and demand insights",
      ],
    },
    {
      title: "Product Analytics",
      description: "Detailed performance metrics for your product catalog",
      icon: ChartBarIcon,
      features: [
        "Product performance rankings",
        "Inventory turnover rates",
        "Price optimization insights",
        "Quality rating analysis",
        "Demand forecasting models",
      ],
    },
    {
      title: "Market Intelligence",
      description: "Stay ahead with competitive and market trend analysis",
      icon: ArrowTrendingUpIcon,
      features: [
        "Market price benchmarking",
        "Competitive positioning analysis",
        "Industry trend identification",
        "Seasonal demand patterns",
        "Geographic market insights",
      ],
    },
  ];

  const dashboardMetrics = [
    {
      category: "Revenue Metrics",
      description: "Track your financial performance and growth",
      icon: CurrencyDollarIcon,
      metrics: [
        { name: "Total Revenue", value: "$125,430", change: "+18%" },
        { name: "Monthly Growth", value: "12.5%", change: "+2.3%" },
        { name: "Average Order Value", value: "$847", change: "+5%" },
        { name: "Profit Margin", value: "34.2%", change: "+1.8%" },
      ],
    },
    {
      category: "Sales Metrics",
      description: "Monitor your sales volume and conversion rates",
      icon: ShoppingBagIcon,
      metrics: [
        { name: "Orders Processed", value: "148", change: "+22%" },
        { name: "Conversion Rate", value: "68%", change: "+4%" },
        { name: "Quote-to-Sale", value: "45%", change: "+7%" },
        { name: "Repeat Customers", value: "73%", change: "+9%" },
      ],
    },
    {
      category: "Performance Metrics",
      description: "Track operational efficiency and quality",
      icon: StarIcon,
      metrics: [
        { name: "Customer Rating", value: "4.8/5", change: "+0.2" },
        { name: "On-Time Delivery", value: "96%", change: "+3%" },
        { name: "Response Time", value: "2.3hrs", change: "-15%" },
        { name: "Quality Score", value: "94%", change: "+2%" },
      ],
    },
    {
      category: "Market Metrics",
      description: "Understand your market position and reach",
      icon: MapPinIcon,
      metrics: [
        { name: "Market Share", value: "8.2%", change: "+1.1%" },
        { name: "Geographic Reach", value: "23 states", change: "+3" },
        { name: "Catalog Views", value: "2,847", change: "+31%" },
        { name: "Inquiry Rate", value: "12.4%", change: "+2.8%" },
      ],
    },
  ];

  const reportTypes = [
    {
      report: "Sales Performance Report",
      description:
        "Comprehensive analysis of revenue, orders, and growth trends",
      frequency: "Weekly/Monthly",
      icon: ChartBarIcon,
    },
    {
      report: "Customer Behavior Analysis",
      description: "Insights into buyer patterns, preferences, and loyalty",
      frequency: "Monthly",
      icon: UserGroupIcon,
    },
    {
      report: "Product Performance Review",
      description: "Detailed metrics on product sales, ratings, and demand",
      frequency: "Monthly",
      icon: EyeIcon,
    },
    {
      report: "Market Intelligence Brief",
      description: "Competitive analysis and industry trend updates",
      frequency: "Quarterly",
      icon: ArrowTrendingUpIcon,
    },
    {
      report: "Operational Efficiency Report",
      description: "Analysis of fulfillment, delivery, and quality metrics",
      frequency: "Monthly",
      icon: TruckIcon,
    },
    {
      report: "Financial Performance Summary",
      description: "Revenue, profit margins, and financial health overview",
      frequency: "Monthly",
      icon: CurrencyDollarIcon,
    },
  ];

  const insightCategories = [
    {
      category: "Demand Forecasting",
      description: "Predict future demand based on historical data and trends",
      benefits: [
        "Optimize inventory planning",
        "Reduce waste and spoilage",
        "Improve cash flow management",
        "Plan production schedules",
      ],
    },
    {
      category: "Price Optimization",
      description:
        "Find the optimal pricing strategy for maximum profitability",
      benefits: [
        "Maximize revenue per product",
        "Stay competitive in the market",
        "Identify pricing opportunities",
        "Improve profit margins",
      ],
    },
    {
      category: "Customer Segmentation",
      description: "Understand different buyer groups and their preferences",
      benefits: [
        "Personalize marketing efforts",
        "Improve customer retention",
        "Identify high-value customers",
        "Tailor product offerings",
      ],
    },
    {
      category: "Seasonal Analysis",
      description: "Understand seasonal patterns and plan accordingly",
      benefits: [
        "Plan for peak seasons",
        "Optimize resource allocation",
        "Identify growth opportunities",
        "Manage seasonal cash flow",
      ],
    },
  ];

  const benefits = [
    {
      title: "Data-Driven Decisions",
      description:
        "Make informed business decisions based on comprehensive data analysis",
      icon: ChartBarIcon,
    },
    {
      title: "Increased Profitability",
      description:
        "Optimize pricing, inventory, and operations for maximum profit",
      icon: CurrencyDollarIcon,
    },
    {
      title: "Better Customer Understanding",
      description: "Know your customers better and serve them more effectively",
      icon: UserGroupIcon,
    },
    {
      title: "Competitive Advantage",
      description: "Stay ahead of the competition with market intelligence",
      icon: ArrowTrendingUpIcon,
    },
    {
      title: "Operational Efficiency",
      description: "Identify bottlenecks and optimize your business processes",
      icon: ClockIcon,
    },
    {
      title: "Growth Planning",
      description: "Plan your expansion and growth strategies with confidence",
      icon: MapPinIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--secondary-black)] text-balance">
            Turn Data Into Profit
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Unlock the power of your business data with Procur's comprehensive
            analytics platform. Get the insights you need to grow smarter, sell
            more, and stay ahead of the competition.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/signup?type=supplier"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Start Analyzing Your Data
            </a>
            <a href="#features" className="btn btn-ghost px-8 py-3 text-base">
              Explore Analytics
            </a>
          </div>
          <div className="mt-10">
            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-xl border border-black/5 w-full max-w-6xl h-96 md:h-[520px]">
              <Image
                src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                alt="Business analytics dashboard and performance metrics"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Introduction */}
        <section className="mb-20">
          <div className="md:columns-2 md:gap-10">
            <p className="text-lg text-gray-700 leading-8 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9]">
              In the produce business, intuition can only take you so far. The
              most successful suppliers are those who combine their experience
              with hard data to make smarter decisions. Every transaction, every
              customer interaction, every seasonal shift tells a story about
              your business.
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-8">
              Our analytics platform helps you read that story clearly. From
              understanding which products drive the most profit to identifying
              your most valuable customers, we turn your business data into
              actionable insights that drive real growth.
            </p>
            <blockquote className="mt-8 md:mt-10 border-l-4 border-[var(--primary-accent2)] pl-5 italic text-xl text-gray-800">
              "Data is the new soil — fertile ground for growing a more
              profitable business."
            </blockquote>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Comprehensive Business Intelligence
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get deep insights into every aspect of your business with our
              advanced analytics platform designed specifically for produce
              suppliers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {analyticsFeatures.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <feature.icon className="h-8 w-8 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Metrics */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Real-Time Performance Dashboard
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Monitor your key business metrics in real-time with our
              comprehensive dashboard that puts all your important data at your
              fingertips.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {dashboardMetrics.map((category, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <category.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      {category.category}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {category.metrics.map((metric, metricIndex) => (
                    <div
                      key={metricIndex}
                      className="bg-[var(--primary-background)] rounded-lg p-3"
                    >
                      <div className="text-sm text-gray-600 mb-1">
                        {metric.name}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-[var(--secondary-black)]">
                          {metric.value}
                        </div>
                        <div className="text-xs font-medium text-green-600">
                          {metric.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Report Types */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Comprehensive Reporting Suite
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get detailed reports on every aspect of your business with
              automated generation and customizable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((report, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <report.icon className="h-6 w-6 text-[var(--primary-accent2)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-2">
                      {report.report}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {report.description}
                    </p>
                    <div className="text-xs font-medium text-[var(--primary-accent2)]">
                      {report.frequency}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Insight Categories */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Actionable Business Insights
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform raw data into strategic insights that help you make
              better decisions and grow your business more effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {insightCategories.map((insight, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-3">
                  {insight.category}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {insight.description}
                </p>
                <ul className="space-y-2">
                  {insight.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)] flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Why Analytics Matter for Your Business
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Suppliers who use data-driven insights consistently outperform
              those who rely on intuition alone. Here's how analytics can
              transform your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-lg transition-all duration-200"
              >
                <div className="flex justify-center mb-4">
                  <benefit.icon className="h-8 w-8 text-[var(--primary-accent2)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Success Metrics */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--secondary-black)] mb-4">
              Real Results from Real Data
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Suppliers using our analytics platform see measurable improvements
              in their business performance and profitability.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="text-3xl font-bold text-[var(--primary-accent2)] mb-2">
                35%
              </div>
              <div className="text-sm font-medium text-gray-800 mb-2">
                Revenue Increase
              </div>
              <div className="text-xs text-gray-600">Average in first year</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-[var(--primary-accent2)] mb-2">
                28%
              </div>
              <div className="text-sm font-medium text-gray-800 mb-2">
                Cost Reduction
              </div>
              <div className="text-xs text-gray-600">Through optimization</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-[var(--primary-accent2)] mb-2">
                92%
              </div>
              <div className="text-sm font-medium text-gray-800 mb-2">
                Forecast Accuracy
              </div>
              <div className="text-xs text-gray-600">Demand prediction</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-[var(--primary-accent2)] mb-2">
                15hrs
              </div>
              <div className="text-sm font-medium text-gray-800 mb-2">
                Time Saved
              </div>
              <div className="text-xs text-gray-600">Per week on analysis</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-black to-black/90 text-white px-8 md:px-14 py-12 md:py-16">
            <div className="max-w-5xl">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Ready to Unlock Your Business Potential?
              </h3>
              <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Stop guessing and start knowing. With Procur's analytics
                platform, you'll have the insights you need to make smarter
                decisions, increase profits, and grow your business with
                confidence.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
                <a
                  href="/signup?type=supplier"
                  className="btn btn-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  Start Your Analytics Journey
                </a>
                <a
                  href="https://calendly.com/procur-analytics-demo"
                  className="btn btn-ghost text-white border-white px-8 md:px-10 py-3 md:py-4 text-base md:text-lg"
                >
                  See Analytics Demo
                </a>
              </div>

              {/* Analytics Highlights */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Real-Time Data</h4>
                  <p className="text-sm text-white/80">
                    Get up-to-the-minute insights into your business performance
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Custom Reports</h4>
                  <p className="text-sm text-white/80">
                    Create reports tailored to your specific business needs
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2">Expert Support</h4>
                  <p className="text-sm text-white/80">
                    Get help interpreting data and implementing insights
                  </p>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
