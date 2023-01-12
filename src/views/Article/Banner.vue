/**
 * 文章管理 banner列表
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>banner列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.keyword" placeholder="搜索banner名称" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item label="状态：">
      <el-select size="small" v-model="status" clearable placeholder="全部" @change="filterstatus">
        <el-option v-for="item in options" :key="item.status" :label="item.label" :value="item.status"></el-option>
      </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handadd">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" border :data="listData" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable type="index" label="序号" width="50">
      </el-table-column>
      <el-table-column align="center" prop="b_title" label="标题" width="200">
      </el-table-column>
      <el-table-column align="center" label="缩略图" width="80">
        <template slot-scope="scope">
          <img :src="scope.row.b_image" style="width: 60px;height: 60px;">
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" width="150">
        <template slot-scope="scope">
           <span v-if="scope.row.b_type == 1">链接</span>
           <span v-if="scope.row.b_type == 2">商品</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="b_content" label="内容" width="200">
        <template slot-scope="scope">
           <span v-if="scope.row.b_type == 1">{{scope.row.b_content}}</span>
           <span v-if="scope.row.b_type == 2">{{scope.row.b_content}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="150">
        <template slot-scope="scope">
           <el-switch v-model="scope.row.b_status" @change="changestatus(scope.row)" active-value=1 inactive-value=0 active-text="正常"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="平台" width="150">
        <template slot-scope="scope">
           <span v-if="scope.row.b_platform == 1">app </span>
           <span v-if="scope.row.b_platform == 2">小程序</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="b_addtime" label="添加时间" width="150">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteType(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="60%" @click="closeDialog" :close-on-click-modal="modal">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm" style="margin-left:-50px">
        <el-form-item label="标题" prop="b_title">
          <el-input v-model="editForm.b_title" placeholder="请输标题" size="small"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="b_type">
          <el-radio v-model="editForm.b_type" label='1'>链接</el-radio>
          <el-radio v-model="editForm.b_type" label='2'>产品</el-radio>
        </el-form-item>
        <el-form-item label="内容" prop="b_content" v-show="editForm.b_type==1">
          <el-input v-model="editForm.b_content" placeholder="请输入链接" size="small"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="b_content" v-show="editForm.b_type==2">
          <el-select size="small" v-model="editForm.b_content" clearable placeholder="产品名称">
            <el-option v-for="item in productlist" :key="item.p_id" :label="item.p_title" :value="item.p_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示平台" prop="b_platform">
          <el-radio v-model="editForm.b_platform" label="1">APP</el-radio>
          <el-radio v-model="editForm.b_platform" label="2">小程序</el-radio>
        </el-form-item>
        
        <el-form-item label="缩略图" prop="b_image">
          <div style="color:red;">（* 建议图片像素尺寸不超过200*200）</div>
          <scoper class="scoper" v-bind:imgurl="editForm.b_image" :key="keys" @upimg="uploadimg" autoCropWidth="200" :autoCropHeight="200" autoCrop="true"></scoper>
          <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 27px;" @click="removeimg" v-show="editForm.b_image">删除</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="addType">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "../../components/Pagination";
import scoper from '../../components/scoper'
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是否显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏

      // 单页数据
      formInline: {
        page: 1,
        limit: 10,
        status:'',
        keyword: "",
      },
      title: "添加",
      // 编辑表单
      editForm: {
        b_id:'',
        b_title:'',
        b_type:'',
        b_content:'',
        b_platform:'',
        b_image:'',
      },
      //添加弹窗状态
      needadd:false,
      // rules表单验证
      rules: {
        b_title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        b_type: [{ required: true, message: "", trigger: "blur" }],
        b_content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        b_platform: [{ required: true, message: "请输入平台", trigger: "blur" }],
        b_image: [{ required: true, message: "请选择缩略图", trigger: "blur" }],
      },
      //用户数据
      listData: [],
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      //下拉状态选择
       options: [{
          status: '1',
          label: '正常'
        }, {
          status: '0',
          label: '隐藏'
        }],
        status: '',
        //产品列表
        productlist:[],
        //下拉平台选择
        platform: [{
          status: '1',
          label: 'app'
        }, {
          status: '2',
          label: '小程序'
        }],
        //图片上传组件重载
        keys:1,
        modal:false,
    };
  },
  // 注册组件
  components: {
    Pagination,
    //上传裁剪组件
    scoper,
  },

  // 创建完毕
  created() {
    this.getdata();
    this.getproduct()
    
  },
  methods: {
    // 获取分类列表
    getdata() {
      this.loading = true;
      this.$axios({
        url: this.$baseURL + "/manage/banner/list.html",
        method: "POST",
        data: {
          page: this.formInline.page,
          limit: this.formInline.limit,
          status:this.formInline.status,
          keyword: this.formInline.keyword,
        },
      }).then((res) => {
        this.listData = res.data.data;
        // 分页赋值
        this.pageparm.total = res.data.total;
        this.loading = false;
      });
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata();
    },

    // 搜索事件
    search() {
      this.formInline.page = 1;
      this.getdata();
    },
    //显示编辑界面
    handleEdit(row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "编辑banner";
        this.editForm.b_id = row.b_id;
        this.editForm.b_title = row.b_title;
        this.editForm.b_type = row.b_type;
        this.editForm.b_content = row.b_content;
        this.editForm.b_platform = row.b_platform;
        this.editForm.b_image = row.b_image;
        this.needadd=false
        this.keys++
      }
    },
    //显示添加界面
    handadd(){
      this.editFormVisible = true;
      this.title = "添加banner";
      this.editForm.b_id = '';
      this.editForm.b_title = '';
      this.editForm.b_type = '1';
      this.editForm.b_content = '';
      this.editForm.b_platform = '1';
      this.editForm.b_image = '';
      this.needadd=true
      this.keys++
    },

    // 添加分类
    addType() {
      this.loading = true;
      if(this.needadd){
        this.$axios({
        url: this.$baseURL + "/manage/banner/add.html",
        method: "POST",
        data: {
          b_title: this.editForm.b_title,
          b_type: this.editForm.b_type,
          b_content: this.editForm.b_content,
          b_platform: this.editForm.b_platform,
          b_image: this.editForm.b_image,
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.getdata();
            this.editFormVisible = false;
            this.loading = false;
            this.$message({
              type: "success",
              message: "添加成功！",
            });
          } else {
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
        }).catch((err) => {
          this.editFormVisible = false;
          this.loading = false;
          this.$message.error("保存失败，请稍后再试！");
        });
      }else{
        this.$axios({
        url: this.$baseURL + "/manage/banner/edit.html",
        method: "PUT",
        data: {
          b_id:this.editForm.b_id,
          b_title: this.editForm.b_title,
          b_type: this.editForm.b_type,
          b_content: this.editForm.b_content,
          b_platform: this.editForm.b_platform,
          b_image: this.editForm.b_image,
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.getdata();
            this.editFormVisible = false;
            this.loading = false;
            this.$message({
              type: "success",
              message: "编辑成功！",
            });
          } else {
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
        })
      }
    },

    // 删除分类
    deleteType(index,row) {
      this.loading = true;
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(()=>{
        this.$axios({
        url: this.$baseURL + "/manage/banner/del.html",
        method: "DELETE",
        data: {
          b_id: row.b_id,
        },
      }).then(() => {
          if (res.code === 1000) {
            this.loading = false;
            this.listData.splice(index,1)
            this.$message.success("删除成功")
          } else {
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
        })
      })
      .catch(() => {
          this.editFormVisible = false;
          this.loading = false;
          this.$message.error("删除失败，请稍后再试！");
        });
    },

    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },

     //状态切换
    changestatus(row){
     this.$axios({
        url: this.$baseURL + "/manage/banner/status.html",
        method: "PUT",
        data: {
          b_id:row.b_id,
          b_status: row.b_status,
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.$message.success('状态修改成功');
          }else{
            this.$message.error(res.mes);
          }
      })
    },

    //筛选状态
    filterstatus(e){
      this.formInline.status=e
      this.getdata()
    },

    //type值切换变化
    changetype(e){
      this.editForm.b_content=''
    },

    //获取产品列表
    getproduct(){
      this.$axios({
        url: this.$baseURL + "/manage/product/list.html",
        method: "POST",
        data: {
          limit:30,
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.productlist=res.data.data
          }
      })
    },
    //裁剪好的缩略图图片
    uploadimg(upimg){
      this.editForm.b_image=upimg
      this.keys--
      this.$message.success('图片上传成功')
    },

    //删除缩略图上传图片
    removeimg(){
      this.editForm.b_image=''
      this.keys++
      this.$message.error('图片删除成功')
    },

  },
};
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
.el-select{
  width: 110px;
}
.scoper{
  width: 135px;
  height: 135px;
  border: 1px dashed #d9d9d9;
}
.scoper:hover {
  border-color: #409EFF;
}
</style>

 
 