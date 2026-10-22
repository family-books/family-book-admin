<template>
  <div class="page">
    <header class="site-header">
      <p class="announce">家人数量不限 · 全家共同参与 · 免费配送</p>
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
      <section id="about" class="hero wrap">
        <div class="hero-copy">
          <span class="kicker">让亲情可以被触摸</span>
          <h1>把一家人的日常，<br><span class="hero-title-accent">寄到父母手里。</span></h1>
          <p class="gift">送给长辈的贴心礼物</p>
          <p class="lead">在微信分享照片和文字，家书帮你自动排版、印刷，每月寄送一本专属家庭月刊，让远方的家人看见你的生活，也把珍贵的回忆留在手里。</p>
          <div class="hero-actions">
            <button class="btn solid" type="button" @click="openModal('wechat')">开始制作家书</button>
            <div class="hero-sample">
              <button class="btn ghost" type="button" @click="openSample(0)">翻看一本样刊</button>
              <p class="smile-line">每个月，让他们多一份笑容。</p>
            </div>
          </div>
          <ul class="meta">
            <li><i aria-hidden="true">✓</i>微信小程序</li>
            <li><i aria-hidden="true">✓</i>全家共同上传</li>
            <li><i aria-hidden="true">✓</i>纸质月刊寄到家</li>
          </ul>
        </div>

        <div class="hero-scene">
          <img src="/images/home/hero.jpg" alt="爷爷奶奶一起翻看家书月刊" />
          <span class="hero-caption">爷爷奶奶爱看的家庭月刊</span>
        </div>
      </section>

      <section id="sample" class="section wrap">
        <h2 class="section-title">他们收到的，<span class="title-break">是这样一本家书</span></h2>
        <p class="section-desc">照片、文字和一家人的近况，翻开就能看见。</p>
        <div class="sample-layout">
          <button class="book" type="button" aria-label="在线翻看样刊" @click="openSample(1)">
            <div class="book-page mosaic">
              <div class="ph ph-1 tall"><span>周日午饭</span></div>
              <div class="ph ph-2"><span>公园</span></div>
              <div class="ph ph-6"><span>出门</span></div>
              <div class="ph ph-3"><span>菜园</span></div>
              <div class="ph ph-7"><span>晚饭</span></div>
              <div class="ph ph-4"><span>小满</span></div>
              <div class="ph ph-8"></div>
            </div>
            <div class="book-page spread-copy">
              <p class="mast">家书 · 家庭月刊</p>
              <div class="ph ph-5 feature-photo"><span>和爷爷奶奶一起吃饭</span></div>
              <h3>周末回家这一顿</h3>
              <p>番茄是爷爷种的，宝宝负责把碗里的饭吃完。</p>
              <div class="pair"><i class="ph ph-3"></i><i class="ph ph-2"></i></div>
            </div>
          </button>
          <div class="sample-points">
            <article>
              <span class="point-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="16" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.6 17.5c.5-2.2 2-3.4 3.4-3.4s2.9 1.2 3.4 3.4M12.6 17.5c.5-2.2 2-3.4 3.4-3.4s2.9 1.2 3.4 3.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
              </span>
              <div>
                <h3>全家一起分享</h3>
                <p>微信上传照片和文字，全家都能参与。</p>
              </div>
            </article>
            <article>
              <span class="point-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><rect x="4" y="3.5" width="16" height="17" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 8h8M8 12h8M8 16h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
              </span>
              <div>
                <h3>不用自己排版</h3>
                <p>家书帮你自动整理、排版，把大家的点滴做成一本杂志。</p>
              </div>
            </article>
            <article>
              <span class="point-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
              </span>
              <div>
                <h3>父母直接收件</h3>
                <p>每月印刷并寄送，直接送到父母手里。</p>
              </div>
            </article>
            <button class="text-arrow" type="button" @click="openSample(1)">在线翻看样刊 <span>→</span></button>
          </div>
        </div>
      </section>

      <section id="how" class="section how wrap">
        <h2 class="section-title">你分享生活，我们负责送达</h2>
        <ol class="steps">
          <li>
            <img class="step-shot" src="/images/home/step-family.jpg" alt="我的家庭：管理家庭并邀请家人加入" />
            <p class="step-no">01</p>
            <h3>开通家书</h3>
            <p>填写收件信息，邀请家人加入。</p>
          </li>
          <li>
            <img class="step-shot" src="/images/home/step-share.jpg" alt="家庭墙：上传照片和近况" />
            <p class="step-no">02</p>
            <h3>分享日常</h3>
            <p>上传照片，写下几句近况。</p>
          </li>
          <li>
            <img class="step-shot" src="/images/home/step-issue.jpg" alt="排版印刷后的家书月刊" />
            <p class="step-no">03</p>
            <h3>每月收件</h3>
            <p>自动排版、印刷，寄到家人手里。</p>
          </li>
        </ol>
      </section>

      <section class="section reviews wrap">
        <h2 class="section-title">用家人喜欢的方式，<span class="title-break">分享你的生活</span></h2>
        <p class="section-desc">一份订阅，全家参与。在微信上传照片和文字，把一家人的近况，送到长辈手里。</p>
        <div class="quotes">
          <blockquote>
            <span class="quote-mark" aria-hidden="true">“</span>
            <p>妈妈收到后，边翻边给我打电话，问起照片里的每一件小事。</p>
          </blockquote>
          <blockquote>
            <span class="quote-mark" aria-hidden="true">“</span>
            <p>兄弟姐妹一起上传，爸爸妈妈能在一本里看到大家的近况。</p>
          </blockquote>
          <blockquote>
            <span class="quote-mark" aria-hidden="true">“</span>
            <p>不用自己整理和排版，随手分享，就能把日常留给家人。</p>
          </blockquote>
        </div>
        <p class="review-note">示例文案，后续替换为真实用户评价。</p>
      </section>

      <section id="pricing" class="section wrap">
        <h2 class="section-title">每月30元，<span class="title-break">把全家的近况寄回家</span></h2>
        <div class="plan">
          <div class="stack" aria-hidden="true">
            <div class="issue back-a"></div>
            <div class="issue back-b"></div>
            <div class="issue front">
              <span>家庭月刊</span>
              <strong>家书</strong>
              <i class="ph ph-1"></i>
              <small>第 06 期</small>
            </div>
          </div>
          <div class="plan-copy">
            <h3>家书月刊</h3>
            <p class="amount"><span>¥</span><strong>30</strong><em>／月</em></p>
            <ul class="perks">
              <li><i>✓</i>每月寄送1本纸质月刊</li>
              <li><i>✓</i>每期最多上传28张照片</li>
              <li><i>✓</i>家人数量不限，全家共同参与</li>
              <li><i>✓</i>自动排版、印刷，免费配送</li>
            </ul>
            <button class="btn solid plan-btn" type="button" @click="openModal('wechat')">开通家书月刊</button>
          </div>
        </div>
      </section>

      <section id="faq" class="section wrap">
        <h2 class="section-title">你可能想知道</h2>
        <div class="faq-list">
          <details v-for="item in faqs" :key="item.q">
            <summary>{{ item.q }}<i class="chev" aria-hidden="true"></i></summary>
            <p>{{ item.a }}</p>
          </details>
        </div>
      </section>

      <section id="start" class="finale-wrap wrap">
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
        :class="{ wide: modal === 'sample', legal: modal === 'privacy' || modal === 'terms' }"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <button ref="closeBtn" class="close-x" type="button" aria-label="关闭" @click="closeModal">×</button>

        <template v-if="modal === 'wechat'">
          <p class="dialog-kicker">微信小程序</p>
          <h3 id="dialog-title">打开微信小程序</h3>
          <p class="dialog-copy">家书在微信小程序里制作。打开微信，搜索「家书」，就可以上传照片、邀请家人，并开通月刊。</p>
          <p class="search-name">小程序名称：家书</p>
          <button class="btn solid" type="button" @click="closeModal">我知道了</button>
        </template>

        <template v-else-if="modal === 'story'">
          <p class="dialog-kicker">品牌故事</p>
          <h3 id="dialog-title">让亲情可以被触摸</h3>
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
            <p>样刊示意，正式内容来自你们自己上传的照片和文字。</p>
          </div>
          <div class="viewer" @touchstart.passive="onSampleTouchStart" @touchend.passive="onSampleTouchEnd">
            <div v-show="sampleIndex === 0" class="sheet cover-sheet">
              <span>FAMILY MONTHLY</span>
              <strong>家书</strong>
              <em>把一家人的日常，寄到父母手里</em>
              <div class="ph ph-5 cover-photo"></div>
              <small>第 06 期 · 样刊</small>
            </div>
            <div v-show="sampleIndex === 1" class="sheet inside-sheet">
              <div class="book in-viewer">
                <div class="book-page mosaic">
                  <div class="ph ph-1 tall"><span>周日午饭</span></div>
                  <div class="ph ph-2"></div>
                  <div class="ph ph-6"></div>
                  <div class="ph ph-3"></div>
                  <div class="ph ph-7"></div>
                  <div class="ph ph-4"><span>小满</span></div>
                  <div class="ph ph-8"></div>
                </div>
                <div class="book-page spread-copy">
                  <p class="mast">家书 · 第06期</p>
                  <div class="ph ph-5 feature-photo"></div>
                  <h3>和爷爷奶奶一起吃饭</h3>
                  <p>照片、文字和一家人的近况，翻开就能看见。</p>
                </div>
              </div>
            </div>
            <div v-show="sampleIndex === 2" class="sheet story-sheet">
              <div class="ph ph-6 story-photo"></div>
              <div>
                <p class="mast">妈妈的一句话</p>
                <h3>今天宝宝第一次自己走路了</h3>
                <p>10 月 12 日 · 来自妈妈的手机。随手写下的几句近况，会和照片一起留在这一期里。</p>
              </div>
            </div>
            <div v-show="sampleIndex === 3" class="sheet mail-sheet">
              <div class="mini-issue big"><span>家书</span><i class="ph ph-1"></i></div>
              <div>
                <p class="mast">本月收件</p>
                <h3>这一本，正在寄往家里</h3>
                <p>自动排版、印刷，免费配送。父母不用打开小程序，也能翻到你们的生活。</p>
              </div>
            </div>
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
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type ModalName = 'wechat' | 'sample' | 'story' | 'contact' | 'privacy' | 'terms'

const modal = ref<ModalName | null>(null)
const menuOpen = ref(false)
const sampleIndex = ref(0)
const sampleCount = 4
const closeBtn = ref<HTMLButtonElement | null>(null)
const touchStartX = ref(0)

const faqs = [
  {
    q: '父母需要使用小程序吗？',
    a: '不需要。父母只要在家收下纸质月刊，翻开就能看到你们的照片和近况。上传和开通都在微信小程序里完成。',
  },
  {
    q: '家人都需要付费吗？',
    a: '不需要。开通一份家书月刊，全家都可以一起上传。家人数量不限，不用每人单独付费。',
  },
  {
    q: '每期什么时候寄出？',
    a: '每期在上传截止后自动排版、印刷，并免费寄出。具体的截止日期和寄送进度，可以在微信小程序里查看。',
  },
  {
    q: '家庭照片会公开吗？',
    a: '不会公开展示。照片和文字只供你的家庭制作这本月刊，受邀家人可以一起上传。为了印刷和寄送，内容会提供给必要的印刷与物流合作方，不会用于公开传播。',
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
})

onMounted(() => {
  document.documentElement.classList.add('home-scroll')
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('home-scroll')
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
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
.serif, .section-title, .hero-copy h1, .brand, .quote-mark, .amount, .dialog h3, .cover-sheet strong { font-family: 'helvetica neue', 'microsoft yahei', 'pingfang sc', 'hiragino sans gb', 'stheiti', tahoma, sans-serif; }

.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: #fff9f3;
  border-bottom: 1px solid rgba(90, 60, 30, .06);
}
.announce {
  margin: 0;
  background: #f6c23c;
  color: #2a2118;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .04em;
  line-height: 1.5;
  padding: 8px 16px;
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
.menu-btn img { display: block; width: 36px; height: 36px; }

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
  gap: 48px;
  align-items: center;
  padding: 48px 0 28px;
}
.kicker {
  display: block;
  color: #8a5a3c;
  font-size: 16px;
}
.hero-copy h1 {
  margin: 12px 0 18px;
  font-size: clamp(36px, 4.5vw, 56px);
  font-weight: 700;
  line-height: 1.22;
  letter-spacing: -.02em;
  color: #241c16;
}
.hero-title-accent { color: #c45c38; }
.gift { font-size: 18px; font-weight: 700; }
.smile-line { margin: 0; color: #5c5148; font-size: 16px; line-height: 1.45; }
.lead { margin-top: 16px; max-width: 540px; color: #6f645c; font-size: 15px; line-height: 1.9; }
.hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 26px; }
.hero-sample { display: flex; align-items: center; gap: 14px; min-width: 0; }
.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 10px;
  margin: 18px 0 0;
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
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(90, 50, 20, .12);
}
.hero-scene img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 800 / 632;
  object-fit: cover;
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
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  min-height: 390px;
  padding: 0;
  border: 0;
  background: #fffdf8;
  border-radius: 8px;
  overflow: hidden;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 24px 50px rgba(80, 48, 20, .12);
  position: relative;
}
.book::before {
  content: "";
  position: absolute;
  left: 52%;
  top: 0;
  bottom: 0;
  width: 22px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent, rgba(70, 40, 20, .13), transparent);
  z-index: 2;
  pointer-events: none;
}
.book-page { padding: 16px; }
.mosaic {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  grid-template-rows: 1fr 1fr 1fr .8fr;
  gap: 6px;
  background: #f7f1e7;
}
.mosaic .tall { grid-row: 1 / 3; }
.spread-copy { display: flex; flex-direction: column; gap: 8px; }
.spread-copy h3, .story-sheet h3, .mail-sheet h3 { font-size: 18px; line-height: 1.4; }
.spread-copy p, .story-sheet p, .mail-sheet p { color: #6f645c; font-size: 13px; line-height: 1.7; }
.mast { color: #a15a32; font-size: 12px; letter-spacing: .08em; }
.feature-photo { min-height: 168px; border-radius: 4px; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; min-height: 72px; }
.ph { position: relative; border-radius: 4px; overflow: hidden; display: block; }
.ph span {
  position: absolute;
  left: 8px;
  bottom: 6px;
  color: #fff;
  font-size: 11px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, .35);
}
.ph-1 { background: linear-gradient(160deg, #f6c991, #d4785a 58%, #8d4c3a); }
.ph-2 { background: linear-gradient(165deg, #dce6cc, #7f9a6e); }
.ph-3 { background: linear-gradient(160deg, #f8e2b8, #e0a15a); }
.ph-4 { background: linear-gradient(200deg, #f3d3b8, #c4896a 70%, #8d5a48); }
.ph-5 { background: linear-gradient(160deg, #f7d7ae, #e29a62 40%, #7f9a78); }
.ph-6 { background: linear-gradient(165deg, #f0c2a8, #c46b4f); }
.ph-7 { background: linear-gradient(160deg, #ead7a8, #b7894e); }
.ph-8 { background: linear-gradient(160deg, #f7dccb, #d99070); }
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
.point-icon svg { width: 22px; height: 22px; }
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

.how { padding-top: 20px; }
.steps {
  list-style: none;
  margin: 42px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1.05fr 1fr;
  gap: 28px;
  align-items: start;
}
.steps li { text-align: center; }
.steps h3 { margin: 8px 0 6px; font-size: 20px; }
.steps li > p:last-child { color: #6f645c; font-size: 14px; line-height: 1.7; }
.step-no { margin-top: 16px; color: #c45c38; font-family: "Songti SC", serif; font-size: 28px; font-weight: 700; }
.step-shot {
  display: block;
  width: 200px;
  height: 430px;
  margin: 0 auto;
  object-fit: cover;
  object-position: top center;
  border-radius: 22px;
  border: 1px solid #f1e6d8;
  box-shadow: 0 16px 36px rgba(80, 50, 20, .12);
  background: #fff;
}
.mini-issue {
  width: 116px;
  height: 156px;
  padding: 12px;
  background: #fff;
  border-radius: 4px 8px 8px 4px;
  box-shadow: 0 12px 24px rgba(70, 40, 20, .12);
  transform: rotate(-8deg);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.mini-issue span { font-family: "Songti SC", serif; font-size: 20px; }
.mini-issue i { flex: 1; }

.quotes { margin-top: 36px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.quotes blockquote {
  margin: 0;
  min-height: 190px;
  padding: 18px 22px 20px;
  background: #fff;
  border: 1px solid #f3e9dd;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(80, 50, 20, .04);
}
.quote-mark { display: block; color: #e2b15a; font-size: 48px; line-height: .8; }
.quotes p { font-size: 15px; line-height: 1.8; color: #3f352f; }
.review-note { margin-top: 16px !important; text-align: center; color: #a8988c; font-size: 13px; }

.plan {
  margin: 36px auto 0;
  max-width: 880px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 12px;
  align-items: center;
  padding: 36px 42px;
  background: #fff;
  border: 1px solid #f1e6d8;
  border-radius: 28px;
  box-shadow: 0 18px 50px rgba(80, 50, 20, .06);
}
.stack { position: relative; height: 250px; }
.issue {
  position: absolute;
  width: 148px;
  height: 206px;
  border-radius: 3px 8px 8px 3px;
  background: #f6ecdf;
  box-shadow: 0 12px 24px rgba(70, 40, 20, .1);
}
.back-a { left: 18px; top: 28px; transform: rotate(-12deg); background: #f3e4d2; }
.back-b { left: 48px; top: 18px; transform: rotate(-3deg); background: #f8f1e6; }
.front {
  left: 86px;
  top: 8px;
  transform: rotate(6deg);
  background: #fffdf8;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.front span { font-size: 11px; color: #a15a32; letter-spacing: .08em; }
.front strong { font-family: "Songti SC", serif; font-size: 28px; line-height: 1; }
.front i { flex: 1; border-radius: 3px; }
.front small { color: #8d7f74; font-size: 11px; }
.plan-copy h3 { font-size: 18px; }
.amount { display: flex; align-items: flex-end; gap: 2px; margin: 6px 0 16px; color: #c45c38; }
.amount span { font-size: 22px; margin-bottom: 8px; }
.amount strong { font-size: 64px; line-height: .85; font-weight: 700; }
.amount em { margin: 0 0 8px 2px; font-style: normal; font-size: 18px; color: #7a6e64; font-family: "PingFang SC", "Microsoft YaHei", sans-serif; }
.perks { list-style: none; margin: 0 0 22px; padding: 0; }
.perks li { display: flex; align-items: center; gap: 10px; padding: 6px 0; color: #4e453f; font-size: 15px; }
.perks i {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f8e7b8;
  color: #9a6230;
  font-style: normal;
  font-size: 11px;
  flex: none;
}
.plan-btn { min-width: 220px; }

.faq-list { max-width: 760px; margin: 28px auto 0; }
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
.faq-list p { margin: -2px 4px 18px; max-width: 640px; color: #6f645c; font-size: 14px; line-height: 1.8; }
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

.finale-wrap { padding-bottom: 88px; }
.finale {
  position: relative;
  overflow: hidden;
  min-height: 280px;
  display: grid;
  place-items: center;
  padding: 64px 24px;
  border-radius: 16px;
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
.dialog.wide { width: min(920px, 100%); }
.dialog h3 { font-size: 28px; line-height: 1.3; padding-right: 36px; }
.dialog-kicker { color: #a15a32; font-size: 13px; font-weight: 700; letter-spacing: .08em; }
.dialog-copy { margin-top: 12px; color: #5f554e; font-size: 15px; line-height: 1.85; }
.search-name {
  margin: 16px 0 20px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fff6e4;
  color: #6a4b28;
  font-weight: 700;
}
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
.viewer { margin-top: 16px; }
.sheet { border-radius: 14px; overflow: hidden; background: #f7f1e7; }
.cover-sheet {
  min-height: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 28px 16px;
  background: linear-gradient(180deg, #f8efe3, #f4e0c8);
  text-align: center;
}
.cover-sheet span, .cover-sheet small { letter-spacing: .14em; color: #8d6244; font-size: 12px; }
.cover-sheet strong { font-size: 64px; line-height: 1; }
.cover-sheet em { font-style: normal; color: #5c5148; }
.cover-photo { width: min(280px, 70%); height: 150px; margin: 8px 0; border-radius: 6px; }
.inside-sheet { padding: 12px; }
.in-viewer { min-height: 420px; box-shadow: none; }
.story-sheet, .mail-sheet {
  min-height: 380px;
  display: grid;
  grid-template-columns: .9fr 1.1fr;
  gap: 22px;
  align-items: center;
  padding: 22px;
}
.story-photo { min-height: 260px; border-radius: 8px; }
.mini-issue.big { width: 180px; height: 240px; margin: 0 auto; transform: rotate(-6deg); }
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
  .hero, .sample-layout, .steps, .quotes, .plan, .story-sheet, .mail-sheet { grid-template-columns: minmax(0, 1fr); }
  .hero { padding-top: 28px; gap: 28px; }
  .section { padding: 64px 0; }
  .book { min-height: 0; }
  .feature-photo { min-height: 140px; }
  .plan { padding: 28px 22px 24px; }
  .stack { height: 230px; margin-bottom: 8px; }
  .foot, .finale-wrap { width: min(1120px, calc(100% - 32px)); }
}
@media (max-width: 640px) {
  .wrap { width: min(1120px, calc(100% - 32px)); }
  .announce { font-size: 12px; padding: 8px 12px; }
  .nav-cta { padding: 9px 12px; }
  .cta-long { display: none; }
  .nav-cta .cta-short { display: inline; }
  .title-break { display: block; }
  .section-title, .finale h2 { font-size: 28px; }
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
  .hero-actions, .hero-actions > .btn, .hero-sample, .plan-btn, .dialog .btn.solid { width: 100%; }
  .hero-sample .btn { width: auto; flex: none; }
  .book, .inside-sheet .book { grid-template-columns: 1fr; }
  .book::before, .in-viewer::before { display: none; }
  .mosaic { min-height: 280px; }
  .steps { gap: 36px; }
  .quotes blockquote { min-height: 0; }
  .front { left: 64px; }
  .back-a { left: 8px; }
  .copyright, .foot-links { grid-column: 1; justify-self: start; }
  .foot { grid-template-columns: 1fr; }
  .finale { min-height: 240px; padding: 48px 18px; }
  .cover-sheet strong { font-size: 48px; }
  .in-viewer { min-height: 0; }
}
@media (prefers-reduced-motion: reduce) {
  :global(html.home-scroll) { scroll-behavior: auto; }
}
</style>

<style scoped>
:global(html.home-scroll) {
  scroll-behavior: smooth;
  scroll-padding-top: 118px;
}
</style>
