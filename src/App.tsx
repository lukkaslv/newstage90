import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Clock, Award } from 'lucide-react';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import TopCarousel from '@/components/TopCarousel';
import ReleaseCard from '@/components/ReleaseCard';
import ReleaseDetail from '@/components/ReleaseDetail';
import AuthModal from '@/components/AuthModal';
import Top90Leaderboard from '@/components/Top90Leaderboard';
import Achievements from '@/components/Achievements';
import MediaReviews from '@/components/MediaReviews';
import RecentReviewsFeed from '@/components/RecentReviewsFeed';
import ConcertsSection from '@/components/ConcertsSection';
import Top15Daily from '@/components/Top15Daily';
import AuthorsPicks from '@/components/AuthorsPicks';
import AuthorComments from '@/components/AuthorComments';
import NewNamesSection from '@/components/NewNamesSection';
import AdminDashboard from '@/components/AdminDashboard';
import type { Release, PageId } from '@/types/music';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth-context';

type AuthMode = 'login' | 'register';

function AppContent() {
  const { user } = useAuth();
  const [selectedRelease, setSelectedRelease] = useState<Release | string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [activeTab, setActiveTab] = useState<PageId>('releases');
  const [releaseCatalog, setReleaseCatalog] = useState<Release[]>([]);
  const [releaseCount, setReleaseCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const topCatalog = releaseCatalog.slice(0, 7);
  const latestCatalog = releaseCatalog.length > 7 ? releaseCatalog.slice(7) : releaseCatalog;
  const openRelease = (nextRelease: Release | string) => setSelectedRelease(nextRelease);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const loadReleases = async () => {
      const { data, error } = await client
        .from('releases')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      const [{ count: liveReleaseCount }, { count: liveReviewCount }] = await Promise.all([
        client.from('releases').select('*', { count: 'exact', head: true }).eq('is_active', true),
        client.from('reviews').select('*', { count: 'exact', head: true }),
      ]);

      setReleaseCount(liveReleaseCount ?? 0);
      setReviewCount(liveReviewCount ?? 0);
      if (error || !data || data.length === 0) return;

      const normalized = data.map((row) => {
        const item = row as Record<string, unknown>;
        const score = Number(item.score ?? item.total_score ?? 0);
        const parsedId = typeof item.id === 'number' ? item.id : String(item.id ?? '');
        return {
          id: parsedId,
          title: String(item.title ?? ''),
          artist: String(item.artist ?? item.artist_name ?? ''),
          coverUrl: String(item.cover_url ?? item.coverUrl ?? ''),
          type: String(item.release_type ?? item.type ?? '') as Release['type'],
          release_type: item.release_type ? String(item.release_type) : undefined,
          year: Number(item.year ?? new Date().getFullYear()),
          score,
          reviewCount: Number(item.review_count ?? item.reviewCount ?? 0),
          commentCount: Number(item.comment_count ?? item.commentCount ?? item.comments ?? 0),
          trackCount: Number(item.track_count ?? item.trackCount ?? 0),
          genre: String(item.genre ?? ''),
          season: item.season ? String(item.season) : undefined,
          scores: {
            community: Number(item.community_score ?? score - 2),
            critics: Number(item.critics_score ?? score - 3),
            personal: Number(item.personal_score ?? score),
          },
          personalScore: item.personal_score == null ? undefined : Number(item.personal_score),
        } satisfies Release;
      }).filter((release) => Boolean(release.id) && release.title && release.coverUrl);

      if (normalized.length > 0) setReleaseCatalog(normalized);
    };

    void loadReleases();
  }, []);

  useEffect(() => {
    if (selectedRelease) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedRelease]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  if (selectedRelease) {
    return (
      <div className="min-h-screen bg-[#0a0a0c]">
        <Navbar onOpenAuth={setAuthMode} activeTab={activeTab} onTabChange={setActiveTab} />
        <ReleaseDetail
          release={selectedRelease}
          onBack={() => setSelectedRelease(null)}
          onOpenAuth={() => setAuthMode('login')}
        />
        {authMode && (
          <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      <Navbar onOpenAuth={setAuthMode} activeTab={activeTab} onTabChange={setActiveTab} />
      {user?.role === 'admin' && <AdminDashboard />}

      {activeTab === 'top90' && <Top90Leaderboard />}

      {activeTab === 'achievements' && <Achievements />}

      {activeTab === 'concerts' && (
        <main className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
          <ConcertsSection />
        </main>
      )}

      {activeTab === 'releases' && (
        <>
          {/* Hero banner */}
          <section className="relative overflow-hidden border-b border-[#1e1e24]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5" />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, rgba(34,211,238,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(167,139,250,0.08) 0%, transparent 50%)',
              }}
            />
            <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
              <div className="flex flex-col items-start gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-300">ახალი სეზონი · 2026</span>
                </div>
                <h1 className="max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                  ქართული მუსიკის რეცენზიები და რეიტინგები —{' '}
                  <span className="text-glow-cyan text-cyan-400">სრულად თქვენთვის</span>
                </h1>
                <p className="max-w-xl text-sm text-gray-400 sm:text-base">
                  აღმოაჩინეთ ახალი რელიზები, წაიკითხეთ კრიტიკოსთა რეცენზიები და შეაფასეთ თქვენი საყვარელი მუსიკოსების ნამუშევრები.
                </p>

                {/* Stats row */}
                <div className="mt-2 flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-gray-300">
                      <span className="font-bold text-white">{releaseCount}</span> რელიზი
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-violet-400" />
                    <span className="text-sm text-gray-300">
                      <span className="font-bold text-white">{reviewCount}</span> რეცენზია
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-gray-300">
                      <span className="font-bold text-white">90</span> ტოპ რეიტინგი
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main content */}
          <main className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
            <Top15Daily releases={releaseCatalog} onReleaseClick={openRelease} />

            <AuthorsPicks releases={releaseCatalog} onReleaseClick={openRelease} />

            <AuthorComments releases={releaseCatalog} onReleaseClick={openRelease} />

            {/* Section 1: Top daily releases */}
            <TopCarousel releases={topCatalog} onReleaseClick={openRelease} />

            {/* Section 2: Latest releases */}
            <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-400/10">
                    <TrendingUp className="h-4 w-4 text-violet-400" />
                  </span>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">დამატებული რელიზები</h2>
                </div>
                <button className="text-sm font-medium text-gray-500 transition-colors hover:text-violet-400">
                  ყველას ნახვა →
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {latestCatalog.map((release) => (
                  <ReleaseCard key={release.id} release={release} onClick={openRelease} />
                ))}
              </div>
            </section>

            <MediaReviews releases={releaseCatalog} onReleaseClick={openRelease} />

            <RecentReviewsFeed releases={releaseCatalog} onReleaseClick={openRelease} />

            <NewNamesSection releases={releaseCatalog} onReleaseClick={openRelease} />
          </main>
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-[#1e1e24]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-gray-600">
              © 2026 რზტ — რისა ზა თვორჩესტვო. ყველა უფლება დაცულია.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <button className="transition-colors hover:text-gray-400">წესები</button>
              <button className="transition-colors hover:text-gray-400">კონტაქტი</button>
              <button className="transition-colors hover:text-gray-400">კონფიდენციალობა</button>
            </div>
          </div>
        </div>
      </footer>

      {authMode && (
        <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
