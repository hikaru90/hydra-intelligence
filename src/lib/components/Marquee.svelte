<script lang="ts">
  import { m } from "$src/paraglide/messages.js";
</script>

<div
  class="bg-midnight text-yellow-200 rounded-full px-7 py-5 gap-2 whitespace-nowrap max-w-[200px] overflow-hidden relative"
>
  <div
    class="absolute left-4 top-0 w-6 h-full bg-gradient-to-r from-midnight to-midnight/0 z-10"
  ></div>
  <div class="relative overflow-hidden -mx-2">
    <div class="marquee">
      {m.chooseLocation()}
    </div>
  </div>
  <div
    class="absolute right-4 top-0 w-6 h-full bg-gradient-to-l from-midnight to-midnight/0 z-10"
  ></div>
</div>

<style lang="scss">
  .marquee {
    display: flex;
    animation: marquee 4s linear infinite;
  }

  @keyframes marquee {
    0% {
      opacity: 0;
      transform: translateX(0);
    }
    10% {
      opacity: 1;
      transform: translateX(0);
    }
    90% {
      opacity: 1;
      transform: translateX(-100%);
    }
    100% {
      opacity: 0;
      transform: translateX(-100%);
    }
  }
</style>
