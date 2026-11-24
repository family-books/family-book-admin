import type { CaptionScrim } from '@/api/storybooks'

export function localCaptionGradient(scrim: CaptionScrim) {
  const core = scrim.core
  if (!core) return {}
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
