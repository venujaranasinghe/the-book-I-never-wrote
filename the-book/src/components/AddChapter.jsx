import React, { useState } from 'react';
import './AddChapter.css';

const AddChapter = ({ onAddChapter }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onAddChapter({ title, content });
      setTitle('');
      setContent('');
    }
  };

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
        />
        <textarea
          placeholder="Chapter Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="nostalgic-textarea"
        />
        <button type="submit" className="nostalgic-button">Add Chapter</button>
      </form>
    </div>
  );
};

export default AddChapter;
