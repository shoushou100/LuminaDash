import { clamp } from '@/core/utils'

export function useKpiAnim() {
  function animate(target: number, onUpdate: (value: number) => void, duration = 900): void {
    const start = performance.now()
    const from = 0
    function frame(now: number): void {
      const progress = clamp((now - start) / duration, 0, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      onUpdate(from + (target - from) * eased)
      if (progress < 1) {
        requestAnimationFrame(frame)
      }
    }
    requestAnimationFrame(frame)
  }

  return { animate }
}
