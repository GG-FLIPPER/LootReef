import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const createSafeSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Supabase URL or Anon Key is missing. React app is running in guest/local-only mode. ' +
      'Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable authentication.'
    );

    const createChainableThenable = (resolvedValue) => {
      const obj = {
        then: (onFulfilled) => Promise.resolve(resolvedValue).then(onFulfilled),
        catch: (onRejected) => Promise.resolve(resolvedValue).catch(onRejected),
      };
      return new Proxy(obj, {
        get(target, prop) {
          if (prop === 'then' || prop === 'catch') {
            return target[prop];
          }
          return () => createChainableThenable(resolvedValue);
        },
      });
    };

    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: (callback) => {
          setTimeout(() => callback('SIGNED_OUT', null), 0);
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        signInWithPassword: async () => {
          throw new Error('Supabase is not configured on this machine.');
        },
        signUp: async () => {
          throw new Error('Supabase is not configured on this machine.');
        },
        signOut: async () => ({ error: null }),
        updateUser: async () => {
          throw new Error('Supabase is not configured on this machine.');
        },
      },
      from: () => createChainableThenable({ data: null, error: null }),
    };
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSafeSupabaseClient();

