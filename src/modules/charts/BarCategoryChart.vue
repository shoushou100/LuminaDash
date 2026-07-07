<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { CategoryItem } from '@/services/datasource/types'
import { CHART } from '@/core/config/chart'

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
      type: 'bar',
      data: props.data.map((d) => d.value),
      barWidth: '46%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: CHART.accent,
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
