import React, { useState } from 'react';
import { Metric, Goal } from '../types.ts';
import { X, Maximize2, Tv, Sparkles } from 'lucide-react';

interface StreamOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandTitle: string;
  metrics: Metric[];
  countdown: string;
  activeGoal?: Goal;
}

export const StreamOverlayModal: React.FC<StreamOverlayModalProps> = ({
  isOpen,
  onClose,
  brandTitle,
  metrics,
  countdown,
  activeGoal,
}) => {
  const [bgStyle, setBgStyle] = useState<'transparent' | 'dark' | 'green'>('dark');

  if (!isOpen) return null;

  const bgClasses = {
    transparent: 'bg-black/40 backdrop-blur-md',
    dark: 'bg-[#0a0a0c]',
    green: 'bg-[#00ff00]', // Chroma key green for OBS
  }[bgStyle];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className={`w-full max-w-4xl border border-[#00f0ff]/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-colors ${bgClasses}`}
      >
        {/* Controls Toolbar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#232330]">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-[#ff0055]" />
            <h3 className="font-['Orbitron',sans-serif] font-bold text-sm text-white">
              OBS STREAM HUD / EMBED MODE
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-['Orbitron',sans-serif]">
              <span className="text-gray-400 mr-1">Backdrop:</span>
              <button
                onClick={() => setBgStyle('dark')}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  bgStyle === 'dark' ? 'bg-[#00f0ff] text-black font-bold' : 'text-gray-400'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setBgStyle('transparent')}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  bgStyle === 'transparent' ? 'bg-[#00f0ff] text-black font-bold' : 'text-gray-400'
                }`}
              >
                Glass
              </button>
              <button
                onClick={() => setBgStyle('green')}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  bgStyle === 'green' ? 'bg-[#00f0ff] text-black font-bold' : 'text-gray-400'
                }`}
              >
                Chroma
              </button>
            </div>

            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              className="text-gray-400 hover:text-white p-1 rounded transition"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-400 p-1 rounded transition"
              title="Close Stream HUD"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live HUD Component */}
        <div className="space-y-6 py-2">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#ff0055] to-[#ffe600] flex items-center justify-center font-['Orbitron',sans-serif] font-black text-black">
                {brandTitle.charAt(1) || 'T'}
              </div>
              <div>
                <h2 className="font-['Orbitron',sans-serif] font-black text-xl text-white tracking-wider">
                  {brandTitle}
                </h2>
                <p className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block animate-pulse" /> LIVE MISSION
                  STATUS
                </p>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="bg-black/70 border border-[#232330] px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] font-['Orbitron',sans-serif] text-gray-400 uppercase tracking-widest block">
                DEADLINE COUNTDOWN
              </span>
              <span className="font-['Orbitron',sans-serif] font-black text-lg text-[#ff0055] glow-text-pink">
                {countdown}
              </span>
            </div>
          </div>

          {/* Metrics Bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((metric) => {
              const pct = metric.target > 0 ? Math.min(100, Math.round((metric.current / metric.target) * 100)) : 0;
              const remaining = Math.max(0, metric.target - metric.current);

              return (
                <div
                  key={metric.id}
                  className="bg-black/80 border border-[#232330] rounded-xl p-3.5 shadow-lg"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-['Orbitron',sans-serif] font-bold text-xs text-white uppercase">
                      {metric.title}
                    </span>
                    <span className="font-['Orbitron',sans-serif] font-bold text-xs text-[#00f0ff] tabular-nums">
                      {pct}%
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <div className="font-['Orbitron',sans-serif] font-black text-2xl text-white tabular-nums">
                      {metric.current.toLocaleString()}{' '}
                      <span className="text-gray-500 text-sm font-normal">/ {metric.target.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {remaining} {metric.remainingLabel}
                    </span>
                  </div>

                  <div className="w-full bg-[#1c1c28] h-2 rounded-full overflow-hidden border border-[#232330]">
                    <div
                      className="bg-gradient-to-r from-[#00f0ff] to-[#ff0055] h-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Active Goal Banner */}
          {activeGoal && (
            <div className="bg-[#ff0055]/10 border border-[#ff0055]/30 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-mono text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ffe600] animate-pulse" />
                <span>
                  <strong>ACTIVE GOAL:</strong> {activeGoal.title}
                </span>
              </div>
              <span className="font-['Orbitron',sans-serif] px-2 py-0.5 rounded bg-[#ff0055]/20 text-[#ff0055] text-[10px] uppercase font-bold">
                {activeGoal.range}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
