import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ktezclohitsiegzhhhgo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzAyOTE0MiwiZXhwIjoyMDQ4NjA1MTQyfQ.JuqsO0J67NiPblAc6oYlJwgHRbMfS3vorbmnNzb4jhI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fetch dashboard data
export const fetchDashboardData = async () => {
  try {
    // Get counts from various tables
    const [
      { count: totalProducts, error: productsError },
      { count: totalUsers, error: usersError }
    ] = await Promise.all([
      supabase.from('items').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true })
    ]);

    if (productsError) throw productsError;
    if (usersError) throw usersError;

    // Mock total sales for now (could be calculated from actual sales table)
    const totalSales = 15250.75;

    return {
      totalProducts,
      totalUsers,
      totalSales
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
};

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
    return { error };
  }
  return data;
};

// Insert a new record into the Supabase table
export const insertRecord = async (table, newRecord) => {
  const { data, error } = await supabase.from(table).insert([newRecord]);
  if (error) {
    console.error(`Error inserting into ${table}:`, error);
    return { error };
  }
  return data;
};

// Delete a record from a Supabase table
export const deleteRecord = async (table, id) => {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  if (error) {
    console.error(`Error deleting from ${table}:`, error);
    return { error };
  }
  return data;
};

// Fetch reports (mock data for now)
export const fetchReports = async () => {
  // In a real implementation, this would fetch from a reports table
  // For now, return mock data
  return [
    { id: '1', title: 'Suspicious Listing Report', date: '2025-05-15', status: 'Pending' },
    { id: '2', title: 'Payment Processing Issue', date: '2025-05-10', status: 'In Progress' },
    { id: '3', title: 'User Verification Request', date: '2025-05-01', status: 'Resolved' },
    { id: '4', title: 'Product Quality Complaint', date: '2025-04-28', status: 'Pending' },
    { id: '5', title: 'Delivery Delay Report', date: '2025-04-25', status: 'Resolved' }
  ];
};