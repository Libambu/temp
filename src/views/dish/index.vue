<template>
    <div class="container">
        <div class="tableBar">
            <label style="float: left; padding: 9px;">菜品名称：</label>
            <el-input
                v-model="name"
                placeholder="请输入关键词"
                style="margin-right: 10px; width: 20%; float: left;"
                clearable
            />
            <label style="float: left;margin-left: 50px; padding: 9px;">类别：</label>
            <el-select v-model="category" filterable placeholder="请输入关键词"  style="margin-right: 10px; width: 20%; float: left;">
                <el-option 
                    v-for="item in options"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-button type="primary" style="float: right;margin-left: 10px" @click="addDish()">+ 添加菜品</el-button>
            <el-button type="primary" style="float: right;margin-left: 10px" @click="dialogTableVisible = true">+ 添加分类</el-button>
            <el-dialog title="新建分类" :visible.sync="dialogTableVisible" :append-to-body="true" center>
                <lable>分类名: </lable>
                <el-input
                    placeholder="请输入内容"
                    v-model="newCategory"
                    clearable>
                </el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogTableVisible = false">取 消</el-button>
                    <el-button type="primary" @click="createCategory(newCategory)">确 定</el-button>
                </span>
            </el-dialog>
            <el-button type="danger" style="float: right;margin-left: 10px" @click="deleteCategory()">删除分类</el-button>
            <el-button type="primary" style="float: right;margin-left: 10px" @click="dishQuary()">查询</el-button>
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
                prop="foodImg"
                label="图片"
                width="100">
                <template slot-scope="scope">
                    <img :src="scope.row.foodImg" min-width="70" height="70"/>
                </template>
            </el-table-column>
            <el-table-column
                prop="foodName"
                label="名称"
                width="200" >
            </el-table-column>
            <el-table-column
                prop="categoryName"
                label="类别"
                width="150">
            </el-table-column>
            <el-table-column
                prop="foodPrice"
                label="售价（元）"
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
            <el-table-column
                prop="foodExplain"
                label="商品介绍"
                width="100" >
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
                newCategory: '',
                dialogTableVisible: false,
                name:'',//菜品名称
                page:1,//页码
                pageSize:10,//每页菜品数
                total:0,//总菜品数
                records:[],//当前页菜品集合
                category:'',
                options:[]//分类集合
            }
        },
        created(){
            this.dishQuary()
            axios.get('/elm/admin/category',{
                headers:{
                    'adminToken': localStorage.getItem('adminToken')
                }
            }).then(res =>{
                this.options=res.data.data
                console.log(res.data);
            }).catch(err =>{
                console.log(err);
            })
        },
        methods:{
            //查询菜品
            dishQuary(){
                axios.get('/elm/admin/dish/page',{
                    headers:{
                        'adminToken': localStorage.getItem('adminToken'),
                    },
                    params:{
                        name:this.name,
                        category:this.category,
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
                        headers:{
                            'adminToken': localStorage.getItem('adminToken'),
                        },
                        params:{
                            status:p.status,
                            foodId:row.foodId
                        }
                    }).then(res =>{
                        if(res.data.code == 200){
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
            //修改菜品信息
            changeDish(row){
                this.$router.push({
                    path: '/home/dish/dishInfo',
                    query: {
                        'id':row.foodId
                    }
                })
            },
            //添加分类
            createCategory(){
                axios.post('/elm/admin/category/',null,{
                    headers:{
                        'adminToken': localStorage.getItem('adminToken'),
                    },
                    params:{
                        categoryName: this.newCategory
                    }
                }).then(res =>{
                    if(res.data.code == 200){
                        this.$message.success('已修改')
                        this.dialogTableVisible=false
                    }else{
                        this.$message.info('修改失败')
                    }
                }).catch(err =>{
                    console.log(err);
                })
            },
            //删除分类
            deleteCategory(){
                if(!this.category){
                    this.$message.warning('操作失败，分类不能为空！')
                }else{
                    axios.post('/elm/admin/category',{
                        headers:{
                            'adminToken': localStorage.getItem('adminToken'),
                        },
                        params:{
                            categoryName:this.category
                        }
                    }).then(res =>{
                        if(res.data.code == 200){
                            this.$message.success('删除成功')
                            this.dialogTableVisible=false
                        }else{
                            this.$message.info('删除失败')
                        }
                    }).catch(err =>{
                        console.log(err);
                    })
                }
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