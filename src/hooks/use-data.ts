import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Pet {
  id: string;
  name: string;
  price: number;
  description: string;
  category_id: string;
  image_url: string;
  created_at: string;
  categories?: Category;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  pet_id: string;
  created_at: string;
  pets?: Pet;
}

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase.from("categories").insert({ name }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from("categories").update({ name }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

// Pets
export function usePets(categoryId?: string) {
  return useQuery({
    queryKey: ["pets", categoryId],
    queryFn: async () => {
      let q = supabase.from("pets").select("*, categories(*)").order("created_at", { ascending: false });
      if (categoryId) q = q.eq("category_id", categoryId);
      const { data, error } = await q;
      if (error) throw error;
      return data as Pet[];
    },
  });
}

export function useCreatePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pet: Omit<Pet, "id" | "created_at" | "categories">) => {
      const { data, error } = await supabase.from("pets").insert(pet).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pets"] }),
  });
}

export function useUpdatePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...pet }: Partial<Pet> & { id: string }) => {
      const { error } = await supabase.from("pets").update(pet).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pets"] }),
  });
}

export function useDeletePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pets"] }),
  });
}

// Enquiries
export function useEnquiries() {
  return useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*, pets(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Enquiry[];
    },
  });
}

export function useCreateEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (enquiry: { name: string; phone: string; message: string; pet_id: string }) => {
      const { data, error } = await supabase.from("enquiries").insert(enquiry).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enquiries"] }),
  });
}
