#!/usr/bin/env node
/**
 * 扫描 src/prototypes 与 src/components 目录，生成 entries.json
 * 供 check-app-ready.mjs 的独立构建校验使用。
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const OUTPUT_DIR = path.resolve(ROOT, '.axhub/make')
const OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'entries.json')

function scanDirectory(baseDir, prefix) {
  const entries = {}
  const absoluteBase = path.resolve(ROOT, baseDir)

  if (!fs.existsSync(absoluteBase)) {
    return entries
  }

  for (const name of fs.readdirSync(absoluteBase)) {
    const entryPath = path.resolve(absoluteBase, name)
    const stat = fs.statSync(entryPath)
    if (!stat.isDirectory()) continue

    const indexFile = path.join(entryPath, 'index.tsx')
    if (fs.existsSync(indexFile)) {
      const key = `${prefix}/${name}`
      entries[key] = `./${path.relative(ROOT, indexFile).replace(/\\/g, '/')}`
    }
  }

  return entries
}

const prototypeEntries = scanDirectory('src/prototypes', 'prototypes')
const componentEntries = scanDirectory('src/components', 'components')

const entries = {
  js: {
    ...prototypeEntries,
    ...componentEntries,
  },
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true })
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(entries, null, 2))

console.log(`Scanned ${Object.keys(entries.js).length} entries -> ${path.relative(ROOT, OUTPUT_FILE)}`)
