"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface StoryItem {
  id: number
  type: "image" | "text" | "video"
  content: string
  link?: string
  expiresAt: string
}

export default function StoriesBar() {
  const [stories, setStories] = useState<StoryItem[]>([])
  const [viewingIndex, setViewingIndex] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch("/api/homepage")
      .then((r) => r.json())
      .then((data) => {
        if (data.stories?.length) setStories(data.stories)
      })
      .catch(() => {})
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback((durationMs: number) => {
    stopTimer()
    progressRef.current = 0
    setProgress(0)
    const interval = 50
    const step = (interval / durationMs) * 100
    timerRef.current = setInterval(() => {
      progressRef.current += step
      setProgress(progressRef.current)
      if (progressRef.current >= 100) {
        stopTimer()
      }
    }, interval)
  }, [stopTimer])

  useEffect(() => {
    if (viewingIndex !== null) {
      startTimer(5000)
    }
    return stopTimer
  }, [viewingIndex, startTimer, stopTimer])

  function openViewer(index: number) {
    setViewingIndex(index)
  }

  function closeViewer() {
    setViewingIndex(null)
    stopTimer()
  }

  function nextStory() {
    if (viewingIndex === null) return
    if (viewingIndex < stories.length - 1) {
      setViewingIndex(viewingIndex + 1)
    } else {
      closeViewer()
    }
  }

  function prevStory() {
    if (viewingIndex === null) return
    if (viewingIndex > 0) {
      setViewingIndex(viewingIndex - 1)
    }
  }

  if (!stories.length) return null

  const storyColors = ["#ec4899", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#14b8a6"]

  return (
    <>
      <style>{`
        .stories-bar-wrap {
          padding: 20px 0 4px;
          overflow: hidden;
        }
        .stories-bar-heading {
          text-align: center;
          margin-bottom: 20px;
        }
        .stories-bar-heading h3 {
          font-size: 24px;
          font-weight: 700;
          color: #222;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }
        .stories-bar {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding: 4px 0 16px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          justify-content: center;
        }
        .stories-bar::-webkit-scrollbar { display: none; }
        .story-avatar {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .story-avatar:hover { transform: scale(1.08); }
        .story-ring {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          padding: 4px;
          background: conic-gradient(#ec4899, #f59e0b, #ec4899);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 12px rgba(236,72,153,0.25);
        }
        .story-ring-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .story-ring-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .story-text-thumb {
          font-size: 14px;
          font-weight: 600;
          color: #ec4899;
          text-align: center;
          padding: 6px;
          line-height: 1.3;
          word-break: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .story-avatar-name {
          font-size: 12px;
          font-weight: 500;
          color: #555;
          text-align: center;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .story-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(0,0,0,0.92);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .story-viewer {
          position: relative;
          width: 100%;
          max-width: 420px;
          height: 100vh;
          max-height: 700px;
          display: flex;
          flex-direction: column;
        }
        .story-viewer-top {
          display: flex;
          gap: 4px;
          padding: 12px 12px 8px;
        }
        .story-progress-track {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.3);
          overflow: hidden;
        }
        .story-progress-fill {
          height: 100%;
          border-radius: 2px;
          background: #fff;
          transition: width 0.05s linear;
        }
        .story-viewer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 12px 12px;
        }
        .story-viewer-user {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }
        .story-viewer-close {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 20px;
        }
        .story-viewer-close:hover { background: rgba(255,255,255,0.15); }
        .story-viewer-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          cursor: pointer;
          position: relative;
          user-select: none;
          -webkit-user-select: none;
        }
        .story-viewer-body img, .story-viewer-body video {
          max-width: 100%;
          max-height: 100%;
          border-radius: 8px;
          object-fit: contain;
          pointer-events: none;
        }
        .story-viewer-text {
          color: #fff;
          font-size: 22px;
          font-weight: 600;
          text-align: center;
          padding: 24px;
          line-height: 1.5;
          max-width: 100%;
          word-break: break-word;
        }
        .story-nav-area {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 40%;
          z-index: 2;
        }
        .story-nav-left { left: 0; }
        .story-nav-right { right: 0; }
        .story-viewer-link {
          text-align: center;
          padding: 16px;
        }
        .story-viewer-link a {
          display: inline-block;
          padding: 8px 24px;
          background: #fff;
          color: #000;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
        }
        .story-viewer-link a:hover { opacity: 0.9; }
      `}</style>

      <div className="container">
        <div className="stories-bar-wrap">
          <div className="stories-bar-heading">
            <h3>Story</h3>
          </div>
          <div className="stories-bar">
            {stories.map((story, i) => (
              <div key={story.id} className="story-avatar" onClick={() => openViewer(i)}>
                <div className="story-ring">
                  <div className="story-ring-inner">
                    {story.type === "image" ? (
                      <img src={story.content} alt="Story" />
                    ) : story.type === "text" ? (
                      <div className="story-text-thumb" style={{ background: storyColors[i % storyColors.length], color: "#fff", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                        {story.content.slice(0, 40)}
                      </div>
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", fontSize: 32, color: "#fff" }}>
                        ▶
                      </div>
                    )}
                  </div>
                </div>
                <span className="story-avatar-name">
                  {story.type === "text" ? story.content.slice(0, 18) : "Story"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {viewingIndex !== null && stories[viewingIndex] && (
        <div className="story-overlay" onClick={closeViewer}>
          <div className="story-viewer" onClick={(e) => e.stopPropagation()}>
            <div className="story-viewer-top">
              {stories.map((_, i) => (
                <div key={i} className="story-progress-track">
                  <div
                    className="story-progress-fill"
                    style={{
                      width: i < viewingIndex ? "100%" : i === viewingIndex ? `${Math.min(progress, 100)}%` : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="story-viewer-header">
              <div className="story-viewer-user">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: storyColors[viewingIndex % storyColors.length],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  {viewingIndex + 1}
                </div>
                <span>Story {viewingIndex + 1}</span>
              </div>
              <button className="story-viewer-close" onClick={closeViewer}>✕</button>
            </div>

            <div className="story-viewer-body">
              <div className="story-nav-area story-nav-left" onClick={prevStory} />
              <div className="story-nav-area story-nav-right" onClick={nextStory} />

              {stories[viewingIndex].type === "image" && (
                <img src={stories[viewingIndex].content} alt="Story" />
              )}
              {stories[viewingIndex].type === "video" && (
                <video src={stories[viewingIndex].content} autoPlay muted controls />
              )}
              {stories[viewingIndex].type === "text" && (
                <div
                  className="story-viewer-text"
                  style={{ background: storyColors[viewingIndex % storyColors.length] }}
                >
                  {stories[viewingIndex].content}
                </div>
              )}
            </div>

            {stories[viewingIndex].link && (
              <div className="story-viewer-link">
                <a href={stories[viewingIndex].link} target="_blank" rel="noopener noreferrer">
                  Learn More
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
