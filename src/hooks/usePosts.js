import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

function fromDB(row) {
  return {
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
  }
}

function toDB(post, user, profile) {
  return {
    title:       post.title,
    excerpt:     post.excerpt,
    content:     post.content,
    tags:        post.tags,
    date:        post.date,
    read_time:   post.readTime,
    emoji:       post.emoji,
    color:       post.color,
    user_id:     user.id,
    author_name:  profile?.full_name || user.email,
    author_emoji: profile?.avatar_emoji || '🌸',
  }
}

export function usePosts(filterUserId = null) {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (filterUserId) query = query.eq('user_id', filterUserId)

    const { data, error } = await query
    if (error) setError(error.message)
    else setPosts(data.map(fromDB))
    setLoading(false)
  }, [filterUserId])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const addPost = async (post, user, profile) => {
    const { data, error } = await supabase
      .from('posts').insert([toDB(post, user, profile)]).select().single()
    if (error) throw new Error(error.message)
    const newPost = fromDB(data)
    setPosts(prev => [newPost, ...prev])
    return newPost
  }

  const updatePost = async (post) => {
    const { data, error } = await supabase
      .from('posts').update({
        title: post.title, excerpt: post.excerpt, content: post.content,
        tags: post.tags, date: post.date, read_time: post.readTime,
        emoji: post.emoji, color: post.color,
      }).eq('id', post.id).select().single()
    if (error) throw new Error(error.message)
    const updated = fromDB(data)
    setPosts(prev => prev.map(p => p.id === post.id ? updated : p))
    return updated
  }

  const deletePost = async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return { posts, loading, error, addPost, updatePost, deletePost, refetch: fetchPosts }
}
