import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KpiCard from '@/modules/widgets/KpiCard.vue'
import PanelHeader from '@/modules/widgets/PanelHeader.vue'
import type { CoreMetric } from '@/services/datasource/types'

describe('widgets render', () => {
  const kpi: CoreMetric = {
    id: 'capacity',
    name: '实时产能',
    value: 1280,
    unit: '件/分',
    delta: 3.2,
    status: 'normal',
  }

  it('KpiCard renders name and unit', () => {
    const wrapper = mount(KpiCard, { props: { kpi } })
    expect(wrapper.text()).toContain('实时产能')
    expect(wrapper.text()).toContain('件/分')
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
