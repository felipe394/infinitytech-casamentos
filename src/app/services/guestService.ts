import { supabase } from './supabase';

export interface Guest {
  id: string;
  name: string;
  family: string;
  status: 'pending' | 'confirmed' | 'declined';
  confirmedCount: number;
  totalGuests: number;
  phone?: string;
}

export const guestService = {
  getGuests: async (): Promise<Guest[]> => {
    const { data, error } = await supabase
      .from('guest_list')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching guests:', error);
      return [];
    }
    
    return data.map(g => ({
      id: g.id,
      name: g.name,
      family: g.family,
      status: g.status,
      confirmedCount: g.confirmed_count,
      totalGuests: g.total_guests,
      phone: g.phone
    }));
  },

  addGuest: async (guest: Omit<Guest, 'id'>) => {
    const { data, error } = await supabase
      .from('guest_list')
      .insert([{
        name: guest.name,
        family: guest.family,
        status: guest.status,
        confirmed_count: guest.confirmedCount,
        total_guests: guest.totalGuests,
        phone: guest.phone
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding guest:', error);
      throw error;
    }
    return data;
  },

  updateGuestStatus: async (id: string, status: Guest['status'], confirmedCount: number) => {
    const { error } = await supabase
      .from('guest_list')
      .update({ 
        status, 
        confirmed_count: confirmedCount 
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating guest status:', error);
      throw error;
    }
  },

  updateGuest: async (id: string, guest: Partial<Omit<Guest, 'id'>>) => {
    const updateData: any = {};
    if (guest.name !== undefined) updateData.name = guest.name;
    if (guest.family !== undefined) updateData.family = guest.family;
    if (guest.status !== undefined) updateData.status = guest.status;
    if (guest.confirmedCount !== undefined) updateData.confirmed_count = guest.confirmedCount;
    if (guest.totalGuests !== undefined) updateData.total_guests = guest.totalGuests;
    if (guest.phone !== undefined) updateData.phone = guest.phone;

    const { error } = await supabase
      .from('guest_list')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
  },

  deleteGuest: async (id: string) => {
    const { error } = await supabase
      .from('guest_list')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting guest:', error);
      throw error;
    }
  },

  searchGuests: async (query: string): Promise<Guest[]> => {
    const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Using ilike for search. Note: Supabase/Postgres search can be complex with normalized names,
    // but for now we'll do a simple case-insensitive match on name and family.
    const { data, error } = await supabase
      .from('guest_list')
      .select('*')
      .or(`name.ilike.%${query}%,family.ilike.%${query}%`);

    if (error) {
      console.error('Error searching guests:', error);
      return [];
    }

    return data.map(g => ({
      id: g.id,
      name: g.name,
      family: g.family,
      status: g.status,
      confirmedCount: g.confirmed_count,
      totalGuests: g.total_guests,
      phone: g.phone
    }));
  }
};
