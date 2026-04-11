import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Garment {
  id: string;
  name: string;
  category: string;
  color: string;
  season: string;
  occasion: string;
  price_range: string;
  gender: string;
  image_url: string;
  style_tags: string[];
  match_percentage?: number;
  recommendation_reason?: string;
}

interface GarmentCardProps {
  garment: Garment;
  onSave?: (garment: Garment) => void;
  isSaved?: boolean;
}

const GarmentCard = ({ garment, onSave, isSaved }: GarmentCardProps) => (
  <div className="group rounded-lg overflow-hidden bg-card border border-border card-hover">
    <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
      <img
        src={garment.image_url}
        alt={garment.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {garment.match_percentage && (
        <div className="absolute top-3 left-3">
          <Badge className="bg-primary text-primary-foreground font-semibold text-xs px-2 py-1">
            <Star className="h-3 w-3 mr-1" />
            {garment.match_percentage}% Match
          </Badge>
        </div>
      )}
      {onSave && (
        <button
          onClick={() => onSave(garment)}
          className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      )}
    </div>
    <div className="p-4 space-y-2">
      <div className="flex items-start justify-between">
        <h3 className="font-display font-semibold text-card-foreground text-sm leading-tight">{garment.name}</h3>
        <span className="text-xs font-medium text-primary ml-2 whitespace-nowrap">{garment.price_range}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        <Badge variant="secondary" className="text-xs">{garment.category}</Badge>
        <Badge variant="outline" className="text-xs">{garment.occasion}</Badge>
      </div>
      {garment.recommendation_reason && (
        <p className="text-xs text-muted-foreground leading-relaxed">{garment.recommendation_reason}</p>
      )}
    </div>
  </div>
);

export default GarmentCard;
