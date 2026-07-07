<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { ShareItem } from '@/services/datasource/types'
import { CHART } from '@/core/config/chart'

const props = defineProps<{
  data: ShareItem[]
}>()

const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: {
    bottom: 0,
    textStyle: { color: CHART.textSecondary },
  },
  series: [
    {
      type: 'pie',
      radius: ['42%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderColor: '#0f1115',
        borderWidth: 2,
      },
      label: { color: CHART.textPrimary },
      data: props.data.map((d, i) => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: CHART.palette[i % CHART.palette.length] },
      })),
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
