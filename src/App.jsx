import React, { useState } from 'react'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Petals from './components/Petals.jsx'
import Toast, { showToast } from './components/Toast.jsx'
import HomePage from './pages/HomePage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import PostPage from './pages/PostPage.jsx'
import WritePage from './pages/WritePage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import FavouritesPage from './pages/FavouritesPage.jsx'
import { usePosts } from './hooks/usePosts.js'
import { useAuth } from './hooks/useAuth.js'

export default function App() {
  const { user, profile, loading: authLoading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, updateProfile } = useAuth()
  const { posts, loading: postsLoading, addPost, updatePost, deletePost } = usePosts()

  const [page, setPage]                 = useState('home')
  const [activePost, setActivePost]     = useState(null)
  const [viewedProfile, setViewedProfile] = useState(null)
  const [saving, setSaving]             = useState(false)

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const goTo = (p) => { setPage(p); scrollTop() }

  const handleOpenPost = (post) => { setActivePost(post); goTo('post') }

  const handleAuthorClick = async (userId) => {
    if (!userId) return
    const { supabase } = await import('./lib/supabase.js')
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) { setViewedProfile(data); goTo('author') }
  }

  const handleSetPage = (p) => {
    if (p === 'write' && !user) { goTo('auth'); return }
    if (p === 'favourites' && !user) { goTo('auth'); return }
    setActivePost(null)
    setViewedProfile(null)
    goTo(p)
  }

  const handleSave = async (post) => {
    if (!user) { goTo('auth'); return }
    setSaving(true)
    try {
      if (page === 'edit') {
        const updated = await updatePost(post)
        setActivePost(updated)
        goTo('post')
        showToast('✿ Note updated!')
      } else {
        await addPost(post, user, profile)
        goTo('blog')
        showToast('✿ Note published!')
      }
    } catch (e) {
      showToast('⚠️ Error saving — try again')
      console.error(e)
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    try { await deletePost(id); goTo('blog'); showToast('Note deleted') }
    catch { showToast('⚠️ Error deleting') }
  }

  const handleEdit = (post) => { setActivePost(post); goTo('edit') }

  const handleSignOut = async () => {
    await signOut(); goTo('home')
    showToast('Signed out — see you soon! 🌸')
  }

  const handleUpdateProfile = async (updates) => {
    await updateProfile(updates)
    showToast('✿ Profile updated!')
  }

  const navPage = ['write','edit'].includes(page) ? 'write'
    : ['post','blog'].includes(page) ? 'blog'
    : page

  if (authLoading) return (
    <>
      <Petals />
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
        <div style={{ fontSize:'2.5rem', animation:'spin 1.5s linear infinite' }}>🌸</div>
        <p style={{ color:'var(--ink-faint)', fontSize:'0.9rem', letterSpacing:'0.08em' }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  )

  return (
    <>
      <Petals />
      <Nav page={navPage} setPage={handleSetPage} user={user} profile={profile} onSignOut={handleSignOut} />

      {page === 'home' && <HomePage posts={posts} setPage={handleSetPage} onOpenPost={handleOpenPost} onAuthorClick={handleAuthorClick} user={user} />}
      {page === 'blog' && <BlogPage posts={posts} onOpenPost={handleOpenPost} onAuthorClick={handleAuthorClick} />}

      {page === 'post' && activePost && (
        <PostPage
          post={activePost}
          onBack={() => goTo('blog')}
          onDelete={handleDelete}
          onEdit={handleEdit}
          isOwner={user?.id === activePost.userId}
          onAuthorClick={handleAuthorClick}
          user={user}
          profile={profile}
        />
      )}

      {(page === 'write' || page === 'edit') && (
        <WritePage
          initialPost={page === 'edit' ? activePost : null}
          onSave={handleSave}
          onCancel={() => goTo(page === 'edit' ? 'post' : 'blog')}
          saving={saving}
        />
      )}

      {page === 'auth' && (
        <AuthPage
          onSignInGoogle={signInWithGoogle}
          onSignInEmail={signInWithEmail}
          onSignUpEmail={signUpWithEmail}
        />
      )}

      {page === 'profile' && profile && (
        <ProfilePage profile={profile} isOwn={true} onOpenPost={handleOpenPost} onUpdateProfile={handleUpdateProfile} onWrite={() => goTo('write')} />
      )}

      {page === 'author' && viewedProfile && (
        <ProfilePage profile={viewedProfile} isOwn={user?.id === viewedProfile.id} onOpenPost={handleOpenPost} onUpdateProfile={handleUpdateProfile} onWrite={() => goTo('write')} />
      )}

      {page === 'favourites' && user && (
        <FavouritesPage user={user} onOpenPost={handleOpenPost} onAuthorClick={handleAuthorClick} />
      )}

      {user && page === 'auth' && (() => { goTo('home'); return null })()}

      <Footer />
      <Toast />
    </>
  )
}
