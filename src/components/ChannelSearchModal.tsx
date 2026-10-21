import React, { useState } from 'react';
import { Search, X, Youtube, CheckCircle, ArrowRight, Loader2, Sparkles, TrendingUp, Video, Film, Eye } from 'lucide-react';

export interface ChannelData {
  channelTitle: string;
  handle: string;
  subscribersFormatted: string;
  subscribers: number;
  totalVideos: number;
  shortsCount: number;
  viewsFormatted: string;
  views: number;
  description: string;
  niche: string;
  verified?: boolean;
}

interface ChannelSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyStats: (channelData: ChannelData) => void;
}

export const ChannelSearchModal: React.FC<ChannelSearchModalProps> = ({
  isOpen,
  onClose,
  onApplyStats,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ChannelData | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/channel/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Channel not found');
      }

      setResult(data.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to search channel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApplyStats(result);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#121218] border border-[#00f0ff]/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#232330]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-md">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Orbitron',sans-serif] font-bold text-base md:text-lg text-white">
                SEARCH YOUTUBE CHANNEL
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Lookup live subscriber, shorts, and video stats to auto-populate your Hub
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              autoFocus
              placeholder="Enter YouTube handle or channel name (e.g. @MrBeast, @mkbhd, @Toji.FNX)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-black text-white text-sm pl-9 pr-3 py-2.5 rounded-xl border border-[#232330] focus:border-[#00f0ff] outline-none font-mono"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-[#00f0ff] hover:bg-[#67e8f9] disabled:bg-gray-700 disabled:text-gray-500 text-black font-['Orbitron',sans-serif] font-bold px-5 py-2.5 rounded-xl text-xs transition active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> SEARCHING...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" /> LOOKUP
              </>
            )}
          </button>
        </form>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Search Result Card */}
        {result && (
          <div className="space-y-4 bg-black border border-[#232330] rounded-xl p-5 shadow-inner">
            {/* Channel header */}
            <div className="flex items-center justify-between border-b border-[#232330] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff0055] to-[#ffe600] flex items-center justify-center font-['Orbitron',sans-serif] font-black text-xl text-black shadow-md">
                  {result.channelTitle.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-['Orbitron',sans-serif] font-bold text-lg text-white">
                      {result.channelTitle}
                    </h4>
                    {result.verified && (
                      <span title="Verified Creator">
                        <CheckCircle className="w-4 h-4 text-[#00f0ff]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#00f0ff] font-mono">{result.handle}</p>
                </div>
              </div>

              <span className="text-[10px] font-['Orbitron',sans-serif] px-2.5 py-1 rounded bg-[#ff0055]/20 text-[#ff0055] border border-[#ff0055]/40 font-bold uppercase">
                {result.niche || 'YouTube Creator'}
              </span>
            </div>

            {/* Description */}
            {result.description && (
              <p className="text-xs text-gray-300 italic line-clamp-2">
                "{result.description}"
              </p>
            )}

            {/* Statistics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="bg-[#121218] p-3 rounded-lg border border-[#232330] text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400 font-['Orbitron',sans-serif] mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#ffe600]" />
                  <span>SUBSCRIBERS</span>
                </div>
                <div className="font-['Orbitron',sans-serif] font-black text-lg text-[#ffe600] tabular-nums">
                  {result.subscribersFormatted || result.subscribers.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#121218] p-3 rounded-lg border border-[#232330] text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400 font-['Orbitron',sans-serif] mb-1">
                  <Film className="w-3.5 h-3.5 text-[#ff0055]" />
                  <span>SHORTS</span>
                </div>
                <div className="font-['Orbitron',sans-serif] font-black text-lg text-[#ff0055] tabular-nums">
                  {result.shortsCount.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#121218] p-3 rounded-lg border border-[#232330] text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400 font-['Orbitron',sans-serif] mb-1">
                  <Video className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>TOTAL VIDEOS</span>
                </div>
                <div className="font-['Orbitron',sans-serif] font-black text-lg text-[#00f0ff] tabular-nums">
                  {result.totalVideos.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#121218] p-3 rounded-lg border border-[#232330] text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400 font-['Orbitron',sans-serif] mb-1">
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  <span>TOTAL VIEWS</span>
                </div>
                <div className="font-['Orbitron',sans-serif] font-black text-lg text-purple-400 tabular-nums">
                  {result.viewsFormatted || result.views.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Sync button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleApply}
                className="w-full sm:w-auto bg-gradient-to-r from-[#ff0055] to-[#ffe600] text-black font-['Orbitron',sans-serif] font-black text-xs px-6 py-3 rounded-xl shadow-lg glow-pink hover:opacity-95 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-black" /> SYNC STATS TO DASHBOARD
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        )}

        {!result && !isLoading && (
          <div className="text-center py-8 text-gray-500 font-mono text-xs">
            Enter a channel name or handle above to fetch live metrics & milestones.
          </div>
        )}
      </div>
    </div>
  );
};
