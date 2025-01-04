// database.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ktezclohitsiegzhhhgo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzAyOTE0MiwiZXhwIjoyMDQ4NjA1MTQyfQ.JuqsO0J67NiPblAc6oYlJwgHRbMfS3vorbmnNzb4jhI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fetch data from the 'category' table
export const fetchCategories = async () => {
    const { data, error } = await supabase.from('category').select('*');
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return data;
  };
  
  // Fetch data from the 'users' table
  export const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    return data;
  };
  
  // Fetch data from the 'items' table
  export const fetchItems = async () => {
    const { data, error } = await supabase.from('items').select('*');
    if (error) {
      console.error('Error fetching items:', error);
      return [];
    }
    return data;
  };
  
  // Update an entry in the Supabase table
  export const updateRecord = async (table, id, updatedData) => {
    const { data, error } = await supabase
      .from(table)
      .update(updatedData)
      .eq('id', id);
    if (error) {
      console.error(`Error updating ${table}:`, error);
      return null;
    }
    return data;
  };
  
  // Insert a new record into the Supabase table
  export const insertRecord = async (table, newRecord) => {
    const { data, error } = await supabase.from(table).insert([newRecord]);
    if (error) {
      console.error(`Error inserting into ${table}:`, error);
      return null;
    }
    return data;
  };