import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PetCard from "@/components/PetCard";
import EnquiryModal from "@/components/EnquiryModal";
import { useCategories, usePets, type Pet } from "@/hooks/use-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { data: categories } = useCategories();
  const { data: pets, isLoading } = usePets();
  const [enquiryPet, setEnquiryPet] = useState<Pet | null>(null);

  const filtered = useMemo(() => {
    if (!pets) return [];
    return pets.filter((p) => {
      if (category && p.category_id !== category) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    });
  }, [pets, category, search, maxPrice]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold md:text-4xl">
            Browse <span className="text-primary">Pets</span> 🐾
          </h1>
          <p className="mt-2 text-muted-foreground">Find your new best friend</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 flex flex-wrap gap-3"
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search pets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl pl-10"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={maxPrice} onValueChange={setMaxPrice}>
            <SelectTrigger className="w-[160px] rounded-xl">
              <SelectValue placeholder="Max Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Price</SelectItem>
              <SelectItem value="100">Under $100</SelectItem>
              <SelectItem value="500">Under $500</SelectItem>
              <SelectItem value="1000">Under $1000</SelectItem>
              <SelectItem value="5000">Under $5000</SelectItem>
            </SelectContent>
          </Select>
          {(category || search || maxPrice) && (
            <Button variant="ghost" size="sm" onClick={() => { setCategory(""); setSearch(""); setMaxPrice(""); }}>
              Clear filters
            </Button>
          )}
        </motion.div>

        {/* Results */}
        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((pet, i) => (
                <PetCard key={pet.id} pet={pet} index={i} onEnquire={setEnquiryPet} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-5xl">🐾</p>
              <h3 className="mt-4 font-display text-xl font-bold">No pets found</h3>
              <p className="mt-1 text-muted-foreground">Try adjusting your filters or check back later!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <EnquiryModal pet={enquiryPet} open={!!enquiryPet} onOpenChange={(o) => !o && setEnquiryPet(null)} />
    </div>
  );
}
