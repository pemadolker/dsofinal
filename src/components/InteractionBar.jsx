import React from 'react'

export default function InteractionBar({ likes, hasLiked, hasFaved, views, onLike, onFav, user, compact = false }) {
  const btn = (active, onClick, children, title) => (
    <button
      title={!user ? `Sign in to ${title}` : title}
      onClick={user ? onClick : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: compact ? '0.3rem' : '0.4rem',
        background: active ? 'var(--washi)' : 'transparent',
        border: `1px solid ${active ? 'var(--sakura-deep)' : 'var(--border)'}`,
        borderRadius: '100px',
        padding: compact ? '0.3rem 0.7rem' : '0.45rem 1rem',
        cursor: user ? 'pointer' : 'not-allowed',
        fontFamily: 'var(--font-body)',
        fontSize: compact ? '0.75rem' : '0.82rem',
        color: active ? 'var(--sakura-deep)' : 'var(--ink-faint)',
        fontWeight: active ? 600 : 400,
        transition: 'var(--transition)',
        opacity: user ? 1 : 0.65,
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => user && (e.currentTarget.style.borderColor = 'var(--sakura-deep)')}
      onMouseLeave={e => !active && user && (e.currentTarget.style.borderColor = 'var(--border)')}
    >{children}</button>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      {btn(hasLiked, onLike, <>{hasLiked ? '♥' : '♡'} {likes}</>, 'like')}
      {btn(hasFaved, onFav, <>{hasFaved ? '🔖' : '🔖'} {hasFaved ? 'Saved' : 'Save'}</>, 'save to favourites')}
      <span style={{
        display: 'flex', alignItems: 'center', gap: '0.3rem',
        fontSize: compact ? '0.75rem' : '0.82rem',
        color: 'var(--ink-faint)', marginLeft: '0.2rem',
      }}>
        👁 {views} {!compact && 'views'}
      </span>
    </div>
  )
}
