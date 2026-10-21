import React, { useState, useEffect, useRef } from 'react';

interface EditableTextProps {
  value: string;
  onSave: (val: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  className = '',
  multiline = false,
  placeholder = 'Click to edit...',
  tag: Tag = 'span',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleCommit = () => {
    setIsEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value) {
      onSave(trimmed || value);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDraft(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleCommit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleCommit}
          onKeyDown={handleKeyDown}
          rows={3}
          className={`w-full bg-[#0a0a0c] text-white border-2 border-[#00f0ff] rounded p-2 focus:outline-none resize-none shadow-lg ${className}`}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        className={`bg-[#0a0a0c] text-white border-b-2 border-[#00f0ff] px-1 py-0.5 rounded focus:outline-none shadow-md ${className}`}
      />
    );
  }

  return (
    <Tag
      onClick={() => setIsEditing(true)}
      title="Click to edit text"
      className={`group relative cursor-pointer hover:bg-white/5 hover:ring-1 hover:ring-[#00f0ff]/40 rounded px-1 -mx-1 transition-all duration-150 inline-block ${className}`}
    >
      {value || <span className="text-gray-500 italic">{placeholder}</span>}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 text-[10px] text-[#00f0ff] align-middle inline-block">
        ✎
      </span>
    </Tag>
  );
};
