<template>
  <div class="page">
    <header class="site-header">
      <div class="nav wrap">
        <a class="brand brand-logo" href="#about" aria-label="家书来了" @click="closeMenu">
          <img src="/images/home/logo.png" alt="家书来了" />
        </a>
        <nav class="nav-links" :class="{ open: menuOpen }" aria-label="主导航">
          <a href="#about" @click="closeMenu">家书是什么</a>
          <a href="#sample" @click="closeMenu">看看样刊</a>
          <a href="#how" @click="closeMenu">如何使用</a>
          <a href="#faq" @click="closeMenu">常见问题</a>
          <button type="button" @click="openModal('story')">品牌故事</button>
        </nav>
        <button class="btn solid nav-cta" type="button" @click="openModal('wechat')">
          <svg class="wx" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.5 4C5.9 4 3 6.5 3 9.6c0 1.8.9 3.4 2.4 4.5L5 16.2l2.2-1.1c.7.2 1.5.3 2.3.3.3 0 .6 0 .9-.1-.2-.6-.3-1.2-.3-1.8 0-3.3 3-6 6.7-6 .3 0 .6 0 .9.1C16.8 5.3 13.4 4 9.5 4zM7.4 8.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm4.2 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z"/><path fill="currentColor" d="M17.8 8.7c-2.9 0-5.2 2-5.2 4.5s2.3 4.5 5.2 4.5c.5 0 1.1-.1 1.6-.2l1.8.9-.4-1.6c1.1-.8 1.8-2 1.8-3.6 0-2.5-2.3-4.5-5.2-4.5zm-1.6 3.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm3.3 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/></svg>
          <span class="cta-long">打开微信小程序</span>
          <span class="cta-short">小程序</span>
        </button>
        <button class="menu-btn" type="button" :aria-expanded="menuOpen" aria-label="打开菜单" @click="menuOpen = !menuOpen">
          <img src="/images/home/menu-icon.png" alt="" />
        </button>
      </div>
    </header>

    <main>
      <section id="about" class="band band-hero">
        <div class="wrap hero">
        <div class="hero-copy">
          <span class="kicker">让亲情可以被触摸</span>
          <h1>把一家人的日常<br><span class="hero-title-accent">打印成家庭报纸</span><br><span class="hero-title-accent">邮寄到长辈手中</span></h1>
          <p class="gift">送给长辈的贴心礼物， 每个月，让他们多一份笑容。</p>
          <p class="lead">分享照片和文字，家书帮你自动排版印刷，每月寄送专属家庭月刊，<br/>让远方的家人看见你的生活，也把珍贵的回忆留在手里。</p>
          <div class="hero-actions">
            <button class="btn solid" type="button" @click="openModal('wechat')">开始制作家书</button>
            <div class="hero-sample">
              <button class="btn ghost" type="button" @click="openSample(0)">翻看一本样刊</button>
            </div>
          </div>
          <ul class="meta">
            <li><i aria-hidden="true">✓</i>家人数量不限</li>
            <li><i aria-hidden="true">✓</i>全家共同参与</li>
            <li><i aria-hidden="true">✓</i>纸质月刊寄到家</li>
          </ul>
        </div>

        <div class="hero-scene">
          <img src="/images/home/hero.jpg" alt="爷爷奶奶一起翻看家书月刊" />
          <span class="hero-caption">爷爷奶奶爱看的家庭月刊</span>
        </div>
        </div>
      </section>

      <section id="sample" class="section band band-sample">
        <div class="wrap">
        <h2 class="section-title">他们收到的，<span class="title-break">是这样一本家书</span></h2>
        <p class="section-desc">照片、文字和一家人的近况，翻开就能看见。</p>
        <div class="sample-layout">
          <button class="book" type="button" aria-label="在线翻看样刊" @click="openSample(1)">
            <img src="/images/home/sample-book.png?v=4" alt="家书样刊：封面与内页" />
          </button>
          <div class="sample-points">
            <article>
              <span class="point-icon" aria-hidden="true">
                <img src="/images/home/point-share.png" alt="" />
              </span>
              <div>
                <h3>全家一起分享</h3>
                <p>微信上传照片和文字，全家都能参与。</p>
              </div>
            </article>
            <article>
              <span class="point-icon" aria-hidden="true">
                <img src="/images/home/point-layout.png" alt="" />
              </span>
              <div>
                <h3>不用自己排版</h3>
                <p>家书帮你自动整理、排版，把大家的点滴做成一本杂志。</p>
              </div>
            </article>
            <article>
              <span class="point-icon" aria-hidden="true">
                <img src="/images/home/point-deliver.png" alt="" />
              </span>
              <div>
                <h3>父母直接收件</h3>
                <p>每月印刷并寄送，直接送到父母手里。</p>
              </div>
            </article>
            <button class="text-arrow" type="button" @click="openSample(1)">在线翻看样刊 <span>→</span></button>
          </div>
        </div>
        </div>
      </section>

      <section id="how" class="section how band band-how">
        <div class="wrap">
        <h2 class="section-title">你分享生活，我们负责送达</h2>
        <ol class="steps">
          <li>
            <div class="step-body">
              <div class="step-copy">
                <p class="step-no">01</p>
                <div>
                  <h3>开通家书</h3>
                  <p>填写收件信息，邀请家人加入</p>
                </div>
              </div>
              <span class="step-icon">
                <img src="/images/home/step-invite.png" alt="" />
              </span>
            </div>
            <span class="step-next" aria-hidden="true"><svg viewBox="0 0 14 14"><path d="M4 2.4 9.6 7 4 11.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          </li>
          <li>
            <div class="step-body">
              <div class="step-copy">
                <p class="step-no">02</p>
                <div>
                  <h3>分享日常</h3>
                  <p>上传照片，写下几句近况</p>
                </div>
              </div>
              <span class="step-phone">
                <span class="step-icon">
                  <img class="step-shot" src="/images/home/step-share.png" alt="" />
                </span>
              </span>
            </div>
            <span class="step-next" aria-hidden="true"><svg viewBox="0 0 14 14"><path d="M4 2.4 9.6 7 4 11.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          </li>
          <li>
            <div class="step-body">
              <div class="step-copy">
                <p class="step-no">03</p>
                <div>
                  <h3>每月收件</h3>
                  <p>自动排版、印刷，寄到家人手里</p>
                </div>
              </div>
              <span class="step-icon">
                <img src="/images/home/step-deliver.png" alt="" />
              </span>
            </div>
          </li>
        </ol>
        </div>
      </section>

      <section class="section reviews band band-reviews">
        <div class="wrap">
        <h2 class="section-title">用家人喜欢的方式，<span class="title-break">分享你的生活</span></h2>
        <p class="section-desc">这些场景，看看像不像你们。</p>
        <div
          class="quote-swiper"
          @touchstart.passive="onQuoteTouchStart"
          @touchend.passive="onQuoteTouchEnd"
        >
          <div class="quote-viewport">
            <div class="quote-track" :style="{ '--i': quoteIndex, '--visible': quoteVisible }">
              <blockquote v-for="item in scenarios" :key="item.id">
                <h3>{{ item.title }}</h3>
                <p>{{ expandedScenes[item.id] ? item.text : previewScene(item.text) }}</p>
                <button
                  v-if="sceneNeedsExpand(item.text)"
                  class="scene-toggle"
                  type="button"
                  @click="toggleScene(item.id)"
                >{{ expandedScenes[item.id] ? '收起' : '展开' }}</button>
                <ul class="scene-tags">
                  <li v-for="tag in item.tags" :key="tag">{{ tag }}</li>
                </ul>
              </blockquote>
            </div>
          </div>
          <div class="quote-controls">
            <button class="quote-arrow" type="button" aria-label="上一个场景" :disabled="quoteIndex === 0" @click="stepQuote(-1)">‹</button>
            <div class="quote-dots">
              <button
                v-for="page in quotePageCount"
                :key="page"
                type="button"
                :class="{ on: quoteIndex === page - 1 }"
                :aria-label="`第 ${page} 屏场景`"
                @click="goQuote(page - 1)"
              ></button>
            </div>
            <button class="quote-arrow" type="button" aria-label="下一个场景" :disabled="quoteIndex >= quoteMax" @click="stepQuote(1)">›</button>
          </div>
        </div>
        </div>
      </section>

      <section id="pricing" class="section band band-pricing">
        <div class="wrap">
          <header class="pricing-head">
            <h2 class="section-title">选一份家书，<span class="title-break">把全家的近况寄回家</span></h2>
            <p class="section-desc">纸质月刊按月寄出。开通一份，全家都可以一起上传。</p>
            <p class="pricing-gift">为父母选一份可以全家参与的礼物</p>
          </header>
          <div class="pricing-layout">
            <aside class="plan-benefits">
              <h3>每份订阅都包含</h3>
              <p class="benefits-lead">不论首月体验、季卡、半年卡还是年卡，权益都一样。</p>
              <ul class="plan-perks">
                <li v-for="perk in planPerks" :key="perk.title">
                  <span class="perk-ico" aria-hidden="true">
                    <svg class="perk-check" viewBox="0 0 16 16"><path d="M3.2 8.3 6.3 11.4 12.8 4.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <svg v-if="perk.icon === 'calendar'" class="perk-line" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 3.5v3M16 3.5v3M4 10h16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                    <svg v-else-if="perk.icon === 'photo'" class="perk-line" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="10" r="1.3" fill="currentColor"/><path d="m4.5 16 4.2-4 3 3 2.6-2.6 5.2 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <svg v-else-if="perk.icon === 'family'" class="perk-line" viewBox="0 0 24 24"><circle cx="9" cy="9" r="2.1" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="15.6" cy="9.6" r="1.7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.6 17.6c.5-2.3 2.2-3.5 4.4-3.5s3.9 1.2 4.4 3.5M13.4 14.3c1.2-.4 2.4-.3 3.4.5.9.8 1.4 1.9 1.6 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                    <svg v-else class="perk-line" viewBox="0 0 24 24"><path d="M4.5 7.2 12 4.2l7.5 3v10.2L12 20.4 4.5 17.4V7.2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4.5 7.2 12 10.4l7.5-3.2M12 10.4V20.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                  </span>
                  <span class="perk-copy">
                    <strong>{{ perk.title }}</strong>
                    <small>{{ perk.desc }}</small>
                  </span>
                </li>
              </ul>
            </aside>
            <div class="price-grid">
            <article
              v-for="plan in plans"
              :key="plan.name"
              class="price-card"
              :class="{ featured: plan.featured }"
            >
              <p v-if="plan.badge" class="price-ribbon">
                <svg viewBox="0 0 20 16" aria-hidden="true"><path fill="currentColor" d="M1.8 12.2 4.2 4.4 7.3 8.4 10 1.6l2.7 6.8 3.1-4 2.4 7.8H1.8z"/><path fill="currentColor" d="M1.6 12h16.8v2.4H1.6z"/></svg>
                {{ plan.badge }}
              </p>
              <div class="price-body">
                <div class="price-main">
                  <p class="price-term">{{ plan.term }}</p>
                  <h3>{{ plan.name }}</h3>
                  <p class="price-sub">{{ plan.subtitle }}</p>
                  <p class="price-mobile-note">
                    <span class="note-ico" aria-hidden="true">
                      <svg v-if="plan.noteIcon === 'info'" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 7.2V11.2M8 5.1v.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                      <svg v-else-if="plan.noteIcon === 'star'" viewBox="0 0 16 16"><path d="m8 2.4 1.5 3.2 3.5.4-2.6 2.4.7 3.4L8 10.2 4.9 11.8l.7-3.4L3 6l3.5-.4L8 2.4z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
                      <svg v-else viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 11.1s-2.6-1.6-2.6-3.2a1.5 1.5 0 0 1 2.6-1 1.5 1.5 0 0 1 2.6 1C10.6 9.5 8 11.1 8 11.1z" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></svg>
                    </span>
                    {{ plan.mobileNote }}
                  </p>
                </div>
                <div class="price-pay">
                  <div class="price-figure">
                    <p v-if="plan.original" class="price-original"><s>¥{{ plan.original }}</s></p>
                    <p class="amount"><span>¥</span><strong>{{ plan.price }}</strong></p>
                    <span v-if="plan.save" class="price-save price-save-desk">省¥{{ plan.save }}</span>
                  </div>
                  <div class="price-foot">
                    <div class="price-foot-main">
                      <p class="price-note">约合每月¥{{ plan.monthly }}<template v-if="plan.discount"> · {{ plan.discount }}</template></p>
                      <span v-if="plan.save" class="price-save price-save-mob">省¥{{ plan.save }}</span>
                    </div>
                  </div>
                  <button class="btn solid plan-btn" :class="{ year: plan.featured }" type="button" @click="openModal('wechat')">开通{{ plan.name }}</button>
                </div>
              </div>
            </article>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" class="section band band-faq">
        <div class="wrap">
        <h2 class="section-title">关于家书，你可能想知道</h2>
        <p class="section-desc">你负责分享生活，家书负责把爱送到家。</p>
        <div class="faq-groups">
          <section v-for="group in faqGroups" :key="group.title" class="faq-group">
            <h3><span aria-hidden="true">{{ group.icon }}</span>{{ group.title }}</h3>
            <div class="faq-list">
              <details v-for="item in group.items" :key="item.q">
                <summary>{{ item.q }}<i class="chev" aria-hidden="true"></i></summary>
                <p>{{ item.a }}</p>
              </details>
            </div>
          </section>
        </div>
        <div class="faq-cta">
          <div>
            <strong>把想念，变成一份可以收到的礼物。</strong>
            <span>全家一起分享生活，每月把一份纸质家书送到牵挂的人手中。</span>
          </div>
          <button class="btn solid" type="button" @click="openModal('wechat')">立即制作第一份家书</button>
        </div>
        </div>
      </section>

      <section id="start" class="band band-finale">
        <div class="wrap finale-wrap">
        <div class="finale">
          <div class="bloom" aria-hidden="true"></div>
          <div class="finale-copy">
            <h2>从这一期开始，<span class="title-break">让父母多一份期待。</span></h2>
            <button class="btn solid" type="button" @click="openModal('wechat')">
              <svg class="wx" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.5 4C5.9 4 3 6.5 3 9.6c0 1.8.9 3.4 2.4 4.5L5 16.2l2.2-1.1c.7.2 1.5.3 2.3.3.3 0 .6 0 .9-.1-.2-.6-.3-1.2-.3-1.8 0-3.3 3-6 6.7-6 .3 0 .6 0 .9.1C16.8 5.3 13.4 4 9.5 4zM7.4 8.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm4.2 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z"/><path fill="currentColor" d="M17.8 8.7c-2.9 0-5.2 2-5.2 4.5s2.3 4.5 5.2 4.5c.5 0 1.1-.1 1.6-.2l1.8.9-.4-1.6c1.1-.8 1.8-2 1.8-3.6 0-2.5-2.3-4.5-5.2-4.5zm-1.6 3.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm3.3 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/></svg>
              打开微信小程序
            </button>
          </div>
        </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="wrap foot">
        <div class="foot-brand">
          <a class="brand brand-logo" href="#about" aria-label="家书来了">
            <img src="/images/home/logo.png" alt="家书来了" />
          </a>
          <p>让亲情可以被触摸</p>
        </div>
        <nav class="foot-links" aria-label="页脚">
          <button type="button" @click="openModal('story')">品牌故事</button>
          <a href="#how">如何使用</a>
          <a href="#faq">常见问题</a>
          <button type="button" @click="openModal('contact')">联系客服</button>
          <button type="button" @click="openModal('privacy')">隐私政策</button>
          <button type="button" @click="openModal('terms')">服务条款</button>
        </nav>
        <p class="copyright">© 2026 家书</p>
      </div>
    </footer>

    <div v-if="modal" class="backdrop" @click.self="closeModal">
      <div
        class="dialog"
        :class="{ wide: modal === 'sample', story: modal === 'story', legal: modal === 'privacy' || modal === 'terms' }"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <button ref="closeBtn" class="close-x" type="button" aria-label="关闭" @click="closeModal">×</button>

        <template v-if="modal === 'wechat'">
          <h3 id="dialog-title" class="wechat-title">打开微信小程序</h3>
          <img class="mini-qr" src="/images/home/miniapp-qr.png" alt="家书来了微信小程序二维码" />
          <p class="qr-hint">用微信扫描二维码即可进入家书，上传照片、邀请家人，并开通月刊。</p>
          <p class="search-name">也可以在微信中搜索小程序：家书来了</p>
        </template>

        <template v-else-if="modal === 'story'">
          <p class="dialog-kicker">品牌故事</p>
          <h3 id="dialog-title">让亲情可以被触摸</h3>
          <video
            ref="storyVideo"
            class="story-video"
            src="/videos/brand-story.mp4"
            controls
            playsinline
            preload="auto"
          >
            您的浏览器无法播放这段视频。
          </video>
          <p class="dialog-copy">家书想把散落在聊天窗口里的日常，变成父母手里可以一页页翻看的月刊。</p>
          <p class="dialog-copy">家人在微信里分享照片和文字，我们负责排版、印刷，并免费寄到家里。让远方的生活被看见，也让珍贵的回忆留在手里。</p>
        </template>

        <template v-else-if="modal === 'contact'">
          <p class="dialog-kicker">联系客服</p>
          <h3 id="dialog-title">我们在这里</h3>
          <p class="dialog-copy">如需帮助，可以在微信小程序「家书」内联系客服。</p>
          <p class="dialog-copy">也可以发送邮件至 <a class="mail" href="mailto:homebooks@163.com">homebooks@163.com</a>，我们会尽快回复。</p>
        </template>

        <template v-else-if="modal === 'privacy'">
          <h3 id="dialog-title">隐私政策</h3>
          <p class="legal-date">更新日期：2026年10月20日</p>
          <section v-for="block in privacyBlocks" :key="block.title">
            <h4>{{ block.title }}</h4>
            <p v-for="(para, index) in block.paragraphs" :key="index">{{ para }}</p>
          </section>
        </template>

        <template v-else-if="modal === 'terms'">
          <h3 id="dialog-title">服务条款</h3>
          <p class="legal-date">更新日期：2026年10月20日</p>
          <section v-for="block in termsBlocks" :key="block.title">
            <h4>{{ block.title }}</h4>
            <p v-for="(para, index) in block.paragraphs" :key="index">{{ para }}</p>
          </section>
        </template>

        <template v-else>
          <div class="sample-head">
            <h3 id="dialog-title">翻看一本样刊</h3>
            <p>2026年11月 · 第1期。封面、内页和封底按真实成刊排版。</p>
          </div>
          <div class="viewer" @touchstart.passive="onSampleTouchStart" @touchend.passive="onSampleTouchEnd">
            <img
              class="sample-page"
              :src="samplePages[sampleIndex]"
              :alt="sampleIndex === 0 ? '样刊封面' : sampleIndex === samplePages.length - 1 ? '样刊封底' : `样刊第 ${sampleIndex} 页`"
            />
          </div>
          <div class="viewer-nav">
            <button class="btn ghost" type="button" :disabled="sampleIndex === 0" @click="stepSample(-1)">上一页</button>
            <span>{{ sampleIndex + 1 }} / {{ sampleCount }}</span>
            <button class="btn ghost" type="button" :disabled="sampleIndex === sampleCount - 1" @click="stepSample(1)">下一页</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type ModalName = 'wechat' | 'sample' | 'story' | 'contact' | 'privacy' | 'terms'

const modal = ref<ModalName | null>(null)
const menuOpen = ref(false)
const samplePages = Array.from({ length: 16 }, (_, index) => `/images/home/sample/${String(index + 1).padStart(2, '0')}.jpg`)
const sampleIndex = ref(0)
const sampleCount = samplePages.length
const closeBtn = ref<HTMLButtonElement | null>(null)
const storyVideo = ref<HTMLVideoElement | null>(null)
const touchStartX = ref(0)
const quoteTouchX = ref(0)
const quoteIndex = ref(0)
const quoteVisible = ref(typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches ? 1 : 3)

const scenarios = [
  {
    id: 'beijing',
    title: '在北京工作十几年，终于把生活寄回了老家。',
    text: '在北京的互联网大厂工作十几年，忙起来经常晚上十点才下班。爸妈一直住在老家，每次打电话都说“我们挺好的，你忙你的”。现在我会随手把吃饭、旅行和周末生活的照片放进家书里，每个月寄回去一本。以前觉得没什么可分享，现在才发现，爸妈最想知道的，就是这些普通的小事。',
    tags: ['异地子女', '随手上传', '每月邮寄'],
  },
  {
    id: 'canada',
    title: '在加拿大生活，也能每个月给爸妈寄一封家书。',
    text: '来加拿大以后，和国内有了十几个小时的时差。平时上班、照顾孩子，想打电话时国内往往已经是深夜。现在每个月把孩子在雪地里玩耍、周末去海边、家里做饭的照片放进家书。虽然相隔万里，爸妈依然可以通过一本纸质家书，慢慢了解我们在这边的生活。',
    tags: ['海外家庭', '跨国分享', '亲情连接'],
  },
  {
    id: 'elders',
    title: '不用教爸妈操作手机，他们也能慢慢看。',
    text: '以前往家庭群里发照片，爸妈看过以后经常找不到。现在每个月寄一本纸质家书，他们拿到手就能翻。不用下载软件，不用翻聊天记录，也不用担心手机屏幕太小。有时候还会把家书拿给邻居和老朋友看。原来对他们来说，能拿在手里的照片，真的不一样。',
    tags: ['老人友好', '纸质阅读', '反复翻阅'],
  },
  {
    id: 'siblings',
    title: '一本家书，不用一个人完成。',
    text: '我们兄弟姐妹几个都在不同城市工作，平时各忙各的。现在大家可以一起往同一本家书里上传照片。哥哥分享出差见闻，妹妹上传孩子的照片，我放一些自己的日常。每个人花一点时间，就能让爸妈看到全家人的近况。不是一个人在寄照片，而是全家人一起写家书。',
    tags: ['家庭协作', '多人上传', '共同记录'],
  },
  {
    id: 'growth',
    title: '孩子长得太快了，想让爷爷奶奶也参与他的成长。',
    text: '手机里存了几千张孩子的照片，却很少认真整理。爷爷奶奶不在身边，错过了孩子第一次骑车、第一次上台表演。现在每个月把这些成长瞬间放进家书，让他们看到孩子最近学会了什么、去了哪里。对爷爷奶奶是每月的期待，对孩子也是一份珍贵的成长记录。',
    tags: ['儿童成长', '祖孙互动', '长期珍藏'],
  },
  {
    id: 'layout',
    title: '想给爸妈做相册很多年，终于不用一直拖着了。',
    text: '以前每次旅行回来，都想给爸妈做一本相册。可选照片、排版、找打印店，每一步都很花时间，最后总是不了了之。现在看到喜欢的照片就随手上传，到了约定时间系统自动整理成家书，再安排印刷邮寄。不用自己设计版面，原来给爸妈准备一份用心的礼物，也可以这么简单。',
    tags: ['自动排版', '定期制作', '省时省心'],
  },
]
const expandedScenes = ref<Record<string, boolean>>({})
const sceneLength = (text: string) => Array.from(text).length
const sceneNeedsExpand = (text: string) => sceneLength(text) > 130
const previewScene = (text: string) => {
  if (!sceneNeedsExpand(text)) return text
  const slice = Array.from(text).slice(0, 120).join('')
  const cut = Math.max(slice.lastIndexOf('。'), slice.lastIndexOf('，'))
  if (cut >= 80) return `${slice.slice(0, cut + 1)}…`
  return `${slice}…`
}
const toggleScene = (id: string) => {
  expandedScenes.value = { ...expandedScenes.value, [id]: !expandedScenes.value[id] }
  if (Object.values(expandedScenes.value).some(Boolean)) stopQuoteAutoplay()
  else startQuoteAutoplay()
}

const planPerks = [
  { icon: 'calendar', title: '每月寄送1本纸质月刊', desc: '一本温暖的纸质月刊' },
  { icon: 'photo', title: '每期最多上传28张照片', desc: '多照片共同记录' },
  { icon: 'family', title: '家人数量不限，全家参与', desc: '全家共同参与' },
  { icon: 'print', title: '自动排版印刷，免费配送', desc: '印刷与配送都包含' },
]
const plans = [
  {
    name: '首月体验卡',
    term: '寄出1期',
    price: '29',
    original: '49',
    monthly: '29',
    save: '20',
    subtitle: '首次开通29元，标准月费49元。首次优惠原则上每个订阅家庭一次',
    mobileNote: '首次开通29元，标准月费49元。首次优惠原则上每个订阅家庭一次',
    noteIcon: 'info',
    featured: false,
    badge: '',
  },
  {
    name: '季卡',
    term: '寄出3期',
    price: '119',
    original: '147',
    monthly: '39.7',
    save: '28',
    subtitle: '连续3个月收录',
    mobileNote: '记录一季的家庭温暖，性价比更高',
    noteIcon: 'star',
    featured: false,
    badge: '',
  },
  {
    name: '半年卡',
    term: '寄出6期',
    price: '219',
    original: '294',
    monthly: '36.50',
    discount: '7.4折',
    save: '75',
    subtitle: '连续6个月收录',
    mobileNote: '半年不断档，记录更完整的家庭近况',
    noteIcon: 'star',
    featured: false,
    badge: '',
  },
  {
    name: '年卡',
    term: '寄出12期',
    price: '399',
    original: '588',
    monthly: '33.3',
    save: '189',
    subtitle: '全年12期，家庭记忆不断档',
    mobileNote: '全年陪伴，记录一整年的家庭美好时光',
    noteIcon: 'heart',
    featured: true,
    badge: '推荐套餐',
  },
]

const quoteMax = computed(() => Math.max(0, scenarios.length - quoteVisible.value))
const quotePageCount = computed(() => quoteMax.value + 1)
const QUOTE_FRAME_MS = 10000
let quoteTimer: number | undefined

const stopQuoteAutoplay = () => {
  if (quoteTimer === undefined) return
  window.clearInterval(quoteTimer)
  quoteTimer = undefined
}

const startQuoteAutoplay = () => {
  stopQuoteAutoplay()
  if (quoteMax.value <= 0) return
  quoteTimer = window.setInterval(() => {
    quoteIndex.value = quoteIndex.value >= quoteMax.value ? 0 : quoteIndex.value + 1
  }, QUOTE_FRAME_MS)
}

const syncQuoteVisible = () => {
  const next = window.matchMedia('(max-width: 900px)').matches ? 1 : 3
  if (next === quoteVisible.value) return
  quoteVisible.value = next
  if (quoteIndex.value > quoteMax.value) quoteIndex.value = quoteMax.value
  startQuoteAutoplay()
}

const stepQuote = (dir: number) => {
  quoteIndex.value = Math.min(quoteMax.value, Math.max(0, quoteIndex.value + dir))
  startQuoteAutoplay()
}

const goQuote = (index: number) => {
  quoteIndex.value = index
  startQuoteAutoplay()
}

const onQuoteTouchStart = (event: TouchEvent) => {
  quoteTouchX.value = event.changedTouches[0]?.clientX ?? 0
}

const onQuoteTouchEnd = (event: TouchEvent) => {
  const delta = (event.changedTouches[0]?.clientX ?? 0) - quoteTouchX.value
  if (delta > 48) stepQuote(-1)
  if (delta < -48) stepQuote(1)
}

const faqGroups = [
  {
    title: '了解家书',
    icon: '📖',
    items: [
      {
        q: '家书是什么？',
        a: '家书是一份专属于你们家庭的纸质月刊。家人通过微信小程序上传照片、分享生活，每期由平台自动排版、覆膜高清打印，再寄到父母或其他亲人手中。',
      },
      {
        q: '家书和家庭群聊有什么不同？',
        a: '微信里的照片容易被聊天记录淹没，家书则把散落的日常整理成可以翻阅和珍藏的纸质回忆。对不擅长使用智能手机的长辈来说，阅读也更简单。',
      },
      {
        q: '父母需要使用小程序吗？',
        a: '不需要。父母只要像收快递一样，等待纸质家书送到家中。上传照片、邀请家人、编辑内容和开通订阅等操作，都可以由子女在微信小程序里完成。',
      },
      {
        q: '可以邀请其他家人一起制作吗？',
        a: '可以。你可以邀请兄弟姐妹、伴侣或其他家庭成员加入同一个家庭，大家共同上传照片和分享生活，让一份家书记录全家人的近况。',
      },
      {
        q: '为什么要给父母订阅家书？',
        a: '我们每天都在拍照，却很少把这些生活完整地分享给父母。每个月，一份可以拿在手里、反复翻阅的家书，让远方的牵挂看得见，也让陪伴持续送达。',
      },
    ],
  },
  {
    title: '制作与寄送',
    icon: '📸',
    items: [
      {
        q: '每期家书可以放多少张照片？',
        a: '每期最多可以上传 28 张照片。家庭中的所有成员共享这 28 张额度，大家可以在本期截止前持续上传、删除或调整内容。',
      },
      {
        q: '可以自己选择照片和调整排版吗？',
        a: '你可以自由选择、上传和编辑本期照片，也可以补充文字。页面版式由平台自动编排，目前暂不支持逐页手动调整，让制作家书尽量简单省心。',
      },
      {
        q: '每期家书什么时候寄出？',
        a: '每月 7 日、14日、21日、28日为本期内容上传截止日，用户可自行选择。截止后系统会自动排版并进入印刷流程，通常在 5 个工作日内完成印刷和寄出，具体进度可在小程序查看。',
      },
      {
        q: '可以同时寄给多位家人吗？',
        a: '可以。订阅默认包含一个地址、每期寄送 1 份；如需同时寄给其他家人，可以添加收件地址并购买加印。',
      },
      {
        q: '家书支持哪些地区配送？',
        a: '目前支持中国大陆大部分地区配送。内蒙古、西藏、青海、宁夏、新疆、海南及港澳台暂未开放，后续将逐渐开放，最终请以小程序保存收件地址时的提示为准。',
      },
      {
        q: 'PDF生成后，还能取消并重新生成吗？',
        a: '如果本期PDF已生成但尚未进入不可取消的印刷流程，可在小程序中取消本次生成，调整照片后重新生成，或选择等待下次生成日期。具体操作与权益规则以小程序显示为准。',
      },
      {
        q: '家书有印刷问题或者没有收到怎么办？',
        a: '请通过小程序客服入口联系，我们将免费补寄。',
      },
      {
        q: '担心忘记上传，有提醒功能吗？',
        a: '可以绑定手机号，我们会在每期生成前3天发送短信提醒，提醒及时上传照片。',
      },
    ],
  },
  {
    title: '订阅与费用',
    icon: '💳',
    items: [
      {
        q: '家人都需要付费吗？',
        a: '不需要。一位家人开通订阅后，其他受邀家庭成员都可以共同上传照片和文字，家庭成员数量不限。只有额外收件地址需要按期购买加印。',
      },
      {
        q: '可以先免费体验吗？',
        a: '可以先免费创建家庭、邀请家人并体验照片和故事的记录流程。自动生成纸质家书、覆膜高清打印和寄送属于付费订阅权益，具体以小程序订阅页为准。',
      },
      {
        q: '订阅到期后怎么办？',
        a: '可根据平台套餐继续购买或续订。',
      },
      {
        q: '首月29元是什么优惠？',
        a: '首月29元为开业体验价格，标准月费49元；季卡、半年卡和年卡有对应优惠。',
      },
    ],
  },
  {
    title: '隐私与安全',
    icon: '🔒',
    items: [
      {
        q: '家庭照片会公开吗？',
        a: '不会。照片和文字仅用于你的家庭空间及家书制作，只有受邀家庭成员可以查看和共同上传。我们不会把家庭内容公开展示或用于无关用途。',
      },
      {
        q: '可以下载电子版家书吗？',
        a: '可以。每期家书生成后，家庭成员可以在小程序的“我的家书”中预览并下载 PDF 电子版，既方便随时查看，也可以作为家庭资料长期保存。',
      },
    ],
  },
]

const privacyBlocks = [
  {
    title: '一、我们收集的信息',
    paragraphs: [
      '为了向您提供家书服务，我们可能会收集以下信息：',
      '1. 个人基本信息：昵称、头像、手机号码、生日、性别等；',
      '2. 内容信息：您发布的文字、照片等内容素材；',
      '3. 收件地址：用于家书的印刷和邮寄配送；',
      '4. 设备信息：设备型号、操作系统版本等用于优化服务体验；',
      '5. 支付信息：订阅方案选择及支付状态（不存储银行卡等敏感信息）。',
    ],
  },
  {
    title: '二、我们如何使用您的信息',
    paragraphs: [
      '我们将收集的信息用于以下用途：',
      '1. 生成家书：将您和家人发布的内容编排为定期印刷的家庭月刊；',
      '2. 印刷与配送：将生成的月刊印刷并邮寄至您指定的收件地址；',
      '3. 服务通知：发送制作、发货等服务状态通知；',
      '4. 产品优化：分析使用行为以改善服务体验。',
    ],
  },
  {
    title: '三、信息存储与保护',
    paragraphs: [
      '1. 您的数据存储在中国境内的安全服务器上；',
      '2. 我们采用加密传输和存储技术保护您的信息安全；',
      '3. 我们会定期对数据进行安全备份；',
      '4. 仅授权人员可访问用户数据，且受严格保密义务约束。',
    ],
  },
  {
    title: '四、信息共享与第三方',
    paragraphs: [
      '我们不会出售您的个人信息。以下情况可能涉及第三方共享：',
      '1. 印刷服务商：为完成印刷，需向合作印刷厂提供月刊内容；',
      '2. 物流服务商：为完成配送，需向物流公司提供收件地址和联系方式；',
      '3. 支付服务商：为完成支付，需通过微信支付处理订阅费用；',
      '4. 法律要求：根据法律法规要求，可能需要向有关部门提供信息。',
    ],
  },
  {
    title: '五、您的权利',
    paragraphs: [
      '您对个人信息享有查询、更正、删除、导出和注销的权利。您可以申请注销账号，我们将在15个工作日内完成处理。',
    ],
  },
  {
    title: '六、联系我们',
    paragraphs: [
      '如需咨询隐私政策，或申请删除、导出内容及注销账号，请发送邮件至 homebooks@163.com。我们会先核实账号归属，并在15个工作日内回复您的请求。',
    ],
  },
]

const termsBlocks = [
  {
    title: '一、服务说明',
    paragraphs: [
      '家书帮助家庭成员通过微信小程序发布文字和照片，系统自动编排并定期印刷成纸质月刊，邮寄给指定的家庭成员。',
      '使用本服务前，请您仔细阅读本条款。注册或使用本服务即表示您同意接受本条款的约束。',
    ],
  },
  {
    title: '二、订阅与支付',
    paragraphs: [
      '1. 具体价格和服务内容以产品页面展示为准；',
      '2. 订阅费用通过微信支付完成，支付成功后即开始服务周期；',
      '3. 订阅到期后若未续费，服务将自动停止，您的数据将保留90天；',
      '4. 已支付的订阅费用，在服务正常提供的情况下不予退还；',
      '5. 如因我方原因导致服务无法提供，将按剩余服务期限比例退款。',
      '6. 如需售后或申请退款，请联系 homebooks@163.com。我们将核实订单、已提供的服务和实际履约情况后处理。',
    ],
  },
  {
    title: '三、内容规范',
    paragraphs: [
      '您发布的内容不得违反法律法规，不得侵犯他人知识产权或肖像权，不得包含不良信息、虚假信息或恶意营销。我们有权删除违规内容，情节严重者将终止服务。',
    ],
  },
  {
    title: '四、知识产权',
    paragraphs: [
      '您发布的原创内容，知识产权归您所有。您授予家书在服务范围内使用、编排、印刷这些内容的权利。家书的商标、标识和界面设计归平台方所有。',
    ],
  },
  {
    title: '五、责任限制与服务终止',
    paragraphs: [
      '因不可抗力导致的服务中断，平台不承担责任。因物流原因导致的配送延迟或丢失，平台将协助处理。因用户提供错误地址导致的损失，由用户自行承担。',
      '您主动注销、严重违反内容规范，或账号存在安全风险时，我们可能终止服务，并在合理期限内保留数据以便导出。',
    ],
  },
  {
    title: '六、条款变更',
    paragraphs: [
      '我们保留修改本条款的权利。条款变更后，我们将通过小程序通知或消息推送等方式告知您。如您继续使用服务，视为您同意变更后的条款。',
    ],
  },
]

const openModal = (name: ModalName) => {
  modal.value = name
  menuOpen.value = false
}

const openSample = (index: number) => {
  sampleIndex.value = index
  openModal('sample')
}

const closeModal = () => {
  modal.value = null
}

const closeMenu = () => {
  menuOpen.value = false
}

const stepSample = (dir: number) => {
  sampleIndex.value = Math.min(sampleCount - 1, Math.max(0, sampleIndex.value + dir))
}

const onSampleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.changedTouches[0]?.clientX ?? 0
}

const onSampleTouchEnd = (event: TouchEvent) => {
  const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.value
  if (delta > 48) stepSample(-1)
  if (delta < -48) stepSample(1)
}

const onKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal()
    closeMenu()
  }
  if (modal.value !== 'sample') return
  if (event.key === 'ArrowRight') stepSample(1)
  if (event.key === 'ArrowLeft') stepSample(-1)
}

watch(modal, async (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
  if (!value) return
  await nextTick()
  closeBtn.value?.focus()
  if (value === 'story') {
    const video = storyVideo.value
    if (!video) return
    video.currentTime = 0
    video.play().catch(() => {})
  }
})

onMounted(() => {
  document.documentElement.classList.add('home-scroll')
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', syncQuoteVisible)
  startQuoteAutoplay()
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('home-scroll')
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', syncQuoteVisible)
  stopQuoteAutoplay()
})
</script>

<style scoped>
.page,
.page * { box-sizing: border-box; }
.page {
  min-height: 100vh;
  background: #fff9f3;
  color: #2c241c;
  font-family: 'helvetica neue','microsoft yahei','pingfang sc','hiragino sans gb','stheiti',tahoma,sans-serif;
  overflow-x: clip;
}
.page h1, .page h2, .page h3, .page p { margin: 0; }
.page button, .page a { font-family: inherit; }
.wrap { width: min(1120px, calc(100% - 48px)); margin: 0 auto; }
.serif, .section-title, .hero-copy h1, .brand, .amount, .dialog h3 { font-family: 'helvetica neue', 'microsoft yahei', 'pingfang sc', 'hiragino sans gb', 'stheiti', tahoma, sans-serif; }

.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: #fff9f3;
  border-bottom: 1px solid rgba(90, 60, 30, .06);
}
.nav {
  min-height: 72px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  position: relative;
}
.brand {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #241c16;
  text-decoration: none;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: .04em;
}
.brand-logo { gap: 0; line-height: 0; }
.brand-logo img {
  display: block;
  height: 48px;
  width: auto;
}
.nav-links {
  font-family: 'helvetica neue','microsoft yahei','pingfang sc','hiragino sans gb','stheiti',tahoma,sans-serif;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 28px;
}
.nav-links a, .nav-links button, .foot-links a, .foot-links button {
  border: 0;
  background: none;
  padding: 0;
  color: #4e453f;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
}
.nav-links a:hover, .nav-links button:hover, .foot-links a:hover, .foot-links button:hover { color: #fbc133; }
.nav-cta { justify-self: end; }
.cta-short { display: none; }
.menu-btn {
  display: none;
  flex: none;
  width: 28px;
  height: 28px;
  min-width: 28px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}
.menu-btn img { display: block; width: 26px; height: 26px; }

.btn {
  appearance: none;
  border: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 999px;
  padding: 13px 22px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
}
.btn.solid { background: #fbc133; color: #2a2118; box-shadow: 0 8px 18px rgba(210, 160, 40, .22); }
.btn.solid:hover { background: #fbc133; }
.btn.ghost { background: #fff; color: #2c241c; border: 1px solid #e6d9c8; }
.btn.ghost:hover { border-color: #d8c4aa; }
.btn:disabled { opacity: .45; cursor: not-allowed; }
.btn:focus-visible, .nav-links a:focus-visible, .menu-btn:focus-visible, summary:focus-visible, .close-x:focus-visible {
  outline: 2px solid #fbc133;
  outline-offset: 3px;
}
.wx { width: 16px; height: 16px; color: #1aad19; display: block; flex: none; }
.nav-cta { padding: 10px 16px; font-size: 13px; font-weight: 700; }

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr);
  align-items: stretch;
  min-height: 650px;
  padding: 0;
}
@media (min-width: 901px) {
  .band-hero .hero {
    width: min(1280px, calc(100% - 48px));
    max-width: 1280px;
    margin: 0 auto;
    padding: 0;
    column-gap: 0;
    grid-template-columns: minmax(0, 520px) minmax(0, 1fr);
  }
  .hero-copy { position: relative; z-index: 2; }
  .hero-copy::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 24px;
    bottom: 24px;
    left: -48px;
    right: 0;
    background: linear-gradient(90deg, #fff9f3 0%, #fff9f3 86%, rgba(255, 249, 243, .8) 95%, rgba(255, 249, 243, 0) 100%);
    pointer-events: none;
  }
  .band-hero .hero-scene {
    z-index: 1;
    height: auto;
    margin-top: 25px;
    margin-bottom: 25px;
    margin-left: -290px;
    width: calc(100% + 220px);
  }
  .hero-scene img {
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, .2) 10%, #000 22%, #000 94%, rgba(0, 0, 0, .35) 98%, transparent 100%);
    mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, .2) 10%, #000 22%, #000 94%, rgba(0, 0, 0, .35) 98%, transparent 100%);
  }
}
.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 28px;
}
.kicker {
  display: block;
  color: #8a5a3c;
  font-size: 16px;
}
.hero-copy h1 {
  margin: 0;
  font-size: clamp(36px, 4.5vw, 56px);
  font-weight: 700;
  line-height: 1.28;
  letter-spacing: -.02em;
  color: #241c16;
}
.hero-title-accent { color: #c45c38; }
.smile-line { margin: 0; color: #5c5148; font-size: 16px; line-height: 1.45; }
.lead { margin: 0; max-width: 540px; color: #6f645c; font-size: 15px; line-height: 1.9; }
.hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin: 8px 0 0; }
.hero-sample { display: flex; align-items: center; gap: 14px; min-width: 0; }
.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: #8d7f74;
  font-size: 15px;
}
.meta li {
  display: flex;
  align-items: center;
  gap: 6px;
}
.meta li:not(:last-child)::after {
  content: "";
  width: 1px;
  height: 14px;
  margin: 0 16px;
  background: #e4d8cc;
}
.meta i {
  color: #d4a24c;
  font-style: normal;
  font-weight: 700;
  line-height: 1;
}

.hero-scene {
  position: relative;
  min-width: 0;
  height: 100%;
  min-height: 520px;
}
.hero-scene img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, .55) 3%, #000 8%, #000 86%, rgba(0, 0, 0, .45) 94%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, .55) 3%, #000 8%, #000 86%, rgba(0, 0, 0, .45) 94%, transparent 100%);
}
.hero-caption {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 1;
  max-width: calc(100% - 32px);
  padding: 9px 14px 9px 16px;
  border-radius: 999px;
  background: rgba(255, 249, 241, .94);
  color: #6a3e28;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .08em;
  line-height: 1;
  box-shadow: 0 10px 24px rgba(70, 36, 12, .18);
  backdrop-filter: blur(10px);
}
.hero-caption::before {
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 8px;
  border-radius: 50%;
  background: #fbc133;
  box-shadow: 0 0 0 4px rgba(251, 193, 51, .28);
  vertical-align: 1px;
}

.section { padding: 88px 0; }
.band { width: 100%; }
.band-hero { background: #fff9f3; }
.band-sample { background: #fefefe; }
.band-how { background: #fff4e4; }
.band-reviews { background: #f2f6f1; }
.band-faq { background: #f7f1ea; }
.band-finale { background: #f7f1ea; padding: 72px 0 88px; }
.section-title {
  text-align: center;
  font-size: clamp(28px, 3.2vw, 40px);
  font-weight: 700;
  line-height: 1.35;
  color: #241c16;
  overflow-wrap: anywhere;
}
.page .section-desc {
  text-align: center;
  max-width: 640px;
  margin: 12px auto 0;
  color: #7a6e64;
  line-height: 1.8;
}
.sample-layout {
  margin-top: 40px;
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(0, .75fr);
  gap: 42px;
  align-items: center;
}
.book {
  width: 100%;
  display: block;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.book img { display: block; width: 100%; height: auto; }
.sample-points { display: grid; gap: 22px; }
.sample-points article { display: grid; grid-template-columns: 44px 1fr; gap: 12px; align-items: start; }
.sample-points h3 { font-size: 18px; margin-bottom: 4px; }
.sample-points p { color: #6f645c; font-size: 14px; line-height: 1.7; }
.point-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #fff;
  color: #c45c38;
  border: 1px solid #f1e4d4;
}
.point-icon img { width: 24px; height: 24px; display: block; }
.text-arrow {
  justify-self: start;
  border: 0;
  background: none;
  padding: 0;
  color: #c45c38;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}
.text-arrow span { margin-left: 4px; }
.steps {
  list-style: none;
  margin: 48px auto 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px 12px;
}
.steps li {
  display: flex;
  align-items: center;
  min-width: 0;
}
.step-body {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}
.step-copy {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
}
.step-copy p {
  max-width: 8.6em;
  margin: 6px 0 0;
  color: #8a7b70;
  font-size: 13px;
  line-height: 1.55;
}
.step-copy .step-no {
  max-width: none;
  margin: 0;
  color: #fbc133;
  font-size: 30px;
  font-weight: 700;
  line-height: .9;
  letter-spacing: -.03em;
}
.steps h3 {
  margin: 0;
  color: #241c16;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}
.step-icon {
  --icon-w: 76px;
  width: var(--icon-w);
  height: calc(var(--icon-w) * 512 / 473);
  flex: none;
  overflow: hidden;
  display: block;
}
.step-icon img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.step-icon img.step-shot {
  width: 100%;
  height: auto;
  object-fit: unset;
}
.step-phone .step-icon {
  height: calc(var(--icon-w) * 680 / 473);
  border-radius: 6px 6px 0 0;
}
.step-phone {
  position: relative;
  display: block;
  flex: none;
  padding: 5px 2px 0;
  border: 1.5px solid #111;
  border-bottom: 0;
  border-radius: 14px 14px 0 0;
  background: #111;
  line-height: 0;
}
.step-phone::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 50%;
  width: 14px;
  height: 2px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: #3a3a3a;
}
.step-next {
  display: grid;
  place-items: center;
  width: 18px;
  margin-left: 28px;
  color: #fbc133;
  flex: none;
}
.step-next svg { display: block; width: 14px; height: 14px; }
.quote-swiper { margin-top: 36px; }
.quote-viewport { overflow: hidden; }
.quote-track {
  --gap: 16px;
  --visible: 3;
  --i: 0;
  display: flex;
  gap: var(--gap);
  width: 100%;
  transition: transform .45s ease;
  transform: translateX(calc(var(--i) * -1 * (100% + var(--gap)) / var(--visible)));
}
.quote-track blockquote {
  flex: 0 0 calc((100% - (var(--visible) - 1) * var(--gap)) / var(--visible));
  min-width: 0;
  margin: 0;
  min-height: 220px;
  padding: 20px 22px 22px;
  background: #fff;
  border: 1px solid #f3e9dd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(80, 50, 20, .06), 0 16px 36px rgba(80, 50, 20, .12);
}
.quote-track h3 {
  margin: 0 0 12px;
  color: #241c16;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.45;
}
.quote-track p { font-size: 15px; line-height: 1.8; color: #3f352f; }
.scene-toggle {
  margin-top: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #c47d12;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.scene-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.scene-tags li {
  padding: 3px 8px;
  border-radius: 999px;
  background: #fff6e8;
  color: #8a5a32;
  font-size: 12px;
  line-height: 1.4;
}
.quote-controls { display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 18px; }
.quote-arrow {
  width: 36px;
  height: 36px;
  border: 1px solid #eadfd2;
  border-radius: 50%;
  background: #fff;
  color: #4e453f;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}
.quote-arrow:disabled { opacity: .35; cursor: not-allowed; }
.quote-dots { display: flex; gap: 8px; }
.quote-dots button {
  width: 8px;
  height: 8px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #eadfd2;
  cursor: pointer;
}
.quote-dots button.on { background: #e2b15a; }

.band-pricing { background: #fff8f1; }
.band-pricing .pricing-head { text-align: center; }
.band-pricing .section-title { color: #7a3f18; }
.band-pricing .section-desc {
  max-width: 760px;
  color: #c4a06a;
  font-size: 16px;
}
.band-pricing .pricing-gift {
  margin: 6px 0 0;
  color: #c4a06a;
  font-size: 16px;
  line-height: 1.8;
  text-align: center;
}
.pricing-layout {
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-top: 42px;
}
.price-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  align-items: stretch;
  padding-top: 18px;
}
.plan-benefits,
.price-card {
  min-width: 0;
  border: 1px solid #f3e4d2;
  border-radius: 22px;
  background: #fffdfb;
  box-shadow: 0 12px 32px rgba(120, 78, 30, .05);
}
.plan-benefits {
  display: flex;
  flex-direction: column;
  padding: 28px 24px 24px;
  background: #fffaf4;
}
.plan-benefits h3 {
  margin: 0;
  color: #6b3a1c;
  font-size: 22px;
  font-weight: 700;
}
.band-pricing .benefits-lead {
  margin: 8px 0 0;
  color: #b08968;
  font-size: 14px;
  line-height: 1.7;
}
.plan-perks {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px 24px;
  margin: 20px 0 0;
  padding: 0;
}
.plan-perks li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 0;
}
.perk-ico {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  flex: none;
  margin-top: 1px;
  border-radius: 50%;
  background: #f6c445;
  color: #fff;
}
.perk-check, .perk-line { display: block; }
.perk-check { width: 12px; height: 12px; }
.perk-line { display: none; width: 22px; height: 22px; }
.perk-copy { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.perk-copy strong {
  color: #5c3418;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.45;
}
.perk-copy small {
  color: #b08968;
  font-size: 13px;
  line-height: 1.45;
}
.price-card {
  position: relative;
  display: flex;
  padding: 26px 22px 22px;
}
.price-card.featured {
  margin-top: -14px;
  height: calc(100% + 14px);
  border-color: #f0cb78;
  background: linear-gradient(180deg, #fffdf8 0%, #fff4d2 46%, #f6c85a 100%);
  box-shadow: 0 16px 36px rgba(210, 160, 40, .16);
}
.price-ribbon {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 50%;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 7px 14px 7px 12px;
  border-radius: 999px;
  background: linear-gradient(180deg, #8d5a32 0%, #6e3e1e 100%);
  color: #f8e7c4;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  transform: translate(-50%, -58%);
  box-shadow: 0 8px 16px rgba(90, 40, 10, .16);
}
.price-ribbon svg { width: 16px; height: 13px; color: #f6c445; flex: none; }
.price-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
  text-align: center;
}
.price-main,
.price-pay { display: contents; }
.band-pricing .price-term {
  position: absolute;
  top: 16px;
  right: 16px;
  margin: 0;
  padding: 5px 10px;
  border-radius: 999px;
  background: #f6c445;
  color: #6a3e12;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}
.price-card h3 {
  margin: 36px 0 0;
  color: #6b3a1c;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: .02em;
  line-height: 1.2;
}
.band-pricing .price-sub {
  margin: 8px 0 0;
  color: #a08068;
  font-size: 14px;
  line-height: 1.5;
}
.price-figure {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  margin: 18px auto 0;
}
.price-save-desk {
  position: static;
  margin-top: 10px;
}
.price-original {
  margin: 0 0 6px;
  color: #b7a08c;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
}
.price-original s {
  text-decoration-thickness: 1px;
}
.page .price-card .amount {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  margin: 0;
  color: #c47d12;
}
.price-card .amount span {
  margin-bottom: 8px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}
.price-card .amount strong {
  font-size: 48px;
  font-weight: 700;
  line-height: .82;
  letter-spacing: -.03em;
  font-variant-numeric: tabular-nums;
}
.price-save {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  background: #f0a04a;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
  white-space: nowrap;
}
.price-save-mob { display: none; }
.price-foot {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 12px;
}
.price-foot-main { display: flex; flex-direction: column; align-items: center; }
.band-pricing .price-note {
  margin: 0;
  color: #c4a06a;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
}
.price-mobile-note { display: none; }
.price-card .plan-btn {
  width: 78%;
  min-width: 132px;
  margin-top: auto;
  padding: 12px 18px;
  background: #f6c445;
  color: #6a3e12;
  box-shadow: 0 8px 16px rgba(210, 160, 40, .18);
}
.price-card .plan-btn.year {
  background: #7a4522;
  color: #fff8ef;
  box-shadow: 0 8px 16px rgba(90, 40, 10, .18);
}
.price-card .plan-btn.year:hover { background: #69391b; }

.faq-groups { max-width: 860px; margin: 42px auto 0; display: grid; gap: 42px; }
.faq-group h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 6px;
  color: #392f28;
  font-size: 21px;
}
.faq-group h3 span { font-size: 19px; }
.faq-list { margin: 0; }
.faq-list details { border-bottom: 1px solid #efe4d6; }
.faq-list summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 2px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  list-style: none;
}
.faq-list summary::-webkit-details-marker { display: none; }
.faq-list p { margin: -2px 4px 20px; max-width: 720px; color: #6f645c; font-size: 14px; line-height: 1.9; }
.chev {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #eadfd2;
  position: relative;
  flex: none;
}
.chev::before {
  content: "";
  position: absolute;
  left: 9px;
  top: 8px;
  width: 7px;
  height: 7px;
  border-right: 1.5px solid #8a7568;
  border-bottom: 1.5px solid #8a7568;
  transform: rotate(45deg);
}
details[open] .chev::before { top: 11px; transform: rotate(225deg); }
.faq-cta {
  max-width: 860px;
  margin: 54px auto 0;
  padding: 30px 34px;
  border-radius: 12px;
  background: #382f29;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}
.faq-cta div { display: grid; gap: 8px; }
.faq-cta strong { font-size: 20px; }
.faq-cta span { color: #d8cec7; font-size: 13px; line-height: 1.7; }
.faq-cta .btn { flex: none; }

.finale-wrap { padding-bottom: 0; }
.finale {
  position: relative;
  overflow: hidden;
  min-height: 280px;
  display: grid;
  place-items: center;
  padding: 64px 24px;
  border-radius: 8px;
  background: #c4a07a;
  text-align: center;
}
.bloom {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at center, rgba(48, 28, 16, .34), rgba(48, 28, 16, .12) 46%, rgba(48, 28, 16, .05) 72%),
    url("/images/home/finale.png") center / cover no-repeat;
}
.finale-copy { position: relative; z-index: 1; }
.finale h2 {
  max-width: 640px;
  color: #fff;
  font-family: "Songti SC", "STSong", serif;
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 700;
  line-height: 1.35;
  text-shadow: 0 8px 24px rgba(90, 30, 10, .2);
}
.finale .btn { margin-top: 22px; }

footer { border-top: 1px solid #efe4d6; padding: 36px 0 28px; }
.foot { display: grid; grid-template-columns: auto 1fr; gap: 12px 32px; align-items: center; }
.foot-brand { display: flex; flex-direction: column; align-items: center; }
.foot-brand p { margin-top: 8px; color: #7a6e64; font-size: 14px; text-align: center; }
.foot-links { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 12px 22px; }
.copyright { grid-column: 2; justify-self: end; color: #a8988c; font-size: 13px; }

.backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(40, 28, 18, .48);
  display: grid;
  place-items: center;
  padding: 20px 16px;
}
.dialog {
  position: relative;
  width: min(520px, 100%);
  max-height: min(84vh, 780px);
  overflow: auto;
  background: #fffdf9;
  border-radius: 22px;
  padding: 28px 26px 24px;
  box-shadow: 0 24px 70px rgba(40, 20, 10, .28);
}
.dialog.wide {
  width: min(920px, 100%);
  height: min(84vh, 780px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.dialog.story { width: min(760px, 100%); }
.story-video {
  display: block;
  width: 100%;
  margin-top: 16px;
  border-radius: 14px;
  background: #1c1612;
}
.dialog h3 { font-size: 28px; line-height: 1.3; padding-right: 36px; }
.dialog h3.wechat-title { padding-right: 0; text-align: center; }
.dialog-kicker { color: #a15a32; font-size: 13px; font-weight: 700; letter-spacing: .08em; }
.dialog-copy { margin-top: 12px; color: #5f554e; font-size: 15px; line-height: 1.85; }
.page .search-name {
  margin: 20px 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fff6e4;
  color: #6a4b28;
  font-weight: 700;
  text-align: center;
}
.mini-qr {
  display: block;
  width: 220px;
  height: 220px;
  margin: 18px auto 0;
  border-radius: 16px;
  background: #fff;
}
.page .qr-hint { margin-top: 15px; text-align: center; color: #7a6e64; font-size: 14px; }
.mail { color: #c45c38; }
.close-x {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: 1px solid #efe4d6;
  border-radius: 50%;
  background: #fff;
  color: #4e453f;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}
.legal-date { margin: 8px 0 12px; color: #a8988c; font-size: 13px; }
.legal h4 { margin: 16px 0 6px; font-size: 16px; }
.legal p { margin: 0 0 8px; color: #5f554e; font-size: 14px; line-height: 1.8; }
.sample-head p { margin-top: 6px; color: #7a6e64; font-size: 13px; }
.dialog.wide .sample-head,
.dialog.wide .viewer-nav { flex: none; }
.viewer {
  flex: 1;
  min-height: 0;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6efe6;
  border-radius: 14px;
  padding: 12px;
}
.sample-page {
  display: block;
  width: auto;
  height: auto;
  min-width: 0;
  min-height: 0;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  background: #fff;
  box-shadow: 0 12px 36px rgba(70, 40, 20, .1);
}
.viewer-nav { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 14px; color: #7a6e64; font-size: 13px; }

@media (max-width: 900px) {
  .nav { display: flex; min-height: 64px; width: 100%; }
  .brand, .menu-btn, .nav-cta { flex: none; }
  .nav-cta { margin-left: auto; }
  .menu-btn { display: block; }
  .nav-links {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    padding: 6px 4px 12px;
    background: #fffdf9;
    border-bottom: 1px solid #efe4d6;
    box-shadow: 0 16px 30px rgba(60, 40, 20, .06);
    grid-template-columns: 1fr;
    gap: 0;
    z-index: 5;
  }
  .nav-links.open { display: grid; }
  .nav-links a, .nav-links button { text-align: left; padding: 13px 8px; border-bottom: 1px solid #f6eee6; font-size: 15px; }
  .hero, .sample-layout { grid-template-columns: minmax(0, 1fr); }
  .steps {
    flex-direction: column;
    align-items: center;
    width: fit-content;
    max-width: 100%;
    gap: 4px;
  }
  .steps li { flex-direction: column; align-items: center; }
  .step-body { width: auto; justify-content: flex-start; gap: 10px; }
  .step-next { align-self: center; margin: 10px 0 6px; transform: rotate(90deg); }
  .hero { min-height: 0; padding: 36px 0 48px; gap: 32px; }
  .hero-copy { gap: 22px; }
  .lead { display: none; }
  .hero-scene { order: -1; height: min(78vw, 460px); min-height: 0; }
  .section { padding: 64px 0; }
  .faq-groups { gap: 34px; }
  .faq-cta { align-items: flex-start; flex-direction: column; padding: 26px; }
  .book { min-height: 0; }
  .foot { width: min(1120px, calc(100% - 32px)); }
}
@media (max-width: 640px) {
  .wrap { width: min(1120px, calc(100% - 32px)); }
  .nav-cta { padding: 9px 12px; }
  .cta-long { display: none; }
  .nav-cta .cta-short { display: inline; }
  .title-break { display: block; }
  .section-title, .finale h2 { font-size: 28px; }
  .faq-group h3 { font-size: 19px; }
  .faq-list summary { padding-block: 18px; font-size: 15px; }
  .faq-cta .btn { width: 100%; }
  .foot-links { justify-content: flex-start; }
  .brand-logo img { height: 40px; }
  .hero-copy h1 { font-size: 34px; }
  .meta { font-size: 13px; }
  .meta li:not(:last-child)::after { margin: 0 12px; }
  .hero-caption {
    right: 10px;
    bottom: 10px;
    max-width: calc(100% - 20px);
    padding: 8px 12px;
    font-size: 12px;
    letter-spacing: .02em;
  }
  .dialog .btn.solid { width: 100%; }
  .hero-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
    width: 100%;
  }
  .hero-sample { display: contents; }
  .hero-actions > .btn,
  .hero-sample .btn { width: 100%; padding: 13px 8px; font-size: 14px; }
  .smile-line { grid-column: 1 / -1; text-align: center; }
  .text-arrow { justify-self: center; color: #fbc133; }
  .copyright, .foot-links { grid-column: 1; justify-self: start; }
  .foot { grid-template-columns: 1fr; }
  .finale { min-height: 240px; padding: 48px 18px; }
}
@media (max-width: 1100px) {
  .band-pricing .pricing-head,
  .band-pricing .section-title,
  .band-pricing .section-desc,
  .band-pricing .pricing-gift { text-align: left; }
  .band-pricing .section-title {
    overflow-wrap: normal;
    font-size: clamp(20px, 5.5vw, 26px);
    line-height: 1.35;
    letter-spacing: -.02em;
  }
  .band-pricing .section-desc { margin: 10px 0 0; font-size: 14px; line-height: 1.7; }
  .band-pricing .title-break { display: inline; }
  .band-pricing .pricing-gift { display: none; }
  .pricing-layout {
    gap: 14px;
    margin-top: 22px;
  }
  .price-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    padding-top: 8px;
  }
  .plan-perks {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    margin-top: 18px;
  }
  .plan-benefits,
  .price-card {
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 8px 24px rgba(120, 78, 30, .05);
  }
  .plan-benefits { padding: 22px 18px 18px; }
  .plan-benefits h3 { font-size: 20px; }
  .benefits-lead { display: none; }
  .plan-perks { gap: 16px; margin-top: 18px; }
  .perk-ico {
    width: 22px;
    height: 22px;
    margin-top: 0;
    border-radius: 0;
    background: transparent;
    color: #8a5a32;
  }
  .perk-check { display: none; }
  .perk-line { display: block; }
  .perk-copy small { display: none; }
  .perk-copy strong { font-size: 15px; font-weight: 600; }
  .price-card { padding: 16px 16px 14px; }
  .price-card.featured {
    height: auto;
    margin-top: 18px;
    border-color: #f3e0c4;
    background: #fff;
    box-shadow: 0 8px 24px rgba(120, 78, 30, .05);
  }
  .price-ribbon { font-size: 12px; padding: 6px 12px; }
  .price-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    column-gap: 12px;
    text-align: left;
  }
  .price-main,
  .price-pay { display: flex; min-width: 0; }
  .price-main {
    flex-direction: column;
    align-items: flex-start;
  }
  .price-pay {
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
  }
  .band-pricing .price-term {
    position: static;
    padding: 0;
    border-radius: 0;
    background: transparent;
    color: #c4a06a;
    font-size: 12px;
    font-weight: 600;
  }
  .price-card h3 {
    margin: 2px 0 0;
    font-size: 26px;
    letter-spacing: 0;
  }
  .price-sub { display: none; }
  .price-figure { margin: 0; }
  .page .price-card .amount { justify-content: flex-end; color: #e2a322; }
  .price-card .amount span { margin-bottom: 3px; font-size: 16px; }
  .price-card .amount strong { font-size: 32px; }
  .price-save-desk { display: none; }
  .price-save-mob { display: inline-flex; margin-top: 4px; }
  .price-foot {
    justify-content: flex-end;
    width: auto;
    margin-top: 2px;
  }
  .price-foot-main { align-items: flex-end; }
  .band-pricing .price-note { font-size: 12px; }
  .band-pricing .price-mobile-note {
    display: flex;
    align-items: flex-start;
    gap: 4px;
    max-width: 11em;
    margin: 6px 0 0;
    color: #c4a06a;
    font-size: 12px;
    line-height: 1.5;
    text-align: left;
  }
  .note-ico {
    width: 14px;
    height: 14px;
    flex: none;
    margin-top: 1px;
    color: #d4a24c;
  }
  .note-ico svg { display: block; width: 14px; height: 14px; }
  .price-card .plan-btn {
    width: auto;
    min-width: 108px;
    margin-top: 8px;
    align-self: flex-end;
    padding: 11px 16px;
    font-size: 14px;
    box-shadow: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  :global(html.home-scroll) { scroll-behavior: auto; }
  .quote-track { transition: none; }
}
</style>

<style scoped>
:global(html.home-scroll) {
  scroll-behavior: smooth;
  scroll-padding-top: 88px;
}
</style>
