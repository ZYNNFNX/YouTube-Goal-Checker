import React from 'react';
import { Metric } from '../types.ts';
import { EditableText } from './EditableText.tsx';
import { Zap, Film, Users, Video, Trash2, Award } from 'lucide-react';

interface MetricCardProps {
  metric: Metric;
  onUpdate: (updated: Metric) => void;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
  onCelebration?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  onUpdate,
  onDelete,
  canDelete = false,
  onCelebration,
}) => {
  const percentage = metric.target > 0 ? Math.min(100, Math.round((metric.current / metric.target) * 100)) : 0;
  const remaining = Math.max(0, metric.target - metric.current);
  const isCompleted = metric.target > 0 && metric.current >= metric.target;

  const colorStyles = {
    pink: {
      borderHover: 'hover:border-[#ff0055]/60',
      iconBg: 'bg-[#ff0055]/20 border-[#ff0055]/40 text-[#ff0055]',
      badgeBg: 'bg-[#ff0055]/10 text-[#ff0055] border-[#ff0055]/30',
      focusBorder: 'focus:border-[#ff0055]',
      btnBg: 'bg-[#ff0055]/20 hover:bg-[#ff0055]/30 text-[#ff0055] border-[#ff0055]/40',
      barGradient: 'bg-gradient-to-r from-[#ff0055] to-[#ffe600]',
      glowShadow: 'glow-pink',
      textColor: 'text-[#ff0055]',
    },
    cyan: {
      borderHover: 'hover:border-[#00f0ff]/60',
      iconBg: 'bg-[#00f0ff]/20 border-[#00f0ff]/40 text-[#00f0ff]',
      badgeBg: 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30',
      focusBorder: 'focus:border-[#00f0ff]',
      btnBg: 'bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] border-[#00f0ff]/40',
      barGradient: 'bg-gradient-to-r from-[#00f0ff] to-[#3b82f6]',
      glowShadow: 'glow-cyan',
      textColor: 'text-[#00f0ff]',
    },
    gold: {
      borderHover: 'hover:border-[#ffe600]/60',
      iconBg: 'bg-[#ffe600]/20 border-[#ffe600]/40 text-[#ffe600]',
      badgeBg: 'bg-[#ffe600]/10 text-[#ffe600] border-[#ffe600]/30',
      focusBorder: 'focus:border-[#ffe600]',
      btnBg: 'bg-[#ffe600]/20 hover:bg-[#ffe600]/30 text-[#ffe600] border-[#ffe600]/40',
      barGradient: 'bg-gradient-to-r from-[#ffe600] to-[#fde047]',
      glowShadow: 'glow-gold',
      textColor: 'text-[#ffe600]',
    },
    emerald: {
      borderHover: 'hover:border-[#10b981]/60',
      iconBg: 'bg-[#10b981]/20 border-[#10b981]/40 text-[#10b981]',
      badgeBg: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30',
      focusBorder: 'focus:border-[#10b981]',
      btnBg: 'bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#10b981] border-[#10b981]/40',
      barGradient: 'bg-gradient-to-r from-[#10b981] to-[#34d399]',
      glowShadow: 'glow-cyan',
      textColor: 'text-[#10b981]',
    },
    purple: {
      borderHover: 'hover:border-[#a855f7]/60',
      iconBg: 'bg-[#a855f7]/20 border-[#a855f7]/40 text-[#a855f7]',
      badgeBg: 'bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30',
      focusBorder: 'focus:border-[#a855f7]',
      btnBg: 'bg-[#a855f7]/20 hover:bg-[#a855f7]/30 text-[#a855f7] border-[#a855f7]/40',
      barGradient: 'bg-gradient-to-r from-[#a855f7] to-[#ec4899]',
      glowShadow: 'glow-pink',
      textColor: 'text-[#a855f7]',
    },
  }[metric.color] || {
    borderHover: 'hover:border-[#ff0055]/60',
    iconBg: 'bg-[#ff0055]/20 border-[#ff0055]/40 text-[#ff0055]',
    badgeBg: 'bg-[#ff0055]/10 text-[#ff0055] border-[#ff0055]/30',
    focusBorder: 'focus:border-[#ff0055]',
    btnBg: 'bg-[#ff0055]/20 hover:bg-[#ff0055]/30 text-[#ff0055] border-[#ff0055]/40',
    barGradient: 'bg-gradient-to-r from-[#ff0055] to-[#ffe600]',
    glowShadow: 'glow-pink',
    textColor: 'text-[#ff0055]',
  };

  const renderIcon = () => {
    if (metric.color === 'pink') return <Zap className="w-5 h-5" />;
    if (metric.color === 'cyan') return <Film className="w-5 h-5" />;
    if (metric.color === 'gold') return <Users className="w-5 h-5" />;
    return <Video className="w-5 h-5" />;
  };

  const handleDelta = (delta: number) => {
    const nextVal = Math.max(0, metric.current + delta);
    const wasCompleted = metric.current >= metric.target;
    onUpdate({ ...metric, current: nextVal });
    if (!wasCompleted && nextVal >= metric.target && metric.target > 0) {
      onCelebration?.();
    }
  };

  const handleCurrentChange = (valStr: string) => {
    const val = Math.max(0, parseInt(valStr, 10) || 0);
    const wasCompleted = metric.current >= metric.target;
    onUpdate({ ...metric, current: val });
    if (!wasCompleted && val >= metric.target && metric.target > 0) {
      onCelebration?.();
    }
  };

  const handleTargetChange = (valStr: string) => {
    const val = Math.max(1, parseInt(valStr, 10) || 1);
    onUpdate({ ...metric, target: val });
  };

  return (
    <div
      className={`bg-[#121218] border border-[#232330] rounded-2xl p-5 relative overflow-hidden shadow-xl transition-all duration-300 ${colorStyles.borderHover} ${
        isCompleted ? 'ring-1 ring-[#ffe600]/40' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${colorStyles.iconBg}`}>
            {renderIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <EditableText
                value={metric.title}
                onSave={(val) => onUpdate({ ...metric, title: val })}
                tag="h3"
                className="font-['Orbitron',sans-serif] font-bold text-lg text-white"
              />
              {isCompleted && (
                <span title="Goal Met!">
                  <Award className="w-4 h-4 text-[#ffe600] inline-block animate-bounce" />
                </span>
              )}
            </div>
            <EditableText
              value={metric.subtitle}
              onSave={(val) => onUpdate({ ...metric, subtitle: val })}
              tag="p"
              className="text-xs text-gray-400 font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-['Orbitron',sans-serif] px-2 py-1 rounded font-bold border tabular-nums ${colorStyles.badgeBg}`}
          >
            {percentage}%
          </span>
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(metric.id)}
              className="text-gray-500 hover:text-red-400 p-1 rounded transition"
              title="Delete metric"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Numerical inputs: Current / Target */}
      <div className="my-4 flex items-baseline justify-between">
        <div className="flex items-baseline gap-1.5">
          <input
            type="number"
            min={0}
            value={metric.current}
            onChange={(e) => handleCurrentChange(e.target.value)}
            className={`bg-transparent font-['Orbitron',sans-serif] font-black text-3xl md:text-4xl text-white outline-none border-b border-transparent hover:border-gray-600 ${colorStyles.focusBorder} w-24 md:w-32 tabular-nums transition`}
          />
          <span className="text-gray-500 font-['Orbitron',sans-serif] text-xl font-bold">/</span>
          <input
            type="number"
            min={1}
            value={metric.target}
            onChange={(e) => handleTargetChange(e.target.value)}
            className={`bg-transparent font-['Orbitron',sans-serif] font-bold text-lg md:text-xl text-gray-400 outline-none border-b border-transparent hover:border-gray-600 ${colorStyles.focusBorder} w-20 md:w-28 tabular-nums transition`}
          />
        </div>

        <div className="text-right">
          <EditableText
            value={metric.remainingLabel}
            onSave={(val) => onUpdate({ ...metric, remainingLabel: val })}
            tag="span"
            className="text-[10px] font-['Orbitron',sans-serif] text-gray-400 uppercase tracking-wider block"
          />
          <span className={`font-['Orbitron',sans-serif] font-bold text-sm tabular-nums ${colorStyles.textColor}`}>
            {remaining.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Fast Increment / Decrement Buttons */}
      <div className="flex gap-2 mb-4">
        {/* Negative step */}
        <button
          onClick={() => handleDelta(-metric.stepSizes[0])}
          className="flex-1 py-1.5 rounded bg-black hover:bg-[#1c1c28] text-gray-300 font-['Orbitron',sans-serif] text-xs font-semibold border border-[#232330] transition active:scale-95"
        >
          -{metric.stepSizes[0]}
        </button>
        {/* Positive step 1 */}
        <button
          onClick={() => handleDelta(metric.stepSizes[0])}
          className={`flex-1 py-1.5 rounded font-['Orbitron',sans-serif] text-xs font-semibold border transition active:scale-95 ${colorStyles.btnBg}`}
        >
          +{metric.stepSizes[0]}
        </button>
        {/* Positive step 2 */}
        {metric.stepSizes[1] && (
          <button
            onClick={() => handleDelta(metric.stepSizes[1])}
            className={`flex-1 py-1.5 rounded font-['Orbitron',sans-serif] text-xs font-semibold border transition active:scale-95 ${colorStyles.btnBg}`}
          >
            +{metric.stepSizes[1]}
          </button>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-black h-2.5 rounded-full overflow-hidden border border-[#232330] relative">
        <div
          className={`h-full transition-all duration-500 rounded-full ${colorStyles.barGradient}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
