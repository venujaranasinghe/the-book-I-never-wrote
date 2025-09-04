import "./App.css"

export default function ProfilePage({ user, onBack, onShare, mousePosition, isTransitioning }) {
  return (
    <div className={`container vintage-paper profile-page ${isTransitioning ? "transitioning" : ""}`}>
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
          <span className="page-number">PROFILE</span>
          <span className="section">ABOUT THE AUTHOR</span>
        </div>
        <button className="back-button vintage-button" onClick={onBack}>
          ← RETURN TO CONTENTS
        </button>
      </header>
      <main className="profile-content">
                <div className="profile-header">
          <img
            src="/logo1.png"
            alt="Author portrait"
            className="profile-avatar"
            style={{ width: 120, height: 120, borderRadius: "50%", marginBottom: 24, boxShadow: "0 4px 24px #0002" }}
          />
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-title">Storyteller • Dreamer • Born in {user.birthYear}</p>
        </div>
        <div className="profile-bio vintage-paragraph">
          <p>{user.bio}</p>
        </div>
        <div className="profile-links">
          <button onClick={onShare} className="profile-link vintage-button">
            📤 Share Your Story
          </button>
          <a href={`mailto:?subject=Check out my memoir&body=I'd like to share my story with you: ${window.location.origin}?user=${user.bookId}`} className="profile-link vintage-button">
            📧 Share via Email
          </a>
        </div>
      </main>
    </div>
  )
}
