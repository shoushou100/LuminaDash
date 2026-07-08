<script setup lang="ts">
import type { CategoryItem, DashboardBlock } from '@/services/datasource/types'
import BarCategoryChart from '@/modules/charts/BarCategoryChart.vue'

defineProps<{
  blocks: DashboardBlock[]
  title?: string
}>()
</script>

<template>
  <section class="compare">
    <header class="compare__header">
      <span class="compare__bar" />
      <h3 class="compare__title">{{ title || '数据对比' }}</h3>
    </header>
    <div class="compare__items">
      <div v-for="block in blocks" :key="block.file" class="compare__item">
        <div class="compare__item-title">{{ block.title }}</div>
        <BarCategoryChart :data="block.data as CategoryItem[]" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.compare {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px 18px;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.compare__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.compare__bar {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: var(--accent);
}

.compare__title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0;
  color: var(--text-0);
}

.compare__items {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  overflow-y: auto;
}

.compare__item {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.compare__item-title {
  font-size: 13px;
  color: var(--text-1);
  margin-bottom: 6px;
}

.compare__item :deep(.chart) {
  width: 100%;
  height: 220px;
}
</style>
