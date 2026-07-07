import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KpiCard from '@/modules/widgets/KpiCard.vue'
import PanelHeader from '@/modules/widgets/PanelHeader.vue'
import type { Kpi } from '@/services/datasource/types'

describe('widgets render', () => {
  const kpi: Kpi = { id: 'uv', label: '今日访客', value: 18452, unit: '人', delta: 12.4 }

  it('KpiCard renders label and unit', () => {
    const wrapper = mount(KpiCard, { props: { kpi } })
    expect(wrapper.text()).toContain('今日访客')
    expect(wrapper.text()).toContain('人')
    expect(wrapper.text()).toContain('▲')
  })

  it('KpiCard shows down arrow for negative delta', () => {
    const wrapper = mount(KpiCard, {
      props: { kpi: { ...kpi, delta: -2.3 } },
    })
    expect(wrapper.text()).toContain('▼')
  })

  it('PanelHeader renders title and slot content', () => {
    const wrapper = mount(PanelHeader, {
      props: { title: '测试面板' },
      slots: { default: '<div class="inside">chart</div>' },
    })
    expect(wrapper.text()).toContain('测试面板')
    expect(wrapper.find('.inside').exists()).toBe(true)
  })
})
