import { useCallback, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Check, LockKeyhole } from 'lucide-react'

const EDIT_SESSION_KEY = 'prototype-spec-edit-verified'
const EDIT_PASSWORD = '891025'

export function useBuildVerification() {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [hasError, setHasError] = useState(false)
  const pendingAction = useRef<(() => void) | null>(null)

  const requestVerification = useCallback((action: () => void, options?: { requireVerification?: boolean; alwaysPrompt?: boolean }) => {
    if (!options?.alwaysPrompt && ((!options?.requireVerification && !import.meta.env.PROD) || sessionStorage.getItem(EDIT_SESSION_KEY) === 'true')) {
      action()
      return
    }
    pendingAction.current = action
    setPassword('')
    setHasError(false)
    setOpen(true)
  }, [])

  const cancelVerification = () => {
    pendingAction.current = null
    setPassword('')
    setHasError(false)
    setOpen(false)
  }

  const submitVerification = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== EDIT_PASSWORD) {
      setHasError(true)
      return
    }
    sessionStorage.setItem(EDIT_SESSION_KEY, 'true')
    setOpen(false)
    setPassword('')
    setHasError(false)
    const action = pendingAction.current
    pendingAction.current = null
    action?.()
  }

  const dialog = open ? createPortal((
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/35 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) cancelVerification() }}>
      <form onSubmit={submitVerification} role="dialog" aria-modal="true" aria-labelledby="build-verification-title" className="w-full max-w-sm rounded-2xl border border-[var(--tool-border)] tool-panel-light dark:tool-panel-dark p-5 shadow-2xl">
        <div id="build-verification-title" className="mb-4 flex items-center gap-2 font-semibold text-[var(--tool-text)]"><LockKeyhole size={17} />验证后继续操作</div>
        <label htmlFor="build-verification-password" className="mb-1.5 block text-xs text-[var(--tool-text-muted)]">编辑密码</label>
        <input id="build-verification-password" autoFocus type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="请输入密码" className="w-full rounded-xl border border-[var(--tool-border)] bg-[var(--tool-background)] px-3 py-2.5 text-sm text-[var(--tool-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--tool-focus)]" />
        {hasError && <p role="alert" className="mt-2 text-xs text-red-500">密码错误，请重试。</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={cancelVerification} className="rounded-lg px-3 py-2 text-sm text-[var(--tool-text-muted)] hover:bg-[var(--tool-surface-hover)]">取消</button>
          <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--tool-brand)] px-3 py-2 text-sm font-semibold text-white"><Check size={15} />验证并继续</button>
        </div>
      </form>
    </div>
  ), document.body) : null

  return { requestVerification, verificationDialog: dialog }
}
