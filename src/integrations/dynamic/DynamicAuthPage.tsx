import type { FC } from 'react'
import { DynamicEmbeddedWidget } from '@dynamic-labs/sdk-react-core'
import { isDynamicConfigured } from './config'

export const DynamicAuthPage: FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="min-h-full overflow-y-auto bg-[var(--surface)] px-4 py-6">
    <div className="mx-auto flex max-w-[560px] flex-col gap-5">
      <div>
        <span className="text-label-sm font-semibold uppercase tracking-[0.16em] text-[var(--secondary)]">SuperIM authentication</span>
        <h1 className="mt-2 text-headline-md text-[var(--primary)]">{title}</h1>
        <p className="mt-2 text-body-md text-[var(--on-surface-variant)]">{description}</p>
      </div>
      {isDynamicConfigured ? (
        <div className="rounded-2xl bg-[var(--surface-container-low)] p-3 shadow-ambient-lg">
          <DynamicEmbeddedWidget />
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-5 text-body-md text-[var(--on-surface-variant)]">
          Configure <code>VITE_DYNAMIC_ENVIRONMENT_ID</code> to enable Dynamic authentication.
        </div>
      )}
    </div>
  </div>
)
