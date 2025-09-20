<template>
  <div class="container">
    <div class = "title"> 
        <h1>菜品信息</h1>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="padding: 25px 300px;">
      <el-form-item label="菜品名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="菜品图片" prop="picture">
        <el-upload
          class="upload-demo"
          v-model="ruleForm.picture"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="菜品分类" prop="category">
        <el-select v-model="ruleForm.category" filterable placeholder="请输入关键词" style="width: 675px;">
          <el-option 
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜品定价" prop="price">
        <el-input v-model="ruleForm.price"></el-input>
      </el-form-item>
      <el-form-item label="商品状态" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="启用"></el-radio>
          <el-radio label="禁用"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
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
        optType:'',
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        ruleForm: {
          name: '',
          picture: '',
          category: '',
          price: '',
          status:''
        },
        rules: {
          name: [
            { required: true, message: '请输入菜品名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          picture: [
            { required: false, message: '请上传商品图片', trigger: 'change' }
          ],
          category: [
            { required: true, message: '请选择菜品分类', trigger: 'change' }
          ],
          price: [
            { required: true, message: '请输入价格', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择商品状态', trigger: 'blur' }
          ],
        }
      };
    },
    created() {
      this.optType = this.$router.query.adminToken ? 'update' : 'add'
      if(this.optType == 'update'){
        axios.get('/elm/admin/category',{
          header:{
            'adminToken': this.$router.query.adminToken
          }
        }).then(res =>{
          this.ruleForm.name = res.data.dish.name,
          this.ruleForm.picture = res.data.dish.picture,
          this.ruleForm.category = res.data.dish.category,
          this.ruleForm.price = res.data.dish.price
        }).catch(err =>{
          console.log(err);
        })
      }
      axios.get('/elm/admin/category',{
        headers:{
          'adminToken': localStorage.getItem('adminToken')
        }
      }).then(res =>{
        this.options = res.data.category.names
        console.log(res.data);
      }).catch(err =>{
        console.log(err);
      })
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否确定菜品信息无误?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(this.ruleForm.status == '启用') 
                {const status = 1;
              }else{
                const status = 0;
              }
              axios.post('/elm/admin/dish/',null,{
                headers:{
                  'adminToken': localStorage.getItem('adminToken'),
                  name: this.ruleForm.name,
                  picture: this.ruleForm.picture,
                  category: this.ruleForm.category,
                  price: this.ruleForm.price,
                  status: this.status
                }
              }).then(res =>{
                if(res.data.code === 1){
                  this.$message.success('操作成功')
                  this.dishQuary()
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
      }
    }
  }
</script>
<style scoped>

.title{
    background-color: #4ea3e9;
    color: #fff;
    height: 100px;
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
</style>