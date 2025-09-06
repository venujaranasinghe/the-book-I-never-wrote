import React, { useState } from 'react';
import './AddChapter.css';
import RichTextEditor from './RichTextEditor';

const AddChapter = ({ onAddChapter }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [year, setYear] = useState('custom');
  const [content, setContent] = useState('');
  const [footnotes, setFootnotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      // For footnotes, if it's HTML from rich editor, keep as is, otherwise split by lines
      const footnotesArray = footnotes.includes('<') ? [footnotes] : footnotes.split('\n').filter(note => note.trim());
      onAddChapter({ 
        title, 
        subtitle: subtitle || content.replace(/<[^>]*>/g, '').substring(0, 60) + (content.length > 60 ? "..." : ""),
        year,
        content,
        footnotes: footnotesArray
      });
      setTitle('');
      setSubtitle('');
      setYear('custom');
      setContent('');
      setFootnotes('');
    }
  };

  const yearOptions = [
    { value: 'childhood', label: 'Childhood' },
    { value: 'youth', label: 'Youth' },
    { value: 'adulthood', label: 'Adulthood' },
    { value: 'present', label: 'Present' },
    { value: 'future', label: 'Future' },
    { value: 'custom', label: 'Custom' }
  ];

  return (
    <div className="nostalgic-chapter-form">
      <h2>Add a Chapter</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Chapter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="nostalgic-input"
          required
        />
        
        <input
          type="text"
          placeholder="Chapter Subtitle (optional)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="nostalgic-input"
        />

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="nostalgic-select"
        >
          {yearOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <RichTextEditor
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Chapter Content - Use the formatting tools to make your story come alive!"
          className="nostalgic-rich-editor"
        />

        <RichTextEditor
          value={footnotes}
          onChange={(e) => setFootnotes(e.target.value)}
          placeholder="Footnotes (optional) - Add additional context, references, or side notes"
          className="nostalgic-rich-editor footnotes-editor"
        />
        
        <button type="submit" className="nostalgic-button">Add Chapter</button>
      </form>
    </div>
  );
};

export default AddChapter;
