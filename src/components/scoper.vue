<template>
  <div>
    <div>
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        action= 'https://music.thedream.tech/piano/server/gettime.html'
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
      <img  v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <el-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body width="34%">
      <div class="cropper-content">
        <div class="cropper" style="text-align: center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :info="option.info"
            :canScale="option.canScale"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixed="option.fixed"
            :fixedBox="option.fixedBox"
            :fixedNumber="option.fixedNumber" 
            :original="option.original"
          ></vueCropper>
        </div>
      </div>
      <div class="scope-btn top-10">
        <!-- <el-button type="primary"  icon="el-icon-zoom-in"  @click="rotateLeft">逆时针旋转</el-button> -->
        <el-button type="primary" icon="el-icon-refresh-right" @click="rotateRight">旋转</el-button>
        <el-button type="primary" icon="el-icon-zoom-in" @click="changeScale(1)"></el-button>
        <el-button type="primary" icon="el-icon-zoom-out" @click="changeScale(-1)"></el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finish" :loading="loading">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { VueCropper } from "vue-cropper";
import md5 from 'blueimp-md5'
export default {
  components: {
    VueCropper,
  },
  props: ["imgurl","autoCropWidth","autoCropHeight","autoCrop"],
  data() {
    return {
      imageUrl: this.imgurl,
      dialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        info: false, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "png", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: this.autoCrop, // 是否默认生成截图框
        autoCropWidth: this.autoCropWidth, // 默认生成截图框宽度
        autoCropHeight: this.autoCropHeight, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: true, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        canMove: false,
        original:true, //上传图片是否显示原始宽高 (针对大图 可以铺满)
      },
      picsList: [], //页面显示的数组
      // 防止重复提交
      loading: false,
      fileinfo: {},
      upimg: "",
      token:sessionStorage.getItem('token'),
      timestamp:Number(Math.round(new Date().getTime()/1000).toString()) - Number(localStorage.getItem('clientTime')) + Number(localStorage.getItem('serverTime'))
    };
  },
  created() {
    // console.log(this.imgurl);
  },
  methods: {
    handleAvatarSuccess(res, file, fileList) {
      //这一步其实不用上传至服务器，由于el-upload，必传参数action，这个url可以访问即可。
      this.$nextTick(() => {
        this.option.img = URL.createObjectURL(file.raw);
        this.fileinfo = file.raw;
        this.dialogVisible = true;
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片格式有误!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过2MB!");
      }

      return isJPG && isLt2M;
    },
    changeScale(num) {
      // 图片缩放
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    rotateLeft() {
      // 向左旋转
      this.$refs.cropper.rotateLeft(); 
    },
    rotateRight() {
      // 向右旋转
      this.$refs.cropper.rotateRight();
    },

    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        let file_name = this.fileinfo.uid + this.fileinfo.name; //重命名
        let fileOfBlob = new File([data], file_name);

        //formData格式追加元素
        let formData = new FormData();
        formData.append('file', fileOfBlob);
        this.loading = true;
        this.$axios({
          url: this.$baseURL + "/manage/upload/image.html",
          method: "POST",
          data: formData,
          params:{}
        }).then((res) => {
          console.log(res);
          this.$emit('upimg',res.data)
          this.loading = false;
          this.dialogVisible = false;
        });
      });
    },

  },
};
</script>
<style scoped>
.avatar-uploader {
  width: 130px;
  height: 130px;
  text-align: center;
  line-height: 150px;
}
.el-icon-plus {
  width: 130px;
  height: 130px;
  font-size: 30px;
}

.cropper-content {
  width: 600px;
  height: 400px;
  background: pink;
}
.cropper {
  width: 100%;
  height: 100%;
}
.avatar {
  width: 130px;
  height: 130px;
  text-align: center;
  line-height: 150px;
}
.scope-btn{
  margin-top: 50px;
}
</style>
