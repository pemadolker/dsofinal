import React, { useState } from 'react'
import PostCard from '../components/PostCard.jsx'

export default function BlogPage({ posts, onOpenPost, onAuthorClick }) {
  const [activeTag, setActiveTag] = useState('all')
  const [search, setSearch] = useState('')

  const allTags = ['all', ...new Set(posts.flatMap(p => p.tags || []))]
  let filtered = activeTag === 'all' ? posts : posts.filter(p => (p.tags || []).includes(activeTag))
  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      (p.authorName || '').toLowerCase().includes(q)
    )
  }
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <main className="page">
      <div className="container">
        <div className="page-hero">
          <p className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'var(--washi)', border: '1px solid var(--border)', padding: '.4rem 1rem', borderRadius: '100px', fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>✿ All notes</p>
          <h1 className="page-hero-title">Learning Journal</h1>
          <p className="page-hero-sub">Every concept, every discovery — collected here.</p>

          {/* Search */}
          <div style={{ maxWidth: 400, margin: '1.5rem auto 0', position: 'relative' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notes or authors..."
              style={{
                width: '100%', background: 'rgba(255,255,255,0.8)',
                border: '1px solid var(--border)', borderRadius: '100px',
                padding: '0.65rem 1.2rem 0.65rem 2.6rem',
                color: 'var(--ink)', fontFamily: 'var(--font-body)',
                fontSize: '0.88rem', outline: 'none',
              }}
              onFocus={e => e.target.style.border = '1px solid var(--sakura-deep)'}
              onBlur={e => e.target.style.border = '1px solid var(--border)'}
            />
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)', fontSize: '0.85rem' }}>🔍</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`filter-btn${activeTag === tag ? ' active' : ''}`}
              onClick={() => setActiveTag(tag)}
            >{tag}</button>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="empty-state">
            {posts.length === 0 ? 'No notes yet. Sign up and be the first! 🌸' : 'No notes match your search. 🌸'}
          </div>
        ) : (
          <div className="cards-grid">
            {sorted.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} onClick={onOpenPost} onAuthorClick={onAuthorClick} />
            ))}
          </div>
        )}
        <div style={{ height: '5rem' }} />
      </div>
    </main>
  )
}
