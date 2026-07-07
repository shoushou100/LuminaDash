<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { ShareItem } from '@/services/datasource/types'

const props = defineProps<{
  data: ShareItem[]
}>()

const palette = ['#36cfc9', '#4d8bff', '#9b6bff', '#ff5fa2', '#ffd666']

const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: {
    bottom: 0,
    textStyle: { color: '#9fb3d1' },
  },
  series: [
    {
      type: 'pie',
      radius: ['42%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderColor: 'rgba(6,10,24,0.8)',
        borderWidth: 2,
      },
      label: { color: '#eaf2ff' },
      data: props.data.map((d, i) => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: palette[i % palette.length] },
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
