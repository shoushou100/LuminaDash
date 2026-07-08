import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')
const DATA_DIR = 'C:\\LuminaDash\\data'
const OUT_DIR = join(PROJECT_ROOT, 'src', 'data')

function readTSV(file) {
  const text = readFileSync(join(DATA_DIR, file), 'utf8')
  const lines = text.split(/\r?\n/).filter(Boolean)
  const headers = lines[0].split('\t')
  return lines.slice(1).map((l) => {
    const vals = l.split('\t')
    const obj = {}
    headers.forEach((h, i) => (obj[h] = vals[i]))
    return obj
  })
}

function writeJSON(file, data) {
  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(join(OUT_DIR, file), JSON.stringify(data, null, 2) + '\n')
}

const pref = readTSV('pref_tsar.dat')
const disk = readTSV('disk_tsar.dat')
const hosts = readTSV('host_detail.dat')
const mods = readTSV('mod_detail.dat')

const modMap = new Map(mods.map((m) => [m.mod, m]))
const hostMap = new Map(hosts.map((h) => [h.hostid, h]))

const timestamps = [...new Set(pref.map((r) => r.ts))].sort((a, b) => Number(a) - Number(b))
const latestTs = timestamps[timestamps.length - 1]
const firstTs = timestamps[0]

function fmtTime(ts) {
  const d = new Date(Number(ts))
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function avg(arr) {
  if (!arr.length) return 0
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

function latestByMod(rows, mod) {
  const row = rows.filter((r) => r.mod === mod).sort((a, b) => Number(b.ts) - Number(a.ts))[0]
  return row ? Number(row.value) : 0
}

// ---- core.json ----
const cpuUsage = latestByMod(pref, 'cpu_usage')
const memUsed = latestByMod(pref, 'mem_used')
const memFree = latestByMod(pref, 'mem_free')
const memTotal = memUsed + memFree
const memUsage = memTotal ? Math.round((memUsed / memTotal) * 1000) / 10 : 0
const diskUtil = latestByMod(disk, 'sda_util')
const netIn = latestByMod(pref, 'net_in')
const netOut = latestByMod(pref, 'net_out')

const core = [
  {
    name: 'CPU 使用率',
    value: Math.round(cpuUsage * 10) / 10,
    unit: '%',
    delta: 2.3,
    threshold: 80,
    status: cpuUsage > 80 ? 'danger' : cpuUsage > 60 ? 'warning' : 'normal',
  },
  {
    name: '内存使用率',
    value: memUsage,
    unit: '%',
    delta: -1.2,
    threshold: 85,
    status: memUsage > 85 ? 'danger' : memUsage > 70 ? 'warning' : 'normal',
  },
  {
    name: '磁盘利用率',
    value: Math.round(diskUtil * 10) / 10,
    unit: '%',
    delta: 5.4,
    threshold: 90,
    status: diskUtil > 90 ? 'danger' : diskUtil > 75 ? 'warning' : 'normal',
  },
  {
    name: '网络入速',
    value: Math.round(netIn * 100) / 100,
    unit: 'Mb/s',
    delta: -3.1,
    threshold: 1000,
    status: 'normal',
  },
]
writeJSON('core.json', core)

// ---- trend.json (system-wide averages per timestamp) ----
const trend = timestamps.map((ts) => {
  const rows = pref.filter((r) => r.ts === ts)
  const cpu = avg(rows.filter((r) => r.mod === 'cpu_usage').map((r) => Number(r.value)))
  return { time: fmtTime(ts), value: Math.round(cpu * 10) / 10 }
})
writeJSON('trend.json', trend)

// ---- hosts.json (latest snapshot per host) ----
const latestPref = pref.filter((r) => r.ts === latestTs)
const latestDiskRows = disk.filter((r) => r.ts === latestTs)

const hostCpu = new Map()
const hostMem = new Map()
const hostDisk = new Map()
const hostNet = new Map()

latestPref.forEach((r) => {
  const h = r.hostid
  if (r.mod === 'cpu_usage') hostCpu.set(h, Number(r.value))
  if (r.mod === 'mem_used') {
    const memFreeRow = latestPref.find((x) => x.hostid === h && x.mod === 'mem_free')
    const used = Number(r.value)
    const free = memFreeRow ? Number(memFreeRow.value) : 0
    const total = used + free
    hostMem.set(h, total ? Math.round((used / total) * 1000) / 10 : 0)
  }
  if (r.mod === 'net_in') hostNet.set(h, Number(r.value))
})
latestDiskRows.forEach((r) => {
  if (r.mod === 'sda_util') hostDisk.set(r.hostid, Number(r.value))
})

const allHosts = [...new Set([...hostCpu.keys(), ...hostDisk.keys()])].sort()
const hostsJson = allHosts.map((h) => {
  const info = hostMap.get(h)
  const label = info ? info.hostname.replace('.hismartlab.cn', '') : h
  const cpu = hostCpu.get(h) || 0
  return {
    name: label,
    value: Math.round(cpu * 10) / 10,
    host: h,
    cpu,
    mem: hostMem.get(h) || 0,
    disk: hostDisk.get(h) || 0,
    net: hostNet.get(h) || 0,
  }
})
writeJSON('hosts.json', hostsJson)

// ---- alerts.json ----
const alerts = []

hostsJson.forEach((h) => {
  if (h.cpu > 80) {
    alerts.push({
      id: `cpu-${h.host}`,
      level: 'danger',
      title: `${h.name} CPU 使用率过高`,
      metric: 'CPU',
      value: Math.round(h.cpu * 10) / 10,
      threshold: 80,
      time: fmtTime(latestTs),
      status: 'active',
    })
  } else if (h.cpu > 60) {
    alerts.push({
      id: `cpu-${h.host}`,
      level: 'warning',
      title: `${h.name} CPU 使用率偏高`,
      metric: 'CPU',
      value: Math.round(h.cpu * 10) / 10,
      threshold: 60,
      time: fmtTime(latestTs),
      status: 'active',
    })
  }

  if (h.disk > 85) {
    alerts.push({
      id: `disk-${h.host}`,
      level: 'danger',
      title: `${h.name} 磁盘利用率过高`,
      metric: '磁盘',
      value: Math.round(h.disk * 10) / 10,
      threshold: 85,
      time: fmtTime(latestTs),
      status: 'active',
    })
  } else if (h.disk > 70) {
    alerts.push({
      id: `disk-${h.host}`,
      level: 'warning',
      title: `${h.name} 磁盘利用率偏高`,
      metric: '磁盘',
      value: Math.round(h.disk * 10) / 10,
      threshold: 70,
      time: fmtTime(latestTs),
      status: 'active',
    })
  }

  if (h.mem > 85) {
    alerts.push({
      id: `mem-${h.host}`,
      level: 'danger',
      title: `${h.name} 内存使用率过高`,
      metric: '内存',
      value: Math.round(h.mem * 10) / 10,
      threshold: 85,
      time: fmtTime(latestTs),
      status: 'active',
    })
  }
})

alerts.sort((a, b) => (a.level === 'danger' ? -1 : 1))
writeJSON('alerts.json', alerts)

console.log('Generated:')
console.log('  core.json:', core.length, 'metrics')
console.log('  trend.json:', trend.length, 'points')
console.log('  hosts.json:', hostsJson.length, 'hosts')
console.log('  alerts.json:', alerts.length, 'alerts')
