
import React, { useState } from 'react'

export default function Nav({ page, setPage, user, profile, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="nav">
      <button className="nav-logo" onClick={() => setPage('home')}>
      <span className="logo-kanji">ペマ</span>
      Wabisabi Notes
      </button>

      <ul className="nav-links">
        <li><button className={page === 'home' ? 'active' : ''} onClick={() => setPage('home')}>Home</button></li>
        <li><button className={page === 'blog' || page === 'post' ? 'active' : ''} onClick={() => setPage('blog')}>Blog</button></li>

        {user ? (
          <>
            <li>
              <button
                className={page === 'write' || page === 'edit' ? 'active' : ''}
                onClick={() => setPage('write')}
              >Write</button>
            </li>

            {/* Avatar dropdown */}
            <li style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--petal), var(--sakura))',
                  border: '2px solid var(--border)',
                  fontSize: '1rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'var(--transition)',
                }}
              >{profile?.avatar_emoji || '🌸'}</button>

              {menuOpen && (
                <div
                  onMouseLeave={() => setMenuOpen(false)}
                  style={{
                    position: 'absolute', right: 0, top: '110%',
                    background: 'rgba(255,255,255,0.97)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-hover)',
                    minWidth: 190, zIndex: 200, overflow: 'hidden',
                  }}
                >
                  {/* User info */}
                  <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)', marginBottom: '0.1rem' }}>
                      {profile?.full_name || 'Writer'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--ink-faint)', marginBottom: 0 }}>
                      @{profile?.username}
                    </p>
                  </div>

                  {[
                    { label: '🌸 My Profile',    action: 'profile' },
                    { label: '🔖 Favourites',     action: 'favourites' },
                    { label: '✏️ Write note',     action: 'write' },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => { setPage(item.action); setMenuOpen(false) }}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '0.7rem 1rem',
                        background: 'none', border: 'none',
                        fontSize: '0.85rem', cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        color: 'var(--ink-soft)',
                        transition: 'background var(--transition)',
                        display: 'block',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--mist)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >{item.label}</button>
                  ))}

                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={() => { onSignOut(); setMenuOpen(false) }}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '0.7rem 1rem',
                        background: 'none', border: 'none',
                        fontSize: '0.85rem', cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        color: '#c0392b',
                        transition: 'background var(--transition)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--mist)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >↩ Sign out</button>
                  </div>
                </div>
              )}
            </li>
          </>
        ) : (
          <li>
            <button
              onClick={() => setPage('auth')}
              style={{
                background: 'var(--ink)', color: 'var(--cream)',
                border: 'none', borderRadius: '100px',
                padding: '0.45rem 1.1rem', fontSize: '0.82rem',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                fontWeight: 500, letterSpacing: '0.03em',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--sakura-deep)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
            >Sign in</button>
          </li>
        )}
      </ul>
    </nav>
  )
}
