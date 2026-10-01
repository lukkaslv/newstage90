import { Flame } from 'lucide-react';
import type { Release } from '@/types/music';

interface Top15DailyProps {
  releases: Release[];
  onReleaseClick: (release: Release) => void;
}

export default function Top15Daily({ releases, onReleaseClick }: Top15DailyProps) {
  const dailyReleases = releases.slice(0, 15);

  return (
    <section className="animate-fade-in" aria-labelledby="top-15-heading">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-400/10"><Flame className="h-4 w-4 text-orange-300" fill="currentColor" /></span>
        <h2 id="top-15-heading" className="text-lg font-bold text-white sm:text-xl">დღის ტოპ-15</h2>
      </div>
      {dailyReleases.length === 0 ? <div className="flex min-h-20 max-h-36 items-center justify-center rounded-xl border border-dashed border-[#2a2a32] bg-[#121215] px-4 py-5 text-center text-xs text-gray-500">დღის ტოპ-რელიზები მალე დაემატება.</div> : <div className={`no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 pb-2 sm:gap-6 ${dailyReleases.length === 1 ? 'justify-center' : ''}`}>
        {dailyReleases.map((release, index) => (
          <button key={`${release.id}-${index}`} type="button" onClick={() => onReleaseClick(release)} className="group w-[76px] shrink-0 text-center" aria-label={`${release.artist} — ${release.title}`}>
            <div className="relative mx-auto h-16 w-16">
              <img src={release.coverUrl} alt={release.title} className="h-full w-full rounded-full border border-white/5 object-cover ring-2 ring-[#2a2a32] transition-all duration-300 group-hover:scale-105 group-hover:ring-cyan-400/80 group-hover:shadow-[0_0_22px_-4px_rgba(34,211,238,0.85)]" loading="lazy" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#0a0a0c] bg-[#1e1e24] px-1 text-[9px] font-bold text-gray-300">{index + 1}</span>
            </div>
            <p className="mt-2 truncate text-[11px] font-semibold text-gray-300 transition-colors group-hover:text-cyan-300">{release.artist}</p>
            <p className="truncate text-[10px] text-gray-600">{release.title}</p>
          </button>
        ))}
      </div>}
    </section>
  );
}
