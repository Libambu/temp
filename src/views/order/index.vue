<template>
    <div class="container">
        <div class="head">
            <el-menu 
                :default-active="orderType" 
                class="el-menu-demo" 
                mode="horizontal" 
                background-color="#409EFF"
                text-color="#fff"
                active-text-color="#ffd04b">
                <el-menu-item index="1" @click="orderQuary()">全部</el-menu-item>
                <el-menu-item index="2" @click="orderQuary()">未接单</el-menu-item>
                <el-menu-item index="3" @click="orderQuary()">待配送</el-menu-item>
                <el-menu-item index="4" @click="orderQuary()">已完成</el-menu-item>
                <el-menu-item index="5" @click="orderQuary()">已拒绝</el-menu-item>
            </el-menu>
        </div>
        <div class="body">
            <el-table :data="records" stripe show-summary height="620px" >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="商品名称">
                            <span>{{ props.row.name }}</span>
                        </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    label="序号"
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column
                    label="订单编号"
                    prop="id"
                    width="200">
                </el-table-column>
                <el-table-column
                    label="创建日期"
                    prop="date"
                    width="200">
                </el-table-column>
                <el-table-column
                    label="订单金额"
                    prop="price"
                    width="150">
                </el-table-column>
                <el-table-column
                    label="订单状态"
                    prop="deliveryStatus"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="所含菜品"
                    prop="foodName">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    fixed="right"
                    width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="changeDish(scope.row)">编辑</el-button>
                        <el-button type="text" @click="changeStatus(scope.row)">{{ scope.row.status == 0 ? '启用' : '禁用' }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="foot">
            <el-pagination
                style="padding: 10px;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import store from '@/store';
    import axios from 'axios';
    import Cookies from 'js-cookie';
    export default {
        name: 'orderView',
        data(){
            return{
                orderType:'1',//订单状态
                records:[],//订单集合
                page:1,//页码
                pageSize:10,//每页订单数
                total:0,//总订单数
            }
        },
        created(){
            this.orderQuary()
        },
        methods:{
            orderQuary(){
                axios.post('/elm/admin/order/page',{
                    headers:{
                        'adminToken': localStorage.getItem('adminToken')
                    },
                    params:{
                        page:this.page,
                        pageSize:this.pageSize,
                        orderType:this.orderType
                    }
                }).then(res=>{
                    this.total = res.data.data.total;
                    this.records = res.data.data.records;
                    console.log(res.data);
                }).catch(err =>{
                    console.log(err);
                })
            }
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
</style>