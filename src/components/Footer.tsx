import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/30 py-12 px-4">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold">StyleAI</span>
          </div>
          <p className="text-sm text-muted-foreground">Your AI-powered fashion assistant. Discover outfits that match your style, occasion, and personality.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/" className="hover:text-foreground transition-colors">Home</a></li>
            <li><a href="/recommend" className="hover:text-foreground transition-colors">Get Recommendations</a></li>
            <li><a href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">About</h4>
          <p className="text-sm text-muted-foreground">Smart Garment Recommendation System — an AI-powered platform for personalized fashion advice.</p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} StyleAI. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
