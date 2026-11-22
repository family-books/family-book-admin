const FONT_FAMILY = 'LXGWWenKai'
let loading: Promise<boolean> | null = null

export const ensureStorybookFont = () => {
  if (loading) return loading
  const base = import.meta.env.VITE_API_BASE_URL
  const url = import.meta.env.VITE_STORYBOOK_FONT_URL || (base ? `${base}/fonts/LXGWWenKai-Subset.woff2` : '')
  if (!url || typeof document === 'undefined' || !('fonts' in document)) {
    loading = Promise.resolve(false)
    return loading
  }
  loading = new FontFace(FONT_FAMILY, `url(${url})`)
    .load()
    .then((face) => {
      document.fonts.add(face)
      return true
    })
    .catch(() => false)
  return loading
}
