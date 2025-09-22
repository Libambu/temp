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
    return {
      option: {
        title: { text: '近 10 天营销量', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value', name: '个数' ,interval: 1, minInterval: 1},
        series: [
          {
            name: '营收',
            type: 'line',
            smooth: true,
            data: [],
            emphasis: { focus: 'series' }
          }
        ]
      },
      option2: {
        title: { text: '近 10 天销售额', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value', name: '金额（元）' },
        series: [
          {
            name: '销售额',
            type: 'line',
            smooth: true,
            data: [],
            emphasis: { focus: 'series' }
          }
        ]
      },
      option3: {
        title: { text: '食品top10', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value', name: '销售量',interval: 1, minInterval: 1},
        series: [
          {
            name: '销售额',
            type: 'bar',
            smooth: true,
            data: [],
            emphasis: { focus: 'series' }
          }
        ]
      },

      option4: {
        title: { text: '菜品销量占比', left: 'center' },
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
          {
            name: '销量',
            type: 'pie',
            radius: '50%',
            data: [], // 稍后填充
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
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
    height: 710px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    padding: 20px;
}

  .statistics-index {
    padding: 20px;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 3px;
    height: 100%; /* 占满整个视口高度 */
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