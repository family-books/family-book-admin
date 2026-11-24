import type { StorybookArtwork } from '@/api/storybooks'
import { ensureStorybookFont } from '@/utils/storybookFont'
import { captionScrimStyle } from './storybookCaptionScrim'

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
  .COVER section {
    position: absolute; inset: auto 0 0; padding: 30mm 14mm 13mm; text-align: center;
    background: linear-gradient(180deg, transparent, rgba(13,24,40,.55) 60%, rgba(13,24,40,.83));
    print-color-adjust: exact; -webkit-print-color-adjust: exact;
  }
  .COVER h1 {
    margin: 0; color: #fff1ca; font-size: 36pt; font-weight: 800; overflow-wrap: anywhere;
    font-family: "LXGWWenKai", "Yuanti SC", "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
    text-shadow: 0 1mm 0 rgba(62,34,27,.75), 0 1.6mm 4mm rgba(4,11,22,.82);
  }
  .COVER h1.medium { font-size: 27pt; }
  .COVER h1.compact { font-size: 21pt; }
  .FULL_BLEED { position: relative; padding: 0; overflow: hidden; }
  .FULL_BLEED img { width: 100%; height: 100%; object-fit: cover; }
  .FULL_BLEED section {
    position: absolute; box-sizing: border-box; border-radius: 4mm; padding: 3mm 4mm;
    color: #fff8e9; font-family: "LXGWWenKai", "PingFang SC", "Noto Sans CJK SC", sans-serif; font-weight: 600;
    background: linear-gradient(130deg, rgba(9,19,34,.78), rgba(9,19,34,.54));
    print-color-adjust: exact; -webkit-print-color-adjust: exact;
  }
  .FULL_BLEED p { font-size: 16pt; line-height: 1.52; }
  .FULL_BLEED .caption-block { object-fit: fill; position: absolute; pointer-events: none; }
  .caption-scrim { position: absolute; border-radius: 5mm; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  .caption-line { position: absolute; white-space: nowrap; font-family: "LXGWWenKai", "Yuanti SC", "PingFang SC", sans-serif; line-height: 1.15; letter-spacing: .04em; }
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
  const pendingBlocks: Promise<void>[] = []
  for (const page of pages) {
    const sheet = doc.createElement('article')
    sheet.className = page.layout || 'PORTRAIT_LEFT'
    if (page.imageUrl) {
      const image = doc.createElement('img')
      image.alt = ''
      image.src = page.imageUrl
      const scale = page.caption?.imageScale
      if (scale) {
        sheet.style.background = '#faf5ea'
        sheet.style.printColorAdjust = 'exact'
        Object.assign(image.style, { width: `${scale}%`, height: `${scale}%`, marginInline: 'auto', objectFit: 'contain' })
      }
      sheet.append(image)
      images.push(image)
    }
    if (page.caption) {
      const scrim = page.caption.scrim
      if (scrim) {
        const panel = doc.createElement('div')
        panel.className = 'caption-scrim'
        Object.assign(panel.style, captionScrimStyle(scrim, '5mm'))
        if (page.captionBlockUrl) {
          const block = doc.createElement('img')
          block.alt = ''
          block.className = 'caption-block'
          block.src = page.captionBlockUrl
          Object.assign(block.style, {
            left: `${scrim.left}%`, top: `${scrim.top}%`, width: `${scrim.width}%`, height: `${scrim.height}%`,
          })
          sheet.append(block)
          if (scrim.core) {
            // The saved range still allows rendering if the signed image expires.
            pendingBlocks.push(block.decode().catch(() => { block.replaceWith(panel) }))
          } else {
            images.push(block)
          }
        } else {
          sheet.append(panel)
        }
      }
      for (const line of page.caption.lines) {
        const element = doc.createElement('span')
        element.className = 'caption-line'
        element.textContent = line.text
        if (page.caption.layoutVersion === 11) element.style.lineHeight = '1'
        element.style.left = `${line.left}%`
        element.style.top = `${line.top}%`
        element.style.color = page.caption.color
        element.style.fontSize = `${page.caption.fontWidthPercent * 2.4}mm`
        sheet.append(element)
      }
      doc.body.append(sheet)
      continue
    }
    const copy = doc.createElement('section')
    const title = doc.createElement('h1')
    title.textContent = page.title
    if (page.layout === 'COVER') {
      const length = Array.from(page.title || '').length
      if (length > 44) title.className = 'compact'
      else if (length > 26) title.className = 'medium'
    }
    const story = doc.createElement('p')
    story.textContent = page.text || ''
    if (page.layout === 'FULL_BLEED' && page.textBox) {
      const { left, offset, width, fromBottom } = page.textBox
      copy.style.left = `${left}%`
      copy.style.width = `${width}%`
      copy.style[fromBottom ? 'bottom' : 'top'] = `${offset}%`
      copy.append(story)
    } else {
      copy.append(title, story)
    }
    sheet.append(copy)
    doc.body.append(sheet)
  }

  try {
    await Promise.all([...images.map(image => image.decode()), ...pendingBlocks])
    await ensureStorybookFont(doc)
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
