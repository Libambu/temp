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
                <el-menu-item index="1" @click="orderQuary('1')">全部</el-menu-item>
                <el-menu-item index="2" @click="orderQuary('2')">未接单</el-menu-item>
                <el-menu-item index="3" @click="orderQuary('3')">制作中</el-menu-item>
                <el-menu-item index="4" @click="orderQuary('4')">已完成</el-menu-item>
                <el-menu-item index="5" @click="orderQuary('5')">已拒绝</el-menu-item>
                <el-menu-item index="6" @click="orderQuary('6')">已评价</el-menu-item>
                <div class="rate">
                    <label style="font-size: 17px;color: #fff;"> 总评分：</label>
                    <el-rate
                        v-model="totalRate"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                    </el-rate>
                </div>
            </el-menu>
        </div>
        <div class="body">
            <el-table :data="records" stripe height="100%" width="100%" :default-sort="{prop: 'orderDate', order: 'descending'}">
                <el-table-column type="expand" width="30px">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="用户姓名:">
                                <span>{{ props.row.contactName}}</span>
                            </el-form-item>
                            <el-form-item label="用户联系方式:">
                                <span>{{ props.row.contactTel}}</span>
                            </el-form-item>
                            <el-form-item label="送货地址:">
                                <span>{{ props.row.address}}</span>
                            </el-form-item>
                            <el-form-item label="预计送达时间:">
                                <span>{{ props.row.estimatedDeliveryTime}}</span>
                            </el-form-item>
                            <el-form-item label="拒绝原因:" v-show="props.row.orderState == 2">
                                <span>{{ props.row.rejectionReason}}</span>
                            </el-form-item>
                            <el-form-item label="顾客评论:" v-show="props.row.orderState == 5">
                                <span>{{ props.row.commentText}}</span>
                            </el-form-item>
                            <el-form-item label="顾客评分:" v-show="props.row.orderState == 5">
                                <el-rate
                                    v-model="props.row.rating"
                                    disabled
                                    show-score
                                    text-color="#ff9900"
                                    score-template="{value}"
                                    style="padding-top: 13px;">
                                </el-rate>
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
                    width="80">
                </el-table-column>
                <el-table-column
                    label="创建日期"
                    prop="orderDate"
                    width="175"
                    sortable>
                </el-table-column>
                <el-table-column
                    label="订单金额"
                    prop="orderTotal"
                    width="80">
                </el-table-column>
                <el-table-column
                    label="订单状态"
                    width="80">
                    <template slot-scope="scope">
                        <el-tag type="primary" v-show="scope.row.orderState==1"> 未接单 </el-tag>
                        <el-tag type="primary" v-show="scope.row.orderState==7"> 制作中 </el-tag>
                        <el-tag type="success" v-show="scope.row.orderState==3 || scope.row.orderState==4"> 已完成 </el-tag>
                        <el-tag type="danger" v-show="scope.row.orderState==2"> 已拒绝 </el-tag>
                        <el-tag type="success" v-show="scope.row.orderState==5 "> 已评价 </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="所含菜品"
                    fit
                    prop="foodName">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    fixed="right"
                    width="200"
                    align="center">
                    <template slot-scope="scope">
                        <el-button type="danger" v-show="scope.row.orderState!=1 && scope.row.orderState!=7" @click="deleteOrder(scope.row)">删 除 </el-button>
                        <el-button type="primary" v-show="scope.row.orderState==7" @click="dishComplete(scope.row)">完 成 </el-button>
                        <el-button type="primary" v-show="scope.row.orderState==1" @click="acceptOrder(scope.row)">接单</el-button>
                        <el-button type="danger" v-show="scope.row.orderState==1" @click="dialogTableVisible = true">拒接</el-button>
                        <el-dialog title="拒单原因" :visible.sync="dialogTableVisible" :append-to-body="true" center>
                            <el-input
                                placeholder="请输入拒单原因"
                                v-model="rejectReason"
                                clearable>
                            </el-input>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogTableVisible = false">取 消</el-button>
                                <el-button type="primary" @click="rejectOrder(scope.row)">确 定</el-button>
                            </span>
                        </el-dialog>
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
                totalRate: '',
                dialogTableVisible:false,
                rejectReason:'',//拒单原因
                orderType:'1',//订单状态
                records:[],//订单集合
                page:1,//页码
                pageSize:10,//每页订单数
                total:0,//总订单数
            }
        },
        created(){
            this.orderQuary('1'),
            axios.get('/elm/admin/order/getRate',{
                headers:{
                    'adminToken': localStorage.getItem('adminToken')
                }
            }).then(res=>{
                this.totalRate = res.data.data.totalRate;
                console.log(res.data);
            }).catch(err =>{
                console.log(err);
            })
        },
        methods:{
            //订单查询
            orderQuary(type,page){
                if(type)this.orderType=type;
                if(!page) this.page = 1;
                axios.get('/elm/admin/order/getInfo',{
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
            },
            //切换页面大小
            handleSizeChange(pageSize){
                this.pageSize = pageSize
                this.orderQuary()
            },
            //页面跳转
            handleCurrentChange(page){
                this.page = page
                this.orderQuary(this.orderType,page)
            },
            //订单删除
            deleteOrder(row){
                this.$confirm('是否删除订单？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    axios.post('/elm/admin/order/delete',null,{
                        headers:{
                            'adminToken': localStorage.getItem('adminToken'),
                        },
                        params:{
                            orderId:row.orderId
                        }
                    }).then(res=>{
                        if(res.data.code == 200){
                            this.$message.success('删除成功')
                            this.orderQuary(this.orderType)
                        }else{
                            this.$message.info('删除失败')
                        }
                    })
                })
            },
            //接单
            acceptOrder(row){
                axios.post('/elm/admin/order/status',null,{
                    headers:{
                        'adminToken': localStorage.getItem('adminToken'),
                    },
                    params:{
                    orderId:row.orderId,
                    orderState:7,
                    rejectionReason:this.rejectReason
                    }
                }).then(res=>{
                    if(res.data.code == 200){
                        this.$message.success('接单成功')
                        this.orderQuary(this.orderType)
                    }else{
                        this.$message.info('接单失败')
                    }
                })
            },
            //拒单
            rejectOrder(row){
                axios.post('/elm/admin/order/status',null,{
                    headers:{
                        'adminToken': localStorage.getItem('adminToken'),
                    },
                    params:{
                    orderId:row.orderId,
                    orderState:2,
                    rejectionReason:this.rejectReason
                    }
                }).then(res=>{
                    if(res.data.code == 200){
                        this.$message.success('拒单成功')
                        this.orderQuary(this.orderType)
                    }else{
                        this.$message.info('拒单失败')
                    }
                })
            },
            //菜品制作完成，呼叫骑手配送
            dishComplete(row){
                axios.post('/elm/admin/order/status',null,{
                    headers:{
                        'adminToken': localStorage.getItem('adminToken'),
                    },
                    params:{
                    orderId:row.orderId,
                    orderState:3,
                    rejectionReason:this.rejectReason
                    }
                }).then(res=>{
                    if(res.data.code == 200){
                        this.$message.success('已呼叫骑手')
                        this.orderQuary(this.orderType)
                    }else{
                        this.$message.info('呼叫失败')
                    }
                })
            }
        }
    }
</script>
<style scoped>
.container{
    width: auto;
    height: 640px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    padding: 10px;
}

.body{
    height:85%
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
.rate{
    display: flex;
    width: 23%;
    float: right;
    padding-top: 20px;
}
</style>