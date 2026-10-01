import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';

interface ProfileRow { id: string; displayName: string; role: string; }

export default function AdminDashboard() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  useEffect(() => { const client = supabase; if (!client || user?.role !== 'admin') return; const load = async () => { const { data } = await client.from('profiles').select('id, display_name, artist_name, role').order('display_name'); setProfiles((data ?? []).map((row) => { const item = row as Record<string, unknown>; return { id: String(item.id), displayName: String(item.display_name ?? item.artist_name ?? 'მომხმარებელი'), role: String(item.role ?? 'user') }; })); }; void load(); }, [user]);
  const toggleMedia = async (profile: ProfileRow) => {
    const client = supabase;
    if (!client) return;
    const targetUserId = profile.id;
    const nextRole = profile.role === 'media' ? 'user' : 'media';
    const { error } = await client.from('profiles').update({ role: nextRole }).eq('id', targetUserId);
    if (error) {
      console.error('Failed to update role:', error);
      window.alert('როლის განახლება ვერ მოხერხდა. სცადეთ ხელახლა.');
      return;
    }
    setProfiles((items) => items.map((item) => item.id === targetUserId ? { ...item, role: nextRole } : item));
  };
  if (user?.role !== 'admin') return null;
  return <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8"><div className="rounded-xl border border-amber-400/20 bg-[#121215] p-5"><div className="mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-amber-300" /><h2 className="text-lg font-bold text-white">ადმინისტრაცია · ვერიფიკაცია</h2></div><div className="space-y-2">{profiles.map((profile) => <div key={profile.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#1e1e24] px-3 py-2"><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{profile.displayName}</p><p className="text-[11px] text-gray-500">როლი: {profile.role}</p></div><button onClick={() => void toggleMedia(profile)} className="shrink-0 rounded-md border border-teal-400/30 px-3 py-1.5 text-xs font-semibold text-teal-300 hover:bg-teal-400/10">{profile.role === 'media' ? 'მედიის როლის გაუქმება' : 'მედიის როლის მინიჭება'}</button></div>)}</div></div></section>;
}
