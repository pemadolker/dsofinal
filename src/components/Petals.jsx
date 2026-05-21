import React, { useEffect, useRef } from 'react'

export default function Petals() {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    container.innerHTML = ''
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div')
      p.className = 'petal'
      p.style.left = Math.random() * 100 + 'vw'
      p.style.animationDuration = (8 + Math.random() * 10) + 's'
      p.style.animationDelay = (Math.random() * 10) + 's'
      const size = (5 + Math.random() * 8) + 'px'
      p.style.width = size
      p.style.height = size
      p.style.opacity = String(0.4 + Math.random() * 0.4)
      container.appendChild(p)
    }
  }, [])

  return <div className="petals-container" ref={ref} />
}
