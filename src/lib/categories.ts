import { Dog, Cat, Bird, Fish, Rabbit, Turtle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  Dogs: Dog,
  Cats: Cat,
  Birds: Bird,
  Fish: Fish,
  Rabbits: Rabbit,
  Reptiles: Turtle,
};

export function getCategoryIcon(name: string): LucideIcon {
  return categoryIcons[name] || Dog;
}

export const categoryColors = [
  "gradient-card-pink",
  "gradient-card-blue", 
  "gradient-card-mint",
  "gradient-card-pink",
  "gradient-card-blue",
  "gradient-card-mint",
];
