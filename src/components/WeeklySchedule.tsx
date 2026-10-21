import React, { useState } from 'react';
import { ScheduleDay } from '../types.ts';
import { EditableText } from './EditableText.tsx';
import { X, Calendar, Trash2 } from 'lucide-react';

interface WeeklyScheduleProps {
  schedule: ScheduleDay[];
  onUpdate: (updatedSchedule: ScheduleDay[]) => void;
  title: string;
  sub: string;
  onUpdateTitle: (title: string) => void;
  onUpdateSub: (sub: string) => void;
}

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  schedule,
  onUpdate,
  title,
  sub,
  onUpdateTitle,
  onUpdateSub,
}) => {
  const [activeDayInput, setActiveDayInput] = useState<number | null>(null);
  const [newTaskText, setNewTaskText] = useState('');

  const handleUpdateDayTitle = (dayIdx: number, newTitle: string) => {
    const updated = [...schedule];
    updated[dayIdx] = { ...updated[dayIdx], day: newTitle };
    onUpdate(updated);
  };

  const handleUpdateDayFocus = (dayIdx: number, newFocus: string) => {
    const updated = [...schedule];
    updated[dayIdx] = { ...updated[dayIdx], focus: newFocus };
    onUpdate(updated);
  };

  const handleUpdateTask = (dayIdx: number, taskIdx: number, newTask: string) => {
    const updated = [...schedule];
    const dayTasks = [...updated[dayIdx].tasks];
    dayTasks[taskIdx] = newTask;
    updated[dayIdx] = { ...updated[dayIdx], tasks: dayTasks };
    onUpdate(updated);
  };

  const handleRemoveTask = (dayIdx: number, taskIdx: number) => {
    const updated = [...schedule];
    const dayTasks = updated[dayIdx].tasks.filter((_, idx) => idx !== taskIdx);
    updated[dayIdx] = { ...updated[dayIdx], tasks: dayTasks };
    onUpdate(updated);
  };

  const handleAddTask = (dayIdx: number) => {
    if (!newTaskText.trim()) {
      setActiveDayInput(null);
      return;
    }
    const updated = [...schedule];
    updated[dayIdx] = {
      ...updated[dayIdx],
      tasks: [...updated[dayIdx].tasks, newTaskText.trim()],
    };
    onUpdate(updated);
    setNewTaskText('');
    setActiveDayInput(null);
  };

  const handleClearDayTasks = (dayIdx: number) => {
    if (confirm(`Clear all tasks for ${schedule[dayIdx].day}?`)) {
      const updated = [...schedule];
      updated[dayIdx] = { ...updated[dayIdx], tasks: [] };
      onUpdate(updated);
    }
  };

  return (
    <section className="bg-[#121218] border border-[#232330] rounded-2xl p-5 md:p-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#00f0ff]" />
            <EditableText
              value={title}
              onSave={onUpdateTitle}
              tag="h2"
              className="font-['Orbitron',sans-serif] font-bold text-xl text-white"
            />
          </div>
          <EditableText
            value={sub}
            onSave={onUpdateSub}
            tag="p"
            className="text-xs text-gray-400 mt-1 block"
          />
        </div>

        <div className="text-xs text-gray-400 font-mono hidden sm:block">
          7-Day Production Pipeline
        </div>
      </div>

      {/* Grid for all 7 days */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {schedule.map((dayData, dayIdx) => (
          <div
            key={dayIdx}
            className="bg-black border border-[#232330] rounded-xl p-3.5 flex flex-col justify-between hover:border-[#ff0055]/40 transition shadow-md group/card"
          >
            <div>
              {/* Day Card Header */}
              <div className="flex items-center justify-between border-b border-[#232330] pb-2 mb-2">
                <EditableText
                  value={dayData.day}
                  onSave={(val) => handleUpdateDayTitle(dayIdx, val)}
                  tag="span"
                  className="font-['Orbitron',sans-serif] font-bold text-xs text-[#ff0055] uppercase"
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setActiveDayInput(dayIdx);
                      setNewTaskText('');
                    }}
                    className="text-[10px] font-['Orbitron',sans-serif] bg-[#ff0055]/20 text-[#ff0055] hover:bg-[#ff0055]/30 px-2 py-0.5 rounded border border-[#ff0055]/30 transition"
                    title="Add task to this day"
                  >
                    + Task
                  </button>
                  {dayData.tasks.length > 0 && (
                    <button
                      onClick={() => handleClearDayTasks(dayIdx)}
                      className="opacity-0 group-hover/card:opacity-100 text-gray-500 hover:text-red-400 p-0.5 transition"
                      title="Clear day tasks"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Day Focus Headline */}
              <div className="mb-3">
                <EditableText
                  value={dayData.focus}
                  onSave={(val) => handleUpdateDayFocus(dayIdx, val)}
                  tag="div"
                  className="text-xs font-semibold text-[#00f0ff] p-1 rounded hover:bg-white/5 block"
                />
              </div>

              {/* Active inline task creator */}
              {activeDayInput === dayIdx && (
                <div className="mb-2 p-1.5 bg-[#1c1c28] border border-[#00f0ff]/50 rounded">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter task..."
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTask(dayIdx);
                      if (e.key === 'Escape') setActiveDayInput(null);
                    }}
                    className="w-full bg-black text-white text-xs px-2 py-1 rounded outline-none border border-[#232330] focus:border-[#00f0ff]"
                  />
                  <div className="flex justify-end gap-1.5 mt-1.5">
                    <button
                      onClick={() => setActiveDayInput(null)}
                      className="text-[10px] text-gray-400 hover:text-white px-2 py-0.5"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddTask(dayIdx)}
                      className="text-[10px] bg-[#00f0ff] text-black font-bold px-2 py-0.5 rounded font-['Orbitron',sans-serif]"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Tasks List */}
              <div className="space-y-1.5">
                {dayData.tasks.length === 0 && activeDayInput !== dayIdx && (
                  <p className="text-[11px] text-gray-600 italic py-2 text-center">No tasks scheduled</p>
                )}
                {dayData.tasks.map((task, taskIdx) => (
                  <div
                    key={taskIdx}
                    className="flex items-center justify-between text-xs text-gray-300 bg-[#121218]/80 hover:bg-[#1c1c28] p-1.5 rounded border border-[#232330]/60 group/task transition"
                  >
                    <EditableText
                      value={task}
                      onSave={(val) => handleUpdateTask(dayIdx, taskIdx, val)}
                      tag="span"
                      className="flex-1 hover:text-white"
                    />
                    <button
                      onClick={() => handleRemoveTask(dayIdx, taskIdx)}
                      className="opacity-0 group-hover/task:opacity-100 text-red-400 hover:text-red-300 ml-1 p-0.5 transition"
                      title="Delete task"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
