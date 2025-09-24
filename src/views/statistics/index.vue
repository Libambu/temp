<template>
  <div class="container">
    <div class="grid-container">
      <v-chart class="chart top-left" :option="option" autoresize />
      <v-chart class="chart top-right" :option="option4" autoresize />
      <v-chart class="chart bottom-left" :option="option3" autoresize />
      <v-chart class="chart bottom-right" :option="option2" autoresize />
    </div>
  </div>
</template>

<script>

import { ref, onMounted } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { PieChart } from 'echarts/charts'
import VChart from 'vue-echarts'

/* 2. 注册 echarts 组件 */
echarts.use([LineChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer,BarChart,PieChart])

/* 单 <script> 写法：使用普通 <script> 导出配置 */
export default {
  name: 'StatisticsIndex', // 多单词，ESLint 通过
  components: { VChart: () => import('vue-echarts') },
  data() {
    const palette = ['#6D9EFF', '#A5D9FF', '#FFD6A5', '#FF9A9E', '#FECFEF', '#C7CEEA']
    return {
// 1. 近 10 天营销量（折线 + 面积）
      option : {
        backgroundColor: 'transparent',
        textStyle: { fontFamily: 'MiSans, sans-serif', color: '#414a5a' },
        title: { text: '近 10 天营销量', left: 'center', textStyle: { fontSize: 16, fontWeight: 'normal' } },
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,.95)', borderColor: '#ddd', borderWidth: 1, textStyle: { color: '#333' } },
        grid: { left: 50, right: 30, top: 60, bottom: 50 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: { lineStyle: { color: '#e5e5e5' } },
          axisLabel: { color: '#777' }
        },
        yAxis: {
          type: 'value',
          name: '个数',
          nameTextStyle: { color: '#777', padding: [0, 30, 0, 0] },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: '#f2f2f2' } },
          axisLabel: { color: '#777' }
        },
        series: [{
          name: '营收',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: { color: palette[0] },
          lineStyle: { width: 3, shadowColor: 'rgba(109,158,255,.3)', shadowBlur: 10 },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(109,158,255,.25)' }, { offset: 1, color: 'rgba(109,158,255,0)' }]) },
          emphasis: { focus: 'series' },
          data: []
        }]
      },

      option2: {
        backgroundColor: 'transparent',
        textStyle: { fontFamily: 'MiSans, sans-serif', color: '#414a5a' },
        title: { text: '近 10 天销售额', left: 'center', textStyle: { fontSize: 16, fontWeight: 'normal' } },
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,.95)', borderColor: '#ddd', borderWidth: 1, textStyle: { color: '#333' } },
        grid: { left: 50, right: 30, top: 60, bottom: 50 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: { lineStyle: { color: '#e5e5e5' } },
          axisLabel: { color: '#777' }
        },
        yAxis: {
          type: 'value',
          name: '金额（元）',
          nameTextStyle: { color: '#777', padding: [0, 30, 0, 0] },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: '#f2f2f2' } },
          axisLabel: { color: '#777' }
        },
        series: [{
          name: '营收',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: { color: palette[0] },
          lineStyle: { width: 3, shadowColor: 'rgba(109,158,255,.3)', shadowBlur: 10 },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(109,158,255,.25)' }, { offset: 1, color: 'rgba(109,158,255,0)' }]) },
          emphasis: { focus: 'series' },
          data: []
        }]
      },
      option3: {
        backgroundColor: 'transparent',
        textStyle: { fontFamily: 'MiSans, sans-serif', color: '#414a5a' },
        title: { text: '食品 Top10', left: 'center', textStyle: { fontSize: 16, fontWeight: 'normal' } },
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,.95)', borderColor: '#ddd', textStyle: { color: '#333' } },
        grid: { left: 50, right: 30, top: 60, bottom: 50 },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: { lineStyle: { color: '#e5e5e5' } },
          axisLabel: { rotate: 20, color: '#777' }
        },
        yAxis: {
          type: 'value',
          name: '销售量',
          nameTextStyle: { color: '#777', padding: [0, 30, 0, 0] },
          axisLine: { show: false },
          splitLine: { lineStyle: { color: '#f2f2f2' } },
          axisLabel: { color: '#777' }
        },
        series: [{
          name: '销售量',
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: palette[2] }, { offset: 1, color: palette[3] }])
          },
          label: { show: true, position: 'top', color: '#666', fontSize: 12 },
          data: []
        }]
      },

      option4: {
        backgroundColor: 'transparent',
        textStyle: { fontFamily: 'MiSans, sans-serif', color: '#414a5a' },
        title: { text: '菜品销量占比', left: 'center', textStyle: { fontSize: 16, fontWeight: 'normal' } },
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)', backgroundColor: 'rgba(255,255,255,.95)', borderColor: '#ddd', textStyle: { color: '#333' } },
        legend: { orient: 'vertical', left: 'left', top: 'center', textStyle: { color: '#777' } },
        series: [{
          name: '销量',
          type: 'pie',
          radius: ['30%', '80%'],
          center: ['55%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
          label: { show: true, formatter: '{b}占比{d}%', fontSize: 12, color: '#666' },
          emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
          color: palette,
          data: []
        }]
      }
    }
  },
  methods: {
    async loadData() {
      try {
        const { data: raw } = await axios.get('/elm/admin/statistics/dailyRevenue', {
          headers: { adminToken: localStorage.getItem('adminToken') }
        })
        const xData = raw.map(item => item.data)
        const yData = raw.map(item => parseFloat(item.num) || 0)
        // 响应式更新
        this.option.xAxis.data = xData
        this.option.series[0].data = yData
      } catch (e) {
        console.error('加载统计失败', e)
      }
    },

    async loadData2() {
      try {
        const { data: raw } = await axios.get('/elm/admin/statistics/dailyProfit', {
          headers: { adminToken: localStorage.getItem('adminToken') }
        })
        const xData = raw.map(item => item.data)
        const yData = raw.map(item => parseFloat(item.num) || 0)
        // 响应式更新
        this.option2.xAxis.data = xData
        this.option2.series[0].data = yData
      } catch (e) {
        console.error('加载统计失败', e)
      }
    },

    async loadData3() {
      try {
        const { data: raw } = await axios.get('/elm/admin/statistics/top10', {
          headers: { adminToken: localStorage.getItem('adminToken') }
        })
        const xData = raw.map(item => item.food)
        const yData = raw.map(item => parseFloat(item.num) || 0)
        // 响应式更新
        this.option3.xAxis.data = xData
        this.option3.series[0].data = yData
      } catch (e) {
        console.error('加载统计失败', e)
      }
    },

    async loadData4() {
      try {
        const { data: raw } = await axios.get('/elm/admin/statistics/dailyCagetory', {
          headers: { adminToken: localStorage.getItem('adminToken') }
        })
        const pieData = raw.map(item => ({ name: item.category, value: item.num }))
        this.option4.series[0].data = pieData
      } catch (e) {
        console.error('加载菜品占比失败', e)
      }
    }
  },
  mounted() {
    this.loadData()
    this.loadData2()
    this.loadData3()
    this.loadData4()
  }
}
</script>

<style scoped>

  .container{
    width: auto;
    height: 555px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    padding: 10px;
}
  .statistics-index {
    padding: 20px;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 3px;
    height: 90%; /* 占满整个视口高度 */
    padding-top: 20px;
  }

  .chart {
    width: 100%;
    height: 100%;
  }

  .top-left {
    grid-column: 1;
    grid-row: 1;
  }

  .top-right {
    grid-column: 2;
    grid-row: 1;
  }

  .bottom-left {
    grid-column: 1;
    grid-row: 2;
  }

  .bottom-right {
    grid-column: 2;
    grid-row: 2;
  }


</style>