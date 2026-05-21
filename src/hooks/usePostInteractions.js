import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase.js'

export function usePostInteractions(postId, userId) {
  const [likes, setLikes]         = useState(0)
  const [hasLiked, setHasLiked]   = useState(false)
  const [hasFaved, setHasFaved]   = useState(false)
  const [views, setViews]         = useState(0)
  const [loading, setLoading]     = useState(true)

  const fetch = useCallback(async () => {
    if (!postId) return
    setLoading(true)

    // Like count + whether current user liked
    const { data: likesData } = await supabase
      .from('likes').select('user_id').eq('post_id', postId)
    setLikes(likesData?.length || 0)
    if (userId) setHasLiked(likesData?.some(l => l.user_id === userId) || false)

    // Favourite
    if (userId) {
      const { data: favData } = await supabase
        .from('favourites').select('id').eq('post_id', postId).eq('user_id', userId).single()
      setHasFaved(!!favData)
    }

    // View count
    const { data: postData } = await supabase
      .from('posts').select('view_count').eq('id', postId).single()
    setViews(postData?.view_count || 0)

    setLoading(false)
  }, [postId, userId])

  useEffect(() => { fetch() }, [fetch])

  // Increment view on mount (once)
const viewCounted = useRef(false)
useEffect(() => {
  if (!postId || viewCounted.current) return
  viewCounted.current = true
  const increment = async () => {
    const { data: current } = await supabase
      .from('posts')
      .select('view_count')
      .eq('id', postId)
      .single()
    const newCount = (current?.view_count || 0) + 1
    await supabase
      .from('posts')
      .update({ view_count: newCount })
      .eq('id', postId)
    setViews(newCount)
  }
  increment()
}, [postId])

  const toggleLike = async () => {
    if (!userId) return
    if (hasLiked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', userId)
      setLikes(l => l - 1); setHasLiked(false)
    } else {
      await supabase.from('likes').insert([{ post_id: postId, user_id: userId }])
      setLikes(l => l + 1); setHasLiked(true)
    }
  }

  const toggleFav = async () => {
    if (!userId) return
    if (hasFaved) {
      await supabase.from('favourites').delete().eq('post_id', postId).eq('user_id', userId)
      setHasFaved(false)
    } else {
      await supabase.from('favourites').insert([{ post_id: postId, user_id: userId }])
      setHasFaved(true)
    }
  }

  return { likes, hasLiked, hasFaved, views, loading, toggleLike, toggleFav }
}
