import React, { useState } from 'react';
import { Goal, GoalRange, GoalStatus } from '../types.ts';
import { EditableText } from './EditableText.tsx';
import { Target, Trash2, Plus, CheckCircle2 } from 'lucide-react';

interface GoalsSectionProps {
  goals: Goal[];
  onUpdate: (updatedGoals: Goal[]) => void;
  title: string;
  onUpdateTitle: (title: string) => void;
  onCelebration?: () => void;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({
  goals,
  onUpdate,
  title,
  onUpdateTitle,
  onCelebration,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newRange, setNewRange] = useState<GoalRange>('Week 1');
  const [filterRange, setFilterRange] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const ranges: GoalRange[] = ['Today', 'Week 1', 'Week 2', 'Month 1', 'Long Term'];

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      range: newRange,
      status: 'Pending',
    };

    onUpdate([newGoal, ...goals]);
    setNewTitle('');
  };

  const handleUpdateTitle = (id: string, updatedTitle: string) => {
    onUpdate(goals.map((g) => (g.id === id ? { ...g, title: updatedTitle } : g)));
  };

  const handleUpdateRange = (id: string, updatedRange: GoalRange) => {
    onUpdate(goals.map((g) => (g.id === id ? { ...g, range: updatedRange } : g)));
  };

  const handleUpdateStatus = (id: string, updatedStatus: GoalStatus) => {
    const prevGoal = goals.find((g) => g.id === id);
    onUpdate(goals.map((g) => (g.id === id ? { ...g, status: updatedStatus } : g)));

    if (prevGoal?.status !== 'Achieved' && updatedStatus === 'Achieved') {
      onCelebration?.();
    }
  };

  const handleDeleteGoal = (id: string) => {
    onUpdate(goals.filter((g) => g.id !== id));
  };

  const achievedCount = goals.filter((g) => g.status === 'Achieved').length;

  const filteredGoals = goals.filter((g) => {
    const matchesRange = filterRange === 'All' || g.range === filterRange;
    const matchesStatus = filterStatus === 'All' || g.status === filterStatus;
    return matchesRange && matchesStatus;
  });

  return (
    <div className="bg-[#121218] border border-[#232330] rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-2xl">
      <div>
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#00f0ff]" />
            <EditableText
              value={title}
              onSave={onUpdateTitle}
              tag="h2"
              className="font-['Orbitron',sans-serif] font-bold text-lg md:text-xl text-white"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-['Orbitron',sans-serif] text-gray-400">
            <span className="text-[#10b981] font-bold">{achievedCount}</span> / <span>{goals.length}</span> Achieved
          </div>
        </div>

        {/* Add Goal Input Form */}
        <form onSubmit={handleAddGoal} className="flex flex-wrap sm:flex-nowrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter target goal..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 min-w-[180px] bg-black border border-[#232330] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00f0ff] transition"
          />
          <select
            value={newRange}
            onChange={(e) => setNewRange(e.target.value as GoalRange)}
            className="bg-black border border-[#232330] rounded-lg px-2 py-2 text-xs text-[#00f0ff] font-['Orbitron',sans-serif] focus:outline-none cursor-pointer"
          >
            {ranges.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-[#00f0ff] hover:bg-[#67e8f9] text-black font-['Orbitron',sans-serif] font-bold px-4 py-2 rounded-lg text-xs transition active:scale-95 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> ADD
          </button>
        </form>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-[#232330]/60 text-xs font-['Orbitron',sans-serif]">
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <button
              onClick={() => setFilterRange('All')}
              className={`px-2 py-1 rounded transition text-[11px] ${
                filterRange === 'All'
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setFilterRange(r)}
                className={`px-2 py-1 rounded transition text-[11px] whitespace-nowrap ${
                  filterRange === r
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-black text-[11px] font-['Orbitron',sans-serif] text-gray-300 border border-[#232330] rounded px-2 py-1 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Achieved">Achieved</option>
            </select>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredGoals.length === 0 && (
            <div className="p-6 text-center text-gray-500 font-mono text-xs">
              No goals found for selected filter. Add one above!
            </div>
          )}
          {filteredGoals.map((goal) => {
            let statusBadge = 'bg-gray-800 text-gray-300 border-gray-700';
            if (goal.status === 'Achieved') {
              statusBadge = 'bg-[#10b981]/20 text-[#34d399] border-[#10b981]/40';
            } else if (goal.status === 'In Progress') {
              statusBadge = 'bg-[#ff0055]/20 text-[#ff0055] border-[#ff0055]/40';
            }

            return (
              <div
                key={goal.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black border border-[#232330] hover:border-[#00f0ff]/40 transition shadow-sm group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {goal.status === 'Achieved' && (
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                  )}
                  <EditableText
                    value={goal.title}
                    onSave={(val) => handleUpdateTitle(goal.id, val)}
                    tag="span"
                    className={`text-sm outline-none ${
                      goal.status === 'Achieved' ? 'line-through text-gray-400' : 'text-gray-200'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={goal.range}
                    onChange={(e) => handleUpdateRange(goal.id, e.target.value as GoalRange)}
                    className="bg-[#121218] text-[11px] font-['Orbitron',sans-serif] text-[#00f0ff] border border-[#232330] rounded px-1.5 py-1 outline-none cursor-pointer"
                  >
                    {ranges.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>

                  <select
                    value={goal.status}
                    onChange={(e) => handleUpdateStatus(goal.id, e.target.value as GoalStatus)}
                    className={`text-[11px] font-['Orbitron',sans-serif] rounded px-1.5 py-1 border outline-none font-semibold cursor-pointer ${statusBadge}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Achieved">Achieved</option>
                  </select>

                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-gray-500 hover:text-red-400 p-1 rounded transition opacity-60 group-hover:opacity-100"
                    title="Delete goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
