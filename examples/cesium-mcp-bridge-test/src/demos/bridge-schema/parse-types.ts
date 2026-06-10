/** 从 cesium-mcp-bridge types.ts 源码解析接口字段（含 JSDoc 注释） */

export interface ParsedField {
  name: string
  type: string
  optional: boolean
  comment?: string
}

export interface ParsedInterface {
  name: string
  fields: ParsedField[]
}

const INTERFACE_RE = /export interface (\w+)\s*\{([\s\S]*?)^\}/gm
const FIELD_RE = /^(\s*)(\w+)(\?)?:\s*(.+)$/

function extractFieldComment(block: string, fieldStart: number): string | undefined {
  const before = block.slice(0, fieldStart)
  const jsdoc = before.match(/\/\*\*([\s\S]*?)\*\/\s*$/)
  if (jsdoc) {
    return jsdoc[1]
      .split('\n')
      .map((l) => l.replace(/^\s*\*?\s?/, '').trim())
      .filter(Boolean)
      .join(' ')
  }
  const line = before.split('\n').pop() ?? ''
  const lineComment = line.match(/\/\/\s*(.+)$/)
  return lineComment?.[1]?.trim()
}

/** 仅解析顶层字段，跳过内联 `{ ... }` 块中的嵌套行 */
function parseFields(body: string): ParsedField[] {
  const fields: ParsedField[] = []
  let depth = 0
  let lineStart = 0

  for (let i = 0; i <= body.length; i++) {
    if (i < body.length) {
      const ch = body[i]
      if (ch === '{') depth++
      else if (ch === '}') depth--
    }

    if (i === body.length || body[i] === '\n') {
      if (depth === 0) {
        const line = body.slice(lineStart, i).trimEnd()
        const m = line.match(FIELD_RE)
        if (m) {
          const name = m[2]
          const optional = m[3] === '?'
          const type = m[4].replace(/\/\/.*$/, '').trim()
          const comment = extractFieldComment(body, lineStart)
          fields.push({ name, type, optional, comment })
        }
      }
      lineStart = i + 1
    }
  }
  return fields
}

export function parseTypesSource(source: string): Map<string, ParsedInterface> {
  const map = new Map<string, ParsedInterface>()
  let m: RegExpExecArray | null
  INTERFACE_RE.lastIndex = 0
  while ((m = INTERFACE_RE.exec(source)) !== null) {
    map.set(m[1], { name: m[1], fields: parseFields(m[2]) })
  }
  return map
}
