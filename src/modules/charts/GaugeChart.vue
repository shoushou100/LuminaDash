<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'

const props = defineProps<{
  value: number
  title?: string
}>()

const option = computed(() => ({
  backgroundColor: 'transparent',
  series: [
    {
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max: 100,
      radius: '90%',
      progress: {
        show: true,
        width: 14,
        itemStyle: { color: '#36cfc9' },
      },
      axisLine: {
        lineStyle: {
          width: 14,
          color: [[1, 'rgba(255,255,255,0.12)']],
        },
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer: {
        length: '60%',
        width: 4,
        itemStyle: { color: '#4d8bff' },
      },
      anchor: { show: true, size: 10, itemStyle: { color: '#4d8bff' } },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        color: '#eaf2ff',
        fontSize: 26,
        offsetCenter: [0, '40%'],
      },
      title: {
        show: true,
        offsetCenter: [0, '75%'],
        color: '#9fb3d1',
        fontSize: 13,
      },
      data: [{ value: Math.round(props.value), name: props.title || '完成率' }],
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
