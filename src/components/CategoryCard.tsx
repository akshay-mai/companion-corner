import { motion } from "framer-motion";
import { getCategoryIcon } from "@/lib/categories";
import type { Category } from "@/hooks/use-data";

const bgColors = [
  "bg-primary/10",
  "bg-secondary/60",
  "bg-accent/60",
  "bg-lavender/40",
  "bg-peach/40",
  "bg-sunshine/40",
];

interface CategoryCardProps {
  category: Category;
  index: number;
  onClick?: () => void;
}

export default function CategoryCard({ category, index, onClick }: CategoryCardProps) {
  const Icon = getCategoryIcon(category.name);
  const bg = bgColors[index % bgColors.length];

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`flex flex-col items-center gap-3 rounded-2xl ${bg} p-6 shadow-cute transition-shadow hover:shadow-cute-hover`}
    >
      <Icon className="h-10 w-10 text-foreground/70" />
      <span className="font-display text-sm font-bold">{category.name}</span>
    </motion.button>
  );
}
