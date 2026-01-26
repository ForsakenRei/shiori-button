import { ref, onMounted, onBeforeUnmount } from "vue";

export function backTop() {
  const showTopButton = ref(false);
  const hovering = ref(false);

  const handleScroll = () => {
    showTopButton.value = window.scrollY > 200;
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  onMounted(() => {
    window.addEventListener("scroll", handleScroll);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  return {
    showTopButton,
    hovering,
    scrollToTop,
  };
}
