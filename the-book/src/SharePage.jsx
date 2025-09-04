import { useState } from "react"
import "./App.css"

export default function SharePage({ user, bookUrl, onBack, mousePosition, isTransitioning }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = bookUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(`${user.name}'s Memoir: "The Book I Never Wrote"`)
    const body = encodeURIComponent(
      `I'd like to share my personal memoir with you.\n\n` +
      `"${user.name}'s story is a collection of memories, thoughts, and experiences that shaped who I am today. ` +
      `It's my invitation to you to understand my journey and perhaps find inspiration for your own."\n\n` +
      `Read it here: ${bookUrl}\n\n` +
      `Every story deserves to be told. Every life has chapters worth sharing.`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const handleShareViaTwitter = () => {
    const text = encodeURIComponent(
      `I just created my personal memoir: "${user.name}'s Book I Never Wrote" ✨\n\n` +
      `A collection of memories, dreams, and the moments that shaped me.\n\n` +
      `${bookUrl}`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`)
  }

  return (
    <div className={`container vintage-paper share-page ${isTransitioning ? "transitioning" : ""}`}>
      <div className="paper-texture" />
      <div className="vintage-border" />
      <div
        className="cursor-glow"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />

      <header className="header">
        <div className="header-ornament">❦</div>
        <div className="header-meta">
          <span className="page-number">SHARE</span>
          <span className="section">YOUR STORY AWAITS</span>
        </div>
        <button className="back-button vintage-button" onClick={onBack}>
          ← RETURN TO BOOK
        </button>
      </header>

      <main className="share-content">
        <div className="share-header">
          <h1 className="share-title">Your Book is Ready!</h1>
          <p className="share-subtitle">
            "{user.name}'s Book I Never Wrote" is now live and ready to be shared with the world.
          </p>
        </div>

        <div className="share-link-section">
          <div className="share-link-container">
            <label className="share-link-label">Your Book's URL:</label>
            <div className="share-link-input-group">
              <input
                type="text"
                value={bookUrl}
                readOnly
                className="share-link-input"
              />
              <button
                onClick={handleCopyLink}
                className={`copy-btn vintage-button ${copied ? "copied" : ""}`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <div className="share-options">
          <h3 className="share-options-title">Share Your Story</h3>
          <div className="share-buttons">
            <button onClick={handleShareViaEmail} className="share-btn email-share vintage-button">
              📧 Share via Email
            </button>
            <button onClick={handleShareViaTwitter} className="share-btn twitter-share vintage-button">
              🐦 Share on Twitter
            </button>
          </div>
        </div>

        <div className="share-preview">
          <h3 className="share-preview-title">Preview</h3>
          <div className="share-preview-card">
            <div className="preview-header">
              <h4 className="preview-book-title">{user.name}'s Book I Never Wrote</h4>
              <p className="preview-author">by {user.name}</p>
            </div>
            <div className="preview-bio">
              <p>{user.bio}</p>
            </div>
            <div className="preview-footer">
              <span className="preview-year">Born in {user.birthYear}</span>
              <span className="preview-status">Available to read now</span>
            </div>
          </div>
        </div>

        <div className="share-tips">
          <div className="tips-ornament">
            <div className="ornament-line" />
            <div className="ornament-center">✦</div>
            <div className="ornament-line" />
          </div>
          <h3 className="tips-title">Sharing Tips</h3>
          <ul className="tips-list">
            <li>Your book link will remain active and accessible to anyone who has it</li>
            <li>Readers don't need an account to view your memoir</li>
            <li>You can always return to edit your profile and update your story</li>
            <li>Consider sharing with family, friends, or anyone who might find inspiration in your journey</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
