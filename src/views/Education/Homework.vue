/**
 * 教学管理 作业列表
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教学管理</el-breadcrumb-item>
      <el-breadcrumb-item>作业列表</el-breadcrumb-item>
      <el-breadcrumb-item v-if="homeworkShow==true">布置作业</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 --> 
    <el-form :inline="true" :model="formInline" class="user-search" v-show="listShow">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.class" placeholder="请输入班级名称" @keyup.enter.native="search" style="height: 40px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item label="日期：">
        <el-select size="small" v-model="dates" clearable placeholder="全部" @change="changedate">
          <el-option v-for="item in optionsdate" :key="item.status" :label="item.label" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select size="small" v-model="formInline.status" clearable placeholder="全部" @change="changestatus">
          <el-option v-for="item in options" :key="item.status" :label="item.label" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师：">
        <el-select size="small" v-model="formInline.teacher" clearable placeholder="全部" @change="changeteacher">
          <el-option v-for="item in teacherList" :key="item.u_id" :label="item.label" :value="item.u_name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="homework">布置作业</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table v-show="listShow" size="small" border :data="homeworkList" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" min-width="50">
      </el-table-column>
      <el-table-column  align="center" label="序号" type="index" min-width="50">
      </el-table-column>
      <!-- 作业日期 -->
      <el-table-column sortable prop="h_date" label="作业日期" min-width="140" align="center">
      </el-table-column>
      <!-- 作业标题 -->
      <el-table-column align="center" prop="h_title" label="作业标题" min-width="100"> 
      </el-table-column>
      <!-- 作业描述 -->
      <el-table-column align="center" prop="h_desc" label="作业描述" min-width="150">
      </el-table-column>
      <!-- 作者 -->
      <el-table-column align="center" sortable prop="h_addtime" label="添加日期" min-width="150">
      </el-table-column>
      <!-- 班级名称 -->
      <el-table-column prop="g_name" label="班级名称" min-width="140" align="center"> 
      </el-table-column>
      <!-- 老师姓名 -->
      <el-table-column align="center" prop="u_name" label="老师姓名" min-width="120">
      </el-table-column>
      <!-- 老师昵称 -->
      <el-table-column align="center" prop="u_nickname" label="老师昵称" min-width="120">
      </el-table-column>
      <!-- 状态 -->
      <el-table-column align="center" label="状态" min-width="120" prop="h_status">
        <template slot-scope="scope">
          <span v-if="scope.row.h_status == 1">正常</span>
          <span v-if="scope.row.h_status == 0">隐藏</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column align="center" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteHomework(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="homeworkPageparm" v-show="listShow" @callFather="homeworkPage"></Pagination>

    <el-row v-show="homeworkShow">
      <!-- 左侧布置作业表单 -->
      <el-col :span="9" v-model="addForm" style="margin-top: 85px; margin-left: -30px; margin-right: 30px;">
        <div>
          <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="日期" prop="date">
              <el-date-picker v-model="addForm.date" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="班级" prop="class" >
              <el-select v-model="addForm.class" clearable placeholder="全部" @change="changeclass">
                <el-option v-for="item in classList" :key="item.g_name" :label="item.g_name" :value="item.g_id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作业标题" prop="title">
              <el-input v-model="addForm.title" placeholder="请输入作业标题"></el-input> 
            </el-form-item>
            <el-form-item label="作业内容" prop="desc">
              <el-input :rows="4" type="textarea" v-model="addForm.desc" placeholder="请输入作业内容"></el-input>
            </el-form-item>
            <el-form-item label="课件" v-if="content.length==0">
              <el-input readonly placeholder="请在右侧列表选择课件"></el-input>
            </el-form-item>
            <el-form-item label="课件" v-for="(item,index) in content" :key="index">
              <el-input readonly placeholder="请在右侧列表选择课件" v-model="item.cw_name"></el-input>
              <el-form-item v-if="item.cw_type == 2" label="练习次数" style="float:left; margin-left: -100px; margin-top: 10px;">
                <el-input-number v-model="item.cw_pass" placeholder="请输入练习次数" :max="100" :min="1"></el-input-number>
              </el-form-item>
            </el-form-item>
            <el-form-item label="" prop="">
              <el-button type="warning" @click="resetCourses">清空课件</el-button>
              <el-button type="danger" @click="reset">重置</el-button>
              <el-button type="primary" v-if="add == 1 && edit == 0" @click="submitHomework">提交</el-button>
              <el-button type="primary" :loading="loading" class="title" v-if="add == 0 && edit == 1" @click="submitForm('addForm')">保存编辑</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <!-- 右侧课件列表界面 -->
      <el-col :span="15">
        <div>
          <el-form class="user-search" :inline="true" :model="formcourse">
            <el-form-item label="搜索：">
              <el-input size="small" v-model="formcourse.keyword" placeholder="请输入课件名称" @keyup.enter.native="search" style="height: 40px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" icon="el-icon-search" @click="searchCourse">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="goback">返回</el-button>
            </el-form-item>
          </el-form>
        <el-table size="small" border :data="coursewareList" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%;">
        <el-table-column align="center" type="selection" min-width="60">
        </el-table-column>
        <el-table-column  align="center" label="序号" type="index" min-width="50">
        </el-table-column>
        <el-table-column  align="center" prop="cw_name" label="课件名称" min-width="100">
        </el-table-column>
        <el-table-column  align="center" prop="typeName" label="类型" min-width="50">
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="50">
          <template  slot-scope="scope">
            <el-button v-show="scope.row" size="small" type="primary" icon="el-icon-plus" @click="addHomework(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- 分页组件 -->
    <Pagination v-bind:child-msg="coursewarePageparm" @callFather="coursewarePage"></Pagination>
    </div>
      </el-col>
     
    </el-row>
  </div>
</template>

<script>
import { deptList, deptSave, deptDelete } from '../../api/userMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      typeName:'',
      add:0,
      edit:0,
      // 布置作业表单
      addForm:{
        h_id:'', //作业id
        date:'', //日期
        h_grade: '', //班级id
        class:'', //班级名称
        title:'', //作业标题
        desc:'', //作业描述
        num:'', //练习次数
      },
      content: [],//添加的课件列表
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      // 添加作业表单
      formInline: {
        page: 1,
        limit: 10,
        date:'', //日期
        status:'', //状态
        grade:'', //班级id
        class: '', //班级
        teacher:'', //老师id
        keyword:'', //搜索词（作业标题）
      },
      // 课件列表分页属性
      formcourse: {
        page: 1,
        limit: 10,
        keyword:'',
      },
      //下拉日期选择
      optionsdate:[
        {status: 'today', label: '今天'},
        {status: 'yestoday', label: '昨天'},
        {status: 'week', label: '本周'},
        {status: 'lastweek', label: '上周'},
        {status: 'month', label: '本月'},
        {status: 'lastmonth', label: '上月'},
        {status: 'year', label: '今年'},
        {status: 'lastyear', label: '去年'},
      ],
      dates:'',
      //下拉状态选择
      options: [
        {status: '1', label: '正常'},
        {status: '0', label: '隐藏'}
      ],
      status: '',
      statustwo: '',
      // 老师列表：
      teacherList:[], 
      // 老师列表页
      teacherpage:[], 
      // rules表单验证
      rules: {
        h_title: [{ required: true, message: '请输入作业标题', trigger: 'blur' }],
        h_date: [{ required: true, message: '请输入作业日期', trigger: 'blur' }],
        h_grade:[{ required: true, message: '请输入班级名称', trigger: 'blur' }],
        cw_id:[{ message: '请输入课件名称', trigger: 'blur' }],
        h_desc:[{ required: true, message: '请输入作业描述', trigger: 'blur' }],
      },
      userparm: [], //搜索权限
      // 分页参数
      homeworkPageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      coursewarePageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      //作业列表
      homeworkList: [],
      homeworkShow: false,
      listShow: true,
      // 班级列表
      classList:[],
      //班级列表页
      classpage:1,
      // 课件列表
      coursewareList:[],
      // 课件列表页
      coursewarepage:1,
      //判定是否需要修改
      jurisdiction:{
        h_status:'',
        needadd:false,
      },
      modal:false,
    }
  },
  // 注册组件
  components: { 
    Pagination, //分页组件
  },
  created() {
    this.getHomework()
    this.getteacher()
    this.getCourseware();
    this.getclass();
  },
  /**
   * 里面的方法只有被调用才会执行
   */ 
  methods: {
    //获取作业列表
    getHomework(){
      this.$axios({
        url:this.$baseURL+'/manage/homework/list.html',
        method:'POST',
        data:{
          page:this.formInline.page,
          limit:this.formInline.limit,
          status:this.formInline.status,
          date:this.formInline.date,
          teacher:this.formInline.teacher,
          keyword:this.formInline.class,
        }
      }).then(res=>{
        this.homeworkList = res.data.data;
        this.homeworkShow = false;
        this.listShow = true;
        this.homeworkPageparm.total=res.data.total;
      })
    },
    //获取班级列表
    getclass(h_grade){
      this.$axios({
        url:this.$baseURL+'/manage/grade/list.html',
        method:'POST',
        data:{
          page:this.classpage,
          limit:30,
        }
      }).then(res=>{ 
        if(this.classpage == 1){
          this.classList = res.data.data
          this.addForm.class = this.classList.filter(item => item.g_id == h_grade)[0].g_name
        }else{
          this.classList=this.classList.concat(res.data.data)
        }
      })
    },
     // 打开添加作业页面
     homework(){
      this.add = 1; 
      this.edit = 0;
      this.listShow = false;
      this.homeworkShow = true;
      this.addForm.h_id = '';
      this.addForm.date = '';
      this.addForm.h_grade = '';
      this.addForm.title =  '';
      this.addForm.desc =  '';
      this.content = [];
      this.getCourseware();
      this.getclass(this.addForm.h_grade);
      this.addForm.class = '';

    },
    // 获取作业信息
    getInfo(h_id){
      this.$axios({
        url:this.$baseURL+'/manage/homework/getInfo.html',
        method:'GET',
        params:{
          h_id:h_id
        }
      }).then(res=>{
        if(res.code == 1000){ 
          this.addForm.h_id = res.data.h_id
          this.addForm.date = res.data.h_date
          this.addForm.h_grade = res.data.h_grade
          this.addForm.title =  res.data.h_title
          this.addForm.desc =  res.data.h_desc
          this.content = res.data.h_content
        }
      }) 
    },
    //获取老师列表
    getteacher(){
      this.$axios({
        url:this.$baseURL+'/manage/teacher/list.html',
        method:'POST',
        data:{
          limit:30,
        }
      }).then(res=>{
        if(this.teacherpage==1){
          this.teacherList=res.data.data
        }else{
          this.teacherList=this.teacherList.concat(res.data.data)
        }
      })
    },
    //获取课件列表
    getCourseware(){
      this.$axios({
        url:this.$baseURL+'/manage/courseware/list.html',
        method:'POST',
        data:{
          page:this.formcourse.page,
          limit:this.formcourse.limit,
          keyword:this.formcourse.keyword,
        }
      }).then(res=>{
        if(this.coursewarepage==1){
          this.coursewareList=res.data.data
          this.coursewarePageparm.total=res.data.total;
        }else{
          this.coursewareList=this.coursewareList.concat(res.data.data)
          this.coursewarePageparm.total=res.data.total;
        }
        this.coursewareList.filter(item => {
          if (item.cw_type == 1){
            item.typeName = '视频'
          }else if (item.cw_type == 2){
            item.typeName = '曲谱'
          }
        })
      })
    },
    // 右侧点击添加课件
    addHomework(row){
      this.content.some((item, index) => {
        if(item.cw_id==row.cw_id){
          this.content.splice(index,1)
        }
      })
      this.content = this.content.concat({cw_id:row.cw_id, cw_type:row.cw_type, cw_name:row.cw_name, cw_pass:100});
    },
    // 提交作业
    submitHomework(){
      function timeP(s) {
        return s < 10 ? '0' + s : s
      }
      if(('"'+this.addForm.date+'"').length>20){
        let timers=new Date(this.addForm.date)
        this.addForm.date = timers.getFullYear()+'-'+timeP(timers.getMonth()+1)+'-'+timeP(timers.getDate())+' '+timeP(timers.getHours())+':'+timeP(timers.getMinutes())+':'+timeP(timers.getSeconds());
      }
      this.$axios({
        url:this.$baseURL+'/manage/homework/add.html',
        method:'POST',
        data:{
          h_date: this.addForm.date,
          h_grade: this.addForm.class,
          h_title: this.addForm.title,
          h_desc: this.addForm.desc,
          h_content: JSON.stringify(this.content),
        }
      }).then(res=>{
        if(res.code==1000){
          this.$message.success('提交成功')
        } else {
          this.$message({
            type: "info", 
            message: res.msg,
          });
        }
      })
    },
    // 重置
    reset(){
      this.addForm.date = '';
      this.addForm.class = '';
      this.addForm.title = '';
      this.addForm.desc = '';
      this.content = [];
    },
    // 清空课件
    resetCourses(){
      this.content = [];
    },
    // 表单事件
    // 搜索
    search() {
      this.formInline.page = 1;
      this.getHomework()
    },
    // 布置作业面板课件搜索
    searchCourse() {
      this.formcourse.page = 1;
      this.getCourseware()
      this.listShow = false;
      this.homeworkShow = true;
    },
    // 下拉框日期
    changedate(e){
      this.formInline.date=e
      this.getHomework()
    },
    // 下拉框状态
    changestatus(e){
      this.formInline.status=e
      this.getHomework()
    },
    //下拉框班级
    changeclass(e){
      this.formInline.class = e;
      this.addForm.class = e;
    },
    //下拉框老师
    changeteacher(e){
      this.formInline.teacher=e
      this.getHomework()
    },
   
    // 返回到作业列表
    goback(){
      this.homeworkShow = false;
      this.listShow = true;
    },
    // 分页插件事件
    homeworkPage(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getHomework()
    },
    coursewarePage(parm){
      this.formcourse.page = parm.currentPage
      this.formcourse.limit = parm.pageSize
      this.getCourseware()
    }, 
    
    //显示编辑界面
    handleEdit(index, row) {
      this.edit = 1;
      this.add = 0;
      this.listShow = false;
      this.homeworkShow = true;
      if (row != undefined && row != 'undefined') {
        this.getInfo(row.h_id)
        this.getclass(this.addForm.h_grade)
      }
    },
    //编辑页面保存
    submitForm(addForm) {
      //判断非正规时间
      function timeP(s) {
        return s < 10 ? '0' + s : s
      }
      if(('"'+this.addForm.date+'"').length>20){
        let timers=new Date(this.addForm.date)
        this.addForm.date = timers.getFullYear()+'-'+timeP(timers.getMonth()+1)+'-'+timeP(timers.getDate());
      } 
      //编辑作业信息
      this.$axios({
        url:this.$baseURL+'/manage/homework/edit.html',
        method:'PUT',
        data:{
          h_id:this.addForm.h_id,
          h_date:this.addForm.date,
          h_grade:this.addForm.h_grade,
          h_title:this.addForm.title,
          h_desc:this.addForm.desc,
          h_content:JSON.stringify(this.content),
        }
      }).then(res=>{
        if(res.code==1000){
          this.editFormVisible = false
          this.$message.success('修改成功')
        }else {
          this.$message({
            type: "info",
            message: res.msg,
          });
        }
      })
    }, 
    // 删除作业
    deleteHomework(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading=true
        this.$axios({
          url:this.$baseURL+'/manage/homework/del.html',
          method:'DELETE',
          data:{
            h_id:row.h_id,
          }
        }).then(res=>{
          if(res.code==1000){
            this.$message.success(res.msg)
            this.loading=false
            this.getHomework()
          }else{
            this.$message.info(res.msg)
            this.loading=false
          }
        })
      }).catch(() => {})
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false
    },
    //关闭dialog弹窗清除from验证结果
    lose(editForm){
      this.$refs[editForm].resetFields()
    },
  }
}
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
</style>

 
 