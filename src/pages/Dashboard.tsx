import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, Clock, Heart } from "lucide-react";
import GarmentCard from "@/components/GarmentCard";
import { sampleGarments } from "@/lib/garment-data";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/login");
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/login");
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse-soft" />
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Fashionista";
  // Simulated data for demo
  const recentlyViewed = sampleGarments.slice(0, 4).map(g => ({ ...g, match_percentage: Math.floor(Math.random() * 20) + 75 }));
  const suggestions = sampleGarments.slice(4, 8).map(g => ({ ...g, match_percentage: Math.floor(Math.random() * 15) + 82 }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-10 animate-fade-up">
            <h1 className="font-display text-3xl font-bold mb-1">Hello, {displayName}!</h1>
            <p className="text-muted-foreground">Here's your personalized fashion dashboard.</p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <Link to="/recommend" className="p-6 rounded-lg bg-card border border-border card-hover flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wand2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm">New Recommendation</h3>
                <p className="text-xs text-muted-foreground">Get fresh outfit suggestions</p>
              </div>
            </Link>
            <div className="p-6 rounded-lg bg-card border border-border flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm">Saved Favorites</h3>
                <p className="text-xs text-muted-foreground">0 items saved</p>
              </div>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm">Recent Searches</h3>
                <p className="text-xs text-muted-foreground">Browse history</p>
              </div>
            </div>
          </div>

          {/* Recently Viewed */}
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {recentlyViewed.map(g => <GarmentCard key={g.id} garment={g} />)}
            </div>
          </section>

          {/* Personalized Suggestions */}
          <section>
            <h2 className="font-display text-xl font-bold mb-6">Personalized For You</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {suggestions.map(g => <GarmentCard key={g.id} garment={g} />)}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
