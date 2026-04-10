import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PawPrint, Heart, Star, Phone, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import PetCard from "@/components/PetCard";
import EnquiryModal from "@/components/EnquiryModal";
import { useCategories, usePets, type Pet } from "@/hooks/use-data";
import { useState } from "react";
import heroImg from "@/assets/hero-pets.jpg";

export default function Index() {
  const { data: categories } = useCategories();
  const { data: pets } = usePets();
  const [enquiryPet, setEnquiryPet] = useState<Pet | null>(null);
  const featuredPets = pets?.slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="container mx-auto flex flex-col items-center gap-8 px-4 py-16 md:flex-row md:py-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-left"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <PawPrint className="h-4 w-4" /> Amazing Pet Wala
            </div>
            <h1 className="text-4xl font-black leading-tight text-foreground md:text-5xl lg:text-6xl">
              Find Your Perfect{" "}
              <span className="text-primary">Companion</span>{" "}
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="inline-block"
              >
                🐾
              </motion.span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              Discover adorable pets waiting for their forever homes. Every furry, feathery, or scaly friend deserves love!
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link to="/browse">
                <Button variant="hero" size="lg">Browse Pets</Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2">
                <Heart className="h-4 w-4" /> Learn More
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground md:justify-start">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-sunshine text-sunshine" /> 4.9 Rating</span>
              <span>•</span>
              <span>500+ Happy Families</span>
              <span>•</span>
              <span>100+ Pets</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            <motion.img
              src={heroImg}
              alt="Cute pets together"
              className="mx-auto max-w-md rounded-3xl shadow-cute-hover"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
        {/* Decorative paws */}
        <div className="pointer-events-none absolute -bottom-2 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold md:text-4xl">
              Browse by <span className="text-primary">Category</span>
            </h2>
            <p className="mt-2 text-muted-foreground">Find the perfect pet that matches your lifestyle</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories?.map((cat, i) => (
              <Link key={cat.id} to={`/browse?category=${cat.id}`}>
                <CategoryCard category={cat} index={i} />
              </Link>
            ))}
          </div>
          {(!categories || categories.length === 0) && (
            <p className="text-center text-muted-foreground">No categories yet. Add some in the admin panel!</p>
          )}
        </div>
      </section>

      {/* Featured Pets */}
      {featuredPets.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 text-center"
            >
              <h2 className="text-3xl font-bold md:text-4xl">
                Meet Our <span className="text-primary">Stars</span> ⭐
              </h2>
              <p className="mt-2 text-muted-foreground">These cuties are looking for their forever home</p>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredPets.map((pet, i) => (
                <PetCard key={pet.id} pet={pet} index={i} onEnquire={setEnquiryPet} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/browse">
                <Button variant="outline" size="lg">View All Pets →</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact / Location Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold md:text-4xl">
              Visit <span className="text-primary">Us</span> 📍
            </h2>
            <p className="mt-2 text-muted-foreground">Come say hello to our furry friends!</p>
          </motion.div>
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-cute">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Our Location</p>
                  <p className="text-muted-foreground">Ramesh Nagar Metro Station near Kesar Chai Wala</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Call Us</p>
                  <p className="text-muted-foreground">+91 85879 44627</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <a href="tel:+918587944627">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Phone className="h-4 w-4" /> Call Us
                  </Button>
                </a>
                <a href="https://wa.me/918587944627" target="_blank" rel="noopener noreferrer">
                  <Button variant="hero" size="lg" className="gap-2 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)]">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <EnquiryModal pet={enquiryPet} open={!!enquiryPet} onOpenChange={(o) => !o && setEnquiryPet(null)} />
    </div>
  );
}
