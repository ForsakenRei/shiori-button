import { ref, reactive, onMounted, computed, watch } from "vue";

const fileCount = ref(0);
const lastModified = ref("");

async function fetchLastModified() {
  try {
    const res = await fetch("/api/lastmod");
    const data = await res.json();
    if (data.lastModified) {
      lastModified.value = data.lastModified;
    } else {
      lastModified.value = "";
    }
  } catch (e) {
    lastModified.value = "";
  }
}

async function fetchFileCount() {
  try {
    const res = await fetch("/api/file-count");
    const data = await res.json();
    if (typeof data.count === "number") {
      fileCount.value = data.count;
    } else {
      fileCount.value = 0;
    }
  } catch (e) {
    fileCount.value = 0;
  }
}

export function pageLogic() {
  const volume = ref(1);
  const byCategory = computed(() => {
    const groups = {};
    for (const audio of audioList.value) {
      if (!groups[audio.category]) groups[audio.category] = [];
      groups[audio.category].push(audio);
    }
    return groups;
  });

  const audioList = ref([]);
  const audioElements = reactive({});
  const visitorCount = ref(0);
  const allowMultiple = ref(false);
  const continueRandom = ref(false);
  const loopAudio = ref(false);
  let randomPlayTimeout = null;

  async function fetchAudioList() {
    const res = await fetch("/audio/audioList.json");
    audioList.value = await res.json();
  }

  onMounted(async () => {
    fetchAudioList();
    try {
      const res = await fetch("/api/visitor-count");
      const data = await res.json();
      visitorCount.value = data.count;
    } catch (e) {
      visitorCount.value = "N/A";
    }
  });

  const nowPlayingPaths = ref([]);

  function setVolume(val) {
    const v = typeof val === "string" ? parseFloat(val) : val;
    volume.value = v;
    Object.values(audioElements).forEach((aud) => {
      aud.volume = v;
    });
  }

  function playAudio(path) {
    if (!allowMultiple.value) {
      stopAll();
    }
    if (!audioElements[path]) {
      audioElements[path] = new Audio(path);
      audioElements[path].onended = () => {
        updateNowPlaying();
        if (continueRandom.value) {
          playRandom();
        }
      };
      audioElements[path].onpause = updateNowPlaying;
      audioElements[path].onplay = updateNowPlaying;
      audioElements[path].volume = volume.value;
    } else {
      audioElements[path].volume = volume.value;
    }
    audioElements[path].loop = loopAudio.value;
    audioElements[path].currentTime = 0;
    audioElements[path].play().then(updateNowPlaying).catch(updateNowPlaying);
    updateNowPlaying();
  }

  function stopAll() {
    Object.values(audioElements).forEach((aud) => {
      aud.pause();
      aud.currentTime = 0;
    });
    if (randomPlayTimeout) {
      clearTimeout(randomPlayTimeout);
      randomPlayTimeout = null;
    }
    updateNowPlaying();
  }

  function updateNowPlaying() {
    nowPlayingPaths.value = Object.entries(audioElements)
      .filter(([_, aud]) => !aud.paused)
      .map(([path]) => path);
  }

  const lastRandomPath = ref(null);

  const nowPlaying = computed(() => {
    return audioList.value
      .filter((audio) => nowPlayingPaths.value.includes(audio.path))
      .map((audio) => audio.displayName);
  });

  function playRandom() {
    if (!audioList.value.length) return;
    let idx = Math.floor(Math.random() * audioList.value.length);
    let chosen = audioList.value[idx];
    lastRandomPath.value = chosen.path;
    playAudio(chosen.path);
    updateNowPlaying();
  }

  function playCategory(category) {
    allowMultiple.value = true;
    const group = byCategory.value[category] || [];
    group.forEach((audio) => playAudio(audio.path));
  }

  watch(loopAudio, (val) => {
    if (!val) stopAll();
  });

  const slogan = ref("");
  async function fetchSlogan() {
    try {
      const res = await fetch("/slogan.json");
      const arr = await res.json();
      if (Array.isArray(arr) && arr.length > 0) {
        slogan.value = arr[Math.floor(Math.random() * arr.length)];
      } else {
        slogan.value = "";
      }
    } catch (e) {
      slogan.value = "";
    }
  }

  onMounted(() => {
    fetchSlogan();
    fetchLastModified();
    fetchFileCount();
  });

  return {
    byCategory,
    audioList,
    audioElements,
    visitorCount,
    allowMultiple,
    continueRandom,
    loopAudio,
    randomPlayTimeout,
    nowPlayingPaths,
    playAudio,
    stopAll,
    updateNowPlaying,
    lastRandomPath,
    nowPlaying,
    playRandom,
    playCategory,
    slogan,
    fileCount,
    lastModified,
    volume,
    setVolume,
  };
}
