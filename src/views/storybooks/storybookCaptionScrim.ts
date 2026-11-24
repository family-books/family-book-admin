import type { CaptionScrim } from '@/api/storybooks'

export function localCaptionGradient(scrim: CaptionScrim) {
  const core = scrim.core
  if (!core) return {}
  if (scrim.softLines?.length && scrim.width > 0 && scrim.height > 0) {
    const color = scrim.color || '#FFF8EE'
    const backgroundImage = scrim.softLines.map(line => {
      const x = ((line.left + line.right) / 2 - scrim.left) / scrim.width * 100
      const y = ((line.top + line.bottom) / 2 - scrim.top) / scrim.height * 100
      const rx = Math.min(x, 100 - x, (line.right - line.left) / scrim.width * 50 + 20)
      const ry = Math.min(y, 100 - y, (line.bottom - line.top) / scrim.height * 50 + 22)
      return `radial-gradient(ellipse ${rx}% ${ry}% at ${x}% ${y}%, ${color} 48%, transparent 100%)`
    }).join(', ')
    return { backgroundImage, opacity: scrim.opacity ?? 0.50 }
  }
  const feather = (direction: string, start: number, end: number, origin: number, size: number) => {
    const first = (start - origin) / size * 100
    const last = (end - origin) / size * 100
    return `linear-gradient(${direction}, transparent, #000 ${first}%, #000 ${last}%, transparent)`
  }
  return {
    backgroundColor: scrim.color || '#FFFFFF',
    opacity: scrim.opacity ?? 0.85,
    maskImage: [
      feather('to right', core.left, core.right, scrim.left, scrim.width),
      feather('to bottom', core.top, core.bottom, scrim.top, scrim.height),
    ].join(', '),
    maskComposite: 'intersect',
  }
}

export function captionScrimStyle(scrim: CaptionScrim, legacyRadius: string) {
  const position = {
    left: scrim.left + '%', top: scrim.top + '%', width: scrim.width + '%', height: scrim.height + '%',
  }
  if (scrim.core) return { ...position, ...localCaptionGradient(scrim), borderRadius: '0' }
  if (scrim.style === 'bottom') {
    return { ...position, borderRadius: '0', background: 'radial-gradient(ellipse at center, #fffaf080 0%, #fffaf080 60%, transparent 100%)' }
  }
  return { ...position, borderRadius: legacyRadius, background: scrim.color || '#FFF6E6', opacity: scrim.opacity ?? 0.82 }
}
