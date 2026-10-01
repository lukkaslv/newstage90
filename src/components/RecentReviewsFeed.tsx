import { useEffect, useState } from 'react';
import { ExternalLink, Heart, MessageCircle, ShieldCheck } from 'lucide-react';
import type { Release } from '@/types/music';
import { supabase } from '@/lib/supabase';
import RoleBadge from '@/components/RoleBadge';

interface RecentReviewsFeedProps { onReleaseClick: (release: Release | string) => void; releases: Release[]; }
interface ReviewItem { id: string; username: string; role: string; score: number; scores: number[]; title: string; text: string; releaseId: number | string; reactions: number; releaseTitle: string; releaseArtist: string; releaseCoverUrl: string; }

function joinedObject(value: unknown): Record<string, unknown> | undefined {
  if (Array.isArray(value)) return value[0] as Record<string, unknown> | undefined;
  return value as Record<string, unknown> | undefined;
}

function mapReview(row: Record<string, unknown>): ReviewItem {
  const profile = joinedObject(row.profiles);
  const release = joinedObject(row.releases);
  return {
    id: String(row.id ?? crypto.randomUUID()), username: String(profile?.display_name ?? row.user_display_name ?? row.display_name ?? (row.user_metadata as Record<string, unknown> | undefined)?.display_name ?? 'მომხმარებელი'), role: String(profile?.role ?? row.role ?? 'user'), score: Number(row.total_score ?? 0),
    scores: [Number(row.param_rhymes ?? row.rhymes ?? 0), Number(row.param_structure ?? row.structure ?? 0), Number(row.param_style ?? row.style ?? 0), Number(row.param_charisma ?? row.charisma ?? row.individuality ?? 0), Number(row.vibe_level ?? row.vibe ?? 0)],
    title: String(row.title ?? 'რეცენზია'), text: String(row.content ?? ''), releaseId: typeof row.release_id === 'number' ? row.release_id : String(row.release_id ?? ''), reactions: Number(row.reactions ?? row.likes ?? 0), releaseTitle: String(release?.title ?? 'Baby არი Drama'), releaseArtist: String(release?.artist_name ?? ''), releaseCoverUrl: String(release?.cover_url ?? ''),
  };
}

function releaseFromReview(review: ReviewItem): Release { return { id: review.releaseId, title: review.releaseTitle, artist: review.releaseArtist, coverUrl: review.releaseCoverUrl, type: 'album' as Release['type'], year: new Date().getFullYear(), score: review.score, reviewCount: 0, trackCount: 0, genre: '' }; }

export default function RecentReviewsFeed({ onReleaseClick, releases }: RecentReviewsFeedProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    const loadReviews = async () => {
      const { data: reviewsData, error: reviewsError } = await client
        .from('reviews')
        .select('*, profiles:user_id(display_name, role)')
        .order('created_at', { ascending: false })
        .limit(6);
      if (reviewsError) return;
      if (reviewsData) setReviews(reviewsData.map((row) => mapReview(row as Record<string, unknown>)));
    };
    void loadReviews();
  }, []);

  const emptyRelease = releases[0];
  return <section className="animate-fade-in" aria-labelledby="recent-reviews-heading" style={{ animationDelay: '0.15s' }}>
    <div className="mb-5 flex items-center justify-between gap-4"><h2 id="recent-reviews-heading" className="text-xl font-bold text-white sm:text-2xl">ახალი რეცენზიები რელიზებზე</h2><button className="text-sm font-medium text-gray-500 transition-colors hover:text-cyan-400">ყველა რეცენზია →</button></div>
    {reviews.length === 0 ? <div className="py-12 text-center text-gray-500"><p>ამ დროისთვის რეცენზიები ჯერ არ არის დამატებული.</p>{emptyRelease && <button onClick={() => onReleaseClick(emptyRelease)} className="mt-4 rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-xs font-bold text-black">რელიზის შეფასება</button>}</div> : <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{reviews.map((review) => {
      const release = releases.find((item) => String(item.id) === String(review.releaseId)) ?? releaseFromReview(review);
      const releaseTarget: Release | string = releases.some((item) => String(item.id) === String(review.releaseId)) ? release : String(review.releaseId);
      return <article key={review.id} onClick={() => onReleaseClick(releaseTarget)} className="card-hover min-w-0 max-w-full cursor-pointer overflow-hidden rounded-xl border border-[#1e1e24] bg-[#121215] p-4">
        <div className="flex items-center gap-3"><div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/30 to-cyan-400/20 text-xs font-bold text-white">{review.username.slice(0, 2).toUpperCase()}<ShieldCheck className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#121215] text-amber-300" fill="currentColor" /></div><div className="min-w-0 flex-1"><div className="flex min-w-0 items-center gap-2"><p className="truncate text-sm font-bold text-white">{review.username}</p><RoleBadge role={review.role} /></div><span className="mt-1 inline-flex rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">რეცენზენტი</span></div><span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-violet-400/10 px-2 text-sm font-extrabold text-violet-300 ring-1 ring-inset ring-violet-400/20">{review.score}</span></div>
        <div className="mt-4 flex items-center justify-between rounded-lg border border-[#1e1e24] bg-[#0a0a0c] px-3 py-2 text-xs font-bold text-gray-400">{review.scores.map((score, index) => <span key={`${review.id}-${index}`} className={index === 4 ? 'text-violet-300' : ''}>{score}</span>)}</div>
        <div className="mt-4 flex min-w-0 items-center gap-3">{(release.coverUrl || review.releaseCoverUrl) && <img src={release.coverUrl || review.releaseCoverUrl} alt={release.title} className="h-12 w-12 shrink-0 rounded-md object-cover" loading="lazy" />}<h3 className="block min-w-0 max-w-full truncate overflow-hidden text-sm font-bold text-white">{review.title}</h3></div><p className="mt-2 min-w-0 max-w-full overflow-hidden line-clamp-3 break-all break-words text-sm leading-relaxed text-gray-400">{review.text}</p>
        <div className="mt-4 flex items-center gap-4 border-t border-[#1e1e24] pt-3 text-[11px] text-gray-500"><span className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-rose-400/70" />{review.reactions}</span><span className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" />კომენტარი</span><ExternalLink className="ml-auto h-3.5 w-3.5" /></div>
      </article>;
    })}</div>}
  </section>;
}
