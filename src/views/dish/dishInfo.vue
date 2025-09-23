<template>
  <div class="container">
    <div class = "title"> 
        <h1>菜品信息</h1>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="padding:25px 300px;">
      <el-form-item label="菜品名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="菜品图片" prop="picture">
        <input type="file" @change="onFileChange" accept="image/png, image/jpeg" />
      </el-form-item>
      <el-form-item label="菜品分类" prop="category">
        <el-select v-model="ruleForm.category" filterable placeholder="请输入关键词"  style="width: 675px;">
          <el-option 
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜品定价" prop="price">
        <el-input v-model="ruleForm.price"></el-input>
      </el-form-item>
      <el-form-item label="菜品介绍" prop="explain">
        <el-input v-model="ruleForm.explain"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" :disabled="optType == 'add'" @click="deleteDish()" >删除菜品</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">{{optType == 'add'? '立即创建':'立即修改'}}</el-button>
        <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="primary" @click="reback()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import store from '@/store';
  import axios from 'axios';
  import Cookies from 'js-cookie';
  export default {
    data() {
      return {
        optType:'add',
        options: [],
        ruleForm: {
          id:'',
          name: '',
          picture: null,
          category: '',
          price: '',
          explain:'',
          remarks:''
        },
        rules: {
          name: [
            { required: true, message: '请输入菜品名称', trigger: 'blur' }
          ],
          picture: [
            { required: false, message: '请上传商品图片', trigger: 'blur' }
          ],
          category: [
            { required: true, message: '请选择菜品分类', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入价格', trigger: 'blur' }
          ],
          explain: [
            { required: true, message: '请输入商品介绍', trigger: 'blur' }
          ],
        }
      };
    },
    created() {
      
      this.optType = this.$route.query.id ? 'update' : 'add'
      if(this.optType === 'update'){
        axios.get('/elm/admin/dish/getDish',{
          headers:{
            'adminToken': localStorage.getItem('adminToken')
          },
          params:{
            'id': this.$route.query.id
          }
        }).then(res =>{
          this.ruleForm.id = res.data.data.foodId,
          this.ruleForm.name = res.data.data.foodName,
          //this.ruleForm.picture = res.data.data.foodImg,
          this.ruleForm.category = res.data.data.categoryName,
          this.ruleForm.price = res.data.data.foodPrice,
          this.ruleForm.explain = res.data.data.foodExplain,
          this.ruleForm.remarks = res.data.data.remarks
        }).catch(err =>{
          console.log(err);
        })
      }
      axios.get('/elm/admin/category/getInfo',{
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
    methods: {

    onFileChange(e) {
      this.ruleForm.picture = e.target.files[0];
    },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否确定菜品信息无误?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {

              const formData = new FormData();
              formData.append('foodId', this.ruleForm.id);
              formData.append('foodName', this.ruleForm.name);
              formData.append('foodImg', this.ruleForm.picture); // 文件字段
              formData.append('categoryId', this.ruleForm.category);
              formData.append('foodPrice', this.ruleForm.price);
              formData.append('foodExplain', this.ruleForm.explain);
              formData.append('remarks', this.ruleForm.remarks);

              axios.post('/elm/admin/dish/add',formData,
              {
                headers:{
                  'adminToken': localStorage.getItem('adminToken'),
                },
              }).then(res =>{
                if(res.data.code === 200){
                  this.$message.success('操作成功')
                  this.$router.push('/home/dish')
                }else{
                  this.$message.info('操作失败')
                }
              }).catch(err =>{
                console.log(err);
              })
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$message.success('已重置')
      },
      reback(){
        this.$router.push('/home/dish')
      },
      deleteDish(){
        this.$confirm('是否确认删除该菜品？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            axios.post('/elm/admin/dish/delete',null,{
              headers:{
                'adminToken': localStorage.getItem('adminToken'),
              },
              params:{
                'id': this.$route.query.id,
              }
            }).then(res =>{
              if(res.data.code === 200){
                this.$message.success('操作成功')
                this.$router.push('/home/dish')
              }else{
                this.$message.info('操作失败')
              }
            }).catch(err =>{
              console.log(err);
            })
        })
      }
    }
  }
</script>
<style scoped>

.title{
    background-color: #4ea3e9;
    color: #fff;
    height: 70px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    align-content: center;
}
.container{
    width: auto;
    height: 750px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
.el-form-item{
    height: 50px;
}
</style>