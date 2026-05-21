import React, { useState } from 'react'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day:'numeric', month:'short' })
}

function CommentInput({ onSubmit, placeholder = 'Write a comment...', autoFocus = false, compact = false }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!text.trim()) return
    setLoading(true)
    await onSubmit(text)
    setText('')
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <textarea
        autoFocus={autoFocus}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.85)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.7rem 0.9rem',
          color: 'var(--ink)', fontFamily: 'var(--font-body)',
          fontSize: '0.88rem', resize: 'none', outline: 'none',
          lineHeight: 1.6,
          transition: 'border var(--transition)',
        }}
        onFocus={e => e.target.style.border = '1px solid var(--sakura-deep)'}
        onBlur={e => e.target.style.border = '1px solid var(--border)'}
        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>Ctrl+Enter to send</span>
        <button
          onClick={submit}
          disabled={!text.trim() || loading}
          className="btn-publish"
          style={{ padding: '0.45rem 1.1rem', fontSize: '0.8rem' }}
        >{loading ? '...' : 'Post'}</button>
      </div>
    </div>
  )
}

function CommentBubble({ comment, user, onDelete, onReply, depth = 0 }) {
  const [replying, setReplying] = useState(false)
  const isOwn = user?.id === comment.user_id
  const maxDepth = 1 // only 1 level of replies

  return (
    <div style={{ marginLeft: depth > 0 ? '2rem' : 0 }}>
      <div style={{
        background: depth > 0 ? 'rgba(242,196,206,0.07)' : 'rgba(255,255,255,0.6)',
        border: '1px solid var(--border)',
        borderLeft: depth > 0 ? '3px solid var(--sakura)' : '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.85rem 1rem',
        marginBottom: '0.5rem',
        backdropFilter: 'blur(6px)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1rem' }}>{comment.author_emoji || '🌸'}</span>
          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)' }}>
            {comment.author_name || 'Anonymous'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--ink-faint)', marginLeft: 'auto' }}>
            {timeAgo(comment.created_at)}
          </span>
        </div>

        {/* Content */}
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '0.5rem' }}>
          {comment.content}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          {user && depth < maxDepth && (
            <button
              onClick={() => setReplying(r => !r)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.75rem', color: 'var(--sakura-deep)',
                fontFamily: 'var(--font-body)', padding: 0, fontWeight: 500,
              }}
            >{replying ? 'Cancel' : '↩ Reply'}</button>
          )}
          {isOwn && (
            <button
              onClick={() => onDelete(comment.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.75rem', color: 'var(--ink-faint)',
                fontFamily: 'var(--font-body)', padding: 0,
                transition: 'color var(--transition)',
              }}
              onMouseEnter={e => e.target.style.color = '#e74c3c'}
              onMouseLeave={e => e.target.style.color = 'var(--ink-faint)'}
            >🗑 Delete</button>
          )}
        </div>
      </div>

      {/* Reply input */}
      {replying && (
        <div style={{ marginLeft: '2rem', marginBottom: '0.5rem' }}>
          <CommentInput
            autoFocus
            compact
            placeholder={`Replying to ${comment.author_name}...`}
            onSubmit={async (text) => {
              await onReply(text, comment.id)
              setReplying(false)
            }}
          />
        </div>
      )}

      {/* Replies */}
      {comment.replies?.map(reply => (
        <CommentBubble
          key={reply.id}
          comment={reply}
          user={user}
          onDelete={onDelete}
          onReply={onReply}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

export default function CommentsSection({ threaded, loading, user, onAdd, onDelete, onReply }) {
  const total = threaded.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)

  return (
    <div style={{ marginTop: '3rem' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-mark">✿</span>
        <span className="section-label">{total} Comment{total !== 1 ? 's' : ''}</span>
        <div className="section-line" />
      </div>

      {/* Add comment */}
      {user ? (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '1.2rem' }}>{user.profile?.avatar_emoji || '🌸'}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>
              {user.profile?.full_name || 'You'}
            </span>
          </div>
          <CommentInput onSubmit={(text) => onAdd(text)} />
        </div>
      ) : (
        <div style={{
          background: 'var(--washi)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', padding: '1rem 1.2rem',
          marginBottom: '2rem', fontSize: '0.88rem', color: 'var(--ink-soft)',
        }}>
          🌸 <strong>Sign in</strong> to leave a comment
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <p style={{ color: 'var(--ink-faint)', fontSize: '0.88rem' }}>Loading comments...</p>
      ) : threaded.length === 0 ? (
        <p style={{ color: 'var(--ink-faint)', fontSize: '0.88rem', textAlign: 'center', padding: '1.5rem' }}>
          No comments yet — be the first! 🌸
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {threaded.map(comment => (
            <CommentBubble
              key={comment.id}
              comment={comment}
              user={user}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}
