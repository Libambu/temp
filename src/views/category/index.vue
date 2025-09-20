<template>
    <div class="container">
        <div class="tableBar">
            <el-select v-model="categoryKey" filterable placeholder="请输入关键词" style="width: 675px;">
                <el-option 
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" style="float: left" @click="dishQuary()">查询</el-button>
            <el-button type="primary" style="float: right" @click="dialogTableVisible = true">+ 添加菜品</el-button>
            <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
                <el-table :data="gridData">
                    <el-table-column property="date" label="日期" width="150"></el-table-column>
                    <el-table-column property="name" label="姓名" width="200"></el-table-column>
                    <el-table-column property="address" label="地址"></el-table-column>
                </el-table>
            </el-dialog>
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
    export default {
        name: 'Test1View',
        data(){
            return{

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