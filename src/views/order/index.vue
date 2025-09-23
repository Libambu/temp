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
            <el-table :data="records" stripe height="620px" width="100%" >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="用户姓名:">
                                <span>{{ props.row.contactName}}</span>
                            </el-form-item>
                            <el-form-item label="用户联系方式:">
                                <span>{{ props.row.contacttel}}</span>
                            </el-form-item>
                            <el-form-item label="送货地址:">
                                <span>{{ props.row.addr}}</span>
                            </el-form-item>
                            <el-form-item label="预计送达时间:">
                                <span>{{ props.row.estimatedDeliveryTime}}</span>
                            </el-form-item>
                            <el-form-item label="拒绝原因:" :disabled="props.row.orderState == 5">
                                <span>{{ props.row.rejectionReason}}</span>
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
                    prop="orderId"
                    width="200">
                </el-table-column>
                <el-table-column
                    label="创建日期"
                    prop="orderDate"
                    width="200">
                </el-table-column>
                <el-table-column
                    label="订单金额"
                    prop="orderTotal"
                    width="150">
                </el-table-column>
                <el-table-column
                    label="订单状态"
                    prop="orderState"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="所含菜品"
                    prop="foodName">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    fixed="right"
                    width="200">
                    <template slot-scope="scope">
                        <el-button type="danger" v-show="scope.row.orderState==3 || scope.row.orderState==4" @click="deleteOrder(scope.row)">删除</el-button>
                        <el-button type="primary" @click="acceptOrder(scope.row)">接单</el-button>
                        <el-button type="danger" @click="rejectOrder(scope.row)">拒接</el-button>
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
                records:[{orderState:1,orderId:1}],//订单集合
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
                axios.post('/elm/admin/order/getInfo',{
                        page:this.page,
                        pageSize:this.pageSize,
                        orderType:this.orderType
                    },{
                    headers:{
                        'adminToken': localStorage.getItem('adminToken')
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
.demo-table-expand {
    padding-left: 50px;
    font-size: 0;
}
.demo-table-expand label {
    width: 200px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-bottom: 0;
    width: 100%;
}
</style>