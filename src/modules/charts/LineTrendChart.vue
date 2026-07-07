<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { TrendPoint } from '@/services/datasource/types'
import { CHART } from '@/core/config/chart'

const props = defineProps<{
  data: TrendPoint[]
}>()

const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  grid: { left: 44, right: 20, top: 24, bottom: 28 },
  xAxis: {
    type: 'category',
    data: props.data.map((d) => d.time),
    axisLine: { lineStyle: { color: CHART.axisLine } },
    axisLabel: { color: CHART.textSecondary },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: CHART.splitLine } },
    axisLabel: { color: CHART.textSecondary },
  },
  series: [
    {
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      data: props.data.map((d) => d.value),
      lineStyle: { color: CHART.accent, width: 2 },
      itemStyle: { color: CHART.accent },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.18)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.01)' },
          ],
        },
      },
    },
  ],
}))
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
