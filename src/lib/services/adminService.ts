import { supabase } from '../supabase';

export async function loginAdmin(email: string, password: string) {
  // Login via Supabase Auth
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // Get logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error('Unable to verify user');
  }

  // Verify admin access
  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('*')
    .eq('email', user.email)
    .single();

  if (adminError || !admin) {
    await supabase.auth.signOut();

    throw new Error('You do not have admin access');
  }

  return admin;
}

export async function logoutAdmin() {
  await supabase.auth.signOut();
}

export async function getCurrentSession() {
  return supabase.auth.getSession();
}
