import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Trash2, Sparkles, Loader2, Zap, ArrowUpRight } from 'lucide-react';
import { AppState } from '../types.ts';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface AiAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
}

export const AiAdvisorDrawer: React.FC<AiAdvisorDrawerProps> = ({
  isOpen,
  onClose,
  appState,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Welcome to **AI Creator Strategist**. I have analyzed your dashboard for **${appState.brandTitle}**.\n\nAsk me anything about your channel: viral Shorts pacing, algorithm mechanics, title CTR optimization, or weekly schedule critiques!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Give me 5 viral Shorts hooks for my channel',
    'How do I double my viewer retention in the first 3 seconds?',
    'Critique my weekly production schedule and suggest improvements',
    'Generate 5 high-CTR titles for my next video',
    'How can I convert casual Shorts viewers into permanent subscribers?',
  ];

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare channel context
      const channelContext = {
        brandTitle: appState.brandTitle,
        subscribers: appState.metrics.find((m) => m.title.includes('SUB'))?.current || 0,
        subscribersTarget: appState.metrics.find((m) => m.title.includes('SUB'))?.target || 10000,
        shorts: appState.metrics.find((m) => m.title.includes('SHORT'))?.current || 0,
        shortsTarget: appState.metrics.find((m) => m.title.includes('SHORT'))?.target || 100,
        videos: appState.metrics.find((m) => m.title.includes('VIDEO'))?.current || 0,
        videosTarget: appState.metrics.find((m) => m.title.includes('VIDEO'))?.target || 30,
        targetDate: appState.targetDate,
        mainQuote: appState.mainQuote,
        rules: appState.rules.map((r) => r.text),
      };

      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText.trim(),
          history,
          channelContext,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get advice');
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.reply || 'Keep perfecting your content!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: `⚠️ Error: ${err?.message || 'Unable to connect to AI Strategist. Please try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: `Conversation reset. How can I assist **${appState.brandTitle}** today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Simple Markdown renderer for bullet points, bold text, etc.
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold replacement
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#00f0ff] font-semibold">$1</strong>');
      if (line.startsWith('# ')) {
        return (
          <h3 key={i} className="font-['Orbitron',sans-serif] font-bold text-sm text-[#ffe600] mt-2 mb-1" dangerouslySetInnerHTML={{ __html: formatted.replace('# ', '') }} />
        );
      }
      if (line.startsWith('## ') || line.startsWith('### ')) {
        return (
          <h4 key={i} className="font-['Orbitron',sans-serif] font-semibold text-xs text-white mt-1.5 mb-1" dangerouslySetInnerHTML={{ __html: formatted.replace(/^###?\s+/, '') }} />
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={i} className="ml-4 list-disc text-gray-200 text-xs mb-1" dangerouslySetInnerHTML={{ __html: formatted.replace(/^[-*]\s+/, '') }} />
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={i} className="ml-4 list-decimal text-gray-200 text-xs mb-1" dangerouslySetInnerHTML={{ __html: formatted.replace(/^\d+\.\s+/, '') }} />
        );
      }
      return (
        <p key={i} className="text-xs text-gray-200 mb-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#121218] border-l border-[#00f0ff]/40 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-[#232330] flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shadow-md glow-cyan">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Orbitron',sans-serif] font-black text-sm text-white tracking-wider">
                  AI CREATOR STRATEGIST
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              </div>
              <p className="text-[11px] text-[#00f0ff] font-mono">
                Advising {appState.brandTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-red-400 p-1.5 rounded transition"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1.5 rounded transition"
              title="Close Advisor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 shadow-md ${
                  m.role === 'user'
                    ? 'bg-[#ff0055] text-white rounded-tr-none'
                    : 'bg-black border border-[#232330] text-gray-200 rounded-tl-none'
                }`}
              >
                {m.role === 'model' && (
                  <div className="flex items-center gap-1.5 text-[10px] font-['Orbitron',sans-serif] text-[#00f0ff] mb-1.5 uppercase font-bold">
                    <Sparkles className="w-3 h-3" /> Strategist Insight
                  </div>
                )}
                <div>{formatContent(m.content)}</div>
                <div
                  className={`text-[9px] mt-1 font-mono text-right ${
                    m.role === 'user' ? 'text-pink-200' : 'text-gray-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] bg-black/60 border border-[#232330] p-3 rounded-xl w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-[#00f0ff]" />
              Analyzing channel metrics & algorithm signals...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 border-t border-[#232330] bg-black/30">
          <div className="text-[10px] font-['Orbitron',sans-serif] text-gray-400 mb-1.5 flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#ffe600]" /> QUICK STRATEGY TOPICS
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="text-[11px] font-medium bg-[#1c1c28] hover:bg-[#232330] text-gray-300 hover:text-white px-2.5 py-1 rounded-lg border border-[#232330] whitespace-nowrap transition active:scale-95 shrink-0 flex items-center gap-1"
              >
                <span>{prompt}</span>
                <ArrowUpRight className="w-3 h-3 text-[#00f0ff]" />
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#232330] bg-[#0a0a0c]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask about ${appState.brandTitle}'s strategy, hooks, retention...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-black text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#232330] focus:border-[#00f0ff] outline-none font-mono"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#00f0ff] hover:bg-[#67e8f9] disabled:bg-gray-800 disabled:text-gray-600 text-black font-bold p-2.5 rounded-xl transition active:scale-95"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
