import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, User as SupabaseUser } from '../lib/supabase';
import { User as AuthUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
  signInWithPhone: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (phone: string, otp: string, userData?: { name: string; email: string }) => Promise<{ success: boolean; error?: string; user?: SupabaseUser }>;
  updateUserProfile: (data: { name?: string; email?: string }) => Promise<{ success: boolean; error?: string }>;
  createOrLoginUser: (userData: { phone: string; name: string; email: string }) => Promise<{ success: boolean; requiresOTP?: boolean; error?: string; user?: SupabaseUser }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signInWithPhone = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Mock OTP sending for testing
      console.log(`📱 Mock OTP sent to ${phone}: 123456`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
    } catch (error: any) {
      console.error('Error in signInWithPhone:', error);
      return { success: false, error: error.message || 'Failed to send OTP' };
    }
  };

  const verifyOTP = async (phone: string, otp: string, userData?: { name: string; email: string }): Promise<{ success: boolean; error?: string; user?: SupabaseUser }> => {
    try {
      // Mock OTP verification for testing
      if (otp !== '123456') {
        return { success: false, error: 'Invalid OTP. Use "123456" for testing.' };
      }

      console.log(`✅ Mock OTP verified for ${phone}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists in our mock database
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

      if (existingUser) {
        // Update existing user with new data if provided
        if (userData && (userData.name || userData.email)) {
          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({
              name: userData.name || existingUser.name,
              email: userData.email || existingUser.email,
              updated_at: new Date().toISOString()
            })
            .eq('phone', phone)
            .select()
            .single();

          if (!updateError && updatedUser) {
            setUser(updatedUser);
            return { success: true, user: updatedUser };
          }
        }
        
        setUser(existingUser);
        return { success: true, user: existingUser };
      } else {
        // Create new user profile - let Supabase generate the UUID
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            phone: phone,
            name: userData?.name || '',
            email: userData?.email || '',
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          return { success: false, error: 'Failed to create user profile' };
        }

        setUser(newUser);
        return { success: true, user: newUser };
      }
    } catch (error: any) {
      console.error('Error in verifyOTP:', error);
      return { success: false, error: error.message || 'Failed to verify OTP' };
    }
  };

  const updateUserProfile = async (data: { name?: string; email?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        return { success: false, error: error.message };
      }

      setUser(updatedUser);
      return { success: true };
    } catch (error: any) {
      console.error('Error in updateUserProfile:', error);
      return { success: false, error: error.message || 'Failed to update profile' };
    }
  };

  const createOrLoginUser = async (userData: { phone: string; name: string; email: string }): Promise<{ success: boolean; requiresOTP?: boolean; error?: string; user?: SupabaseUser }> => {
    try {
      // First, check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('phone', userData.phone)
        .single();

      if (existingUser) {
        // User exists, require OTP for login
        console.log(`👋 Existing user found for ${userData.phone}`);
        const otpResult = await signInWithPhone(userData.phone);
        if (otpResult.success) {
          return { success: true, requiresOTP: true };
        } else {
          return { success: false, error: otpResult.error };
        }
      } else {
        // User doesn't exist, will create new user account after OTP verification
        console.log(`🆕 New user detected for ${userData.phone}`);
        const otpResult = await signInWithPhone(userData.phone);
        if (otpResult.success) {
          return { success: true, requiresOTP: true, user: undefined };
        } else {
          return { success: false, error: otpResult.error };
        }
      }
    } catch (error: any) {
      console.error('Error in createOrLoginUser:', error);
      return { success: false, error: error.message || 'Failed to process user' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log('🚪 Signing out user...');
      await supabase.auth.signOut();
      setUser(null);
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    signInWithPhone,
    verifyOTP,
    updateUserProfile,
    createOrLoginUser,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 