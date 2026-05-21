

import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const EMOJIS = ['🌸','📝','💻','🌿','☁️','✨','📚','🍵','🔬','🧩']
const COLORS = [
  'linear-gradient(135deg, #fdf0f3, #f2c4ce)',
  'linear-gradient(135deg, #f0fdf4, #bbf7d0)',
  'linear-gradient(135deg, #fefce8, #fde68a)',
  'linear-gradient(135deg, #f0f9ff, #bae6fd)',
  'linear-gradient(135deg, #fdf4ff, #e9d5ff)',
]

function CardStats({ postId }) {
  const [likes, setLikes] = useState(0)
  const [views, setViews] = useState(0)
  const [comments, setComments] = useState(0)

  useEffect(() => {
    if (!postId) return
    Promise.all([
      supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', postId),
      supabase.from('posts').select('view_count').eq('id', postId).single(),
      supabase.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', postId),
    ]).then(([likesRes, postRes, commentsRes]) => {
      setLikes(likesRes.count || 0)
      setViews(postRes.data?.view_count || 0)
      setComments(commentsRes.count || 0)
    })
  }, [postId])

  return (
    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
      <span style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>♥ {likes}</span>
      <span style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>💬 {comments}</span>
      <span style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>👁 {views}</span>
    </div>
  )
}

export default function PostCard({ post, index = 0, onClick, onAuthorClick }) {
  const emoji = post.emoji || EMOJIS[index % EMOJIS.length]
  const color = post.color || COLORS[index % COLORS.length]

  return (
    <div className="card fade-up" style={{ animationDelay: `${index * 0.07}s` }} onClick={() => onClick(post)}>
      <div className="card-image" style={{ background: color }}>{emoji}</div>
      <div className="card-body">
        <div className="card-tags">
          {(post.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <h3 className="card-title">{post.title}</h3>
        <p className="card-excerpt">{post.excerpt}</p>
      </div>
      <div className="card-footer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <CardStats postId={post.id} />
          <span className="card-date">{post.date}</span>
          {post.authorName && (
            <button
              onClick={e => { e.stopPropagation(); onAuthorClick?.(post.userId) }}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontSize: '0.72rem', color: 'var(--sakura-deep)',
                cursor: onAuthorClick ? 'pointer' : 'default',
                fontFamily: 'var(--font-body)', textAlign: 'left',
              }}
            >{post.authorEmoji} {post.authorName}</button>
          )}
        </div>
        <div className="card-arrow">→</div>
      </div>
    </div>
  )
}
