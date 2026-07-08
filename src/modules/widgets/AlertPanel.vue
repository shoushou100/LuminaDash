<script setup lang="ts">
import { computed } from 'vue'
import type { AlertItem, AlertLevel } from '@/services/datasource/types'

const props = defineProps<{
  alerts: AlertItem[]
  title?: string
}>()

const levelText: Record<AlertLevel, string> = {
  normal: '正常',
  warning: '预警',
  danger: '严重',
}

const activeCount = computed(
  () => props.alerts.filter((a) => a.status === 'active').length,
)
</script>

<template>
  <section class="alerts">
    <header class="alerts__header">
      <span class="alerts__bar" />
      <h3 class="alerts__title">{{ props.title || '实时监控预警' }}</h3>
      <span class="alerts__count">{{ activeCount }} 条活动</span>
    </header>
    <ul class="alerts__list">
      <li
        v-for="alert in alerts"
        :key="alert.id"
        class="alerts__item"
        :class="`is-${alert.level}`"
      >
        <span class="alerts__dot" />
        <div class="alerts__body">
          <div class="alerts__row">
            <span class="alerts__name">{{ alert.title }}</span>
            <span class="alerts__level">{{ levelText[alert.level] }}</span>
          </div>
          <div class="alerts__meta">
            {{ alert.metric }}：{{ alert.value }} / 阈值 {{ alert.threshold }} · {{ alert.time }}
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.alerts {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px 18px;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.alerts__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.alerts__bar {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: var(--accent);
}

.alerts__title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0;
  color: var(--text-0);
}

.alerts__count {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-1);
}

.alerts__list {
  list-style: none;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.alerts__item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid var(--text-1);
}

.alerts__item.is-normal {
  border-left-color: var(--accent);
}

.alerts__item.is-warning {
  border-left-color: var(--warn);
}

.alerts__item.is-danger {
  border-left-color: var(--negative);
}

.alerts__dot {
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--text-1);
  flex-shrink: 0;
}

.alerts__item.is-normal .alerts__dot {
  background: var(--accent);
}

.alerts__item.is-warning .alerts__dot {
  background: var(--warn);
}

.alerts__item.is-danger .alerts__dot {
  background: var(--negative);
}

.alerts__body {
  flex: 1;
  min-width: 0;
}

.alerts__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.alerts__name {
  font-size: 14px;
  color: var(--text-0);
}

.alerts__level {
  font-size: 12px;
  padding: 1px 8px;
  border-radius: 999px;
  color: var(--text-1);
  background: rgba(255, 255, 255, 0.06);
}

.alerts__item.is-normal .alerts__level {
  color: var(--accent);
}

.alerts__item.is-warning .alerts__level {
  color: var(--warn);
}

.alerts__item.is-danger .alerts__level {
  color: var(--negative);
}

.alerts__meta {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-1);
}
</style>
