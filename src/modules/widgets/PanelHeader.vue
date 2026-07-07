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
  padding: 16px 18px;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.panel__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.panel__bar {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: var(--accent);
}

.panel__title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0;
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
