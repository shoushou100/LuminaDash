<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { RealtimeItem } from '@/services/datasource/types'

const props = defineProps<{
  data: RealtimeItem[]
}>()

const option = computed(() => {
  const max = Math.max(...props.data.map((d) => d.value), 1)
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    grid: { left: 44, right: 20, top: 24, bottom: 40 },
    xAxis: {
      type: 'category',
      data: props.data.map((d) => d.region),
      axisLine: { lineStyle: { color: 'rgba(159,179,209,0.4)' } },
      axisLabel: { color: '#9fb3d1', rotate: 30 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLabel: { color: '#9fb3d1' },
    },
    visualMap: {
      show: false,
      min: 0,
      max,
      dimension: 1,
      inRange: { color: ['#4d8bff', '#36cfc9', '#ff5fa2'] },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (val: number[]) => 14 + (val[1] / max) * 26,
        data: props.data.map((d) => [d.region, d.value]),
        itemStyle: { shadowBlur: 12, shadowColor: 'rgba(77,139,255,0.6)' },
      },
    ],
  }
})
</script>

<template>
  <VChart class="chart" :option="option" autoresize />
</template>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
