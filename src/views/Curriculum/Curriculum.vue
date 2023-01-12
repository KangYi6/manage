/**
 * 教学管理 课程列表
 */
<template>
  <div> 
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.keyword" placeholder="搜索课程名称" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item label="状态：">
      <el-select size="small" v-model="formInline.status" clearable placeholder="全部" @change="filterstatus">
        <el-option v-for="item in options" :key="item.status" :label="item.label" :value="item.status"></el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="课程：">
        <el-select size="small" filterable v-model="formInline.courses" width="200" clearable placeholder="请选择" @change="selectcourse" @clear="clearcourse">
          <el-option v-for="item in courselist" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="课本：">
        <el-select size="small" filterable v-model="formInline.textbook" clearable placeholder="请选择" @change="selecttextbook" @clear="cleartextbook">
          <el-option v-for="item in textbooklist" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handadd">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" border :data="listData" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%">
      <el-table-column align="center" type="selection" min-width="60">
      </el-table-column>
      <el-table-column align="center" sortable type="index" label="序号" min-width="50">
      </el-table-column>
      <el-table-column align="center" prop="c_name" label="名称" min-width="100">
      </el-table-column>
      <el-table-column align="center" prop="category" label="所属" min-width="80">
      </el-table-column>
      <el-table-column align="center" prop="c_desc" label="描述" min-width="200">
      </el-table-column>
      <el-table-column align="center" label="缩略图" min-width="80">
        <template slot-scope="scope">
          <img :src="scope.row.c_thumb" style="width: 60px;height: 60px;">
        </template>
      </el-table-column>
      <el-table-column align="center" label="付费" min-width="50">
        <template slot-scope="scope">
           <span v-if="scope.row.c_free==1">是</span>
           <span v-if="scope.row.c_free==0">否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示平台" min-width="100">
        <template slot-scope="scope">
           <span v-if="scope.row.c_platform=='1'">APP</span>
           <span v-if="scope.row.c_platform=='2'">小程序</span>
           <span v-if="scope.row.c_platform=='1,2'">APP，小程序</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="80">
        <template slot-scope="scope">
           <el-switch v-model="scope.row.c_status" @change="changestatus(scope.row)" active-value=1 inactive-value=0 active-text="正常"></el-switch>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="c_addtime" label="添加时间" min-width="120">
      </el-table-column>
      <el-table-column sortable align="center" prop="c_sort" label="排序" min-width="80">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteType(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @click="closeDialog" :close-on-click-modal="modal" style="height:110%; margin-top: -50px;">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm" style="margin-left: -50px;">
        <el-form-item label="名称" prop="c_name">
          <el-input v-model="editForm.c_name" placeholder="请输入名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="c_type">
          <el-radio v-model="editForm.c_type" label="1">课程</el-radio>
          <el-radio v-model="editForm.c_type" label="2">课本</el-radio>
          <el-radio v-model="editForm.c_type" label="3">课时</el-radio>
        </el-form-item>
        <el-form-item label="所属课程" prop="classid" v-show="editForm.c_type=='2'">
          <el-select size="small" filterable v-model="editForm.classid" clearable placeholder="请选择所属课程" @change="selectcourse" @clear="clearcourse">
            <el-option v-for="item in courselist" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属课程" prop="classid" v-show="editForm.c_type=='3'">
          <el-select size="small" filterable v-model="editForm.c_tid" clearable placeholder="请选择所属课程" @change="selectcourse" @clear="clearcourse">
            <el-option v-for="item in courselist" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属课本" prop="bookid" v-show="editForm.c_type=='3'">
          <el-select size="small" filterable v-model="editForm.bookid" clearable placeholder="请选择所属课本">
            <el-option v-for="item in textbooklist" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缩略图" prop="c_thumb">
          <div style="color:red">（* 建议图片像素尺寸不超过200*200）</div>
          <scoper class="scoper" v-bind:imgurl="editForm.c_thumb" :key="keys" @upimg="uploadimg" :autoCropWidth="scropWidth1" :autoCropHeight="scropHeight1" autoCrop="false"></scoper>
          <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 27px;" @click="removeimg" v-show="editForm.c_thumb">删除</el-button>
        </el-form-item>
        <el-form-item label="描述" prop="c_desc">
          <el-input v-model="editForm.c_desc" placeholder="请输入描述（选填）" size="small"></el-input>
        </el-form-item>
        <el-form-item label="付费" prop="c_free">
          <el-radio v-model="editForm.c_free" label="1">是</el-radio>
          <el-radio v-model="editForm.c_free" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="显示平台" prop="c_platform">
          <el-checkbox v-model="editForm.platform" label="APP"></el-checkbox>
          <el-checkbox v-model="editForm.platform" label="小程序"></el-checkbox>
        </el-form-item>
        <el-form-item label="排序" prop="c_sort">
          <el-input v-model="editForm.c_sort" placeholder="请输入排序（选填）" size="small" type="number"></el-input>
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
      scropWidth1:200,
      scropHeight1:200,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是否显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      // 课程信息
      infoList:[],
      // 单页数据
      formInline: {
        page: 1,
        limit: 10,
        courses: '',
        textbook: '',
        status: '',
        keyword: '',
      },
      coursedata: 0,
      title: "添加",
      // 编辑表单
      editForm: {
        c_id:'',
        c_name:'',
        c_type:'',
        c_pid:'',
        hour: '',
        c_desc:'',
        c_thumb:'',
        c_tid:'',
        c_sort:'',
        c_free:'',
        platform:[],
        classid: '', //课程id
        bookid: '', //课本id
      },
      //添加弹窗状态
      needadd:false,
      // rules表单验证
      rules: {
        c_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        c_type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        classid: [{ required: true, message: "请选择课程", trigger: "blur" }],
        bookid: [{ required: true, message: "请选择课本", trigger: "blur" }],
        c_free: [{ required: true, message: "", trigger: "blur" }],
        c_platform: [{ required: true, message: "", trigger: "blur" }],
      },
      // 列表数据
      listData: [],
      //课程列表
      courselist:[{name:''}],
      //课本列表
      textbooklist:[],
      //课时列表
      classhourlist:[],
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
      //图片上传组件重载
      keys:1,
      
      //传课程id获取课时
      courseid:'',
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
    this.getcourse();
  },
  methods: {
    //获取课程
    getcourse(){
      this.$axios({
        url: this.$baseURL + "/manage/course/list.html",
        method: "POST",
        data: {
          limit:9999,
          status: this.formInline.status,
          keyword: this.formInline.keyword,
          status: this.formInline.status,
        },
      }).then((res) => {
        if (res.code === 1000) {
          this.courselist = res.data.data
          this.listData = this.courselist
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    //获取课本
    gettextbook(id){
      this.$axios({
        url: this.$baseURL + "/manage/course/list.html",
        method: "POST",
        data: {
          limit:9999,
          course:id,
          status: this.formInline.status,
        },
      }).then((res) => {
        if (res.code === 1000) {
          if(this.coursedata == 0){
            this.textbooklist = []
          }else if(this.coursedata == 1){
            this.textbooklist = res.data.data
          }
          this.listData = this.textbooklist
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    //获取课时
    getclasshour(id){
      this.$axios({
        url: this.$baseURL + "/manage/course/list.html",
        method: "POST",
        data: {
          limit:9999,
          course:id,
          // period:'',
          status:this.formInline.status,
        },
      }).then((res) => {
        if (res.code === 1000) {
          this.classhourlist = res.data.data
          let arr = [];
          this.classhourlist.filter(item => {
            if(item.c_id==this.editForm.cw_pid){
              arr = item
            }
          })
          this.editForm.hour = arr.c_name
          this.listData = this.classhourlist
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    // 获取课程信息
    getInfo(row){
      this.$axios({
        url: this.$baseURL + "/manage/course/getInfo.html",
        method: "GET",
        params: {
          c_id: row.c_id
        },
      }).then((res) => {
        console.log(res.data)
        this.editForm.c_id = res.data.c_id;
        this.editForm.c_name = res.data.c_name;
        this.editForm.c_type = res.data.c_type;
        this.editForm.c_desc= res.data.c_desc;
        this.editForm.c_sort = res.data.c_sort;
        this.editForm.c_free = res.data.c_free;
        this.editForm.c_tid = res.data.c_tid
        this.editForm.c_thumb = res.data.c_thumb
        // classid/bookid 赋值
        if(res.data.c_type == '1'){
          this.editForm.classid = '';
        }else if(res.data.c_type == '2'){
          this.editForm.classid = res.data.c_pid
        }else{
          this.editForm.bookid = res.data.c_pid
        }
        // platform 赋值
        if(row.c_platform == '1'){
          this.editForm.platform = ['APP'];
        }
        if(row.c_platform == '2'){
          this.editForm.platform = ['小程序'];
        }
        if(row.c_platform == '1,2'){
          this.editForm.platform = ['APP','小程序'];
        }
      });
    },
    //显示编辑界面
    handleEdit(row) {
      this.editFormVisible = true;
      this.editForm.c_thumb = row.c_thumb;
      this.getInfo(row);
      this.getcourse();
      if (row != undefined && row != "undefined") {
        this.title = "编辑课程";
        this.needadd = false;
        this.keys++;
        this.coursedata = 0;
        this.editForm.classid = row.c_id;
      }
    },
    //显示添加界面
    handadd(){
      this.editFormVisible = true;
      this.formInline.textbook = '';
      this.formInline.courses = '';
      this.formInline.status = '';
      this.formInline.keyword = '';
      this.getcourse()
      this.title = "添加课程";
      this.editForm.c_name = '';
      this.editForm.c_type ='1';
      this.editForm.c_desc = '';
      this.editForm.c_thumb = '';
      this.editForm.c_sort='';
      this.editForm.c_free = '0';
      this.editForm.platform = ['APP'];
      this.needadd = true;
      this.keys++
      this.editForm.classid = '';
      this.editForm.bookid = '';
      this.editForm.c_tid = '';
      this.coursedata = 0;
    },
    //添加课程
    addType() {
      this.loading = true;
      if(this.editForm.platform == 'APP'){
        this.editForm.platform = '1';
      }else if(this.editForm.platform == '小程序'){
        this.editForm.platform = '2';
      }else{
        this.editForm.platform = '1,2';
      }
      //所属id赋值
      if(this.editForm.c_type=='1'){
        this.editForm.c_pid = 0
      }else if(this.editForm.c_type=='2'){
        this.editForm.c_pid = this.editForm.classid
      }else{
        this.editForm.c_pid = this.editForm.bookid
      }
      if(this.needadd){
        this.$axios({
          url: this.$baseURL + "/manage/course/add.html",
          method: "POST",
          data: {
          c_name: this.editForm.c_name,
          c_type: this.editForm.c_type,
          c_pid: this.editForm.c_pid, //所属id
          c_desc: this.editForm.c_desc,
          c_thumb: this.editForm.c_thumb,
          c_sort: this.editForm.c_sort,
          c_free:this.editForm.c_free,
          c_platform: this.editForm.platform,
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.editFormVisible = false;
            this.loading = false;
            this.formInline.textbook = '';
            this.formInline.courses = '';
            this.formInline.status = '';
            this.formInline.keyword = '';
            this.$message({
              type: "success",
              message: "添加成功！",
            });
            this.getcourse();
          } else {
            this.editForm.platform = ['APP'];
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
        //编辑课程
        this.$axios({
        url: this.$baseURL + "/manage/course/edit.html",
        method: "PUT",
        data: {
          c_id: this.editForm.c_id, //自身id
          c_pid: this.editForm.c_pid, //所属id
          c_name: this.editForm.c_name,
          c_type: this.editForm.c_type,
          c_desc: this.editForm.c_desc,
          c_thumb: this.editForm.c_thumb,
          c_sort: this.editForm.c_sort,
          c_free:this.editForm.c_free,
          c_platform:this.editForm.platform,
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.getcourse();
            this.editFormVisible = false;
            this.loading = false;
            this.formInline.textbook = '';
            this.formInline.courses = '';
            this.formInline.status = '';
            this.formInline.keyword = '';
            this.$message({
              type: "success",
              message: "编辑成功！",
            });
          } else {
            this.editForm.platform = ['APP'];
            this.loading = false;
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
        })
      }
    },
    // 关键词搜索
    search(){
      this.getcourse()
    },
    //分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getclasshour();
    },
    //删除分类
    deleteType(index,row) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(()=>{
        this.loading = true;
        this.$axios({
          url: this.$baseURL + "/manage/course/del.html",
          method: "DELETE",
          data: {
            c_id: row.c_id,
          },
        }).then((res) => {
          if (res.code === 1000) {
            this.loading = false;
            this.courselist.splice(index,1)
            this.getcourse()
            this.$message.success("删除成功")
          } else {
            this.$message({
              type: "info",
              message: res.msg,
            });
            this.loading = false;
          }
        })
      }).catch(() => {
        this.editFormVisible = false;
        this.loading = false;
      });
    },
    //关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
    //状态切换
    changestatus(row){
     this.$axios({
        url: this.$baseURL + "/manage/course/status.html",
        method: "PUT",
        data: {
          c_id:row.c_id,
          c_status: row.c_status,
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.$message.success('状态修改成功');
          }else{
            this.$message.error(res.msg);
          }
      })
    },
    //筛选状态
    filterstatus(e){
      this.formInline.status = e
      this.getcourse()
    },
    //切换课程
    selectcourse(e){
      // 重新切换课程时，课本内容为空
      this.editForm.bookid = ''
      this.formInline.textbook = ''
      this.coursedata = 1
      this.formInline.courses = e
      //获取课本列表
      this.gettextbook(e)
    },
    //清除课程数据
    clearcourse(){
      this.editForm.bookid = ''
      this.formInline.textbook = ''
      this.coursedata = 0
      this.getcourse()
    },
    // 清除课本数据
    cleartextbook(){
      this.gettextbook(this.formInline.courses)
    },
    // 切换课本
    selecttextbook(e){
      //获取课时列表
      this.getclasshour(e)
    },
    //裁剪好的缩略图图片
    uploadimg(upimg){
      this.editForm.c_thumb=upimg
      this.keys--
      this.$message.success('图片上传成功')
    },
    //删除缩略图上传图片
    removeimg(){
      this.editForm.c_thumb=''
      this.keys++
      this.$message.success('图片删除成功')
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

 
 