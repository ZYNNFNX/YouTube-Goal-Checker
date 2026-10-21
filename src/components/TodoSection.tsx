import React, { useState } from 'react';
import { TodoItem } from '../types.ts';
import { EditableText } from './EditableText.tsx';
import { CheckSquare, Trash2, Plus, Check } from 'lucide-react';

interface TodoSectionProps {
  todos: TodoItem[];
  onUpdate: (updatedTodos: TodoItem[]) => void;
  title: string;
  onUpdateTitle: (title: string) => void;
  onCelebration?: () => void;
}

export const TodoSection: React.FC<TodoSectionProps> = ({
  todos,
  onUpdate,
  title,
  onUpdateTitle,
  onCelebration,
}) => {
  const [newText, setNewText] = useState('');
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: newText.trim(),
      completed: false,
    };

    onUpdate([newItem, ...todos]);
    setNewText('');
  };

  const handleToggle = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    const willBeCompleted = !todo?.completed;

    onUpdate(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    if (willBeCompleted) {
      onCelebration?.();
    }
  };

  const handleUpdateText = (id: string, updatedText: string) => {
    onUpdate(todos.map((t) => (t.id === id ? { ...t, text: updatedText } : t)));
  };

  const handleDelete = (id: string) => {
    onUpdate(todos.filter((t) => t.id !== id));
  };

  const handleClearCompleted = () => {
    onUpdate(todos.filter((t) => !t.completed));
  };

  const activeCount = todos.filter((t) => !t.completed).length;

  const filteredTodos = todos.filter((t) => {
    if (filter === 'Active') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  return (
    <div className="bg-[#121218] border border-[#232330] rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-2xl">
      <div>
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#ff0055]" />
            <EditableText
              value={title}
              onSave={onUpdateTitle}
              tag="h2"
              className="font-['Orbitron',sans-serif] font-bold text-lg md:text-xl text-white"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-['Orbitron',sans-serif] text-gray-400">
            <span className="text-[#ff0055] font-bold">{activeCount}</span> Active Left
          </div>
        </div>

        {/* Add Todo Input Form */}
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add edit, render, or clip task..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="flex-1 bg-black border border-[#232330] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff0055] transition"
          />
          <button
            type="submit"
            className="bg-[#ff0055] hover:bg-[#db2777] text-white font-['Orbitron',sans-serif] font-bold px-4 py-2 rounded-lg text-xs transition active:scale-95 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> ADD
          </button>
        </form>

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#232330]/60 text-xs font-['Orbitron',sans-serif]">
          <div className="flex items-center gap-1">
            {(['All', 'Active', 'Completed'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-2.5 py-1 rounded transition text-[11px] ${
                  filter === mode
                    ? 'bg-[#ff0055]/20 text-[#ff0055] border border-[#ff0055]/40 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {todos.some((t) => t.completed) && (
            <button
              onClick={handleClearCompleted}
              className="text-[11px] text-gray-400 hover:text-red-400 transition"
            >
              Clear Completed
            </button>
          )}
        </div>

        {/* Todo List Items */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredTodos.length === 0 && (
            <div className="p-6 text-center text-gray-500 font-mono text-xs">
              No tasks found. Everything clear!
            </div>
          )}
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black border border-[#232330] hover:border-[#ff0055]/40 transition shadow-sm group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleToggle(todo.id)}
                  className={`w-4 h-4 rounded flex items-center justify-center transition border ${
                    todo.completed
                      ? 'bg-[#ff0055] border-[#ff0055] text-white'
                      : 'border-gray-500 hover:border-[#ff0055]'
                  }`}
                >
                  {todo.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                <EditableText
                  value={todo.text}
                  onSave={(val) => handleUpdateText(todo.id, val)}
                  tag="span"
                  className={`text-sm flex-1 outline-none ${
                    todo.completed ? 'line-through text-gray-500' : 'text-gray-200'
                  }`}
                />
              </div>

              <button
                onClick={() => handleDelete(todo.id)}
                className="text-gray-500 hover:text-red-400 p-1 rounded transition opacity-60 group-hover:opacity-100"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
