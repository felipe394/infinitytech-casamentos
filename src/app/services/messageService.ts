import { supabase } from "./supabase";

export interface WeddingMessage {
  id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

export const messageService = {
  async getMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data as WeddingMessage[];
  },

  async saveMessage(sender_name: string, message: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ sender_name, message }])
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      throw error;
    }

    return data as WeddingMessage;
  },

  async deleteMessage(id: string) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
};
