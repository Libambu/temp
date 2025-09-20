<template>
    <div class="container">
        <div class="tableBar">
            <label style="float: left; padding: 9px;">菜品名称：</label>
            <el-input
                v-model="name"
                placeholder="请输入菜品名称"
                style="margin-right: 10px; width: 30%; float: left;"
                clearable
            />
            <el-button type="primary" style="float: left" @click="dishQuary()">查询</el-button>
            <el-button type="primary" style="float: right" @click="addDish()">+ 添加菜品</el-button>
            <el-button type="primary" style="float: right" @click="addDish()">+ 添加分类</el-button>
        </div>
        <el-table
            :data="records"
            stripe
            height="640px">
            <el-table-column
                label="序号"
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                prop="picture"
                label="图片"
                width="100">
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                width="100">
            </el-table-column>
            <el-table-column
                prop="category"
                label="类别"
                width="100">
            </el-table-column>
            <el-table-column
                prop="price"
                label="售价"
                width="100">
            </el-table-column>
            <el-table-column
                prop="status"
                label="上架状态"
                width="100">
                <template slot-scope="scope">
                    {{ scope.row.status == 0 ? '禁用' : '启用' }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="changeDish(scope.row)">编辑</el-button>
                    <el-button type="text" @click="changeStatus(scope.row)">{{ scope.row.status == 0 ? '启用' : '禁用' }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        
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
</template>

<script>
    import store from '@/store';
    import axios from 'axios';
    import Cookies from 'js-cookie';
    export default {
        name: "dishView",
        data(){
            return{
                name:'',//菜品名称
                page:1,//页码
                pageSize:10,//每页菜品数
                total:0,//总菜品数
                records:[{name:'jiaozi' ,status:1},{status:0},{status:1},{status:1},{status:1},{status:1},{status:1},{status:1},{status:1},{status:1},]//当前页菜品集合
            }
        },
        created(){
            this.dishQuary()
        },
        methods:{
            //查询菜品
            dishQuary(){
                axios.get('/elm/admin/dish/page',{
                    params:{
                        'adminToken': localStorage.getItem('adminToken'),
                        name:this.name,
                        page:this.page,
                        pageSize:this.pageSize
                    }
                }).then(res =>{
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
                this.dishQuary()
            },
            //页面跳转
            handleCurrentChange(page){
                this.page = page
                this.dishQuary()
            },
            //切换上架状态
            changeStatus(row){
                this.$confirm('是否确定修改该菜品?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const p ={
                        status : !row.status ? 1:0
                    }
                    axios.post('/elm/admin/dish/',null,{
                        params:{
                            'adminToken': localStorage.getItem('adminToken'),
                            status:p.status
                        }
                    }).then(res =>{
                        if(res.data.code === 1){
                            this.$message.success('已修改')
                            this.dishQuary()
                        }else{
                            this.$message.info('修改失败')
                        }
                    }).catch(err =>{
                        console.log(err);
                    })
                })
            },
            //添加菜品
            addDish(){
                this.$router.push('/home/dish/dishInfo')
            },
            changeDish(){
                this.$router.push({
                    path: '/home/dish/dishInfo',
                    query: {'adminToken': localStorage.getItem('adminToken')}
                })
            }
        }
    }
</script>
<style scoped>

* {
    box-sizing: border-box;
}
.container{
    width: auto;
    height: 750px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    padding: 20px;
}
</style>