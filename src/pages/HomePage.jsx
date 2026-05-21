import React from 'react'
import PostCard from '../components/PostCard.jsx'

export default function HomePage({ posts, setPage, onOpenPost, onAuthorClick, user }) {
  const recent = [...posts].sort((a, b) => b.id - a.id).slice(0, 6)

  return (
    <main className="page">

      {/* Hero */}
      <section className="hero">
        <div className="hero-kanji">ペマ</div>
        <span className="hero-badge">✿ A community learning journal</span>
        <h1 className="hero-title">
          Notes &amp; learnings,<br />
          <span className="accent">shared with the world</span>
        </h1>
        <div className="hero-divider" />
        <p className="hero-sub">
          A quiet place where writers collect things they've learned —<br />
          code, concepts, and tiny discoveries, one petal at a time.
        </p>
        <p> Written for future-me, shared for you </p>
        <br />
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="hero-cta" onClick={() => setPage('blog')}>Browse all notes →</button>
          {!user && (
            <button
              onClick={() => setPage('auth')}
              style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'transparent',
                border: '1.5px solid var(--sakura-deep)',
                color: 'var(--sakura-deep)',
                padding: '0.85rem 2rem', borderRadius: '100px',
                fontSize: '0.88rem', fontWeight: 500,
                letterSpacing: '0.04em', cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--sakura-deep)'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sakura-deep)' }}
            >Start writing free ✿</button>
          )}
        </div>
      </section>

      {/* Recent posts */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-mark">✿</span>
            <span className="section-label">Recent Notes</span>
            <div className="section-line" />
            <button onClick={() => setPage('blog')} style={{
              fontSize: '0.8rem', color: 'var(--ink-faint)', whiteSpace: 'nowrap',
              letterSpacing: '0.06em', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}>See all →</button>
          </div>

          {posts.length === 0 ? (
            <div className="empty-state">
              No notes yet — be the first to write one! 🌸
            </div>
          ) : (
            <div className="cards-grid">
              {recent.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} onClick={onOpenPost} onAuthorClick={onAuthorClick} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <span className="section-mark">✿</span>
            <span className="section-label">About Wabisabi Notes</span>
            <div className="section-line" />
          </div>
          <div className="about-text">
            <p>Wabisabi Notes is a free platform for students and learners to write, share, and discover notes on anything — code, concepts, ideas, and discoveries.</p>
            <p>Sign up free and start sharing your knowledge with the world. 🌸</p>
          </div>
        </div>
      </section>

    </main>
  )
}
