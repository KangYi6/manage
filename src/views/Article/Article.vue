/**
 * 文章管理 文章列表
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.keyword" placeholder="搜索文章标题" @keyup.enter.native="search"></el-input>
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
      <el-table-column align="center" type="selection" min-width="50">
      </el-table-column>
      <el-table-column align="center" sortable type="index" label="序号" min-width="50">
      </el-table-column>
      <el-table-column align="center" prop="title" label="标题" min-width="120">
      </el-table-column>
      <el-table-column align="center" label="缩略图" min-width="80">
        <template slot-scope="scope">
           <img :src="scope.row.thumb" style="width: 60px;height: 60px;">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="auther" label="作者" min-width="100">
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="80">
        <template slot-scope="scope">
           <el-switch v-model="scope.row.status" @change="changestatus(scope.row)" active-value=1 inactive-value=0 active-text="正常"></el-switch>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="addtime" label="添加时间" min-width="120">
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
    <el-dialog :title="title" :visible.sync="editFormVisible" width="70%" @click="closeDialog" :close-on-click-modal="modal" style="height:110%; margin-top: -50px;">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm" v-loading="newsload" element-loading-text="拼命加载中">
        <el-form-item>
          <el-form-item label="标题" prop="title" size="small"  style="float: left; margin-left: -120px;">
            <el-input v-model="editForm.title" placeholder="请输入标题" style="width: 120%;"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="auther" size="small">
            <el-input v-model="editForm.auther" placeholder="请输入作者" style="width: 25%;"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="缩略图" prop="thumb">
          <div style="color:red;">（* 建议图片像素尺寸不超过1177*658）</div>
          <scoper class="scoper" v-bind:imgurl="editForm.thumb" :key="keys" @upimg="uploadimg" :autoCropWidth="scropWidth_5" :autoCropHeight="scropHeight_5" autoCrop="true"></scoper>
          <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 27px;" @click="removeimg" v-show="editForm.thumb">删除</el-button>
        </el-form-item>
        <el-form-item label="内容" prop="content" size="small">
          <quill-editor v-model="editForm.content"/>
        </el-form-item>

        <el-form-item>
          <el-form-item label="发布时间" prop="addtime" style="float: left; margin-left: -120px;">
            <el-date-picker v-model="editForm.addtime" type="datetime" size="small" placeholder="选择发布时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="SEO标题" prop="seotitle" style="float: left; margin-right: 80px;">
            <el-input v-model="editForm.seotitle" placeholder="请输入SEO标题" size="small" style="width:120%;"></el-input>
          </el-form-item>
          <el-form-item label="关键词" prop="keywords" style="margin-left: 300px;">
            <el-input v-model="editForm.keywords" placeholder="请输入关键词" size="small" style="width: 30%;"></el-input>
          </el-form-item>
        </el-form-item>
         
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description" placeholder="请输入描述" size="small" style="width: 100%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="addType"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "../../components/Pagination";
import scoper from '../../components/scoper'
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  data() {
    return {
      // 裁剪尺寸
      scropWidth_5:1177,
      scropHeight_5:658,

      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是否显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏

      // 单页数据
      formInline: {
        page: 1,
        limit: 10,
        keyword: '',
        status:'',
      },

      title: "添加",

      // 编辑表单
      editForm: {
        id:'',
        title:'',
        thumb:'',
        auther:'',
        content:'',
        addtime:'',
        status:'',
        seotitle:'',
        keywords:'',
        description:'',
      },
      //添加弹窗状态
      needadd:false,

      // rules表单验证
      rules: {
        PId: [{ required: true, message: "请输入ID", trigger: "blur" }],
        typeName: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        typeStatus: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },

      //搜索权限
      userparm: [],

      //用户数据
      listData: [],

      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },

      //图片上传变化
      keys:1,

      //分类列表
      classification:[],

      //下拉状态选择
       options: [{
          status: '1',
          label: '正常'
        }, {
          status: '0',
          label: '隐藏'
        }],
        status: '',

        //富文本内容
        content:'',

        //文章详情加载中
        newsload:false,

        modal:false,
    };
  },
  // 注册组件
  components: {
    Pagination,
    //上传裁剪组件
    scoper,
    //富文本组件
    quillEditor
  },

  // 创建完毕
  created() {
    this.getdata();
  },

  methods: {
    // 获取产品列表
    getdata() {
      this.loading = true;
      this.$axios({
        url: this.$baseURL + "/manage/news/list.html",
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
        this.getnews(row)
        this.title = "编辑文章";
        this.needadd=false
      }
    },
    //显示添加界面
    handadd(){
      this.editFormVisible = true;
      this.title = "添加文章";
      this.editForm.id='',
      this.editForm.title='',
      this.editForm.thumb='',
      this.editForm.auther='',
      this.editForm.content='',
      this.editForm.addtime='',
      this.editForm.seotitle='',
      this.editForm.keywords='',
      this.editForm.description=''
      this.needadd=true
      if(this.keys>1){
        this.keys--
      }else{
        this.keys++
      }
    },

    // 添加产品
    addType() {
      this.loading = true;
       //判断非正规时间
      if(('"'+this.editForm.addtime+'"').length>20){
        // 补0
      function timeP(s) {
        return s < 10 ? '0' + s : s
      }
      let timer=new Date(this.editForm.addtime)
      this.editForm.addtime=timer.getFullYear()+'-'+timeP(timer.getMonth()+1)+'-'+timeP(timer.getDate())+' '+timeP(timer.getHours())+':'+timeP(timer.getMinutes())+':'+timeP(timer.getSeconds());
      }
      //判断是否是添加或编辑
      if(this.needadd){
        this.$axios({
        url: this.$baseURL + "/manage/news/add.html",
        method: "POST",
        data: {
          title:this.editForm.title,
          thumb:this.editForm.thumb,
          auther:this.editForm.auther,
          content:this.editForm.content,
          addtime:this.editForm.addtime,
          seotitle:this.editForm.seotitle,
          keywords:this.editForm.keywords,
          description:this.editForm.description,
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
        }).catch(() => {
          this.editFormVisible = false;
          this.loading = false;
          this.$message.error("保存失败，请稍后再试！");
        });
      }else{
        this.$axios({
        url: this.$baseURL + "/manage/news/edit.html",
        method: "PUT",
        data: {
          id:this.editForm.id,
          title:this.editForm.title,
          thumb:this.editForm.thumb,
          auther:this.editForm.auther,
          content:this.editForm.content,
          addtime:this.editForm.addtime,
          seotitle:this.editForm.seotitle,
          keywords:this.editForm.keywords,
          description:this.editForm.description,
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

    // 删除产品
    deleteType(index,row) {    
      this.loading = true;
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(()=>{
        this.$axios({
        url: this.$baseURL + "/manage/news/del.html",
        method: "DELETE",
        data: {
          id: row.id,
        },
      }).then((res) => {
        if(res.code==1000){
          this.listData.splice(index,1)
          this.$message.success("删除成功")
        }else{
          this.$message.error(res.msg)
        }
      })
      })
      .catch((err) => {
          this.editFormVisible = false;
          this.loading = false;
          // this.$message.warning("取消删除");
        });
      this.loading = false;
    },

    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
     //状态切换
    changestatus(row){
      this.$axios({
        url: this.$baseURL + "/manage/news/status.html",
        method: "PUT",
        data: {
          id: row.id,
          status: row.status,
        },
      }).then((res) => {
        if(res.code==1000){
          this.$message,success('状态修改成功')
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    //裁剪好的缩略图图片
    uploadimg(upimg){
      this.editForm.thumb=upimg
      this.keys--
      this.$message.success('图片上传成功')
    },
    //删除缩略图上传图片
    removeimg(){
      this.editForm.thumb=''
      this.keys++
      this.$message.error('图片删除成功')
    },
    //筛选状态
    filterstatus(e){
      this.formInline.status=e
      this.getdata()
    },
    //获取文章信息
    getnews(row){
      this.newsload = true;
      this.$axios({
        url: this.$baseURL + "/manage/news/getInfo.html",
        method: "GET",
        params: {
          id: row.id,
        },
      }).then((res) => {
        if(res.code==1000){
          this.editForm.id=res.data.id
          this.editForm.title=res.data.title
          this.editForm.thumb=res.data.thumb
          this.editForm.auther=res.data.auther
          this.editForm.content=res.data.content
          this.editForm.addtime=res.data.addtime
          this.editForm.status=res.data.status
          this.editForm.seotitle=res.data.seotitle
          this.editForm.keywords=res.data.keywords
          this.editForm.description=res.data.description
          if(this.keys>1){
            this.keys--
          }else{
            this.keys++
          }
          this.newsload = false;
        }else{
          this.$message.error(res.msg)
          this.newsload = false;
          this.editFormVisible = false;
        }
      }).catch((err)=>{
        this.$message.error('加载失败')
        this.newsload = false;
        this.editFormVisible = false;
      })
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

 
 