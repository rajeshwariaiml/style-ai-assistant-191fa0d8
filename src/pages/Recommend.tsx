import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wand2, X } from "lucide-react";
import GarmentCard from "@/components/GarmentCard";
import { getLocalRecommendations, type UserPreferences } from "@/lib/garment-data";
import type { Garment } from "@/components/GarmentCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const colors = ["Red", "Blue", "Black", "White", "Green", "Pink", "Navy", "Beige", "Gold", "Maroon", "Yellow", "Multi"];
const occasions = ["Casual", "Party", "Office", "Wedding", "Travel"];
const seasons = ["Summer", "Winter", "Monsoon"];
const clothingTypes = ["Traditional", "Western", "Sportswear", "Formal"];
const budgets = ["Under ₹1,000", "₹1,000–₹3,000", "₹3,000–₹5,000", "₹5,000–₹10,000", "Above ₹10,000"];

const Recommend = () => {
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({ preferred_colors: [] });
  const [results, setResults] = useState<Garment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleColor = (c: string) => {
    const current = prefs.preferred_colors ?? [];
    setPrefs({
      ...prefs,
      preferred_colors: current.includes(c) ? current.filter(x => x !== c) : [...current, c],
    });
  };

  const handleSubmit = async () => {
    if (!prefs.gender || !prefs.occasion || !prefs.season || !prefs.clothing_type) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    // Use local recommendation engine
    const recs = getLocalRecommendations(prefs as UserPreferences);
    setResults(recs);
    setLoading(false);
  };

  const handleSave = async (garment: Garment) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Please login to save favorites", description: "Create an account to save your favorite outfits." });
      navigate("/login");
      return;
    }
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(garment.id)) { next.delete(garment.id); } else { next.add(garment.id); }
      return next;
    });
    toast({ title: savedIds.has(garment.id) ? "Removed from favorites" : "Saved to favorites!" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10 animate-fade-up">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Get Your Style Recommendations</h1>
            <p className="text-muted-foreground">Tell us your preferences and our AI will find the perfect outfits for you.</p>
          </div>

          {!results ? (
            <div className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-6 animate-fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select onValueChange={v => setPrefs({ ...prefs, gender: v })}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Unisex">Non-binary / Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Age Group</Label>
                  <Select onValueChange={v => setPrefs({ ...prefs, age_group: v })}>
                    <SelectTrigger><SelectValue placeholder="Select age group" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-25">18–25</SelectItem>
                      <SelectItem value="26-35">26–35</SelectItem>
                      <SelectItem value="36-45">36–45</SelectItem>
                      <SelectItem value="46+">46+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Occasion *</Label>
                  <Select onValueChange={v => setPrefs({ ...prefs, occasion: v })}>
                    <SelectTrigger><SelectValue placeholder="Select occasion" /></SelectTrigger>
                    <SelectContent>
                      {occasions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Season *</Label>
                  <Select onValueChange={v => setPrefs({ ...prefs, season: v })}>
                    <SelectTrigger><SelectValue placeholder="Select season" /></SelectTrigger>
                    <SelectContent>
                      {seasons.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Clothing Type *</Label>
                  <Select onValueChange={v => setPrefs({ ...prefs, clothing_type: v })}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {clothingTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <Select onValueChange={v => setPrefs({ ...prefs, budget: v })}>
                    <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                    <SelectContent>
                      {budgets.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(c => (
                    <Badge
                      key={c}
                      variant={prefs.preferred_colors?.includes(c) ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => toggleColor(c)}
                    >
                      {c}
                      {prefs.preferred_colors?.includes(c) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={loading} size="lg" className="w-full gap-2">
                <Wand2 className="h-4 w-4" />
                {loading ? "Finding Your Style..." : "Get Recommendations"}
              </Button>
            </div>
          ) : (
            <div className="animate-fade-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">Your Recommendations</h2>
                <Button variant="outline" onClick={() => setResults(null)}>New Search</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {results.map(g => (
                  <GarmentCard key={g.id} garment={g} onSave={handleSave} isSaved={savedIds.has(g.id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Recommend;
