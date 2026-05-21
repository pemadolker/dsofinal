// import React, { useState } from 'react'

// export default function AuthPage({ onSignInGoogle, onSignInEmail, onSignUpEmail }) {
//   const [mode, setMode]       = useState('login') // 'login' | 'signup'
//   const [email, setEmail]     = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError]     = useState('')
//   const [loading, setLoading] = useState(false)

//   const handle = async (fn) => {
//     setError(''); setLoading(true)
//     const { error } = await fn()
//     if (error) setError(error.message)
//     setLoading(false)
//   }

//   const inputStyle = {
//     width: '100%',
//     background: 'rgba(255,255,255,0.8)',
//     border: '1px solid var(--border)',
//     borderRadius: 'var(--radius-sm)',
//     padding: '0.85rem 1.1rem',
//     color: 'var(--ink)',
//     fontFamily: 'var(--font-body)',
//     fontSize: '0.95rem',
//     outline: 'none',
//     marginBottom: '0.9rem',
//     transition: 'border var(--transition)',
//   }

//   return (
//     <main className="page">
//       <div style={{
//         minHeight: '100vh',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         padding: '6rem 1.5rem 3rem',
//       }}>
//         <div style={{
//           width: '100%', maxWidth: 420,
//           background: 'rgba(255,255,255,0.75)',
//           border: '1px solid var(--border)',
//           borderRadius: 'var(--radius)',
//           padding: '2.5rem 2rem',
//           backdropFilter: 'blur(12px)',
//           boxShadow: 'var(--shadow)',
//         }}>
//           {/* Logo */}
//           <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
//             <div style={{ fontFamily: 'var(--font-prose)', fontSize: '2.5rem', color: 'var(--sakura-deep)', marginBottom: '0.3rem' }}>ペマ</div>
//             <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.3rem' }}>
//               {mode === 'login' ? 'Welcome back' : 'Join Wabisabi Notes'}
//             </h1>
//             <p style={{ color: 'var(--ink-faint)', fontSize: '0.85rem' }}>
//               {mode === 'login' ? 'Sign in to your account' : 'Create your free account'}
//             </p>
//           </div>

//           {/* Google button */}
//           <button
//             onClick={() => handle(onSignInGoogle)}
//             disabled={loading}
//             style={{
//               width: '100%', padding: '0.85rem',
//               background: 'white', border: '1px solid var(--border)',
//               borderRadius: 'var(--radius-sm)', cursor: 'pointer',
//               fontFamily: 'var(--font-body)', fontSize: '0.9rem',
//               color: 'var(--ink)', fontWeight: 500,
//               display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem',
//               marginBottom: '1.2rem', transition: 'var(--transition)',
//               boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
//             }}
//             onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
//             onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'}
//           >
//             <svg width="18" height="18" viewBox="0 0 18 18">
//               <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
//               <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
//               <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
//               <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
//             </svg>
//             Continue with Google
//           </button>

//           {/* Divider */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
//             <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
//             <span style={{ color: 'var(--ink-faint)', fontSize: '0.75rem', letterSpacing: '0.08em' }}>OR</span>
//             <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
//           </div>

//           {/* Email form */}
//           <input
//             type="email" placeholder="Email address"
//             value={email} onChange={e => setEmail(e.target.value)}
//             style={inputStyle}
//             onFocus={e => e.target.style.border = '1px solid var(--sakura-deep)'}
//             onBlur={e => e.target.style.border = '1px solid var(--border)'}
//           />
//           <input
//             type="password" placeholder="Password"
//             value={password} onChange={e => setPassword(e.target.value)}
//             style={{ ...inputStyle, marginBottom: error ? '0.5rem' : '1.2rem' }}
//             onFocus={e => e.target.style.border = '1px solid var(--sakura-deep)'}
//             onBlur={e => e.target.style.border = '1px solid var(--border)'}
//             onKeyDown={e => e.key === 'Enter' && handle(() =>
//               mode === 'login' ? onSignInEmail(email, password) : onSignUpEmail(email, password)
//             )}
//           />

//           {error && (
//             <p style={{ color: '#c0392b', fontSize: '0.8rem', marginBottom: '0.8rem', lineHeight: 1.5 }}>
//               ⚠️ {error}
//             </p>
//           )}

//           {mode === 'signup' && (
//             <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginBottom: '0.9rem', lineHeight: 1.6 }}>
//               📧 After signing up, check your email to confirm your account before logging in.
//             </p>
//           )}

//           <button
//             onClick={() => handle(() =>
//               mode === 'login' ? onSignInEmail(email, password) : onSignUpEmail(email, password)
//             )}
//             disabled={loading || !email || !password}
//             className="btn-publish"
//             style={{ width: '100%', padding: '0.9rem', fontSize: '0.9rem' }}
//           >
//             {loading ? '🌸 Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
//           </button>

//           {/* Toggle */}
//           <p style={{ textAlign: 'center', marginTop: '1.3rem', fontSize: '0.85rem', color: 'var(--ink-faint)', marginBottom: 0 }}>
//             {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
//             <button
//               onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
//               style={{ background: 'none', border: 'none', color: 'var(--sakura-deep)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}
//             >
//               {mode === 'login' ? 'Sign up free' : 'Sign in'}
//             </button>
//           </p>
//         </div>
//       </div>
//     </main>
//   )
// }



import React, { useState } from 'react'

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password, mode) {
  const errors = []
  if (mode === 'signup') {
    if (password.length < 8)           errors.push('At least 8 characters')
    if (!/[A-Z]/.test(password))       errors.push('One uppercase letter')
    if (!/[0-9]/.test(password))       errors.push('One number')
  } else {
    if (password.length < 1) errors.push('Password is required')
  }
  return errors
}

export default function AuthPage({ onSignInGoogle, onSignInEmail, onSignUpEmail }) {
  const [mode, setMode]         = useState('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [touched, setTouched]   = useState({ email: false, password: false })
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [loading, setLoading]   = useState(false)

  const emailError    = touched.email    && !validateEmail(email)    ? 'Please enter a valid email address' : ''
  const passwordErrors = touched.password ? validatePassword(password, mode) : []
  const isFormValid   = validateEmail(email) && validatePassword(password, mode).length === 0

  const handle = async (fn) => {
    setError(''); setSuccess(''); setLoading(true)
    const { error, data } = await fn()
    if (error) {
      // Make Supabase errors human-friendly
      const msg = error.message
      if (msg.includes('Invalid login'))        setError('Wrong email or password. Please try again.')
      else if (msg.includes('Email not confirmed')) setError('Please check your email and click the confirmation link first.')
      else if (msg.includes('already registered')) setError('This email is already registered. Try signing in instead.')
      else if (msg.includes('rate limit'))      setError('Too many attempts. Please wait a moment and try again.')
      else setError(msg)
    } else if (mode === 'signup' && data?.user && !data?.session) {
      setSuccess('🌸 Check your email! We sent you a confirmation link. Click it then come back to sign in.')
    }
    setLoading(false)
  }

  const handleSubmit = () => {
    setTouched({ email: true, password: true })
    if (!isFormValid) return
    handle(() => mode === 'login'
      ? onSignInEmail(email, password)
      : onSignUpEmail(email, password)
    )
  }

  const switchMode = (m) => {
    setMode(m); setError(''); setSuccess('')
    setTouched({ email: false, password: false })
  }

  const inputWrap = (hasError) => ({
    position: 'relative',
    marginBottom: hasError ? '0.3rem' : '1rem',
  })

  const inputStyle = (hasError) => ({
    width: '100%',
    background: 'rgba(255,255,255,0.9)',
    border: `1px solid ${hasError ? '#e74c3c' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)',
    padding: '0.85rem 1.1rem',
    color: 'var(--ink)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border var(--transition), box-shadow var(--transition)',
    boxShadow: hasError ? '0 0 0 3px rgba(231,76,60,0.1)' : 'none',
  })

  const fieldError = (msg) => (
    <p style={{ color: '#e74c3c', fontSize: '0.75rem', marginBottom: '0.7rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
      ⚠ {msg}
    </p>
  )

  // Password strength bar (signup only)
  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) ? 2
    : 3
  const strengthLabel = ['', 'Weak', 'Almost there', 'Strong']
  const strengthColor = ['', '#e74c3c', '#f39c12', '#27ae60']

  return (
    <main className="page">
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '6rem 1.5rem 3rem',
      }}>
        <div style={{
          width: '100%', maxWidth: 420,
          background: 'rgba(255,255,255,0.78)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '2.5rem 2rem',
          backdropFilter: 'blur(12px)',
          boxShadow: 'var(--shadow)',
        }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontFamily: 'var(--font-prose)', fontSize: '2.5rem', color: 'var(--sakura-deep)', marginBottom: '0.3rem' }}>ペマ</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.3rem' }}>
              {mode === 'login' ? 'Welcome back' : 'Join Wabisabi Notes'}
            </h1>
            <p style={{ color: 'var(--ink-faint)', fontSize: '0.85rem', marginBottom: 0 }}>
              {mode === 'login' ? 'Sign in to your account' : 'Create your free account'}
            </p>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: 'flex', background: 'var(--mist)',
            borderRadius: 'var(--radius-sm)', padding: '3px',
            marginBottom: '1.5rem',
          }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => switchMode(m)} style={{
                flex: 1, padding: '0.5rem',
                borderRadius: 'calc(var(--radius-sm) - 2px)',
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 500,
                background: mode === m ? 'white' : 'transparent',
                color: mode === m ? 'var(--ink)' : 'var(--ink-faint)',
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'var(--transition)',
              }}>
                {m === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {/* Google */}
          <button
            onClick={() => handle(onSignInGoogle)}
            disabled={loading}
            style={{
              width: '100%', padding: '0.85rem',
              background: 'white', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: 'var(--ink)', fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem',
              marginBottom: '1.2rem', transition: 'var(--transition)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ color: 'var(--ink-faint)', fontSize: '0.75rem', letterSpacing: '0.08em' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Email field */}
          <div style={inputWrap(!!emailError)}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              style={inputStyle(!!emailError)}
              onFocus={e => { if (!emailError) e.target.style.border = '1px solid var(--sakura-deep)' }}
            />
          </div>
          {emailError && fieldError(emailError)}

          {/* Password field */}
          <div style={{ ...inputWrap(passwordErrors.length > 0), position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder={mode === 'signup' ? 'Password (min 8 chars)' : 'Password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, password: true }))}
              style={{ ...inputStyle(touched.password && passwordErrors.length > 0), paddingRight: '2.8rem' }}
              onFocus={e => { if (!passwordErrors.length) e.target.style.border = '1px solid var(--sakura-deep)' }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <button
              onClick={() => setShowPass(s => !s)}
              style={{
                position: 'absolute', right: '0.8rem', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1rem', color: 'var(--ink-faint)', padding: '0.2rem',
              }}
              tabIndex={-1}
            >{showPass ? '🙈' : '👁'}</button>
          </div>

          {/* Password errors (signup) */}
          {mode === 'signup' && touched.password && passwordErrors.length > 0 && (
            <div style={{ marginBottom: '0.7rem' }}>
              {passwordErrors.map(e => fieldError(e))}
            </div>
          )}

          {/* Password strength bar (signup) */}
          {mode === 'signup' && password.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '0.25rem' }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 2,
                    background: i <= strength ? strengthColor[strength] : 'var(--border)',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <p style={{ fontSize: '0.72rem', color: strengthColor[strength], marginBottom: 0, fontWeight: 500 }}>
                {strengthLabel[strength]}
              </p>
            </div>
          )}

          {/* API error */}
          {error && (
            <div style={{
              background: 'rgba(231,76,60,0.07)', border: '1px solid rgba(231,76,60,0.2)',
              borderRadius: 'var(--radius-sm)', padding: '0.7rem 0.9rem',
              marginBottom: '1rem',
            }}>
              <p style={{ color: '#c0392b', fontSize: '0.82rem', marginBottom: 0, lineHeight: 1.5 }}>⚠ {error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div style={{
              background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(39,174,96,0.25)',
              borderRadius: 'var(--radius-sm)', padding: '0.7rem 0.9rem',
              marginBottom: '1rem',
            }}>
              <p style={{ color: '#27ae60', fontSize: '0.82rem', marginBottom: 0, lineHeight: 1.6 }}>{success}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-publish"
            style={{ width: '100%', padding: '0.9rem', fontSize: '0.9rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '🌸 Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          {/* Requirements hint for signup */}
          {mode === 'signup' && !touched.password && (
            <p style={{ fontSize: '0.75rem', color: 'var(--ink-faint)', marginTop: '0.8rem', marginBottom: 0, lineHeight: 1.6, textAlign: 'center' }}>
              Password needs 8+ chars, one uppercase, one number
            </p>
          )}
        </div>
      </div>
    </main>
  )
}