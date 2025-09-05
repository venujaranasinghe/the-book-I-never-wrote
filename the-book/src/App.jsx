"use client"

import { useState, useEffect } from "react"
import "./App.css"
import ProfilePage from "./ProfilePage"
import AuthPage from "./AuthPage"
import SharePage from "./SharePage"

const defaultChapters = [
  { id: 1, title: "The Prologue: A Letter to the Reader", subtitle: "The truth behind the silence, and the courage it took to break it", year: "childhood" },
  { id: 2, title: "When I was Just a Name", subtitle: "Before I knew who I was, the world had already started shaping me", year: "childhood" },
  { id: 3, title: "A Small World with Big Dreams", subtitle: "On intuition and unverifiable truths", year: "childhood" },
  { id: 4, title: "The Algorithm of Growing Up", subtitle: "How a quiet soul began to see beyond the map they were given", year: "youth" },
  { id: 5, title: "Love in a Time of Uncertainty", subtitle: "What it meant to care, to lose, and to hold on through the storm", year: "youth" },
  { id: 6, title: "The Learning Years", subtitle: "Education, discovery, and finding my voice", year: "youth" },
  { id: 7, title: "Finding Purpose", subtitle: "When passion met reality, and dreams took shape", year: "adulthood" },
  { id: 8, title: "Challenges and Growth", subtitle: "The obstacles that taught me who I really am", year: "adulthood" },
  {
    id: 9,
    title: "Lessons Learned",
    subtitle: "On wisdom gained through experience",
    year: "present",
  },
  { id: 10, title: "Dreams for Tomorrow", subtitle: "The chapters yet to be written", year: "future" },
  { id: 11, title: "What I Want to Leave Behind", subtitle: "A legacy of hope, love, and authenticity", year: "future" },
  { id: 12, title: "The Book I Never Wrote... Until Now", subtitle: "The story that lived within me, waiting for courage and a voice", year: "present" },
]

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [guestUser, setGuestUser] = useState(null) // For viewing other people's books
  const [currentPage, setCurrentPage] = useState("auth")
  const [currentChapter, setCurrentChapter] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Check for shared book URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const userBookId = urlParams.get('user')
    
    if (userBookId) {
      // Load guest user data for viewing someone else's book
      const users = JSON.parse(localStorage.getItem("memorialUsers") || "{}")
      const guestUserData = Object.values(users).find(user => user.bookId === userBookId)
      
      if (guestUserData) {
        setGuestUser(guestUserData)
        setCurrentPage("home")
        return
      }
    }

    // Check if user is already logged in
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      // Normalize user object for compatibility
      const normalizedUser = {
        ...parsedUser,
        name: parsedUser.fullName || parsedUser.name,
      }
      setCurrentUser(normalizedUser)
      setCurrentPage("home")
    }
  }, [])

  const handleLogin = (user) => {
    // Normalize user object to ensure compatibility with existing code
    const normalizedUser = {
      ...user,
      name: user.fullName || user.name, // Use fullName from API or fallback to name
    }
    setCurrentUser(normalizedUser)
    localStorage.setItem("currentUser", JSON.stringify(normalizedUser))
    setCurrentPage("home")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setGuestUser(null)
    localStorage.removeItem("currentUser")
    setCurrentPage("auth")
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  const navigateToChapter = (chapter) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentChapter(chapter)
      setCurrentPage("chapter")
      setIsTransitioning(false)
    }, 800)
  }

  const navigateHome = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentPage("home")
      setCurrentChapter(null)
      setIsTransitioning(false)
    }, 800)
  }

  const navigateToShare = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentPage("share")
      setIsTransitioning(false)
    }, 800)
  }

  // Get the active user (current user or guest user)
  const activeUser = guestUser || currentUser
  const isViewingAsGuest = !!guestUser

  // Show authentication page if no user is logged in and not viewing as guest
  if (!activeUser) {
    return (
      <div className="app">
        <div
          className="cursor-glow"
          style={{
            left: mousePosition.x - 10,
            top: mousePosition.y - 10,
          }}
        />
        <AuthPage onLogin={handleLogin} mousePosition={mousePosition} />
      </div>
    )
  }

  if (currentPage === "chapter" && currentChapter) {
    return (
      <ChapterPage
        chapter={currentChapter}
        user={activeUser}
        onBack={navigateHome}
        isTransitioning={isTransitioning}
        mousePosition={mousePosition}
      />
    )
  }

  if (currentPage === "profile") {
    return (
      <ProfilePage
        user={activeUser}
        onBack={navigateHome}
        onShare={navigateToShare}
        mousePosition={mousePosition}
        isTransitioning={isTransitioning}
      />
    )
  }

  if (currentPage === "share" && !isViewingAsGuest) {
    const bookUrl = `${window.location.origin}${window.location.pathname}?user=${currentUser.bookId}`
    return (
      <SharePage
        user={currentUser}
        bookUrl={bookUrl}
        onBack={navigateHome}
        mousePosition={mousePosition}
        isTransitioning={isTransitioning}
      />
    )
  }

  return (
    <div className="app">
      <div
        className="cursor-glow"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />
      <div className={`page-transition ${isTransitioning ? "active" : ""}`} />
      
      <TableOfContents
        chapters={defaultChapters}
        user={activeUser}
        isViewingAsGuest={isViewingAsGuest}
        onChapterClick={navigateToChapter}
        isTransitioning={isTransitioning}
        onProfileClick={() => {
          setIsTransitioning(true)
          setTimeout(() => {
            setCurrentPage("profile")
            setIsTransitioning(false)
          }, 800)
        }}
        onLogout={handleLogout}
      />
    </div>
  )
}

function TableOfContents({ chapters, user, isViewingAsGuest, onChapterClick, isTransitioning, onProfileClick, onLogout }) {
  const [typedText, setTypedText] = useState("")
  const fullTitle = "THE BOOK I NEVER WROTE"

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullTitle.length) {
        setTypedText(fullTitle.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [fullTitle])

  return (
    <div className={`container vintage-paper ${isTransitioning ? "transitioning" : ""}`}>
      <div className="paper-texture" />
      <div className="vintage-border" />

      <header className="header">
        <div className="header-ornament">❦</div>
        <div className="header-meta">
          <span className="page-number">Est. {user.birthYear}</span>
          <span className="section">MEMOIRS OF THE UNWRITTEN</span>
        </div>
        <div className="header-actions">
          {!isViewingAsGuest && (
            <button className="logout-button vintage-button" onClick={onLogout}>
              Sign Out
            </button>
          )}
          <div className="header-ornament">❦</div>
        </div>
      </header>

      <main className="main-content">
        <div className="title-section">
          <div className="vintage-frame">
            <h1 className="main-title typewriter">
              {typedText}
              <span className="cursor-blink">|</span>
            </h1>
            <div className="title-underline" />
          </div>

          <div className="vintage-ornament">
            <div className="ornament-line" />
            <div className="ornament-center">✦</div>
            <div className="ornament-line" />
          </div>
        </div>

        <div className="subtitle-section">
          <p className="subtitle vintage-text">
            <em>
              "{user.bio}"
            </em>
          </p>
          <div className="author-signature">— {user.name}, 2025</div>
        </div>

        <div className="chapters-section">
          <div className="chapters-header">
            <h2 className="chapters-title">TABLE OF CONTENTS</h2>
            <div className="chapters-ornament">◆ ◇ ◆</div>
          </div>

          <div className="chapters-list">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="chapter-item vintage-entry"
                onClick={() => onChapterClick(chapter)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="chapter-number-section">
                  <span className="chapter-roman">{toRoman(index + 1)}</span>
                  <div className="chapter-year">{chapter.year}</div>
                </div>

                <div className="chapter-content">
                  <h3 className="chapter-title">{chapter.title}</h3>
                  <p className="chapter-subtitle">{chapter.subtitle}</p>
                  <div className="chapter-dots">
                    {Array.from({ length: 30 }, (_, i) => (
                      <span key={i} className="dot">
                        .
                      </span>
                    ))}
                  </div>
                </div>

                <div className="page-ref">
                  <span className="page-number">{String((index + 1) * 12).padStart(3, "0")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="footer-meta">
          <div className="vintage-footer-ornament">
            <div className="footer-line" />
            <span className="footer-symbol">❋</span>
            <div className="footer-line" />
          </div>
          <div className="publication-info">
            <span className="publisher">UNWRITTEN PRESS • {user.birthYear}</span>
            <span className="isbn">Personal Edition • {isViewingAsGuest ? "Shared Copy" : "Author's Copy"}</span>
          </div>
          <div className="profile-link-section">
            <button className="profile-link vintage-button" onClick={onProfileClick}>
              About the Author
            </button>
          </div>
        </footer>
      </main>
    </div>
  )
}

function ChapterPage({ chapter, user, onBack, isTransitioning, mousePosition }) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollTop / docHeight
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getChapterContent = (chapterId, user) => {
    // Generate personalized content based on user data and chapter
    const contents = {
      1: {
        content: `Dear Reader,

This is the book I never planned to write.

My name is ${user.name}, and I was born in ${user.birthYear}. This memoir began as scattered thoughts, memories that refused to stay quiet, and moments that shaped who I am today.

${user.bio}

I once believed some stories were better left untold — especially mine. But I've learned that every life has chapters worth sharing, lessons worth passing on, and moments that deserve to be remembered.

This is not just about events that happened to me. It's about the quiet moments of growth, the challenges that tested my resolve, and the dreams that kept me moving forward. It's about the person I was, the person I became, and the person I'm still becoming.

If you're here, reading this, maybe you have your own unwritten book too. Maybe you've whispered your story into the dark, hoping someone might hear it. Maybe this is your sign that your story matters too.

I can't promise you perfect prose or profound wisdom. But I can promise honesty. And sometimes, that's enough.

So come with me — not as a reader, but as a companion. Let's explore these pages together. Not to relive the past, but to understand how it brought me here. How every silence had a voice. Every challenge, a lesson. Every version of me... a story worth telling.

With hope and authenticity,
${user.name}`,
        footnotes: [],
      },
      2: {
        content: `Before I understood who I was, the world began shaping me.

Born in ${user.birthYear}, I entered this world as ${user.name}. But names carry weight, expectations, and the dreams of those who give them to us.

${user.bio}

In those early years, I was like soft clay, molded by every experience, every word, every moment of wonder and confusion. The world seemed enormous then, filled with possibilities I couldn't yet name but somehow felt in my bones.

Looking back now, I can see how those formative moments were already writing the first chapters of who I would become. Every childhood fear, every small victory, every question that kept me awake at night — they were all leading me toward this moment, where I finally found the courage to tell my story.

Before I was anyone else, I was simply me. And sometimes, that simple truth is the most powerful story of all.`,
        footnotes: [],
      },
    }
    
    return contents[chapterId] || {
      content: `This chapter of ${user.name}'s story is still being written...

Born in ${user.birthYear}, ${user.name}'s journey continues to unfold. Each day brings new experiences, new insights, and new stories to tell.

${user.bio}

The beauty of an unfinished story is that it holds infinite potential. What will happen next? What dreams will be pursued? What challenges will be overcome?

Only time will tell, but one thing is certain: this story is far from over.`,
      footnotes: []
    }
  }

  const content = getChapterContent(chapter.id, user)

  return (
    <div className={`container vintage-paper chapter-page ${isTransitioning ? "transitioning" : ""}`}>
      <div className="paper-texture" />
      <div className="vintage-border" />
      <div className="scroll-progress" style={{ width: `${scrollProgress * 100}%` }} />

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
          <span className="page-number">{String(chapter.id * 12 + 1).padStart(3, "0")}</span>
          <span className="section">CHAPTER {toRoman(chapter.id)}</span>
        </div>
        <button className="back-button vintage-button" onClick={onBack}>
          ← RETURN TO CONTENTS
        </button>
      </header>

      <main className="chapter-content">
        <div className="chapter-header">
          <div className="chapter-number-large">{toRoman(chapter.id)}</div>
          <h1 className="chapter-title-large">{chapter.title}</h1>
          <p className="chapter-subtitle-large">{chapter.subtitle}</p>
          <div className="chapter-year-large">{chapter.year}</div>

          <div className="vintage-ornament chapter-ornament">
            <div className="ornament-line" />
            <div className="ornament-center">✦</div>
            <div className="ornament-line" />
          </div>
        </div>

        <div className="chapter-text">
          {content.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="paragraph vintage-paragraph" style={{ animationDelay: `${index * 0.2}s` }}>
              {paragraph}
            </p>
          ))}
        </div>

        {content.footnotes.length > 0 && (
          <div className="footnotes">
            <div className="footnote-ornament">
              <div className="footnote-line" />
              <span className="footnote-symbol">❋</span>
              <div className="footnote-line" />
            </div>
            {content.footnotes.map((footnote, index) => (
              <p key={index} className="footnote vintage-footnote">
                {footnote}
              </p>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function toRoman(num) {
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]
  return romanNumerals[num - 1] || num.toString()
}

export default App
