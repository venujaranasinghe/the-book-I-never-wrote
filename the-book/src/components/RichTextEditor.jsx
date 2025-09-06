import React, { useState, useRef } from 'react';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder, className }) => {
  const [showFormatting, setShowFormatting] = useState(false);
  const editorRef = useRef(null);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    // Trigger onChange with updated content
    const content = editorRef.current.innerHTML;
    onChange({ target: { value: content } });
  };

  const handleInput = () => {
    const content = editorRef.current.innerHTML;
    onChange({ target: { value: content } });
  };

  const insertSpecialText = (type) => {
    let template = '';
    switch (type) {
      case 'letter':
        template = '<div class="letter-format"><p><em>Dear [Name],</em></p><p>[Letter content...]</p><p><em>With love,<br/>[Your name]</em></p></div>';
        break;
      case 'diary':
        template = '<div class="diary-format"><p class="diary-date"><strong>' + new Date().toLocaleDateString() + '</strong></p><p class="diary-entry">[Today I...]</p></div>';
        break;
      case 'quote':
        template = '<blockquote class="memorable-quote">"[Your memorable quote here]"</blockquote>';
        break;
      case 'poem':
        template = '<div class="poem-format"><p class="poem-line">[First line]</p><p class="poem-line">[Second line]</p><p class="poem-line">[Third line]</p></div>';
        break;
      case 'recipe':
        template = '<div class="recipe-format"><h4>[Recipe Name]</h4><p><strong>Ingredients:</strong></p><ul><li>[Ingredient 1]</li><li>[Ingredient 2]</li></ul><p><strong>Instructions:</strong></p><ol><li>[Step 1]</li><li>[Step 2]</li></ol></div>';
        break;
      default:
        return;
    }
    
    document.execCommand('insertHTML', false, template);
    handleInput();
  };

  const toggleFormatting = () => {
    setShowFormatting(!showFormatting);
  };

  return (
    <div className={`rich-text-editor ${className || ''}`}>
      <div className="formatting-toolbar">
        <button
          type="button"
          className="format-toggle-btn"
          onClick={toggleFormatting}
          title="Toggle Formatting Options"
        >
          ✨ Format
        </button>
        
        {showFormatting && (
          <div className="formatting-controls">
            <div className="format-group">
              <button type="button" onClick={() => formatText('bold')} title="Bold">
                <strong>B</strong>
              </button>
              <button type="button" onClick={() => formatText('italic')} title="Italic">
                <em>I</em>
              </button>
              <button type="button" onClick={() => formatText('underline')} title="Underline">
                <u>U</u>
              </button>
            </div>
            
            <div className="format-group">
              <button type="button" onClick={() => formatText('justifyLeft')} title="Align Left">
                ⬅
              </button>
              <button type="button" onClick={() => formatText('justifyCenter')} title="Center">
                ↔
              </button>
              <button type="button" onClick={() => formatText('justifyRight')} title="Align Right">
                ➡
              </button>
            </div>
            
            <div className="format-group">
              <button type="button" onClick={() => formatText('insertUnorderedList')} title="Bullet List">
                • List
              </button>
              <button type="button" onClick={() => formatText('insertOrderedList')} title="Numbered List">
                1. List
              </button>
            </div>
            
            <div className="format-group special-formats">
              <span className="format-label">Templates:</span>
              <button type="button" onClick={() => insertSpecialText('letter')} title="Letter Format">
                💌 Letter
              </button>
              <button type="button" onClick={() => insertSpecialText('diary')} title="Diary Entry">
                📔 Diary
              </button>
              <button type="button" onClick={() => insertSpecialText('quote')} title="Quote">
                💭 Quote
              </button>
              <button type="button" onClick={() => insertSpecialText('poem')} title="Poem">
                🎭 Poem
              </button>
              <button type="button" onClick={() => insertSpecialText('recipe')} title="Recipe">
                🍳 Recipe
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div
        ref={editorRef}
        className="rich-text-content"
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

export default RichTextEditor;
