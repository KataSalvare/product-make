import defaultAnnotations from '../src/resources/annotations.json'
import defaultPageNavigation from '../src/resources/page-navigation.json'

const ANNOTATIONS_KEY = 'annotations'
const SPEC_KEY_PREFIX = 'spec:'
const PAGE_NAVIGATION_KEY = 'page-navigation'
const EDITABLE_SPECS = new Set([
  'DEMO-ecommerce-detail',
  'DEMO-sports-health-home',
  'DEMO-blockchain-wallet',
  'DEMO-admin-saas-home',
  'DEMO-admin-user-management',
  'DEMO-admin-analytics',
])

interface AnnotationsData {
  annotations: unknown[]
  categories: unknown[]
}

interface PageNavigationData {
  frontend: unknown[]
  admin: unknown[]
}

interface AnnotationsKv {
  get(key: string, type: 'json'): Promise<unknown | null>
  put(key: string, value: string): Promise<void>
}

interface WorkerEnv {
  ANNOTATIONS_KV: AnnotationsKv
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isAnnotationsData(value: unknown): value is AnnotationsData {
  return (
    isRecord(value) &&
    Array.isArray(value.annotations) &&
    Array.isArray(value.categories)
  )
}

function isPageNavigationData(value: unknown): value is PageNavigationData {
  if (!isRecord(value)) return false
  const isTree = (node: unknown, depth = 0): boolean => {
    if (!isRecord(node) || depth > 8) return false
    return typeof node.path === 'string' && /^\/[a-zA-Z0-9/_-]+$/.test(node.path) && Array.isArray(node.children) && node.children.every(child => isTree(child, depth + 1))
  }
  return Array.isArray(value.frontend) && value.frontend.every(node => isTree(node)) && Array.isArray(value.admin) && value.admin.every(node => isTree(node))
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

async function handleAnnotations(request: Request, env: WorkerEnv): Promise<Response> {
  if (request.method === 'GET') {
    const stored = await env.ANNOTATIONS_KV.get(ANNOTATIONS_KEY, 'json')

    if (stored === null) {
      return jsonResponse(defaultAnnotations)
    }

    if (!isAnnotationsData(stored)) {
      return jsonResponse({ error: 'Stored annotations data is invalid' }, 500)
    }

    return jsonResponse(stored)
  }

  if (request.method === 'POST') {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return jsonResponse({ error: 'Request body must be valid JSON' }, 400)
    }

    if (!isAnnotationsData(body)) {
      return jsonResponse(
        { error: 'Request body must contain annotations and categories arrays' },
        400,
      )
    }

    await env.ANNOTATIONS_KV.put(ANNOTATIONS_KEY, JSON.stringify(body))
    return jsonResponse({ success: true })
  }

  return jsonResponse({ error: 'Method not allowed' }, 405)
}

async function handlePageNavigation(request: Request, env: WorkerEnv): Promise<Response> {
  if (request.method === 'GET') {
    const stored = await env.ANNOTATIONS_KV.get(PAGE_NAVIGATION_KEY, 'json')
    if (stored === null) return jsonResponse(defaultPageNavigation)
    if (!isPageNavigationData(stored)) return jsonResponse({ error: 'Stored page navigation data is invalid' }, 500)
    return jsonResponse(stored)
  }
  if (request.method === 'POST') {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return jsonResponse({ error: 'Request body must be valid JSON' }, 400)
    }
    if (!isPageNavigationData(body)) return jsonResponse({ error: 'Invalid page navigation data' }, 400)
    await env.ANNOTATIONS_KV.put(PAGE_NAVIGATION_KEY, JSON.stringify(body))
    return jsonResponse({ success: true })
  }
  return jsonResponse({ error: 'Method not allowed' }, 405)
}

async function handleSpec(request: Request, env: WorkerEnv, dirName: string): Promise<Response> {
  if (!EDITABLE_SPECS.has(dirName)) return jsonResponse({ error: 'Spec not found' }, 404)
  const key = `${SPEC_KEY_PREFIX}${dirName}`

  if (request.method === 'GET') {
    const stored = await env.ANNOTATIONS_KV.get(key, 'json')
    if (stored === null) return jsonResponse({ content: null })
    if (!isRecord(stored) || typeof stored.content !== 'string') {
      return jsonResponse({ error: 'Stored spec is invalid' }, 500)
    }
    return jsonResponse({ content: stored.content })
  }

  if (request.method === 'POST') {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return jsonResponse({ error: 'Request body must be valid JSON' }, 400)
    }
    if (!isRecord(body) || typeof body.content !== 'string') {
      return jsonResponse({ error: 'Request body must contain a content string' }, 400)
    }
    await env.ANNOTATIONS_KV.put(key, JSON.stringify({ content: body.content }))
    return jsonResponse({ success: true })
  }

  return jsonResponse({ error: 'Method not allowed' }, 405)
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const pathname = new URL(request.url).pathname

    if (pathname === '/api/annotations' || pathname === '/api/annotations/') {
      try {
        return await handleAnnotations(request, env)
      } catch (error) {
        console.error('Annotations API error:', error)
        return jsonResponse({ error: 'Annotations service unavailable' }, 500)
      }
    }

    if (pathname === '/api/page-navigation' || pathname === '/api/page-navigation/') {
      try {
        return await handlePageNavigation(request, env)
      } catch (error) {
        console.error('Page navigation API error:', error)
        return jsonResponse({ error: 'Page navigation service unavailable' }, 500)
      }
    }

    const specMatch = pathname.match(/^\/api\/spec\/([^/]+)\/?$/)
    if (specMatch) {
      try {
        return await handleSpec(request, env, decodeURIComponent(specMatch[1]))
      } catch (error) {
        console.error('Spec API error:', error)
        return jsonResponse({ error: 'Spec service unavailable' }, 500)
      }
    }

    return env.ASSETS.fetch(request)
  },
}
