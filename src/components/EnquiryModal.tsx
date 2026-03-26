import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateEnquiry, type Pet } from "@/hooks/use-data";
import { PawPrint, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface EnquiryModalProps {
  pet: Pet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EnquiryModal({ pet, open, onOpenChange }: EnquiryModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const createEnquiry = useCreateEnquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet) return;
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await createEnquiry.mutateAsync({ name: name.trim(), phone: phone.trim(), message: message.trim(), pet_id: pet.id });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setPhone("");
        setMessage("");
        onOpenChange(false);
      }, 2000);
    } catch {
      toast.error("Failed to send enquiry. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle2 className="h-16 w-16 text-accent-foreground" />
              </motion.div>
              <h3 className="font-display text-xl font-bold">Enquiry Sent! 🎉</h3>
              <p className="text-center text-sm text-muted-foreground">
                We'll get back to you soon about {pet?.name}!
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-display">
                  <PawPrint className="h-5 w-5 text-primary" />
                  Enquire about {pet?.name}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="mt-1 rounded-xl" required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" className="mt-1 rounded-xl" required />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="I'd love to know more about this pet..." className="mt-1 rounded-xl" rows={3} />
                </div>
                <Button type="submit" className="w-full" disabled={createEnquiry.isPending}>
                  {createEnquiry.isPending ? "Sending..." : "Send Enquiry 💌"}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
