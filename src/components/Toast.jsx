import React, { useEffect, useState } from 'react'

let _show = null
export function showToast(msg) { _show?.(msg) }

export default function Toast() {
  const [msg, setMsg] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    _show = (m) => {
      setMsg(m)
      setVisible(true)
      setTimeout(() => setVisible(false), 2500)
    }
    return () => { _show = null }
  }, [])

  if (!msg) return null
  return (
    <div className={`toast ${visible ? 'visible' : 'hidden'}`}>{msg}</div>
  )
}
