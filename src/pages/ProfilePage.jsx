import React, { useState } from 'react'
import PostCard from '../components/PostCard.jsx'
import { usePosts } from '../hooks/usePosts.js'

const AVATAR_EMOJIS = ['🌸','🌺','🌻','🌹','🍀','🦋','✨','🌙','⭐','🎋','🍵','📝','💻','🎨','🌊']

export default function ProfilePage({ profile, isOwn, onOpenPost, onUpdateProfile, onWrite }) {
  const { posts, loading } = usePosts(profile.id)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [bio, setBio]           = useState(profile.bio || '')
  const [avatarEmoji, setAvatarEmoji] = useState(profile.avatar_emoji || '🌸')
  const [saving, setSaving]     = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onUpdateProfile({ full_name: fullName, bio, avatar_emoji: avatarEmoji })
    setSaving(false)
    setEditing(false)
  }

  return (
    <main className="page">
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '5rem' }}>

        {/* Profile header */}
        <div style={{
          background: 'rgba(255,255,255,0.7)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '2.5rem 2rem',
          backdropFilter: 'blur(10px)', marginBottom: '3rem',
          display: 'flex', gap: '2rem', alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}>
          {/* Avatar */}
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--petal), var(--sakura))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', flexShrink: 0,
            border: '3px solid var(--border)',
          }}>
            {editing ? avatarEmoji : (profile.avatar_emoji || '🌸')}
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            {editing ? (
              <>
                <input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your name"
                  style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700,
                    background: 'rgba(255,255,255,0.9)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.8rem',
                    color: 'var(--ink)', outline: 'none', width: '100%', marginBottom: '0.6rem',
                  }}
                  onFocus={e => e.target.style.border = '1px solid var(--sakura-deep)'}
                  onBlur={e => e.target.style.border = '1px solid var(--border)'}
                />
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell people a little about yourself..."
                  rows={2}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.9)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem 0.8rem', color: 'var(--ink)',
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                    outline: 'none', resize: 'none', marginBottom: '0.8rem',
                  }}
                  onFocus={e => e.target.style.border = '1px solid var(--sakura-deep)'}
                  onBlur={e => e.target.style.border = '1px solid var(--border)'}
                />
                {/* Emoji picker */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--ink-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Pick avatar</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {AVATAR_EMOJIS.map(e => (
                      <button key={e} onClick={() => setAvatarEmoji(e)} style={{
                        width: 36, height: 36, borderRadius: 8, fontSize: '1.2rem',
                        border: avatarEmoji === e ? '2px solid var(--sakura-deep)' : '1px solid var(--border)',
                        background: avatarEmoji === e ? 'var(--washi)' : 'transparent',
                        cursor: 'pointer',
                      }}>{e}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="btn-publish" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save profile'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.3rem' }}>
                  {profile.full_name || 'Writer'}
                </h1>
                <p style={{ fontSize: '0.8rem', color: 'var(--ink-faint)', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                  @{profile.username}
                </p>
                {profile.bio && (
                  <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 480, marginBottom: '0.8rem' }}>
                    {profile.bio}
                  </p>
                )}
                <p style={{ fontSize: '0.8rem', color: 'var(--ink-faint)' }}>
                  ✿ {posts.length} note{posts.length !== 1 ? 's' : ''}
                </p>
              </>
            )}
          </div>

          {/* Owner actions */}
          {isOwn && !editing && (
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button className="btn-edit" onClick={() => setEditing(true)}>✏️ Edit profile</button>
              <button className="btn-publish" onClick={onWrite} style={{ padding: '0.5rem 1.2rem', fontSize: '0.82rem' }}>
                ✿ New note
              </button>
            </div>
          )}
        </div>

        {/* Posts */}
        <div className="section-header">
          <span className="section-mark">✿</span>
          <span className="section-label">{isOwn ? 'My notes' : `Notes by ${profile.full_name || 'this writer'}`}</span>
          <div className="section-line" />
        </div>

        {loading ? (
          <div className="empty-state">Loading notes... 🌸</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            {isOwn ? 'No notes yet — write your first one! 🌸' : 'No notes published yet. 🌸'}
          </div>
        ) : (
          <div className="cards-grid">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} onClick={onOpenPost} />
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
