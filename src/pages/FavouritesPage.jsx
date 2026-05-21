import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import PostCard from '../components/PostCard.jsx'

export default function FavouritesPage({ user, onOpenPost, onAuthorClick }) {
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetch = async () => {
      setLoading(true)
      // Get all favourited post IDs for this user
      const { data: favs } = await supabase
        .from('favourites')
        .select('post_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!favs || favs.length === 0) { setPosts([]); setLoading(false); return }

      const ids = favs.map(f => f.post_id)
      const { data: postData } = await supabase
        .from('posts')
        .select('*')
        .in('id', ids)

      // Keep the order of favourites (most recently saved first)
      const ordered = ids
        .map(id => postData?.find(p => p.id === id))
        .filter(Boolean)
        .map(row => ({
          id:          row.id,
          title:       row.title,
          excerpt:     row.excerpt   || '',
          content:     row.content   || '',
          tags:        row.tags      || [],
          date:        row.date      || '',
          readTime:    row.read_time || '',
          emoji:       row.emoji     || '🌸',
          color:       row.color     || 'linear-gradient(135deg, #fdf0f3, #f2c4ce)',
          userId:      row.user_id,
          authorName:  row.author_name  || 'Anonymous',
          authorEmoji: row.author_emoji || '🌸',
          createdAt:   row.created_at,
        }))

      setPosts(ordered)
      setLoading(false)
    }
    fetch()
  }, [user])

  return (
    <main className="page">
      <div className="container" style={{ paddingTop: '7rem', paddingBottom: '5rem' }}>

        <div className="page-hero" style={{ paddingTop: 0, textAlign: 'left', marginBottom: '2.5rem' }}>
          <p className="hero-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '.5rem',
            background: 'var(--washi)', border: '1px solid var(--border)',
            padding: '.4rem 1rem', borderRadius: '100px',
            fontSize: '.78rem', letterSpacing: '.12em',
            textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '1.2rem',
          }}>🔖 Saved notes</p>
          <h1 className="page-hero-title" style={{ textAlign: 'left' }}>My Favourites</h1>
          <p className="page-hero-sub" style={{ textAlign: 'left' }}>
            Notes you've saved to read again
          </p>
        </div>

        <div className="section-header">
          <span className="section-mark">✿</span>
          <span className="section-label">{posts.length} saved note{posts.length !== 1 ? 's' : ''}</span>
          <div className="section-line" />
        </div>

        {loading ? (
          <div className="empty-state">Loading your saved notes... 🌸</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>No saved notes yet.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
              Hit the 🔖 button on any post to save it here!
            </p>
          </div>
        ) : (
          <div className="cards-grid">
            {posts.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                index={i}
                onClick={onOpenPost}
                onAuthorClick={onAuthorClick}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
