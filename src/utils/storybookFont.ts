const FONT_FAMILY = 'LXGWWenKai'
const loading = new WeakMap<Document, Promise<boolean>>()

export const ensureStorybookFont = (doc = document) => {
  const pending = loading.get(doc)
  if (pending) return pending
  const base = import.meta.env.VITE_API_BASE_URL
  const url = import.meta.env.VITE_STORYBOOK_FONT_URL || (base ? `${base}/fonts/LXGWWenKai-Subset.woff2` : '')
  if (!url || !('fonts' in doc)) return Promise.resolve(false)
  const font = new FontFace(FONT_FAMILY, `url(${url})`)
    .load()
    .then((face) => {
      doc.fonts.add(face)
      return true
    })
    .catch(() => false)
  loading.set(doc, font)
  return font
}
