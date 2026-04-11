import type { Garment } from "@/components/GarmentCard";

export const sampleGarments: Garment[] = [
  { id: "1", name: "Classic Linen Blazer", category: "Formal", color: "Beige", season: "Summer", occasion: "Office", price_range: "₹2,500–₹4,000", gender: "Unisex", image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop", style_tags: ["minimal", "elegant"] },
  { id: "2", name: "Floral Maxi Dress", category: "Western", color: "Pink", season: "Summer", occasion: "Casual", price_range: "₹1,500–₹2,500", gender: "Female", image_url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=600&fit=crop", style_tags: ["bohemian", "floral"] },
  { id: "3", name: "Tailored Navy Suit", category: "Formal", color: "Navy", season: "Winter", occasion: "Office", price_range: "₹5,000–₹8,000", gender: "Male", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", style_tags: ["classic", "power"] },
  { id: "4", name: "Embroidered Kurta Set", category: "Traditional", color: "White", season: "Summer", occasion: "Wedding", price_range: "₹3,000–₹5,000", gender: "Male", image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop", style_tags: ["ethnic", "festive"] },
  { id: "5", name: "Silk Saree", category: "Traditional", color: "Red", season: "Winter", occasion: "Wedding", price_range: "₹4,000–₹10,000", gender: "Female", image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop", style_tags: ["bridal", "luxury"] },
  { id: "6", name: "Performance Track Suit", category: "Sportswear", color: "Black", season: "Monsoon", occasion: "Travel", price_range: "₹2,000–₹3,500", gender: "Unisex", image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop", style_tags: ["athletic", "comfort"] },
  { id: "7", name: "Casual Denim Jacket", category: "Western", color: "Blue", season: "Winter", occasion: "Casual", price_range: "₹2,000–₹3,000", gender: "Unisex", image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop", style_tags: ["streetwear", "layering"] },
  { id: "8", name: "Cocktail Sequin Dress", category: "Western", color: "Gold", season: "Winter", occasion: "Party", price_range: "₹3,500–₹6,000", gender: "Female", image_url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=600&fit=crop", style_tags: ["glamour", "evening"] },
  { id: "9", name: "Cotton Polo Shirt", category: "Western", color: "Green", season: "Summer", occasion: "Casual", price_range: "₹800–₹1,500", gender: "Male", image_url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=600&fit=crop", style_tags: ["preppy", "smart-casual"] },
  { id: "10", name: "Anarkali Suit", category: "Traditional", color: "Maroon", season: "Winter", occasion: "Party", price_range: "₹3,000–₹5,500", gender: "Female", image_url: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=600&fit=crop", style_tags: ["festive", "elegant"] },
  { id: "11", name: "Lightweight Rain Jacket", category: "Sportswear", color: "Yellow", season: "Monsoon", occasion: "Travel", price_range: "₹1,500–₹2,500", gender: "Unisex", image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=600&fit=crop", style_tags: ["functional", "outdoor"] },
  { id: "12", name: "Printed Palazzo Set", category: "Western", color: "Multi", season: "Summer", occasion: "Casual", price_range: "₹1,200–₹2,000", gender: "Female", image_url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop", style_tags: ["relaxed", "boho"] },
];

export interface UserPreferences {
  gender: string;
  age_group: string;
  occasion: string;
  season: string;
  preferred_colors: string[];
  clothing_type: string;
  budget: string;
}

export function getLocalRecommendations(prefs: UserPreferences): Garment[] {
  const scored = sampleGarments.map((g) => {
    let score = 0;
    if (g.gender.toLowerCase() === prefs.gender.toLowerCase() || g.gender === "Unisex") score += 20;
    if (g.occasion.toLowerCase() === prefs.occasion.toLowerCase()) score += 25;
    if (g.season.toLowerCase() === prefs.season.toLowerCase()) score += 20;
    if (prefs.preferred_colors.some(c => g.color.toLowerCase().includes(c.toLowerCase()))) score += 15;
    if (g.category.toLowerCase() === prefs.clothing_type.toLowerCase()) score += 20;
    // budget bonus
    score = Math.min(score, 98);
    if (score < 20) score = Math.floor(Math.random() * 20) + 20;

    const reasons: string[] = [];
    if (g.occasion.toLowerCase() === prefs.occasion.toLowerCase()) reasons.push(`perfect for ${prefs.occasion}`);
    if (g.season.toLowerCase() === prefs.season.toLowerCase()) reasons.push(`ideal for ${prefs.season}`);
    if (prefs.preferred_colors.some(c => g.color.toLowerCase().includes(c.toLowerCase()))) reasons.push(`matches your color preference`);
    if (g.category.toLowerCase() === prefs.clothing_type.toLowerCase()) reasons.push(`fits your ${prefs.clothing_type} style`);

    return {
      ...g,
      match_percentage: score,
      recommendation_reason: reasons.length > 0 ? `Recommended because it's ${reasons.join(", ")}.` : "A versatile piece that complements various styles.",
    };
  });

  return scored.sort((a, b) => (b.match_percentage ?? 0) - (a.match_percentage ?? 0)).slice(0, 8);
}
