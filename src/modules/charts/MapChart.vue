<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { RealtimeItem } from '@/services/datasource/types'
import { CHART } from '@/core/config/chart'

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
      axisLine: { lineStyle: { color: CHART.axisLine } },
      axisLabel: { color: CHART.textSecondary, rotate: 30 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: CHART.splitLine } },
      axisLabel: { color: CHART.textSecondary },
    },
    visualMap: {
      show: false,
      min: 0,
      max,
      dimension: 1,
      inRange: { color: ['#1e293b', CHART.accentSoft, CHART.accent] },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (val: number[]) => 14 + (val[1] / max) * 26,
        data: props.data.map((d) => [d.region, d.value]),
        itemStyle: { color: CHART.accent },
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
