<script setup lang="ts">
import { onMounted, ref } from 'vue'

const running = ref(false)
const loading = ref(false)

async function loadStatus(): Promise<void> {
  try {
    const res = await fetch('/api/screenshot/status')
    const data = (await res.json()) as { running: boolean }
    running.value = data.running
  } catch {
    /* endpoint unavailable */
  }
}

async function toggle(): Promise<void> {
  if (loading.value) return
  loading.value = true
  const target = !running.value
  try {
    const res = await fetch(`/api/screenshot/${target ? 'start' : 'stop'}`, {
      method: 'POST',
    })
    const data = (await res.json()) as { running: boolean }
    running.value = data.running
  } catch (error) {
    console.error('screenshot toggle failed', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadStatus)
</script>

<template>
  <label class="shot-toggle" :class="{ 'is-on': running }">
    <span class="shot-toggle__label">截图模式</span>
    <button
      type="button"
      class="shot-toggle__switch"
      role="switch"
      :aria-checked="running"
      :disabled="loading"
      @click="toggle"
    >
      <span class="shot-toggle__thumb" />
    </button>
  </label>
</template>

<style scoped>
.shot-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-1);
  user-select: none;
  cursor: pointer;
}

.shot-toggle.is-on {
  color: var(--text-0);
}

.shot-toggle__switch {
  position: relative;
  width: 36px;
  height: 20px;
  border: 1px solid var(--panel-border);
  border-radius: 999px;
  background: var(--panel-bg);
  padding: 0;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;
}

.shot-toggle.is-on .shot-toggle__switch {
  background: var(--accent);
  border-color: var(--accent);
}

.shot-toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--text-1);
  transition:
    transform 0.2s,
    background 0.2s;
}

.shot-toggle.is-on .shot-toggle__thumb {
  transform: translateX(16px);
  background: #fff;
}
</style>
