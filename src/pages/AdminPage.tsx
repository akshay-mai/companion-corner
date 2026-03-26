import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory,
  usePets, useCreatePet, useUpdatePet, useDeletePet,
  useEnquiries,
  type Category, type Pet,
} from "@/hooks/use-data";

function CategoryManager() {
  const { data: categories, isLoading } = useCategories();
  const createCat = useCreateCategory();
  const updateCat = useUpdateCategory();
  const deleteCat = useDeleteCategory();
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) return;
    await createCat.mutateAsync(name.trim());
    setName("");
    toast.success("Category added!");
  };

  const handleUpdate = async () => {
    if (!editId || !editName.trim()) return;
    await updateCat.mutateAsync({ id: editId, name: editName.trim() });
    setEditId(null);
    toast.success("Category updated!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Pets in this category will also be affected.")) return;
    await deleteCat.mutateAsync(id);
    toast.success("Category deleted!");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" />
        <Button onClick={handleAdd} disabled={createCat.isPending}><Plus className="mr-1 h-4 w-4" /> Add</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow><TableHead>Name</TableHead><TableHead className="w-[120px]">Actions</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>}
          {categories?.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>
                {editId === cat.id ? (
                  <div className="flex gap-2">
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 rounded-lg" />
                    <Button size="sm" onClick={handleUpdate}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>Cancel</Button>
                  </div>
                ) : (
                  cat.name
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { setEditId(cat.id); setEditName(cat.name); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PetManager() {
  const { data: pets, isLoading } = usePets();
  const { data: categories } = useCategories();
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();
  const deletePet = useDeletePet();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Pet | null>(null);
  const [form, setForm] = useState({ name: "", price: "", description: "", category_id: "", image_url: "" });

  const resetForm = () => setForm({ name: "", price: "", description: "", category_id: "", image_url: "" });

  const openEdit = (pet: Pet) => {
    setEditing(pet);
    setForm({ name: pet.name, price: String(pet.price), description: pet.description, category_id: pet.category_id, image_url: pet.image_url });
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price || !form.category_id) {
      toast.error("Please fill required fields");
      return;
    }
    const payload = { name: form.name.trim(), price: Number(form.price), description: form.description.trim(), category_id: form.category_id, image_url: form.image_url.trim() };
    if (editing) {
      await updatePet.mutateAsync({ id: editing.id, ...payload });
      toast.success("Pet updated!");
    } else {
      await createPet.mutateAsync(payload);
      toast.success("Pet added!");
    }
    setOpen(false);
    setEditing(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pet?")) return;
    await deletePet.mutateAsync(id);
    toast.success("Pet deleted!");
  };

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); resetForm(); } }}>
        <DialogTrigger asChild>
          <Button><Plus className="mr-1 h-4 w-4" /> Add Pet</Button>
        </DialogTrigger>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle className="font-display">{editing ? "Edit Pet" : "Add New Pet"}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 rounded-xl" /></div>
            <div><Label>Price *</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1 rounded-xl" /></div>
            <div>
              <Label>Category *</Label>
              <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="mt-1 rounded-xl" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 rounded-xl" rows={3} /></div>
            <Button onClick={handleSubmit} className="w-full">{editing ? "Update Pet" : "Add Pet"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pet</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>}
          {pets?.map((pet) => (
            <TableRow key={pet.id}>
              <TableCell className="flex items-center gap-3">
                {pet.image_url && <img src={pet.image_url} alt={pet.name} className="h-10 w-10 rounded-lg object-cover" />}
                <div>
                  <p className="font-semibold">{pet.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{pet.description}</p>
                </div>
              </TableCell>
              <TableCell>{pet.categories?.name}</TableCell>
              <TableCell className="font-semibold">${pet.price}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(pet)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(pet.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EnquiryManager() {
  const { data: enquiries, isLoading } = useEnquiries();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Pet</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>}
        {enquiries?.map((enq) => (
          <TableRow key={enq.id}>
            <TableCell className="font-semibold">{enq.name}</TableCell>
            <TableCell>{enq.phone}</TableCell>
            <TableCell>{enq.pets?.name || "N/A"}</TableCell>
            <TableCell className="max-w-[200px] truncate">{enq.message || "—"}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{new Date(enq.created_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
        {!isLoading && (!enquiries || enquiries.length === 0) && (
          <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No enquiries yet</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <p className="mt-1 text-muted-foreground">Manage your pet shop</p>
        </motion.div>

        <Tabs defaultValue="categories" className="mt-8">
          <TabsList className="rounded-xl bg-muted">
            <TabsTrigger value="categories" className="rounded-lg">Categories</TabsTrigger>
            <TabsTrigger value="pets" className="rounded-lg">Pets</TabsTrigger>
            <TabsTrigger value="enquiries" className="rounded-lg">Enquiries</TabsTrigger>
          </TabsList>
          <TabsContent value="categories" className="mt-6"><CategoryManager /></TabsContent>
          <TabsContent value="pets" className="mt-6"><PetManager /></TabsContent>
          <TabsContent value="enquiries" className="mt-6"><EnquiryManager /></TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
