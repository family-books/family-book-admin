<template>
  <div v-if="page.layout === 'COVER'" class="preview cover-preview book-cover">
    <img :src="page.imageUrl" alt="" />
    <div class="book-cover-copy">
      <span class="book-cover-title" :class="coverTitleSize">{{ page.title }}</span>
    </div>
  </div>
  <div v-else-if="page.layout === 'FULL_BLEED'" class="preview full-bleed-preview">
    <img :src="page.imageUrl" alt="" />
    <template v-if="page.caption">
      <span v-for="(line, index) in page.caption.lines" :key="index" class="laid-out-caption"
        :style="{ left: line.left + '%', top: line.top + '%', color: page.caption.color,
          fontSize: page.caption.fontWidthPercent + 'cqw' }">{{ line.text }}</span>
    </template>
    <span v-else-if="page.qualityStatus !== 'caption_pending'" class="full-bleed-caption"
      :class="{ 'space-caption': templateCode === 'space-station' }" :style="captionPosition">{{ page.text }}</span>
  </div>
  <div v-else-if="page.layout && page.layout !== 'LEGACY'" class="preview story-preview">
    <div class="book-page" :class="storyLayout">
      <div class="story-image"><img :src="page.imageUrl" alt="" /></div>
      <div class="story-copy">
        <span class="story-page-title">{{ page.title }}</span>
        <span class="story-text">{{ page.text }}</span>
      </div>
    </div>
  </div>
  <img v-else class="legacy-image" :src="page.imageUrl" alt="" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StorybookArtwork } from '@/api/storybooks'

const props = defineProps<{ page: StorybookArtwork['pages'][number]; templateCode?: string }>()

const coverTitleSize = computed(() => {
  const length = Array.from(props.page.title).length
  if (length > 44) return 'book-cover-title--compact'
  if (length > 26) return 'book-cover-title--medium'
  return ''
})

const storyLayout = computed(() => {
  if (props.page.layout === 'LANDSCAPE') return 'landscape-preview'
  if (props.page.layout === 'PORTRAIT_RIGHT') return 'portrait-right-preview'
  return 'portrait-left-preview'
})

const captionPosition = computed(() => {
  const box = props.page.textBox ?? { left: 7, offset: 8, width: 53, fromBottom: true }
  return {
    left: box.left + '%',
    width: box.width + '%',
    [box.fromBottom ? 'bottom' : 'top']: box.offset + '%',
  }
})
</script>

<style scoped>


.preview{position:relative;overflow:hidden;width:100%;aspect-ratio:4 / 3;container-type:inline-size;--page-unit:calc(100cqw / 694)}
.cover-preview img{width:100%;height:100%;object-fit:cover}
.story-preview{background:#fff}
.book-page{height:100%}
.story-image{position:relative;overflow:hidden}
.story-copy{display:flex;box-sizing:border-box;flex-direction:column}
.story-page-title,.story-text{font-family:serif}
.story-page-title{font-weight:700}
.book-cover{background:var(--accent)}
.book-cover img{display:block}
.book-cover-copy{
  position:absolute;right:0;bottom:0;left:0;
  padding:calc(92 * var(--page-unit)) calc(38 * var(--page-unit)) calc(42 * var(--page-unit));
  text-align:center;
  background:linear-gradient(180deg,rgba(13,24,40,0),rgba(13,24,40,.55) 60%,rgba(13,24,40,.83));
}
.book-cover-title{
  display:block;
  max-width:calc(600 * var(--page-unit));
  margin:0 auto;
  color:#fff1ca;
  font-family:"Yuanti SC","PingFang SC","Noto Sans CJK SC","Microsoft YaHei",sans-serif;
  font-size:calc(46 * var(--page-unit));
  font-weight:800;
  line-height:1.24;
  letter-spacing:calc(1.5 * var(--page-unit));
  overflow-wrap:anywhere;
  text-shadow:0 calc(3 * var(--page-unit)) 0 rgba(62,34,27,.75),0 calc(5 * var(--page-unit)) calc(16 * var(--page-unit)) rgba(4,11,22,.82);
}
.book-cover-title--medium{font-size:calc(34 * var(--page-unit));letter-spacing:calc(1 * var(--page-unit))}
.book-cover-title--compact{font-size:calc(26 * var(--page-unit));letter-spacing:0}
.story-preview .story-image{background:transparent}
.story-preview .story-image img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
.story-preview .story-copy{height:auto;min-width:0}
.story-text{white-space:pre-wrap;overflow-wrap:anywhere}
.book-page{box-sizing:border-box;padding:calc(34.7 * var(--page-unit));color:#30251d}
.book-page .story-copy{flex:1;padding:0}
.book-page .story-page-title{font-size:calc(18.36 * var(--page-unit));line-height:1.25}
.book-page .story-text{margin-top:calc(7.23 * var(--page-unit));font-size:calc(12.24 * var(--page-unit));line-height:1.5}
.book-page.landscape-preview .story-image{width:100%;height:calc(351.34 * var(--page-unit));margin-bottom:calc(14.46 * var(--page-unit))}
.book-page.portrait-left-preview,.book-page.portrait-right-preview{display:flex;align-items:center;gap:calc(28.92 * var(--page-unit))}
.book-page.portrait-right-preview{flex-direction:row-reverse}
.book-page.portrait-left-preview .story-image,.book-page.portrait-right-preview .story-image{flex:none;width:calc(277.6 * var(--page-unit));height:calc(416.4 * var(--page-unit))}
.full-bleed-preview{
  height:auto;aspect-ratio:4 / 3;
  background:linear-gradient(145deg,#425677,#182840);
}
.full-bleed-preview img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.full-bleed-caption{
  position:absolute;display:block;box-sizing:border-box;
  padding:calc(10 * var(--page-unit)) calc(13 * var(--page-unit));border-radius:calc(12 * var(--page-unit));
  background:linear-gradient(130deg,rgba(9,19,34,.78),rgba(9,19,34,.54));
  color:#fff8e9;font-size:calc(22 * var(--page-unit));font-weight:600;line-height:1.52;
  white-space:pre-wrap;overflow-wrap:anywhere;
  text-shadow:0 calc(1 * var(--page-unit)) calc(3 * var(--page-unit)) rgba(0,0,0,.65);
}
.laid-out-caption{position:absolute;display:block;white-space:nowrap;font-family:sans-serif;font-weight:400;line-height:1.15}
.full-bleed-caption.space-caption{padding:0;background:none;border-radius:0}

.book-cover{background:#b9693f}
.legacy-image{display:block;width:100%}
</style>
