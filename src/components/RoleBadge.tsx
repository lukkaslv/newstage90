import {
  BadgeCheck,
  Crown,
  Headphones,
  MicVocal,
  Music2,
  Palette,
  Shield,
  SlidersHorizontal,
  Video,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@/context/AuthContext';

type RoleBadgeProps = {
  role?: UserRole | string | null;
  className?: string;
  category?: string | null;
};

function getAuthorCategoryIcon(category?: string | null): LucideIcon {
  const value = String(category ?? '').trim().toLowerCase();
  if (!value) return Music2;
  if (/(მომღერ|ვოკალ|რეპ|ემსი|artist|rapper|vocal|mc|host|podcast|interview)/.test(value)) return MicVocal;
  if (/(პროდ|ბით|დიჯეი|საუნდ|მიქს|master|producer|beat|dj|sound|mix|engineer)/.test(value)) return SlidersHorizontal;
  if (/(არტ|დიზაინ|ქავერ|visual|cover|design|paint|illustration)/.test(value)) return Palette;
  if (/(ვიდეო|მედია|კამერა|კლიპ|film|video|camera|cinema|broadcast)/.test(value)) return Video;
  return Music2;
}

function getRoleIcon(role?: UserRole | string | null, category?: string | null): LucideIcon {
  if (role === 'media') return Video;
  if (role === 'author' || role === 'artist') return getAuthorCategoryIcon(category);
  if (role === 'admin') return Shield;
  return Headphones;
}

export function RoleAvatarBadge({ role, className = '', category }: RoleBadgeProps) {
  const Icon = getRoleIcon(role, category);

  if (role === 'media') {
    return (
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border border-cyan-200/70 bg-gradient-to-r from-cyan-400 to-teal-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.45)] ${className}`}>
        <Icon className="h-3 w-3" />
      </span>
    );
  }

  if (role === 'admin') {
    return (
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border border-amber-200/70 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.35)] ${className}`}>
        <Icon className="h-3 w-3" />
      </span>
    );
  }

  if (role === 'author' || role === 'artist') {
    return (
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border border-blue-300/60 bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.35)] ${className}`}>
        <Icon className="h-3 w-3" />
      </span>
    );
  }

  return (
    <span className={`flex h-5 w-5 items-center justify-center rounded-full border border-slate-500/60 bg-slate-800 text-slate-200 ${className}`}>
      <Icon className="h-3 w-3" />
    </span>
  );
}

export default function RoleBadge({ role, className = '', category }: RoleBadgeProps) {
  if (role === 'media') {
    return (
      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 px-2.5 py-0.5 text-xs font-extrabold tracking-wide text-black shadow-[0_0_12px_rgba(6,182,212,0.4)] ${className}`}>
        <Video className="h-3.5 w-3.5" />
        მედია
      </span>
    );
  }

  if (role === 'author' || role === 'artist') {
    const AuthorIcon = getAuthorCategoryIcon(category);
    return (
      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-blue-300/40 bg-gradient-to-r from-sky-500/20 to-blue-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-sky-100 shadow-[0_0_10px_rgba(59,130,246,0.18)] ${className}`}>
        <BadgeCheck className="h-3.5 w-3.5 text-blue-400" fill="currentColor" />
        <AuthorIcon className="h-3.5 w-3.5" />
        ავტორი
      </span>
    );
  }

  if (role === 'admin') {
    return (
      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200/70 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 px-2.5 py-0.5 text-[10px] font-extrabold text-black shadow-[0_0_14px_rgba(251,191,36,0.35)] ${className}`}>
        <Shield className="h-3.5 w-3.5" />
        <Crown className="h-3.5 w-3.5" />
        ადმინი
      </span>
    );
  }

  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-600/70 bg-slate-800/90 px-2.5 py-0.5 text-[10px] font-semibold text-slate-200 ${className}`}>
      <Headphones className="h-3.5 w-3.5" />
      მომხმარებელი
    </span>
  );
}
