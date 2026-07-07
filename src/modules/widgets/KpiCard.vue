<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Kpi } from '@/services/datasource/types'
import { useKpiAnim } from './useKpiAnim'

const props = defineProps<{
  kpi: Kpi
}>()

const display = ref(0)
const { animate } = useKpiAnim()

const formatted = computed(() => {
  if (props.kpi.unit === '%') {
    return `${display.value.toFixed(1)}%`
  }
  return display.value.toLocaleString('zh-CN')
})

const isUp = computed(() => props.kpi.delta >= 0)

function run(): void {
  animate(props.kpi.value, (value) => {
    display.value = value
  })
}

onMounted(run)
watch(
  () => props.kpi.value,
  () => run(),
)
</script>

<template>
  <div class="kpi">
    <div class="kpi__label">{{ kpi.label }}</div>
    <div class="kpi__value">
      {{ formatted }}<span class="kpi__unit">{{ kpi.unit === '%' ? '' : kpi.unit }}</span>
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
  padding: 12px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(54, 207, 201, 0.12), rgba(77, 139, 255, 0.08));
  border: 1px solid var(--panel-border);
}

.kpi__label {
  font-size: 13px;
  color: var(--text-1);
}

.kpi__value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-0);
  text-shadow: var(--glow-blue);
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
  color: var(--neon-cyan);
}

.kpi__delta.is-down {
  color: var(--neon-pink);
}
</style>
