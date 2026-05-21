import React, { useState } from 'react'
import { usePostInteractions } from '../hooks/usePostInteractions.js'
import { useComments } from '../hooks/useComments.js'
import InteractionBar from '../components/InteractionBar.jsx'
import CommentsSection from '../components/CommentsSection.jsx'

function renderContent(text) {
  if (!text) return null
  const lines = text.split('\n')
  const elements = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('```')) {
      const codeLines = []; i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      elements.push(<pre key={i}><code>{codeLines.join('\n')}</code></pre>)
      i++; continue
    }
    if (line.startsWith('## '))  { elements.push(<h2 key={i}>{line.slice(3)}</h2>);  i++; continue }
    if (line.startsWith('### ')) { elements.push(<h3 key={i}>{line.slice(4)}</h3>);  i++; continue }
    if (line.startsWith('> '))   { elements.push(<blockquote key={i}>{fmt(line.slice(2))}</blockquote>); i++; continue }
    if (line.startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].startsWith('- ')) { items.push(<li key={i}>{fmt(lines[i].slice(2))}</li>); i++ }
      elements.push(<ul key={`ul${i}`}>{items}</ul>); continue
    }
    if (line.trim() === '') { i++; continue }
    elements.push(<p key={i}>{fmt(line)}</p>); i++
  }
  return elements
}

function fmt(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2,-2)}</strong>
      : part
  )
}

export default function PostPage({ post, onBack, onDelete, onEdit, isOwner, onAuthorClick, user, profile }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const {
    likes, hasLiked, hasFaved, views,
    toggleLike, toggleFav,
  } = usePostInteractions(post.id, user?.id)

  const {
    threaded, loading: commentsLoading,
    addComment, deleteComment,
  } = useComments(post.id)

  const handleAddComment = async (text) => {
    await addComment(text, user.id, profile)
  }

  const handleReply = async (text, parentId) => {
    await addComment(text, user.id, profile, parentId)
  }

  // Pass profile into user object for CommentsSection
  const userWithProfile = user ? { ...user, profile } : null

  return (
    <main className="page">
      <div className="post-container">
        <button className="back-link" onClick={onBack}>← Back to all notes</button>

        <header className="post-header">
          <div className="post-tags">
            {(post.tags || []).map(t => <span key={t} className="tag sakura">{t}</span>)}
          </div>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span>📅 {post.date}</span>
            {post.readTime && <><span>·</span><span>⏱ {post.readTime}</span></>}
            {post.authorName && (
              <>
                <span>·</span>
                <button
                  onClick={() => onAuthorClick?.(post.userId)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--sakura-deep)', fontSize: '0.8rem',
                    fontFamily: 'var(--font-body)', padding: 0,
                  }}
                >{post.authorEmoji} {post.authorName}</button>
              </>
            )}
          </div>
          <div className="post-divider" />

          {/* Interaction bar under header */}
          <div style={{ marginTop: '0.5rem' }}>
            <InteractionBar
              likes={likes} hasLiked={hasLiked}
              hasFaved={hasFaved} views={views}
              onLike={toggleLike} onFav={toggleFav}
              user={user}
            />
          </div>
        </header>

        <article className="post-content">{renderContent(post.content)}</article>

        {/* Bottom interaction bar */}
        <div style={{
          marginTop: '2.5rem', paddingTop: '1.5rem',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <InteractionBar
            likes={likes} hasLiked={hasLiked}
            hasFaved={hasFaved} views={views}
            onLike={toggleLike} onFav={toggleFav}
            user={user}
          />

          {/* Owner actions */}
          {isOwner && (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button className="btn-edit" onClick={() => onEdit(post)}>✏️ Edit</button>
              {confirmDelete ? (
                <>
                  <span style={{ fontSize: '0.8rem', color: 'var(--ink-faint)', alignSelf: 'center' }}>Sure?</span>
                  <button className="btn-edit" onClick={() => setConfirmDelete(false)}>Cancel</button>
                  <button className="btn-delete" onClick={() => onDelete(post.id)}>Yes, delete</button>
                </>
              ) : (
                <button className="btn-delete" onClick={() => setConfirmDelete(true)}>🗑 Delete</button>
              )}
            </div>
          )}
        </div>

        {/* Comments */}
        <CommentsSection
          threaded={threaded}
          loading={commentsLoading}
          user={userWithProfile}
          onAdd={handleAddComment}
          onDelete={(id) => deleteComment(id, user?.id)}
          onReply={handleReply}
        />

      </div>
    </main>
  )
}
