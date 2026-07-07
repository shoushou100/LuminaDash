<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div id="screen" class="screen">
    <header class="screen__top">
      <div class="screen__side screen__side--left">
        <slot name="top-left" />
      </div>
      <h1 class="screen__title">{{ title || 'LuminaDash' }}</h1>
      <div class="screen__side screen__side--right">
        <slot name="top-right" />
      </div>
    </header>
    <main class="screen__body">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.screen {
  position: relative;
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  padding: 28px 40px 36px;
  transform-origin: left top;
}

.screen__top {
  position: relative;
  display: flex;
  align-items: center;
  height: 64px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--panel-border);
}

.screen__title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--text-0);
}

.screen__side {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--text-1);
}

.screen__side--right {
  justify-content: flex-end;
}

.screen__body {
  flex: 1;
  min-height: 0;
}
</style>
