import { supabase } from './supabase';

export interface Guest {
  id: string;
  name: string;
  family: string;
  status: 'pending' | 'confirmed' | 'declined';
  confirmedCount: number;
  totalGuests: number;
  phone?: string;
  confirmedGuests?: string[];
}

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const parseConfirmedGuests = (raw: any): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      return [raw].filter(Boolean);
    } catch {
      return raw.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

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
      phone: g.phone,
      confirmedGuests: parseConfirmedGuests(g.confirmed_guests)
    }));
  },

  addGuest: async (guest: Omit<Guest, 'id'>) => {
    const insertData: any = {
      name: guest.name,
      family: guest.family,
      status: guest.status,
      confirmed_count: guest.confirmedCount,
      total_guests: guest.totalGuests,
      phone: guest.phone
    };

    if (guest.confirmedGuests && guest.confirmedGuests.length > 0) {
      insertData.confirmed_guests = guest.confirmedGuests;
    }

    try {
      const { data, error } = await supabase
        .from('guest_list')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        if (insertData.confirmed_guests && (error.message?.includes('column') || error.code === 'PGRST204')) {
          const { confirmed_guests, ...fallbackData } = insertData;
          const { data: fbData, error: fbError } = await supabase
            .from('guest_list')
            .insert([fallbackData])
            .select()
            .single();
          if (fbError) throw fbError;
          return fbData;
        }
        console.error('Error adding guest:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error adding guest:', error);
      throw error;
    }
  },

  updateGuestStatus: async (
    id: string, 
    status: Guest['status'], 
    confirmedCount: number, 
    confirmedGuests?: string[]
  ) => {
    const updateData: any = { 
      status, 
      confirmed_count: confirmedCount 
    };

    if (confirmedGuests !== undefined) {
      updateData.confirmed_guests = confirmedGuests;
    }

    try {
      const { error } = await supabase
        .from('guest_list')
        .update(updateData)
        .eq('id', id);

      if (error) {
        if (updateData.confirmed_guests && (error.message?.includes('column') || error.code === 'PGRST204')) {
          console.warn('Column confirmed_guests might not exist in Supabase yet. Updating base columns.', error);
          const { error: fallbackError } = await supabase
            .from('guest_list')
            .update({
              status,
              confirmed_count: confirmedCount
            })
            .eq('id', id);
          if (fallbackError) throw fallbackError;
          return;
        }
        console.error('Error updating guest status:', error);
        throw error;
      }
    } catch (error) {
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
    if (guest.confirmedGuests !== undefined) updateData.confirmed_guests = guest.confirmedGuests;

    try {
      const { error } = await supabase
        .from('guest_list')
        .update(updateData)
        .eq('id', id);

      if (error) {
        if (updateData.confirmed_guests && (error.message?.includes('column') || error.code === 'PGRST204')) {
          console.warn('Column confirmed_guests might not exist in Supabase yet. Updating without confirmed_guests.', error);
          const { confirmed_guests, ...fallbackData } = updateData;
          const { error: fallbackError } = await supabase
            .from('guest_list')
            .update(fallbackData)
            .eq('id', id);
          if (fallbackError) throw fallbackError;
          return;
        }
        console.error('Error updating guest:', error);
        throw error;
      }
    } catch (error) {
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
    const { data, error } = await supabase
      .from('guest_list')
      .select('*');

    if (error) {
      console.error('Error searching guests:', error);
      return [];
    }

    const normalizedQuery = normalizeText(query);

    const filtered = data.filter(g => {
      const normalizedName = normalizeText(g.name || "");
      const normalizedFamily = normalizeText(g.family || "");
      return normalizedName.includes(normalizedQuery) || normalizedFamily.includes(normalizedQuery);
    });

    return filtered.map(g => ({
      id: g.id,
      name: g.name,
      family: g.family,
      status: g.status,
      confirmedCount: g.confirmed_count,
      totalGuests: g.total_guests,
      phone: g.phone,
      confirmedGuests: parseConfirmedGuests(g.confirmed_guests)
    }));
  }
};


