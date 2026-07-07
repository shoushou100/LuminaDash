<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import autofit from 'autofit.js'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboard'
import { createLogger } from '@/core/logger'
import { env } from '@/core/config/env'
import ScreenContainer from '@/modules/layout/ScreenContainer.vue'
import PanelHeader from '@/modules/widgets/PanelHeader.vue'
import KpiCard from '@/modules/widgets/KpiCard.vue'
import ScreenshotToggle from '@/modules/widgets/ScreenshotToggle.vue'
import LineTrendChart from '@/modules/charts/LineTrendChart.vue'
import BarCategoryChart from '@/modules/charts/BarCategoryChart.vue'
import PieShareChart from '@/modules/charts/PieShareChart.vue'
import GaugeChart from '@/modules/charts/GaugeChart.vue'
import MapChart from '@/modules/charts/MapChart.vue'

const logger = createLogger('app')
const store = useDashboardStore()
const { kpis, trend, category, share, realtime, loading, lastUpdated } = storeToRefs(store)

const clock = ref('')
let clockTimer: number | undefined
let refreshTimer: number | undefined

const completionRate = computed(() => 86)

function tickClock(): void {
  clock.value = new Date().toLocaleTimeString('zh-CN')
}

onMounted(() => {
  logger.info('app mounted, init autofit + load data')
  autofit.init({
    designWidth: 1920,
    designHeight: 1080,
    renderDom: '#screen',
    resize: true,
  })
  tickClock()
  clockTimer = window.setInterval(tickClock, 1000)
  store.loadAll()
  refreshTimer = window.setInterval(() => store.tick(), env.refreshInterval)
})

onBeforeUnmount(() => {
  if (clockTimer) window.clearInterval(clockTimer)
  if (refreshTimer) window.clearInterval(refreshTimer)
})
</script>

<template>
  <ScreenContainer title="流光大屏 · LuminaDash">
    <template #top-left>
      <span>数据来源：Mock</span>
    </template>
    <template #top-right>
      <div class="top-right">
        <ScreenshotToggle />
        <span>{{ clock }} · 更新于 {{ lastUpdated || '—' }}</span>
      </div>
    </template>

    <div class="dashboard">
      <section class="dashboard__kpis">
        <div v-for="kpi in kpis" :key="kpi.id" class="dashboard__kpi">
          <KpiCard :kpi="kpi" />
        </div>
      </section>

      <section class="dashboard__charts">
        <PanelHeader title="实时趋势" class="span-2">
          <template #header>{{ loading ? '加载中…' : 'OK' }}</template>
          <LineTrendChart :data="trend" />
        </PanelHeader>

        <PanelHeader title="区域对比">
          <BarCategoryChart :data="category" />
        </PanelHeader>

        <PanelHeader title="渠道占比">
          <PieShareChart :data="share" />
        </PanelHeader>

        <PanelHeader title="目标完成率">
          <GaugeChart :value="completionRate" title="完成率" />
        </PanelHeader>

        <PanelHeader title="区域分布">
          <MapChart :data="realtime" />
        </PanelHeader>
      </section>
    </div>
  </ScreenContainer>
</template>

<style scoped>
.top-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 24px;
}

.dashboard__kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  height: 110px;
}

.dashboard__kpi {
  height: 100%;
}

.dashboard__charts {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1.2fr 1fr 1fr;
  gap: 24px;
}

.dashboard__charts :deep(.span-2) {
  grid-column: span 2;
}
</style>
