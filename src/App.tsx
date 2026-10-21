import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { AppState, Metric, ScheduleDay, Goal, TodoItem, Rule, Benchmark } from './types.ts';
import { EditableText } from './components/EditableText.tsx';
import { MetricCard } from './components/MetricCard.tsx';
import { WeeklySchedule } from './components/WeeklySchedule.tsx';
import { GoalsSection } from './components/GoalsSection.tsx';
import { TodoSection } from './components/TodoSection.tsx';
import { RulesSection } from './components/RulesSection.tsx';
import { StreamOverlayModal } from './components/StreamOverlayModal.tsx';
import { ChannelSearchModal, ChannelData } from './components/ChannelSearchModal.tsx';
import { AiAdvisorDrawer } from './components/AiAdvisorDrawer.tsx';
import { playCelebrationSound, playBlipSound } from './utils/audio.ts';
import {
  Download,
  Upload,
  RotateCcw,
  Clock,
  Edit3,
  Tv,
  Volume2,
  VolumeX,
  Plus,
  Flame,
  Search,
  Bot,
  Youtube,
  Sparkles,
} from 'lucide-react';

const STORAGE_KEY = 'TOJI_CYBER_HUB_STATE_V2';

const DEFAULT_STATE: AppState = {
  brandTitle: '@TOJI.FNX',
  brandBadge: 'Edit User',
  brandSub: 'Your User right above 👆',
  quoteBadge: 'CREATOR & MOTIVATION',
  mainQuote: '"Relentless editing. Unmatched discipline. DOMINATE THE ALGORITHM."',
  timerLabel: 'GOAL DAY',
  targetDate: '2027-01-01',
  calSectionTitle: 'WEEKLY PRODUCTION SCHEDULE',
  calSectionSub: 'Click any day, focus area, or task item to edit text inline.',
  goalsTitle: 'CREATOR TARGET GOALS',
  todoTitle: 'ACTION TO-DO LIST',
  rulesTitle: 'EDITING RULES & DIRECTIVES',
  benchmarksTitle: 'BENCHMARKS & MILESTONES',
  soundEnabled: true,
  metrics: [
    {
      id: 'm1',
      title: 'SHORTS POSTED',
      subtitle: 'High-Velocity Short Form',
      current: 0,
      target: 100,
      remainingLabel: 'REMAINING',
      color: 'pink',
      stepSizes: [1, 5],
    },
    {
      id: 'm2',
      title: 'VIDEOS POSTED',
      subtitle: 'Masterpiece Projects',
      current: 0,
      target: 30,
      remainingLabel: 'REMAINING',
      color: 'cyan',
      stepSizes: [1, 5],
    },
    {
      id: 'm3',
      title: 'SUBSCRIBERS',
      subtitle: 'Audience Growth',
      current: 0,
      target: 10000,
      remainingLabel: 'NEEDED',
      color: 'gold',
      stepSizes: [10, 100],
    },
  ],
  schedule: [
    {
      day: 'Monday',
      focus: 'Scripting & Audio Sync',
      tasks: ['Find viral audio clip', 'Set up BPM markers', 'Cut intro 5 seconds'],
    },
    {
      day: 'Tuesday',
      focus: 'Batch Editing',
      tasks: ['Edit 3 High-energy shorts', 'Export 4K 60FPS vertical', 'Draft titles & tags'],
    },
    {
      day: 'Wednesday',
      focus: 'Main Edit Phase 1',
      tasks: ['Main sequence masking', 'Impact sound effects', 'Velocity graph tuning'],
    },
    {
      day: 'Thursday',
      focus: 'Main Edit Phase 2',
      tasks: ['Color grading & Glow FX', 'Typography & Overlays', 'Render preview export'],
    },
    {
      day: 'Friday',
      focus: 'Uploads & Teasers',
      tasks: ['Post Short #1', 'Schedule Short #2', 'Community tab teaser'],
    },
    {
      day: 'Saturday',
      focus: 'Full Release Day',
      tasks: ['Final audio master Check', 'Thumbnail design', 'Publish Video'],
    },
    {
      day: 'Sunday',
      focus: 'Review & Analytics',
      tasks: ['Analyze CTR & retention', 'Plan next week clips', 'Rest & recharge'],
    },
  ],
  goals: [
    { id: '1', title: 'Hit 50k views on single Short', range: 'Week 1', status: 'Achieved' },
    { id: '2', title: 'Master 3D Masking technique', range: 'Week 2', status: 'In Progress' },
    { id: '3', title: 'Publish 10 Shorts & 2 Long Videos', range: 'Month 1', status: 'Pending' },
  ],
  todos: [
    { id: '1', text: 'Export Thumbnail for Toji Edit', completed: true },
    { id: '2', text: 'Clean project files and cache', completed: false },
    { id: '3', text: 'Keyframe camera zoom on impact shot', completed: false },
  ],
  rules: [
    { id: 'r1', text: 'Never compromise on frame precision.' },
    { id: 'r2', text: 'First 3 seconds must grab instant attention.' },
    { id: 'r3', text: 'Always check audio levels on mobile speakers before upload.' },
  ],
  benchmarks: [
    { id: 'b1', text: 'Shorts Retention Goal: > 85%' },
    { id: 'b2', text: 'Average View Duration: > 2:30 mins' },
    { id: 'b3', text: 'Upload Consistency: Minimum 4 Shorts/Week' },
  ],
};

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_STATE;
  });

  const [countdown, setCountdown] = useState<string>('00d 00h 00m 00s');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyChannelData = (data: ChannelData) => {
    setState((prev) => {
      // Calculate smart next milestones
      const subTarget =
        data.subscribers > 0
          ? data.subscribers < 1000
            ? 1000
            : data.subscribers < 10000
            ? 10000
            : data.subscribers < 50000
            ? 50000
            : data.subscribers < 100000
            ? 100000
            : Math.ceil((data.subscribers + 50000) / 100000) * 100000
          : 1000;

      const videosTarget =
        data.totalVideos > 0 ? Math.max(30, Math.ceil((data.totalVideos + 10) / 10) * 10) : 30;

      const shortsTarget =
        data.shortsCount > 0 ? Math.max(50, Math.ceil((data.shortsCount + 20) / 10) * 10) : 100;

      const updatedMetrics = prev.metrics.map((m) => {
        if (m.title.includes('SHORT')) {
          return {
            ...m,
            current: data.shortsCount,
            target: Math.max(m.target, shortsTarget),
          };
        }
        if (m.title.includes('VIDEO')) {
          return {
            ...m,
            current: data.totalVideos,
            target: Math.max(m.target, videosTarget),
          };
        }
        if (m.title.includes('SUB')) {
          return {
            ...m,
            current: data.subscribers,
            target: Math.max(m.target, subTarget),
          };
        }
        return m;
      });

      return {
        ...prev,
        brandTitle: data.handle || data.channelTitle,
        brandBadge: data.niche ? data.niche.toUpperCase() : 'VERIFIED CREATOR',
        brandSub: data.description ? data.description.slice(0, 55) + '...' : `YouTube Channel: ${data.channelTitle}`,
        metrics: updatedMetrics,
      };
    });

    triggerCelebration();
  };

  // Auto-save state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  // Real-time countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      if (!state.targetDate) {
        setCountdown('--d --h --m --s');
        return;
      }

      const target = new Date(`${state.targetDate}T00:00:00`).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown('GOAL DATE REACHED!');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [state.targetDate]);

  // Trigger celebration effect
  const triggerCelebration = () => {
    if (state.soundEnabled) {
      playCelebrationSound();
    }
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0055', '#00f0ff', '#ffe600', '#ffffff'],
      });
    } catch {
      // Ignore
    }
  };

  const triggerBlip = () => {
    if (state.soundEnabled) {
      playBlipSound();
    }
  };

  // Export JSON
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${state.brandTitle.replace(/[^a-zA-Z0-9]/g, '_')}_GoalChecker_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && typeof imported === 'object') {
          setState({ ...DEFAULT_STATE, ...imported });
          triggerCelebration();
        }
      } catch {
        alert('Invalid JSON dashboard file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Reset to default
  const handleReset = () => {
    if (confirm('Reset ALL texts, metrics, schedule, rules, and goals to original defaults?')) {
      setState(DEFAULT_STATE);
      triggerBlip();
    }
  };

  // Add a new metric
  const handleAddMetric = () => {
    const title = prompt('Enter metric title (e.g. WATCH HOURS, TIKTOK FOLLOWERS):');
    if (!title || !title.trim()) return;

    const newMetric: Metric = {
      id: `m_${Date.now()}`,
      title: title.trim().toUpperCase(),
      subtitle: 'Custom Creator Objective',
      current: 0,
      target: 100,
      remainingLabel: 'REMAINING',
      color: 'emerald',
      stepSizes: [1, 10],
    };

    setState((prev) => ({
      ...prev,
      metrics: [...prev.metrics, newMetric],
    }));
    triggerBlip();
  };

  const handleUpdateMetric = (updated: Metric) => {
    setState((prev) => ({
      ...prev,
      metrics: prev.metrics.map((m) => (m.id === updated.id ? updated : m)),
    }));
  };

  const handleDeleteMetric = (id: string) => {
    setState((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((m) => m.id !== id),
    }));
  };

  const activeGoal = state.goals.find((g) => g.status === 'In Progress') || state.goals[0];

  return (
    <div className="bg-grid min-h-screen pb-20 selection:bg-[#ff0055] selection:text-white">
      {/* TOP CONTROL HEADER */}
      <header className="border-b border-[#232330] bg-[#121218]/90 backdrop-blur-md sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Brand lockup */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff0055] to-[#ffe600] flex items-center justify-center font-['Orbitron',sans-serif] font-black text-xl text-black shadow-lg glow-pink shrink-0">
              {state.brandTitle.replace(/[^a-zA-Z0-9]/g, '').charAt(0) || 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <EditableText
                  value={state.brandTitle}
                  onSave={(val) => setState((prev) => ({ ...prev, brandTitle: val }))}
                  tag="h1"
                  className="font-['Orbitron',sans-serif] font-black text-xl md:text-2xl tracking-wider text-white"
                />
                <EditableText
                  value={state.brandBadge}
                  onSave={(val) => setState((prev) => ({ ...prev, brandBadge: val }))}
                  tag="span"
                  className="text-[10px] font-['Orbitron',sans-serif] px-2 py-0.5 rounded bg-[#ff0055]/20 text-[#ff0055] border border-[#ff0055]/50 font-bold uppercase"
                />
              </div>
              <EditableText
                value={state.brandSub}
                onSave={(val) => setState((prev) => ({ ...prev, brandSub: val }))}
                tag="p"
                className="text-xs text-gray-400 font-mono"
              />
            </div>
          </div>

          {/* Global Action Controls */}
          <div className="flex items-center gap-2 text-xs font-['Orbitron',sans-serif]">
            {/* Search Channel button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="px-3 py-2 rounded-lg bg-[#121218] hover:bg-[#1c1c28] text-white border border-red-500/50 hover:border-red-500 transition flex items-center gap-1.5 shadow-md active:scale-95"
              title="Search any YouTube channel and view stats"
            >
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span className="font-bold hidden sm:inline">Search Channel</span>
            </button>

            {/* AI Advisor Coach button */}
            <button
              onClick={() => setIsAiAdvisorOpen(true)}
              className="px-3 py-2 rounded-lg bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 transition flex items-center gap-1.5 shadow-md glow-cyan active:scale-95"
              title="Open AI Creator Strategist"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="font-bold hidden sm:inline">Channel AI</span>
            </button>

            {/* Stream HUD toggle */}
            <button
              onClick={() => setIsOverlayOpen(true)}
              className="px-3 py-2 rounded-lg bg-[#121218] hover:bg-[#1c1c28] text-[#ffe600] border border-[#ffe600]/40 transition flex items-center gap-1.5 shadow-md active:scale-95"
              title="Open OBS Stream HUD"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Stream HUD</span>
            </button>

            {/* Sound toggle */}
            <button
              onClick={() => setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
              className={`px-3 py-2 rounded-lg bg-[#121218] hover:bg-[#1c1c28] transition flex items-center gap-1.5 shadow-md ${
                state.soundEnabled ? 'text-[#00f0ff] border border-[#00f0ff]/40' : 'text-gray-500 border border-[#232330]'
              }`}
              title={state.soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            >
              {state.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Export JSON */}
            <button
              onClick={handleExport}
              className="px-3 py-2 rounded-lg bg-[#121218] hover:bg-[#1c1c28] text-[#00f0ff] border border-[#00f0ff]/40 transition flex items-center gap-1.5 shadow-md active:scale-95"
              title="Export configuration JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Export save</span>
            </button>

            {/* Import JSON */}
            <label className="px-3 py-2 rounded-lg bg-[#121218] hover:bg-[#1c1c28] text-[#ff0055] border border-[#ff0055]/40 cursor-pointer transition flex items-center gap-1.5 shadow-md active:scale-95">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Import save</span>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleImport}
                className="hidden"
                accept=".json"
              />
            </label>

            {/* Reset Defaults */}
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 transition flex items-center gap-1.5 shadow-md active:scale-95"
              title="Reset dashboard to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-8">
        {/* EDIT PROMPT NOTICE & ACTION BANNER */}
        <div className="bg-[#ff0055]/10 border border-[#ff0055]/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#ff0055]">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 animate-pulse shrink-0" />
            <span>
              <strong>EVERY TEXT IS EDITABLE!</strong> Click ANY metric, task, directive, or date to edit inline.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="px-3 py-1 rounded-lg bg-black/70 hover:bg-black text-white border border-[#232330] hover:border-red-500 transition flex items-center gap-1.5 text-xs font-['Orbitron',sans-serif] active:scale-95"
            >
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>Search My Channel</span>
            </button>
            <button
              onClick={() => setIsAiAdvisorOpen(true)}
              className="px-3 py-1 rounded-lg bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/40 transition flex items-center gap-1.5 text-xs font-['Orbitron',sans-serif] active:scale-95"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Channel AI Coach</span>
            </button>
          </div>
        </div>

        {/* MOTIVATIONAL CREED & COUNTDOWN SECTION */}
        <section className="bg-gradient-to-r from-[#121218] via-black to-[#121218] border border-[#232330] rounded-2xl p-5 md:p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left z-10 flex-1">
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <Flame className="w-4 h-4 text-[#00f0ff]" />
              <EditableText
                value={state.quoteBadge}
                onSave={(val) => setState((prev) => ({ ...prev, quoteBadge: val }))}
                tag="p"
                className="text-xs font-['Orbitron',sans-serif] text-[#00f0ff] uppercase tracking-widest font-bold"
              />
            </div>
            <EditableText
              value={state.mainQuote}
              onSave={(val) => setState((prev) => ({ ...prev, mainQuote: val }))}
              multiline
              tag="h2"
              className="text-lg md:text-2xl font-bold italic text-white p-1 rounded transition block"
            />
          </div>

          {/* Target Countdown Timer */}
          <div className="bg-[#121218]/90 border border-[#232330] rounded-xl p-4 min-w-[280px] text-center z-10 shadow-lg">
            <div className="text-xs font-['Orbitron',sans-serif] text-gray-400 flex items-center justify-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-[#ffe600]" />
              <EditableText
                value={state.timerLabel}
                onSave={(val) => setState((prev) => ({ ...prev, timerLabel: val }))}
                tag="span"
              />
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <input
                type="date"
                value={state.targetDate}
                onChange={(e) => setState((prev) => ({ ...prev, targetDate: e.target.value }))}
                className="bg-black text-[#00f0ff] font-['Orbitron',sans-serif] font-bold text-xs px-2.5 py-1 rounded border border-[#232330] outline-none focus:border-[#00f0ff] cursor-pointer"
              />
            </div>

            <div className="text-2xl font-['Orbitron',sans-serif] font-black text-[#ff0055] glow-text-pink tabular-nums">
              {countdown}
            </div>
          </div>
        </section>

        {/* METRICS & COUNTERS GRID */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="font-['Orbitron',sans-serif] text-xs font-bold text-gray-400 uppercase tracking-wider">
              Core Objectives & Volume
            </span>
            <button
              onClick={handleAddMetric}
              className="text-xs font-['Orbitron',sans-serif] text-[#00f0ff] hover:text-white flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Metric
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {state.metrics.map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                onUpdate={handleUpdateMetric}
                onDelete={handleDeleteMetric}
                canDelete={state.metrics.length > 1}
                onCelebration={triggerCelebration}
              />
            ))}
          </div>
        </section>

        {/* WEEKLY PRODUCTION CALENDAR */}
        <WeeklySchedule
          schedule={state.schedule}
          onUpdate={(updatedSchedule) => setState((prev) => ({ ...prev, schedule: updatedSchedule }))}
          title={state.calSectionTitle}
          sub={state.calSectionSub}
          onUpdateTitle={(val) => setState((prev) => ({ ...prev, calSectionTitle: val }))}
          onUpdateSub={(val) => setState((prev) => ({ ...prev, calSectionSub: val }))}
        />

        {/* GOALS & TO-DO LISTS SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GoalsSection
            goals={state.goals}
            onUpdate={(updatedGoals) => setState((prev) => ({ ...prev, goals: updatedGoals }))}
            title={state.goalsTitle}
            onUpdateTitle={(val) => setState((prev) => ({ ...prev, goalsTitle: val }))}
            onCelebration={triggerCelebration}
          />

          <TodoSection
            todos={state.todos}
            onUpdate={(updatedTodos) => setState((prev) => ({ ...prev, todos: updatedTodos }))}
            title={state.todoTitle}
            onUpdateTitle={(val) => setState((prev) => ({ ...prev, todoTitle: val }))}
            onCelebration={triggerCelebration}
          />
        </section>

        {/* MASTER RULES & PERFORMANCE BENCHMARKS */}
        <RulesSection
          rules={state.rules}
          benchmarks={state.benchmarks}
          onUpdateRules={(updatedRules) => setState((prev) => ({ ...prev, rules: updatedRules }))}
          onUpdateBenchmarks={(updatedBenchmarks) =>
            setState((prev) => ({ ...prev, benchmarks: updatedBenchmarks }))
          }
          rulesTitle={state.rulesTitle}
          benchmarksTitle={state.benchmarksTitle}
          onUpdateRulesTitle={(val) => setState((prev) => ({ ...prev, rulesTitle: val }))}
          onUpdateBenchmarksTitle={(val) => setState((prev) => ({ ...prev, benchmarksTitle: val }))}
        />
      </main>

      {/* OBS STREAM OVERLAY HUD MODAL */}
      <StreamOverlayModal
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        brandTitle={state.brandTitle}
        metrics={state.metrics}
        countdown={countdown}
        activeGoal={activeGoal}
      />

      {/* YOUTUBE CHANNEL SEARCH MODAL */}
      <ChannelSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onApplyStats={handleApplyChannelData}
      />

      {/* AI CREATOR STRATEGIST DRAWER */}
      <AiAdvisorDrawer
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        appState={state}
      />
    </div>
  );
}
