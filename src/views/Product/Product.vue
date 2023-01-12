/**
 * 产品管理 产品列表
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>产品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.keyword" placeholder="搜索产品名称" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item label="状态：">
      <el-select size="small" v-model="status" clearable placeholder="全部" @change="filterstatus">
         <el-option v-for="item in options" :key="item.status" :label="item.label" :value="item.status"></el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="分类：">
      <el-select size="small" filterable v-model="categorys" clearable placeholder="全部" @change="filtercategorys">
         <el-option v-for="item in classification" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
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
      <el-table-column align="center" prop="p_title" label="标题" min-width="100">
      </el-table-column>
      <el-table-column align="center" label="缩略图" min-width="80">
        <template slot-scope="scope">
          <img :src="scope.row.p_thumb" style="width: 60px;height: 60px;">
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="p_price" label="价格" min-width="80">
      </el-table-column>
      <el-table-column align="center" prop="c_name" label="分类名称" min-width="100">
      </el-table-column>
      <el-table-column align="center" label="推荐" min-width="100">
        <template slot-scope="scope">
           <el-switch v-model="scope.row.p_command" @change="changecomm(scope.row)" active-value=1 inactive-value=0 active-text="推荐"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="100">
        <template slot-scope="scope">
           <el-switch v-model="scope.row.p_status" @change="changestatus(scope.row)" active-value=1 inactive-value=0 active-text="正常"></el-switch>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="p_addtime" label="添加时间" min-width="120">
      </el-table-column>
      <el-table-column align="center" label="类型" min-width="100">
        <template slot-scope="scope">
           <span v-if="scope.row.p_type == 1">直播课</span>
           <span v-if="scope.row.p_type == 2">视频课</span>
           <span v-if="scope.row.p_type == 3">产品</span>
        </template>
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
    <el-dialog :title="title" :visible.sync="editFormVisible" width="80%" @click="closeDialog" :close-on-click-modal="modal" style="margin-top: -80px;">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm" v-loading="courseloading" style="margin-left:-40px;">    
        <el-form-item class="item" label="标题" size="small" prop="p_title" style="float:left;"> 
          <el-input v-model="editForm.p_title" placeholder="请输入标题" width="50%"></el-input>
        </el-form-item>
        <el-form-item label="产品分类" prop="p_pid" style="margin-left: 300px;">
          <el-select size="small" v-model="editForm.p_pid" placeholder="请选择分类" clearable>
            <el-option v-for="item in classification" :key="item.c_id" v-show="item.c_status==1" :label="item.c_name" :value="item.c_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="p_desc">
          <el-input v-model="editForm.p_desc" placeholder="请输入描述" size="small" width="50%"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="p_price">
          <el-input size="small" v-model="editForm.p_price" placeholder="请输入价格" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="推荐图" prop="p_command" style="float:left; margin-left: -105px;">
            <div style="color:red;">（* 建议图片像素尺寸不超过331*383）</div>
            <scoper class="scoper" v-bind:imgurl="editForm.p_command_pic" :key="keys" @upimg="uploadcommand" :autoCropWidth="scropWidth_1" :autoCropHeight="scropHeight_1" autoCrop="true"></scoper>
            <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 27px;" @click="removecommand" v-show="editForm.p_command_pic">删除</el-button>
          </el-form-item>
          <el-form-item label="缩略图" prop="p_thumb" style="float:left">
            <div style="color:red;">（* 建议图片像素尺寸不超过378*224）</div>
            <scoper class="scoper" v-bind:imgurl="editForm.p_thumb" :key="keys" @upimg="uploadimg" :autoCropWidth="scropWidth_2" :autoCropHeight="scropHeight_2" autoCrop="true"></scoper>
            <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 27px;" @click="removeimg" v-show="editForm.p_thumb">删除</el-button>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-form-item label="详细图" prop="p_body" style="margin-left: -105px;">
          <div style="color:red;">（* 建议图片像素宽度不超过750）</div>
          <div v-for="(body,ind) in editForm.p_body" :key="ind" class="pimages" @click="pbody(ind)">
          <scoper class="scoper" v-bind:imgurl="body" :key="keys" @upimg="uploadpbody" :autoCropWidth="scropWidth_3" :autoCropHeight="scropHeight_3" autoCrop="false"></scoper>
            <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 27px;" @click="removepbody(ind)" v-show="editForm.p_body">删除</el-button>
          </div>
          <div class="pimages">
            <scoper class="scoper" @upimg="uploadaddbody" :autoCropWidth="scropWidth_3" :autoCropHeight="scropHeight_3" autoCrop="true"></scoper>
          </div>
        </el-form-item>
        <el-form-item label="图片列表" prop="p_images" style="margin-left: -105px;">
          <div style="color:red;">（* 建议图片像素尺寸不超过1068*583）</div>
          <div v-for="(i,index) in editForm.p_images" :key="index" class="pimages" @click="pimg(index)">
            <scoper v-bind:imgurl="i" :key="keys" @upimg="uploadupimg" :autoCropWidth="scropWidth_4" :autoCropHeight="scropHeight_4" autoCrop="true"></scoper>
          <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 27px;" @click="removeupimg(index)" v-show="editForm.p_images">删除</el-button>
          </div>
          <div class="pimages">
            <scoper class="scoper" @upimg="uploadaddupimg" :autoCropWidth="scropWidth_4" :autoCropHeight="scropHeight_4" autoCrop="true"></scoper>
          </div>
        </el-form-item>
        </el-form-item>
        <el-form-item label="详情文字" prop="p_body_text">
          <el-input type="textarea" v-model="editForm.p_body_text" placeholder="请输入详情" size="small" style="height:20%"></el-input>
        </el-form-item>
        <el-form-item label="推荐" prop="p_command" style="float: left;">
          <el-radio v-model="editForm.p_command" label="1">是</el-radio>
          <el-radio v-model="editForm.p_command" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="类型" prop="p_type" style="margin-left: 100px;">
          <el-radio v-model="editForm.p_type" label="1">直播</el-radio>
          <el-radio v-model="editForm.p_type" label="2">闯关</el-radio>
          <el-radio v-model="editForm.p_type" label="3">产品</el-radio>
          <el-radio v-model="editForm.p_type" label="4">课程</el-radio>
        </el-form-item>
        <el-form-item label="班级" prop="p_grade" v-if="editForm.p_type==1 && editForm.p_type">
          <el-select size="small" v-model="editForm.p_grade" placeholder="请选择班级" clearable>
            <el-option v-for="item in classlist" :key="item.g_id" :label="item.g_name" :value="item.g_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程" prop="p_course" v-if="editForm.p_type!=3 && editForm.p_type">
          <el-select size="small" v-model="editForm.p_course" placeholder="请选择课程" clearable @change="changecourses" @clear="clearcourse">
            <el-option v-for="item in Courselist" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课本" prop="p_textbook" v-if="editForm.p_type!=1 && editForm.p_type!=3 && editForm.p_type">
          <el-select size="small" v-model="editForm.p_textbook" placeholder="请选择课本" clearable @change="changebook">
            <el-option v-for="item in classes" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课时" v-show="false">
          <el-select size="small" v-model="editForm.p_hour" placeholder="请选择课时" clearable>
            <el-option v-for="item in hourList" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
          </el-select>
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
      // 裁剪尺寸
      // 推荐图
      scropWidth_1:331,
      scropHeight_1:383,
      // 缩略图
      scropWidth_2:378,
      scropHeight_2:224,
      // 详细图
      scropWidth_3:1920,
      scropHeight_3:1080,
      // 图片列表
      scropWidth_4:1068,
      scropHeight_4:583,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是否显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      // 单页数据
      formInline: {
        page: 1,
        limit: 10,
        keyword: '',
        category:'',
        status:'',
      },
      title: "添加",
      coursedata: 0,
      // 编辑表单
      editForm: {
        p_id:'',
        p_title:'',
        p_desc:'',
        p_command_pic:'',
        p_thumb:'',
        p_body:'',
        p_body_text:'',
        p_images:'',
        p_price:'',
        p_pid:'',
        p_command:'',
        p_type:'',
        c_name:'',
        p_status:1,
        p_grade:'', //班级id
        p_course:'', //课程id
        p_textbook:'', //课本id
        p_hour:'', //课时id
      },
      //添加弹窗状态
      needadd:false,
      // rules表单验证
      rules: {
        p_title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        p_pid: [{ required: true, message: "请选择分类", trigger: "blur" }],
        p_desc: [{ required: true, message: "请输入描述", trigger: "blur" }],
        p_price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        p_type: [{ required: true, message: "", trigger: "blur" }],
        p_command: [{ required: true, message: "", trigger: "blur" }],
        p_thumb: [{ required: true, message: "", trigger: "blur" }],
        p_images: [{ required: true, message: "", trigger: "blur" }],
        p_grade: [{ required: true, message: "请选择班级", trigger: "blur" }],
        p_course: [{ required: true, message: "请选择课程", trigger: "blur" }],
        p_textbook: [{ required: true, message: "请选择课本", trigger: "blur" }],
        p_body_text: [{ required: true, message: "请输入详情", trigger: "blur" }],
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
      keys: 1,
      //分类列表
      classification: [],
      //下拉状态选择
      options: [{
        status: '1',
        label: '正常'
      }, {
        status: '0',
        label: '隐藏'
      }],
      status: '',
      //下拉分类
      categorys:'',
      //班级列表
      classlist:[],
      //课程列表
      Courselist:[],
      //课本列表
      classes:[],
      // 课时列表
      hourList:[],
      //替换数组下标
      pimgindex: '',
      pbodyindex: '',
      modal: false,    
      courseloading: false,
    };
  },
  // 注册组件
  components: {
    Pagination,
    //上传裁剪组件
    scoper
  },
  // 创建完毕
  created() {
    this.getdata();
    this.getclassification()
    this.getClass()
    this.getCourse()
  },
  methods: {
    //获取产品列表
    getdata() {
      this.loading = true;
      this.$axios({
        url: this.$baseURL + "/manage/product/list.html",
        method: "POST",
        data: {
          page: this.formInline.page,
          limit: this.formInline.limit,
          category:this.formInline.category,
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
    //获取产品信息
    getinfo(row){
      this.courseloading=true
      this.$axios({
        url: this.$baseURL + "/manage/product/getInfo.html",
        method: "GET",
        params:{
          p_id:row.p_id,
        }
      }).then((res) => {

        this.getClass()
        this.getCourse() 
        this.getTextbook(res.data.p_course)
        this.editForm.p_id = res.data.p_id;
        this.editForm.p_title = res.data.p_title;
        this.editForm.p_desc = res.data.p_desc;
        this.editForm.p_command_pic = res.data.p_command_pic;
        this.editForm.p_thumb = res.data.p_thumb;
        this.editForm.p_body = res.data.p_body;
        this.editForm.p_body_text = res.data.p_body_text;
        this.editForm.p_images = res.data.p_images;
        this.editForm.p_price = res.data.p_price;
        this.editForm.p_command = res.data.p_command;
        this.editForm.p_type = res.data.p_type.toString();
        this.editForm.p_status = res.data.p_status;
        this.editForm.p_grade = res.data.p_grade;
        this.editForm.p_course = res.data.p_course;
        this.editForm.p_textbook = res.data.p_textbook;
        this.editForm.p_hour = res.data.p_period;
        this.keys++
        this.courseloading = false
      })
    },
    //分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata();
    },
    //搜索事件
    search() {
      this.formInline.page = 1;
      this.getdata();
    },
    //显示编辑界面
    handleEdit(row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.getinfo(row)
        this.title = "编辑产品";
        this.needadd=false
      }
    },
    //显示添加界面
    handadd(){
      this.editFormVisible = true;
      this.editForm.p_id = '';
      this.editForm.p_title = '';
      this.editForm.p_desc = '';
      this.editForm.p_command_pic = '';
      this.editForm.p_thumb = '';
      this.editForm.p_body = [];
      this.editForm.p_body_text = '';
      this.editForm.p_images = [];
      this.editForm.p_price = '';
      this.editForm.p_pid = '';
      this.editForm.p_command = '0';
      this.editForm.p_type = '1';
      this.editForm.p_grade = '';
      this.editForm.p_course = '';
      this.editForm.p_textbook = '';
      this.editForm.p_hour = '';
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
      if(this.needadd){
        this.$axios({
          url: this.$baseURL + "/manage/product/add.html",
          method: "POST",
          data: {
            p_title: this.editForm.p_title,
            p_desc:this.editForm.p_desc,
            p_command_pic:this.editForm.p_command_pic,
            p_thumb:this.editForm.p_thumb,
            p_body:this.editForm.p_body.toString(),
            p_body_text:this.editForm.p_body_text,
            p_images:this.editForm.p_images.toString(),
            p_price:this.editForm.p_price,
            p_pid:this.editForm.p_pid,
            p_grade:this.editForm.p_grade,
            p_course:this.editForm.p_course,
            p_textbook:this.editForm.p_textbook,
            p_period:this.editForm.p_hour,
            p_command:this.editForm.p_command,
            p_type:this.editForm.p_type,
          },
        }).then((res) => {
          if (res.code === 1000) {
            this.getdata();
            this.editFormVisible = false;
            this.$message({
              type: "success",
              message: "添加成功！",
            });
            this.loading = false;
          } else {
            this.loading = false;
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
        let body = ''
        if(this.editForm.p_body){
          body = this.editForm.p_body.toString()
        }
        this.$axios({
        url: this.$baseURL + "/manage/product/edit.html",
        method: "PUT",
        data: {
          p_id:this.editForm.p_id,
          p_title: this.editForm.p_title,
          p_desc:this.editForm.p_desc,
          p_command_pic:this.editForm.p_command_pic,
          p_thumb:this.editForm.p_thumb,
          p_body:body,
          p_body_text:this.editForm.p_body_text,
          p_images:this.editForm.p_images.toString(),
          p_price:this.editForm.p_price,
          p_pid:this.editForm.p_pid,
          p_grade:this.editForm.p_grade,
          p_course:this.editForm.p_course,
          p_textbook:this.editForm.p_textbook,
          p_command:this.editForm.p_command,
          p_type:this.editForm.p_type,
          p_period:this.editForm.p_hour,
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.getdata();
            this.editFormVisible = false;
            this.$message({
              type: "success",
              message: "编辑成功！",
            });
            this.loading = false;
          } else {
            this.loading = false;
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
        url: this.$baseURL + "/manage/product/del.html",
        method: "DELETE",
        data: {
          p_id: row.p_id,
        },
      }).then((res) => {
        if(res.code==1000){
          this.listData.splice(index,1)
          this.$message.success(res.msg)
          this.loading = false;
        }else{
          this.$message.error(res.msg)
          this.loading = false;
        }
      })
      })
      .catch((err) => {
          this.editFormVisible = false;
          this.loading = false;
          this.$message.error("删除失败，请稍后再试！");
        });
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
    //推荐切换
    changecomm(row){
      this.$axios({
        url: this.$baseURL + "/manage/product/command.html",
        method: "PUT",
        data: {
          p_id: row.p_id,
          p_command: row.p_command,
        },
      }).then((res) => {
        if(res.code != 1000){
          this.$message.success(res.msg)
        }
      })
    },
    //状态切换
    changestatus(row){
      this.$axios({
        url: this.$baseURL + "/manage/product/status.html",
        method: "PUT",
        data: {
          p_id: row.p_id,
          p_status: row.p_status,
        },
      }).then((res) => {
        if(res.code == 1000){
          this.$message.success('状态修改成功')
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    //裁剪好的缩略图图片
    uploadimg(upimg){
      this.editForm.p_thumb=upimg
      this.keys--
      this.$message.success('图片上传成功')
    },
    //删除缩略图上传图片
    removeimg(){
      this.editForm.p_thumb=''
      this.keys++
      this.$message.success('图片删除成功')
    },
    //裁剪好的推荐图片
    uploadcommand(upimg){
      this.editForm.p_command_pic=upimg
      this.keys--
      this.$message.success('图片上传成功')
    },
    //删除推荐上传图片
    removecommand(){
      this.editForm.p_command_pic=''
      this.keys++
      this.$message.success('图片删除成功')
    },
    //裁剪好的详情图图片
    uploadpbody(upimg){
      if(this.editForm.p_body){
        this.editForm.p_body.splice(this.pbodyindex,1,upimg)
      }else{
        this.editForm.p_body=upimg
      }
      this.keys--
      this.$message.success('图片上传成功')
    },
    //删除详情图上传图片
    removepbody(ind){
      this.editForm.p_body.splice(ind,1)
      this.keys++
      this.$message.success('图片删除成功')
    },
    //裁剪好的图片列表
    uploadupimg(upimg){
      if(this.editForm.p_images){
        this.editForm.p_images.splice(this.pimgindex,1,upimg)
      }else{
        this.editForm.p_images=upimg
      }
      this.keys--
      this.$message.success('图片上传成功')
    },
    //删除图片列表上传图片
    removeupimg(index){
      this.editForm.p_images.splice(index,1)
      this.keys++
      this.$message.success('图片删除成功')
    },
    //添加图片列表
    uploadaddupimg(upimg){
      this.editForm.p_images.push(upimg)
      this.keys++
    },
    //添加详情图文列表
    uploadaddbody(upimg){
      if(this.editForm.p_body==null){
        this.editForm.p_body=[]
      }
      this.editForm.p_body.push(upimg)
      this.keys++
    },
    //获取产品分类列表
    getclassification(){
      this.$axios({
        url: this.$baseURL + "/manage/productcate/list.html",
        method: "POST",
        data:{
          limit:30,
        }
      }).then((res) => {
        this.classification=res.data.data
      })
    },
    //筛选状态
    filterstatus(e){
      this.formInline.status=e
      this.getdata()
    },
    //筛选产品分类
    filtercategorys(e){
      this.formInline.category=e
      this.getdata()
    },
    //获取班级列表
    getClass(){
      this.$axios({
        url: this.$baseURL + "/manage/grade/list.html",
        method: "POST",
        data:{
          status:1,
          limit:9999,
        }
      }).then((res) => {
        this.classlist=res.data.data;
      })
    },
    //获取课程列表
    getCourse(){
      this.$axios({
        url: this.$baseURL + "/manage/course/list.html",
        method: "POST",
        data:{
          status:1,
          limit:9999,
        }
      }).then((res) => {
        this.Courselist=res.data.data;
      })
    },
    //获取课本列表
    getTextbook(id){
      this.$axios({
        url: this.$baseURL + "/manage/course/list.html",
        method: "POST",
        data:{
          status:1,
          limit:9999,
          course:id
        }
      }).then((res) => {
        if(this.coursedata == 0){
          this.classes = []
        }else if(this.coursedata == 1){
          this.classes = res.data.data
        }
      })
    },
    // 获取课时列表
    getHour(id){
      this.$axios({
        url: this.$baseURL + "/manage/course/list.html",
        method: "POST",
        data: {
          limit:30,
          course:id,
          status:1,
        },
      }).then((res) => {
        if (res.code === 1000) {
          this.hourList = res.data.data
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    //图片点击获取下标
    pimg(index){
      this.pimgindex=index
    },
    //详情图文获取下标
    pbody(ind){
      this.pbodyindex=ind
    },
    //课程选定显示课本
    changecourses(e){
      this.editForm.p_textbook = ''
      this.getTextbook(e)
      this.coursedata = 1
    },
    // 清除课本信息
    clearcourse(){
      this.editForm.p_textbook = ''
      this.coursedata = 0
    },
    // 课本选定显示课时
    changebook(e){
      this.editForm.p_hour=''
      if(this.editForm.p_textbook != '' && this.editForm.p_course != ''){
       this.getHour(e)
      }
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
  width: 150px;
}
.pimages{
  float: left;
  padding-right: 20px;
}

.scoper{
  width: 135px;
  height: 135px;
  border: 1px dashed #d9d9d9;
}
.scoper:hover {
  border-color: #409EFF;
}
.item{
  float: left;
  clear:both;
}
</style>

 
 