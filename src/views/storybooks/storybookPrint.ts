import type { StorybookArtwork } from '@/api/storybooks'

const styles = `
  @page { size: 240mm 180mm; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #eee; color: #30251d; font-family: "Noto Serif SC", "Songti SC", SimSun, serif; }
  article { width: 240mm; height: 180mm; margin: 10mm auto; padding: 12mm; background: white; break-after: page; }
  article:last-child { break-after: auto; }
  h1 { font-size: 18pt; line-height: 1.25; margin: 0 0 2.5mm; }
  p { font-size: 12pt; line-height: 1.5; margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
  img { display: block; object-fit: contain; }
  .LANDSCAPE img { width: 216mm; height: 121.5mm; margin-bottom: 5mm; }
  .PORTRAIT_LEFT, .PORTRAIT_RIGHT { display: flex; gap: 10mm; align-items: center; }
  .PORTRAIT_RIGHT { flex-direction: row-reverse; }
  .PORTRAIT_LEFT img, .PORTRAIT_RIGHT img { width: 96mm; height: 144mm; flex: none; }
  section { min-width: 0; flex: 1; }
  .COVER { padding: 0; position: relative; }
  .COVER img { width: 100%; height: 100%; }
  .COVER section { position: absolute; inset: auto 12mm 12mm; background: white; padding: 4mm; text-align: center; }
  .DEDICATION { display: grid; place-items: center; text-align: center; }
  @media print { body { background: white; } article { margin: 0; } }
`

export async function openStorybookPrint(pages: StorybookArtwork['pages']) {
  if (!pages.length || pages.some(page => page.layout !== 'DEDICATION' && !page.imageUrl)) {
    throw new Error('请先生成全部插画')
  }

  const preview = window.open('', '_blank')
  if (!preview) throw new Error('请允许浏览器打开排版窗口')
  preview.opener = null
  const doc = preview.document
  doc.title = pages[0].title || '绘本排版'
  const style = doc.createElement('style')
  style.textContent = styles
  doc.head.append(style)

  const images: HTMLImageElement[] = []
  for (const page of pages) {
    const sheet = doc.createElement('article')
    sheet.className = page.layout || 'PORTRAIT_LEFT'
    if (page.imageUrl) {
      const image = doc.createElement('img')
      image.alt = ''
      image.src = page.imageUrl
      sheet.append(image)
      images.push(image)
    }
    const copy = doc.createElement('section')
    const title = doc.createElement('h1')
    title.textContent = page.title
    const story = doc.createElement('p')
    story.textContent = page.text || ''
    copy.append(title, story)
    sheet.append(copy)
    doc.body.append(sheet)
  }

  try {
    await Promise.all(images.map(image => image.decode()))
    await doc.fonts.ready
    const overflowingPage = Array.from(doc.querySelectorAll('article')).findIndex(
      sheet => sheet.scrollHeight > sheet.clientHeight + 1
    )
    if (overflowingPage >= 0) {
      throw new Error(`第 ${pages[overflowingPage].number} 页文字超出版面，请先调整`)
    }
    preview.focus()
    preview.print()
  } catch (error) {
    preview.close()
    if (error instanceof Error && error.name === 'EncodingError') {
      throw new Error('有插画无法载入，请刷新插画后再试')
    }
    throw error
  }
}
