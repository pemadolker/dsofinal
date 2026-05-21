import React, { useState } from 'react'

const EMOJIS = ['🌸','📝','💻','🌿','☁️','✨','📚','🍵','🔬','🧩']
const COLORS = [
  'linear-gradient(135deg, #fdf0f3, #f2c4ce)',
  'linear-gradient(135deg, #f0fdf4, #bbf7d0)',
  'linear-gradient(135deg, #fefce8, #fde68a)',
  'linear-gradient(135deg, #f0f9ff, #bae6fd)',
  'linear-gradient(135deg, #fdf4ff, #e9d5ff)',
]

export default function WritePage({ initialPost, onSave, onCancel, saving = false }) {
  const editing = !!initialPost
  const [title, setTitle]       = useState(initialPost?.title || '')
  const [excerpt, setExcerpt]   = useState(initialPost?.excerpt || '')
  const [content, setContent]   = useState(initialPost?.content || '')
  const [tags, setTags]         = useState((initialPost?.tags || []).join(', '))
  const [readTime, setReadTime] = useState(initialPost?.readTime || '')
  const [emoji, setEmoji]       = useState(initialPost?.emoji || '🌸')
  const [colorIdx, setColorIdx] = useState(0)

  const canSave = title.trim() && content.trim()

  const handleSave = () => {
    if (!canSave) return
    onSave({
      id: initialPost?.id || Date.now(),
      title: title.trim(),
      excerpt: excerpt.trim() || content.trim().slice(0, 120) + '...',
      content: content.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      date: initialPost?.date || new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      readTime: readTime.trim() || null,
      emoji,
      color: COLORS[colorIdx],
    })
  }

  return (
    <main className="page">
      <div className="write-container">

        <h1 className="write-title">{editing ? 'Edit Note ✏️' : 'New Note ✿'}</h1>
        <p className="write-sub">
          {editing ? 'Update your post below.' : 'Write your thoughts, learnings, or notes below.'}
        </p>

        {/* Title */}
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            className="form-input title-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Give your note a title..."
          />
        </div>

        {/* Tags */}
        <div className="form-group">
          <label className="form-label">Tags <span style={{ fontWeight: 300, opacity: 0.6 }}>(comma separated)</span></label>
          <input
            className="form-input"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="DBMS, SQL, Notes..."
          />
        </div>

        {/* Excerpt */}
        <div className="form-group">
          <label className="form-label">Excerpt <span style={{ fontWeight: 300, opacity: 0.6 }}>(short preview shown on card — leave blank to auto-generate)</span></label>
          <input
            className="form-input"
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            placeholder="A short summary of this note..."
          />
        </div>

        {/* Read time + emoji row */}
        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="form-label">Read time <span style={{ fontWeight: 300, opacity: 0.6 }}>(optional)</span></label>
            <input
              className="form-input"
              value={readTime}
              onChange={e => setReadTime(e.target.value)}
              placeholder="5 min read"
            />
          </div>
          <div>
            <label className="form-label">Card emoji</label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '0.2rem' }}>
              {EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  style={{
                    fontSize: '1.3rem', background: emoji === e ? 'var(--washi)' : 'transparent',
                    border: `1px solid ${emoji === e ? 'var(--sakura-deep)' : 'var(--border)'}`,
                    borderRadius: '8px', padding: '0.2rem 0.4rem', cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >{e}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Card colour */}
        <div className="form-group">
          <label className="form-label">Card colour</label>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {COLORS.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setColorIdx(i)}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: c, cursor: 'pointer',
                  border: colorIdx === i ? '2.5px solid var(--sakura-deep)' : '2px solid var(--border)',
                  transition: 'var(--transition)',
                  transform: colorIdx === i ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="form-group">
          <label className="form-label">Content <span style={{ fontWeight: 300, opacity: 0.6 }}>(supports **bold**, ## headings, - lists, &gt; blockquotes, ``` code)</span></label>
          <textarea
            className="form-textarea"
            rows={20}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={`Write your note here...\n\n## Section heading\n\nYour paragraph text.\n\n- Bullet point\n- Another point\n\n> A blockquote\n\n\`\`\`\nsome code here\n\`\`\``}
          />
          <div style={{ textAlign: 'right', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--ink-faint)' }}>
            {content.length} chars
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-cancel" type="button" onClick={onCancel}>Cancel</button>
          <button
            className="btn-publish"
            type="button"
            onClick={handleSave}
            disabled={!canSave}
          >
            {editing ? '✓ Save changes' : '✿ Publish note'}
          </button>
        </div>

      </div>
    </main>
  )
}
