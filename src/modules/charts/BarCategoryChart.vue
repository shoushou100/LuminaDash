<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { CategoryItem } from '@/services/datasource/types'

const props = defineProps<{
  data: CategoryItem[]
}>()

const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 44, right: 20, top: 24, bottom: 28 },
  xAxis: {
    type: 'category',
    data: props.data.map((d) => d.name),
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
      type: 'bar',
      data: props.data.map((d) => d.value),
      barWidth: '46%',
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#9b6bff' },
            { offset: 1, color: '#4d8bff' },
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
