import type { PageCategory } from '../config/pages'

export interface PageTree {
  path: string
  children: PageTree[]
}

export type PageNavigationData = Record<PageCategory, PageTree[]>

const API_URL = '/api/page-navigation'

export async function loadPageNavigation(): Promise<PageNavigationData> {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error(`Failed to load page navigation: ${response.status}`)
  return response.json() as Promise<PageNavigationData>
}

export async function savePageNavigation(data: PageNavigationData): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error(`Failed to save page navigation: ${response.status}`)
}
