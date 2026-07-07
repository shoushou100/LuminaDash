<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <section class="panel">
    <header v-if="title || $slots.header" class="panel__header">
      <span class="panel__bar" />
      <h3 class="panel__title">{{ title }}</h3>
      <div class="panel__extra">
        <slot name="header" />
      </div>
    </header>
    <div class="panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.panel {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 14px 16px;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: 10px;
  backdrop-filter: blur(6px);
  box-shadow: var(--glow-blue);
  overflow: hidden;
}

.panel::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  padding: 1px;
  background: var(--gradient-neon);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.35;
  pointer-events: none;
}

.panel__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.panel__bar {
  width: 4px;
  height: 16px;
  border-radius: 2px;
  background: var(--gradient-neon);
}

.panel__title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--text-0);
}

.panel__extra {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-1);
}

.panel__body {
  position: relative;
  flex: 1;
  min-height: 0;
}
</style>
