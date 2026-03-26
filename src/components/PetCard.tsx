import { motion } from "framer-motion";
import type { Pet } from "@/hooks/use-data";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface PetCardProps {
  pet: Pet;
  onEnquire: (pet: Pet) => void;
  index?: number;
}

export default function PetCard({ pet, onEnquire, index = 0 }: PetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group overflow-hidden rounded-2xl border border-border/50 bg-card shadow-cute transition-shadow duration-300 hover:shadow-cute-hover"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={pet.image_url || "/placeholder.svg"}
          alt={pet.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute right-3 top-3 rounded-full bg-card/80 p-2 backdrop-blur-sm">
          <Heart className="h-4 w-4 text-primary" />
        </div>
        {pet.categories && (
          <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
            {pet.categories.name}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-bold text-foreground">{pet.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{pet.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-primary">${pet.price}</span>
          <Button size="sm" onClick={() => onEnquire(pet)}>
            Enquire
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
