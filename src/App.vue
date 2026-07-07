<script setup>
import { pageLogic } from './util/script.js';
import { backTop } from './util/backtop.js';

const { showTopButton, hovering, scrollToTop } = backTop();

const {
  byCategory,
  visitorCount,
  allowMultiple,
  continueRandom,
  loopAudio,
  playAudio,
  stopAll,
  nowPlaying,
  playRandom,
  playCategory,
  slogan,
  fileCount,
  lastModified,
  volume,
  setVolume,
} = pageLogic();
</script>

<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-left">
        <a href="https://space.bilibili.com/1609526545" target="_blank" rel="noopener noreferrer">
          <img src="/src/assets/shiori.png" alt="logo" class="navbar-logo left" />
        </a>
        <a class="navbar-title" href="https://space.bilibili.com/1609526545" target="_blank"
          rel="noopener noreferrer">海獭按钮</a>
      </div>
      <div class="navbar-right">
        <a class="navbar-title" href="https://shiori.dev/" target="_blank" rel="noopener noreferrer">獭獭栞的家(Mirror)</a>
        <a href="https://shiori.dev/" target="_blank" rel="noopener noreferrer">
          <img src="/src/assets/ttk.png" alt="logo" class="navbar-logo right" />
        </a>
      </div>
    </nav>
    <div class="slogan-section" v-if="slogan">{{ slogan }}</div>
    <hr>
    <div class="visitor-counter">老馋小孩共计致聋獭獭栞: {{ visitorCount }}只</div>
    <section class="controls controls-top">
      <div class="controls-row">
        <button class="control-btn" @click="playRandom">随机老馋</button>
        <button class="control-btn" @click="stopAll">停止老馋</button>
      </div>
      <div class="controls-row">
        <label><input type="checkbox" v-model="continueRandom" /> 连续老馋</label>
        <label><input type="checkbox" v-model="loopAudio" /> 循环老馋</label>
        <label><input type="checkbox" v-model="allowMultiple" /> 多重老馋</label>
      </div>
      <div class="controls-row volume-row">
        <label for="volume-slider">音量：</label>
        <input id="volume-slider" type="range" min="0" max="1" step="0.1" :value="volume"
          @input="setVolume($event.target.value)" />
        <span>{{ Math.round(volume * 100) }}%</span>
      </div>
      <div class="now-playing">
        <span v-if="nowPlaying.length === 0">🦦正在播放: 无</span>
        <span v-else>🦦正在播放: {{ nowPlaying.join(', ') }}</span>
      </div>
    </section>
    <section class="audio-list">
      <div v-if="byCategory && Object.keys(byCategory).length === 0">看来你是真聋了</div>
      <div v-else>
        <div v-for="(group, category) in byCategory" :key="category" class="category-section">
          <button class="category-btn" @click="playCategory(category)">{{ category }}</button>
          <ul>
            <li class="audio-btn" v-for="audio in group" :key="audio.path">
              <button @click="playAudio(audio.path)">{{ audio.displayName }}
                <span v-if="audio.dateAdded === lastModified" class="new-flag">NEW</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
  <footer class="footer">
    <div>
      &copy; 2026 耳聋ttk All Rights Reserved | 音频总数: {{ fileCount }} | 最后更新: {{ lastModified }} |
      提交新音频或改进建议请前往 <a href="https://github.com/forsakenrei/shiori-button" target="_blank"
        rel="noopener noreferrer">Github</a>
    </div>
  </footer>
  <button v-show="showTopButton" class="to-top-btn" @click="scrollToTop" @mouseenter="hovering = true"
    @mouseleave="hovering = false" :style="{ opacity: hovering ? 1 : 0.7 }">
    ⬆
  </button>
</template>
