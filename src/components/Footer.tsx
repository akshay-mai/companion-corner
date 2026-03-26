import { PawPrint, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30 py-8">
      <div className="container mx-auto flex flex-col items-center gap-3 px-4 text-center">
        <div className="flex items-center gap-2 font-display text-lg font-bold text-primary">
          <PawPrint className="h-5 w-5" />
          PawPals
        </div>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          Made with <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> for pet lovers
        </p>
        <p className="text-xs text-muted-foreground/60">© 2026 PawPals. All rights reserved.</p>
      </div>
    </footer>
  );
}
