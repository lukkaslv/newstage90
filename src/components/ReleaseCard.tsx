import { MessageCircle, Play } from 'lucide-react';
import { releaseTypeLabel, type Release } from '@/types/music';
import { useAuth } from '@/context/auth-context';

export default function ReleaseCard({ release, onClick }: { release: Release; onClick?: (release: Release) => void }) {
  const scores = release.scores ?? { community: Math.max(0, release.score - 2), critics: Math.max(0, release.score - 3), personal: release.score };
  const commentCount = release.commentCount ?? release.reviewCount;
  const { isAuthenticated } = useAuth();
  const personalScore = isAuthenticated && release.personalScore != null ? release.personalScore : '—';

  return (
    <article onClick={() => onClick?.(release)} className="card-hover group relative cursor-pointer overflow-hidden rounded-xl border border-[#1e1e24] bg-[#121216]">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img src={release.coverUrl} alt={release.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent" />
        {releaseTypeLabel(release) && <span className="absolute right-3 top-3 rounded-full border border-cyan-400/30 bg-[#0a0a0c]/75 px-2.5 py-1 text-[10px] font-bold text-cyan-300 backdrop-blur">{releaseTypeLabel(release)}</span>}
        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-[#0a0a0c]/75 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">ტოპ 1 დღის</span>
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 text-black opacity-0 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"><Play className="h-4 w-4" fill="currentColor" /></span>
      </div>
      <div className="p-3 sm:p-3.5">
        <h3 className="truncate text-sm font-bold text-white">{release.title}</h3>
        <p className="mt-0.5 truncate text-xs text-gray-500">{release.artist}</p>
        <div className="mt-3 flex items-center gap-1.5">
          <span title="საზოგადოება" className="flex min-w-0 flex-1 items-center justify-center rounded-full bg-blue-500/20 px-1.5 py-1 text-[10px] font-bold text-blue-300 ring-1 ring-inset ring-blue-400/20"><span className="hidden lg:inline">საზ. </span>{scores.community}</span>
          <span title="კრიტიკოსები" className="flex min-w-0 flex-1 items-center justify-center rounded-full bg-[#24242c] px-1.5 py-1 text-[10px] font-bold text-gray-300 ring-1 ring-inset ring-white/10"><span className="hidden lg:inline">კრიტ. </span>{scores.critics}</span>
          <span title="პირადი შეფასება" className="flex min-w-0 flex-1 items-center justify-center rounded-full bg-gray-300/90 px-1.5 py-1 text-[10px] font-bold text-[#17171b]"><span className="hidden lg:inline">პირ. </span>{personalScore}</span>
          <span className="ml-1 flex shrink-0 items-center gap-1 text-[11px] text-gray-500"><MessageCircle className="h-3.5 w-3.5" />{commentCount}</span>
        </div>
        <button type="button" onClick={(event) => { event.stopPropagation(); onClick?.(release); }} className="mt-3 w-full rounded-full border border-[#2a2a32] bg-[#0a0a0c] px-3 py-1.5 text-[11px] font-semibold text-gray-400 transition-colors hover:border-cyan-400/40 hover:text-cyan-300">რეცენზიის დაწერა...</button>
      </div>
    </article>
  );
}
