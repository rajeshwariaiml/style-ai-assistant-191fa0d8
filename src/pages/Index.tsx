import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, Heart, TrendingUp, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GarmentCard from "@/components/GarmentCard";
import { sampleGarments } from "@/lib/garment-data";

const features = [
  { icon: Wand2, title: "AI-Powered Styling", desc: "Our intelligent engine analyzes your preferences to find the perfect match." },
  { icon: Heart, title: "Personalized Picks", desc: "Recommendations tailored to your body type, occasion, and color choices." },
  { icon: TrendingUp, title: "Trending Styles", desc: "Stay ahead with curated selections based on the latest fashion trends." },
];

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    {/* Hero */}
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-fashion-blush via-background to-fashion-cream -z-10" />
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl -z-10" />

      <div className="container mx-auto text-center max-w-3xl animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" /> AI-Powered Fashion
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
          Find Your Perfect Outfit<br />
          <span className="text-gradient">with AI</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
          Discover clothing recommendations personalized to your style, occasion, and preferences. Let our smart engine be your fashion assistant.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/recommend">
            <Button size="lg" className="gap-2 px-8">
              <Wand2 className="h-4 w-4" /> Start Recommendation
            </Button>
          </Link>
          <Link to="/recommend">
            <Button size="lg" variant="outline" className="gap-2 px-8">
              Explore Styles <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <h2 className="font-display text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="text-center p-8 rounded-lg bg-card border border-border card-hover" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Trending */}
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-3xl font-bold">Trending Now</h2>
          <Link to="/recommend" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {sampleGarments.slice(0, 4).map((g) => (
            <GarmentCard key={g.id} garment={{ ...g, match_percentage: Math.floor(Math.random() * 20) + 80 }} />
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-4 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
      <div className="container mx-auto text-center max-w-2xl">
        <h2 className="font-display text-3xl font-bold mb-4">Ready to Discover Your Style?</h2>
        <p className="text-muted-foreground mb-8">Answer a few questions and let our AI find the perfect outfits for you.</p>
        <Link to="/recommend">
          <Button size="lg" className="gap-2 px-8">
            <Sparkles className="h-4 w-4" /> Get Started Free
          </Button>
        </Link>
      </div>
    </section>

    <Footer />
  </div>
);

export default Index;
