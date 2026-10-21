import React from 'react';
import { Rule, Benchmark } from '../types.ts';
import { EditableText } from './EditableText.tsx';
import { ShieldCheck, Flag, Plus, Trash2, ChevronRight } from 'lucide-react';

interface RulesSectionProps {
  rules: Rule[];
  benchmarks: Benchmark[];
  onUpdateRules: (updated: Rule[]) => void;
  onUpdateBenchmarks: (updated: Benchmark[]) => void;
  rulesTitle: string;
  benchmarksTitle: string;
  onUpdateRulesTitle: (title: string) => void;
  onUpdateBenchmarksTitle: (title: string) => void;
}

export const RulesSection: React.FC<RulesSectionProps> = ({
  rules,
  benchmarks,
  onUpdateRules,
  onUpdateBenchmarks,
  rulesTitle,
  benchmarksTitle,
  onUpdateRulesTitle,
  onUpdateBenchmarksTitle,
}) => {
  const handleAddRule = () => {
    const text = prompt('Enter new master editing rule:');
    if (text && text.trim()) {
      onUpdateRules([...rules, { id: Date.now().toString(), text: text.trim() }]);
    }
  };

  const handleUpdateRule = (id: string, text: string) => {
    onUpdateRules(rules.map((r) => (r.id === id ? { ...r, text } : r)));
  };

  const handleDeleteRule = (id: string) => {
    onUpdateRules(rules.filter((r) => r.id !== id));
  };

  const handleAddBenchmark = () => {
    const text = prompt('Enter new target milestone or benchmark:');
    if (text && text.trim()) {
      onUpdateBenchmarks([...benchmarks, { id: Date.now().toString(), text: text.trim() }]);
    }
  };

  const handleUpdateBenchmark = (id: string, text: string) => {
    onUpdateBenchmarks(benchmarks.map((b) => (b.id === id ? { ...b, text } : b)));
  };

  const handleDeleteBenchmark = (id: string) => {
    onUpdateBenchmarks(benchmarks.filter((b) => b.id !== id));
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Master Rules */}
      <div className="bg-[#121218] border border-[#232330] rounded-2xl p-5 md:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#ffe600]" />
            <EditableText
              value={rulesTitle}
              onSave={onUpdateRulesTitle}
              tag="h2"
              className="font-['Orbitron',sans-serif] font-bold text-lg md:text-xl text-white"
            />
          </div>
          <button
            onClick={handleAddRule}
            className="text-xs font-['Orbitron',sans-serif] bg-[#ffe600]/20 text-[#ffe600] hover:bg-[#ffe600]/30 px-3 py-1.5 rounded-lg border border-[#ffe600]/40 transition active:scale-95 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Rule
          </button>
        </div>

        <div className="space-y-2.5">
          {rules.length === 0 && (
            <p className="text-xs text-gray-500 italic py-2">No editing rules defined yet.</p>
          )}
          {rules.map((rule, idx) => (
            <div
              key={rule.id}
              className="flex items-center justify-between gap-2 text-sm text-gray-300 bg-black p-2.5 rounded-xl border border-[#232330] hover:border-[#ffe600]/40 transition group"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className="text-[#ffe600] font-['Orbitron',sans-serif] font-bold text-xs shrink-0">
                  {idx + 1}.
                </span>
                <EditableText
                  value={rule.text}
                  onSave={(val) => handleUpdateRule(rule.id, val)}
                  tag="span"
                  className="outline-none flex-1 hover:text-white"
                />
              </div>
              <button
                onClick={() => handleDeleteRule(rule.id)}
                className="text-gray-500 hover:text-red-400 p-1 opacity-60 group-hover:opacity-100 transition"
                title="Delete rule"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmarks & Milestones */}
      <div className="bg-[#121218] border border-[#232330] rounded-2xl p-5 md:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-[#00f0ff]" />
            <EditableText
              value={benchmarksTitle}
              onSave={onUpdateBenchmarksTitle}
              tag="h2"
              className="font-['Orbitron',sans-serif] font-bold text-lg md:text-xl text-white"
            />
          </div>
          <button
            onClick={handleAddBenchmark}
            className="text-xs font-['Orbitron',sans-serif] bg-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/30 px-3 py-1.5 rounded-lg border border-[#00f0ff]/40 transition active:scale-95 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Milestone
          </button>
        </div>

        <div className="space-y-2.5">
          {benchmarks.length === 0 && (
            <p className="text-xs text-gray-500 italic py-2">No benchmarks defined yet.</p>
          )}
          {benchmarks.map((benchmark) => (
            <div
              key={benchmark.id}
              className="flex items-center justify-between gap-2 text-sm text-gray-300 bg-black p-2.5 rounded-xl border border-[#232330] hover:border-[#00f0ff]/40 transition group"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <ChevronRight className="w-4 h-4 text-[#00f0ff] shrink-0" />
                <EditableText
                  value={benchmark.text}
                  onSave={(val) => handleUpdateBenchmark(benchmark.id, val)}
                  tag="span"
                  className="outline-none flex-1 hover:text-white"
                />
              </div>
              <button
                onClick={() => handleDeleteBenchmark(benchmark.id)}
                className="text-gray-500 hover:text-red-400 p-1 opacity-60 group-hover:opacity-100 transition"
                title="Delete benchmark"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
