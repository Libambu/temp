<template>
  <div class="info-perfect">
    <form @submit.prevent="submitForm">
      <h2 >商家信息完善</h2>
      <!-- 商家名称 -->
      <div class="form-row">
        <div class="label icon-shop">商家名称</div>
        <div class="input-box">
          <input
            v-model="businessName"
            type="text"
            placeholder="请输入商家名称"
          />
        </div>
      </div>

      <!-- 商家地址 -->
      <div class="form-row">
        <div class="label icon-addr">商家地址</div>
        <div class="input-box">
          <input
            v-model="businessAddress"
            type="text"
            placeholder="请输入商家地址"
          />
        </div>
      </div>

      <!-- 商家图片 -->
      <div class="form-row">
        <div class="label icon-pic">商家图片</div>
        <div class="input-box">
          <label class="upload-area" for="imgInput">
            <input
              id="imgInput"
              ref="imgInput"
              type="file"
              accept="image/*"
              @change="handleImgChange"
            />
            <div v-if="!imgPreview" class="upload-tips">点击或拖拽上传</div>
            <img v-else :src="imgPreview" alt="preview" />
          </label>
        </div>
      </div>

      <!-- 商家介绍 -->
      <div class="form-row">
        <div class="label icon-desc">商家介绍</div>
        <div class="input-box">
          <textarea
            v-model="businessExplain"
            rows="3"
            placeholder="请输入商家介绍"
          ></textarea>
        </div>
      </div>

      <!-- 起送费 -->
      <div class="form-row">
        <div class="label icon-money">起送费(元)</div>
        <div class="input-box">
          <input
            v-model.number="deliveryPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>
      </div>


            <!-- 起送费 -->
      <!-- 起送费 -->
      <div class="form-row">
        <div class="label icon-money">配送费(元)</div>
        <div class="input-box">
          <input
            v-model.number="starPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>
      </div>

      <!-- 打包费 -->
      <div class="form-row">
        <div class="label icon-money">打包费(元)</div>
            <div class="input-box">
                <input
                    v-model.number="packPrice"
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0.00"
                />
        </div>
      </div>

      <!-- 商家分类 -->
      <div class="form-row">
        <div class="label icon-money">商家分类</div>
        <div class="input-box">
          <select v-model="orderTypeID">
            <option :value="1">美食</option>
            <option :value="2">早餐</option>
            <option :value="3">跑腿代购</option>
            <option :value="4">汉堡披萨</option>
            <option :value="5">甜品饮品</option>
            <option :value="6">速食简餐</option>
            <option :value="7">地方小吃</option>
            <option :value="8">米粉面馆</option>
            <option :value="9">包子粥铺</option>
            <option :value="10">炸鸡炸串</option>
          </select>
        </div>
      </div>

            <div class="form-row">
        <div class="label icon-money">商家状态</div>
        <div class="input-box">
          <select v-model="status">
            <option :value="1">营业中</option>
            <option :value="0">打样</option>
          </select>
        </div>
      </div>

      <button class="submit-btn" @click="submitForm">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      保存
      </button>

    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "infoView",
  data() {
    return {
      // 商家信息
      businessName: "",
      businessAddress: "",
      businessImg: null, // 最终要上传的 File 对象
      businessExplain: "",
      starPrice: 0,
      packPrice: 0,
      deliveryPrice: 0,
      orderTypeID: 0,
      status: 1, // 1 营业中  0 打烊
      // 预览图
      imgPreview: "",
    };
  },
  methods: {
    // 图片选择
    handleImgChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.businessImg = file;
      this.imgPreview = URL.createObjectURL(file);
    },

    // 提交表单
    submitForm() {
      // 构造表单数据
      const form = new FormData();
      form.append("businessName", this.businessName);
      form.append("businessAddress", this.businessAddress);
      form.append("businessImg", this.businessImg);
      form.append("businessExplain", this.businessExplain);
      form.append("starPrice", this.starPrice);
      form.append("packPrice", this.packPrice);
      form.append("deliveryPrice", this.deliveryPrice);
      form.append("orderTypeID", this.orderTypeID);


      console.log("提交的表单数据：", form);


      // 这里写你的 axios 或 fetch 逻辑
      console.log("待提交字段", Object.fromEntries(form));

      axios({
        method: 'post',
        url: '/elm/admin/Business/updateInfo',
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data',
          'adminToken': localStorage.getItem('adminToken')
        }
      }).then(response => {
        console.log(response.data);
        if (response.data.code === 200) {
          alert('商家信息更新成功！');
        } else if(response.data.code === 900){
          alert('登录已过期，请重新登录！');
          this.$router.push('/login');
        }
      }).catch(err => {
        alert('更新失败，服务器好像有点问题');
        console.log(err);
      });
    },
    
    getBusinessInfo(){
      axios({
        method: 'get',
        url: '/elm/admin/Business/getInfo',
        headers: {
          'adminToken': localStorage.getItem('adminToken')
        }
      }).then(response => {
        console.log(response.data);
        const data = response.data;
        this.businessName = data.data.businessName;
        this.businessAddress = data.data.businessAddress;
        this.businessExplain = data.data.businessExplain;
        this.starPrice = data.data.starPrice;
        this.packPrice = data.data.packAmount;
        this.deliveryPrice = data.data.deliveryPrice;
        this.orderTypeID = Number(data.data.orderTypeId);
        this.status = Number(data.data.status);
        this.imgPreview = data.data.businessImg ? data.data.businessImg : '';
      })
    }
  },

  mounted() {
    this.getBusinessInfo();
  }
};
</script>

<style scoped>
  /* =========  PC 端微调版（仅 4 处改动，已标 ✅） ========= */
  :root {
    --primary: linear-gradient(135deg, #5b8cff 0%, #3d6dff 100%);
    --primary-dark: #3d6dff;
    --surface: #ffffff;
    --glass: rgba(255, 255, 255, 0.72);
    --line: rgba(224, 230, 237, 0.65);
    --text1: #1d1d1f;
    --text2: #3c3c43;
    --text3: #8e8e93;
    --success: #34c759;
    --shadow-sm: 0 2px 10px rgba(0, 0, 0, 0.04);
    --shadow-md: 0 4px 24px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
    --tr: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    --radius: 16px;
    --radius-inner: 12px;
  }

  * { box-sizing: border-box; }
  body { margin: 0; font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif; background: #f2f5fa; }

  /* ✅ 1. 放宽最大宽度：640→840 */
  .info-perfect {
    max-width: 100%;
    max-height: max-content;
    padding: 20px 20px 20px 20px;
  /* ✅ 2. 左右内边距再大点，让卡片更饱满 */
    background: var(--glass);
    background-color: #fff;
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    border: 1px solid var(--line);
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  h2 { text-align: center; margin: 1px 5px; font-size: 20px; font-weight: 600; color: var(--text1); letter-spacing: 0.5px; }

  .form-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24px;
    padding: 10px 50px;   /* ✅ 3. 横向再撑开一点 */
    background: var(--surface);
    border-radius: var(--radius-inner);
    box-shadow: var(--shadow-sm);
    transition: var(--tr);
  }
  .form-row:hover { box-shadow: var(--shadow-md); }

  .form-row .label {
    width: 150px;   /* 稍微加宽，避免字数多的 label 换行 */
    flex-shrink: 0;
    font-size: 18px;
    color: var(--text2);
    display: flex;
    align-items: center;
    line-height: 1.4;
  }
  .form-row .label::before {
    content: "";
    width: 20px;
    height: 20px;
    margin-right: 8px;
    background-size: contain;
    background-repeat: no-repeat;
  }

  /* 图标保持你的 base64，不动 */
  .icon-shop::before { background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMNCA2djE0aDE2VjZxMC0uODI2LS41ODctMS40MTNIMTJ6bTAgMkwxOCAxMkg2TDEyIDR6bTAgMTZxLTEuMjUgMC0yLjEyNS0uODc1VDkgMTdoNnEwIDEuMjUtLjg3NSAyLjEyNVQxMiAyMHptMy0xMkg5VjloNnYyeiIgZmlsbD0iIzQwOWVmZiIvPjwvc3ZnPg=="); }
  .icon-addr::before { background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJhOS42IDkuNiAwIDAgMC05IDljMCA0LjQxIDMuNTkgOCA4IDhzOC0zLjU5IDgtOGExMCA5IDAgMCAwLTktOXptMCAyYTcgNyAwIDAgMSA3IDdjMCAzLjMxLTIuNjkgNi02IDZzLTYtMi42OS02LTZhNyA3IDAgMCAxIDctN3ptMCAzYTMgMyAwIDAgMC0zIDMgMyAzIDAgMCAwIDMgMyAzIDMgMCAwIDAgMy0zIDMgMyAwIDAgMC0zLTN6IiBmaWxsPSIjNDA5ZWZmIi8+PC9zdmc+"); }
  .icon-pic::before { background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDEyYTIgMiAwIDEgMSAwLTQgMiAyIDAgMCAxIDAgNHptMCAyYTIgMiAwIDEgMCAwIDQgMiAyIDAgMCAwIDAtNHpNNSAzaDE0YTIgMiAwIDAgMSAyIDJ2MTRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yem0wIDJ2MTRoMTRWNUg1em0yIDJsMiAyIDQtNCA0IDQgMi0yIDYgNnYxSDNWMTJsMi0yeiIgZmlsbD0iIzQwOWVmZiIvPjwvc3ZnPg=="); }
  .icon-desc::before { background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTMgM2gxNGEyIDIgMCAwIDEgMiAydjhhMiAyIDAgMCAxLTIgMkg5bC0yIDJWM2EyIDIgMCAwIDEgMi0yem0wIDJ2MTJoMTB2Mmw0LTRoM2ExIDEgMCAwIDAgMS0xVjVhMSAxIDAgMCAwLTEtMUgzem0yIDJoMTB2Mkg1VjV6IiBmaWxsPSIjNDA5ZWZmIi8+PC9zdmc+"); }
  .icon-money::before { background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJhMTAgMTAgMCAxIDAgMCAyMCAxMCAxMCAwIDAgMCAwLTIwek0wIDJhOCA4IDAgMSAxIDAgMTYgOCA4IDAgMCAxIDAtMTZ6bTAgM2E1IDUgMCAwIDAtNSA1aDJhMyAzIDAgMCAxIDYtMXYySDhhMSAxIDAgMCAwIDAgMmgydjJIM2ExIDEgMCAwIDAgMCAyaDEwYTEgMSAwIDAgMCAwLTJoLTR2LTJhNSA1IDAgMCAwIDAtMTB6IiBmaWxsPSIjNDA5ZWZmIi8+PC9zdmc+"); }

  .form-row .input-box { flex: 1; margin-left: 16px; }

  input[type="text"],
  input[type="number"],
  textarea,
  select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--line);
    border-radius: 8px;
    font-size: 15px;
    color: var(--text2);
    background: #fafbfc;
    transition: var(--tr);
  }
  input:focus,
  textarea:focus,
  select:focus {
    border-color: var(--primary-dark);
    background: #fff;
    outline: none;
    box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.18);
  }
  textarea { resize: vertical; min-height: 88px; }

  .upload-area {
    position: relative;
    display: block;
    width: 140px;
    height: 140px;
    border: 1px dashed var(--line);
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    transition: var(--tr);
  }
  .upload-area:hover {
    border-color: var(--primary-dark);
    background: rgba(64, 158, 255, 0.04);
  }
  .upload-area img { width: 100%; height: 100%; object-fit: cover; }
  .upload-tips {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: var(--text3);
    text-align: center;
    line-height: 1.4;
  }
  input[type="file"] { display: none; }




.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.submit-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
}

.icon {
  width: 20px;
  height: 20px;
}



  /* ========= 仅 PC，不做移动端适配 ========= */
</style>