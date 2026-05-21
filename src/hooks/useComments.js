import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useComments(postId) {
  const [comments, setComments] = useState([])
  const [loading, setLoading]   = useState(true)

  const fetch = useCallback(async () => {
    if (!postId) return
    setLoading(true)
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    setComments(data || [])
    setLoading(false)
  }, [postId])

  useEffect(() => { fetch() }, [fetch])

  const addComment = async (content, userId, profile, parentId = null) => {
    const { data, error } = await supabase.from('comments').insert([{
      post_id:     postId,
      user_id:     userId,
      parent_id:   parentId,
      content:     content.trim(),
      author_name:  profile?.full_name || 'Anonymous',
      author_emoji: profile?.avatar_emoji || '🌸',
    }]).select().single()
    if (error) throw error
    setComments(prev => [...prev, data])
    return data
  }

  const deleteComment = async (commentId, userId) => {
    const { error } = await supabase
      .from('comments').delete()
      .eq('id', commentId).eq('user_id', userId)
    if (!error) setComments(prev => prev.filter(c => c.id !== commentId))
  }

  // Build threaded tree: top-level + their replies
  const threaded = comments
    .filter(c => !c.parent_id)
    .map(c => ({
      ...c,
      replies: comments.filter(r => r.parent_id === c.id),
    }))

  return { comments, threaded, loading, addComment, deleteComment }
}
