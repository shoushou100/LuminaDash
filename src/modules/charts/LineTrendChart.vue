<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { TrendPoint } from '@/services/datasource/types'

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
    axisLine: { lineStyle: { color: 'rgba(159,179,209,0.4)' } },
    axisLabel: { color: '#9fb3d1' },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    axisLabel: { color: '#9fb3d1' },
  },
  series: [
    {
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: props.data.map((d) => d.value),
      lineStyle: { color: '#36cfc9', width: 3 },
      itemStyle: { color: '#36cfc9' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(54,207,201,0.45)' },
            { offset: 1, color: 'rgba(54,207,201,0.02)' },
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
