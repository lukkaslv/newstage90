import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';

export default function MediaReleaseModal({ onClose, onSubmitted }: { onClose: () => void; onSubmitted: () => Promise<void> }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [releaseType, setReleaseType] = useState<'single' | 'album'>('single');
  const [profileCount, setProfileCount] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const client = supabase;
    if (!client || !user) return;
    void client.from('profiles').select('media_monthly_releases').eq('id', user.id).maybeSingle().then(({ data }) => setProfileCount(Number(data?.media_monthly_releases ?? 0)));
  }, [user]);

  const submit = async () => {
    const client = supabase;
    if (!client || !user || profileCount === null || profileCount >= 5 || !title.trim() || !artist.trim() || !coverUrl.trim()) return;
    setSaving(true);
    setMessage('');
    const { error: insertError } = await client.from('releases').insert({ title: title.trim(), artist_name: artist.trim(), cover_url: coverUrl.trim(), release_type: releaseType, submitted_by: user.id, is_active: true });
    if (insertError) {
      setMessage('რელიზის შეთავაზება ვერ შეინახა. გადაამოწმეთ შევსებული ველები.');
      setSaving(false);
      return;
    }
    const nextCount = profileCount + 1;
    const { error: quotaError } = await client.from('profiles').update({ media_monthly_releases: nextCount }).eq('id', user.id);
    if (quotaError) {
      setMessage('რელიზი დაემატა, თუმცა კვოტის განახლება ვერ მოხერხდა.');
      setSaving(false);
      return;
    }
    setProfileCount(nextCount);
    await onSubmitted();
    setMessage('რელიზის შეთავაზება წარმატებით გაიგზავნა.');
    setSaving(false);
  };

  const remaining = profileCount === null ? null : Math.max(0, 5 - profileCount);
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="media-release-title"><div className="relative w-full max-w-md rounded-2xl border border-cyan-300/25 bg-[#10171b]/95 p-6 shadow-2xl"><button onClick={onClose} aria-label="დახურვა" className="absolute right-4 top-4 text-gray-500 hover:text-white"><X className="h-5 w-5" /></button><h2 id="media-release-title" className="text-xl font-bold text-white">ახალი რელიზის შეთავაზება</h2><p className="mt-1 text-xs text-cyan-200">{remaining === null ? 'კვოტა იტვირთება…' : `თვიური ლიმიტი: 5-დან დარჩენილია ${remaining}`}</p><div className="mt-5 space-y-3"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="რელიზის სათაური" className="w-full rounded-lg border border-[#2a363b] bg-[#080d10] px-3 py-2 text-sm text-white placeholder-gray-500" /><input value={artist} onChange={(event) => setArtist(event.target.value)} placeholder="შემსრულებელი" className="w-full rounded-lg border border-[#2a363b] bg-[#080d10] px-3 py-2 text-sm text-white placeholder-gray-500" /><input value={coverUrl} onChange={(event) => setCoverUrl(event.target.value)} placeholder="ქავერის სურათის ბმული" type="url" className="w-full rounded-lg border border-[#2a363b] bg-[#080d10] px-3 py-2 text-sm text-white placeholder-gray-500" /><select value={releaseType} onChange={(event) => setReleaseType(event.target.value as 'single' | 'album')} className="w-full rounded-lg border border-[#2a363b] bg-[#080d10] px-3 py-2 text-sm text-white"><option value="single">სინგლი</option><option value="album">ალბომი</option></select></div>{message && <p className="mt-3 text-xs text-gray-300">{message}</p>}<button onClick={() => void submit()} disabled={saving || remaining === null || remaining < 1} className="mt-5 w-full rounded-lg bg-gradient-to-r from-cyan-300 to-teal-300 px-4 py-2 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">{saving ? 'იგზავნება…' : 'შეთავაზების გაგზავნა'}</button></div></div>;
}
