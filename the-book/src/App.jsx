"use client"

import { useState, useEffect } from "react"
import "./App.css"

const chapters = [
  { id: 1, title: "The Prologue: A Letter to the Reader", subtitle: "The truth behind the silence, and the courage it took to break it", year: "1987" },
  { id: 2, title: "When I was Just a Name", subtitle: "Before I knew who I was, the world had already started shaping me", year: "1987" },
  { id: 3, title: "A Small World with Big Dreams", subtitle: "On intuition and unverifiable truths", year: "1987" },
  { id: 4, title: "The algorithm of overthinking", subtitle: "How a quiet boy with wide eyes began to see beyond the map he was given", year: "1991" },
  { id: 5, title: "Love in a Time of Chaos", subtitle: "What it meant to care, to lose, and to hold on - even in the storm", year: "1987" },
  { id: 6, title: "The debugging mindset", subtitle: "Life as a series of logical errors", year: "1994" },
  { id: 7, title: "404: Motivation Not Found", subtitle: "When the server of self fails to respond", year: "1998" },
  { id: 8, title: "Code, Coffee, and Chaos", subtitle: "My journey through computer science, late nights, and chasing clarity through logic", year: "1987" },
  {
    id: 9,
    title: "My mind is a monolith, not a microservice",
    subtitle: "On the architecture of consciousness",
    year: "2003",
  },
  { id: 10, title: "Theories I'll never publish", subtitle: "Academic thoughts in perpetual draft", year: "2007" },
  { id: 11, title: "Why I love broken things", subtitle: "Beauty in imperfection and incomplete systems", year: "2012" },
  { id: 12, title: "The Book I Never Wrote... Until Now", subtitle: "The story that lived me, waiting for a voice and a page", year: "1987" },
]

function App() {
  const [currentPage, setCurrentPage] = useState("home")
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

  if (currentPage === "chapter" && currentChapter) {
    return (
      <ChapterPage
        chapter={currentChapter}
        onBack={navigateHome}
        isTransitioning={isTransitioning}
        mousePosition={mousePosition}
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
      <TableOfContents chapters={chapters} onChapterClick={navigateToChapter} isTransitioning={isTransitioning} />
    </div>
  )
}

function TableOfContents({ chapters, onChapterClick, isTransitioning }) {
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
  }, [])

  return (
    <div className={`container vintage-paper ${isTransitioning ? "transitioning" : ""}`}>
      <div className="paper-texture" />
      <div className="vintage-border" />

      <header className="header">
        <div className="header-ornament">❦</div>
        <div className="header-meta">
          <span className="page-number">Est. 2003</span>
          <span className="section">MEMOIRS OF THE UNWRITTEN</span>
        </div>
        <div className="header-ornament">❦</div>
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
              "In the quiet corners of memory, where thoughts gather dust
              <br />
              and stories wait patiently to be told, lies a collection
              <br />
              of fragments—beautiful in their incompleteness."
            </em>
          </p>
          <div className="author-signature">— Venuja, 2025</div>
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
            <span className="publisher">UNWRITTEN PRESS • MCMLXXXVII</span>
            <span className="isbn">First Edition • Limited Print</span>
          </div>
        </footer>
      </main>
    </div>
  )
}

function ChapterPage({ chapter, onBack, isTransitioning, mousePosition }) {
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

  const getChapterContent = (chapterId) => {
    const contents = {
      1: {
        content: `Dear Reader,

This is the book I never planned to write.

It was born not out of ambition, but out of silence — the kind that grows louder with time. You know the kind I’m talking about. The silence between who you are and who you appear to be. The silence between memories you try to forget and truths you’ve never told. The silence that follows you into dreams, lectures, love, and loneliness.

I once believed some stories were better left untold — especially mine. I’m not famous. I’m not broken in the poetic way people romanticize. I don’t have the kind of success that turns heads or a tragedy that earns applause. But I have a story. We all do. And this is mine.

The Book I Never Wrote is not just about events. It’s about moments — raw, quiet, powerful ones — that shaped me. It’s about growth in the face of doubt, love in the shadow of fear, and finding purpose in confusion. It’s about the chapters of my life I never gave myself permission to explore… until now.

If you’re here, reading this, maybe you’ve got your own unwritten book too. Maybe you’ve whispered your story into the dark, hoping someone, someday, might hear it. Maybe this is your sign to write it.

I can’t promise you perfect prose or profound wisdom. But I can promise honesty. And sometimes, that’s enough.

So come with me — not as a reader, but as a companion. Let’s flip through these pages together. Not to relive the past, but to understand how it brought me here. How every silence had a voice. Every scar, a sentence. Every version of me… a story.

The wise programmer learns to set timeouts on their thoughts.

But now, I finally am.

With love,
Venuja`,
        footnotes: [
          "This is the book I never planned to write. ¹ Sometimes, the most necessary things in life are the ones we avoid the longest.",
          "You know the kind I’m talking about. The silence between who you are and who you appear to be. ² Pretending is easier than explaining — especially when you’re still figuring it out yourself.",
        ],
      },
//       2: {
//         content: `The mind, when left to its own devices, becomes a recursive function with no base case. It loops endlessly, processing the same inputs, generating the same outputs, consuming memory until the system crashes.

// Consider the simple act of sending a text message. The algorithm begins:
// - Compose message
// - Review for tone  
// - Consider recipient's possible interpretations
// - Revise message
// - Question necessity of message
// - Return to step 2

// The loop continues until external intervention—a deadline, exhaustion, or the merciful distraction of another task—forces termination.

// The debugging process reveals the flaw: we optimize for problems that don't exist, edge cases that never occur, user scenarios that live only in our imagination.

// The solution isn't better logic. It's learning when to ship buggy code.

// In the architecture of anxiety, every thought spawns three more. Each worry branches into a tree of possibilities, each possibility into a forest of contingencies. The computational complexity grows exponentially until the system becomes unresponsive.

// The wise programmer learns to set timeouts on their thoughts.`,
//         footnotes: [
//           "¹ Computer scientists call this an infinite loop. Therapists call it anxiety.",
//           "² The 'good enough' principle applies to both software and social interactions.",
//           "³ Premature optimization is the root of all evil, in code and in life.",
//         ],
//       },
      // Add more chapters as needed...
    }
    return contents[chapterId] || { content: "Chapter content coming soon...", footnotes: [] }
  }

  const content = getChapterContent(chapter.id)

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
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]
  return romanNumerals[num - 1] || num.toString()
}

export default App
