<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { CoreMetric } from '@/services/datasource/types'
import { useKpiAnim } from './useKpiAnim'

const props = defineProps<{
  kpi: CoreMetric
}>()

const display = ref(0)
const { animate } = useKpiAnim()

const isUp = computed(() => props.kpi.delta >= 0)

const cells = computed(() => {
  const text =
    props.kpi.unit === '%'
      ? display.value.toFixed(1)
      : Math.round(display.value).toLocaleString('zh-CN')
  return [...text].map((char) => ({
    char,
    digit: char >= '0' && char <= '9' ? Number(char) : null,
  }))
})

function run(): void {
  animate(props.kpi.value, (value) => {
    display.value = value
  })
}

onMounted(run)
watch(
  () => props.kpi.value,
  (value) => {
    display.value = value
  },
)
</script>

<template>
    <div class="kpi" :class="kpi.status ? `is-${kpi.status}` : ''">
      <div class="kpi__label">
        <span v-if="kpi.status" class="kpi__dot" />
        {{ kpi.name }}
      </div>
      <div class="kpi__value">
      <span
        v-for="(cell, index) in cells"
        :key="index"
        class="kpi__digit"
        :class="{ 'kpi__digit--static': cell.digit === null }"
      >
        <span
          v-if="cell.digit !== null"
          class="kpi__reel"
          :style="{ transform: `translateY(-${cell.digit}em)` }"
        >
          <span v-for="n in 10" :key="n" class="kpi__num">{{ n - 1 }}</span>
        </span>
        <template v-else>{{ cell.char }}</template>
      </span>
      <span class="kpi__unit">{{ kpi.unit === '%' ? '' : kpi.unit }}</span>
    </div>
    <div class="kpi__delta" :class="isUp ? 'is-up' : 'is-down'">
      <span>{{ isUp ? '▲' : '▼' }}</span>
      {{ Math.abs(kpi.delta).toFixed(1) }}%
    </div>
  </div>
</template>

<style scoped>
.kpi {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  height: 100%;
  padding: 14px 18px;
  border-radius: var(--radius);
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
}

.kpi__label {
  font-size: 13px;
  color: var(--text-1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.kpi__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--text-1);
  flex-shrink: 0;
}

.kpi.is-normal .kpi__dot {
  background: var(--accent);
}

.kpi.is-warning .kpi__dot {
  background: var(--warn);
}

.kpi.is-danger .kpi__dot {
  background: var(--negative);
}

.kpi__value {
  display: inline-flex;
  align-items: baseline;
  font-size: 28px;
  font-weight: 600;
  line-height: 1;
  color: var(--text-0);
}

.kpi__digit {
  display: inline-block;
  height: 1em;
  overflow: hidden;
  vertical-align: bottom;
}

.kpi__digit--static {
  overflow: visible;
}

.kpi__reel {
  display: flex;
  flex-direction: column;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.kpi__num {
  height: 1em;
  line-height: 1;
}

.kpi__unit {
  margin-left: 4px;
  font-size: 14px;
  color: var(--text-1);
}

.kpi__delta {
  font-size: 13px;
}

.kpi__delta.is-up {
  color: var(--accent);
}

.kpi__delta.is-down {
  color: var(--negative);
}
</style>
