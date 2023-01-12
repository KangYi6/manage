/**
 * 教学管理 班级列表
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教学管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级列表</el-breadcrumb-item>
      <el-breadcrumb-item v-if="studentShow==true">学员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search" v-show="listShow">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.varName" placeholder="请输入班级名称或备注" @keyup.enter.native="search" style="height: 40px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item label="状态：">
      <el-select size="small" v-model="status" clearable placeholder="全部" @change="changestatus">
        <el-option v-for="item in options" :key="item.status" :label="item.label" :value="item.status"></el-option>
      </el-select>
      </el-form-item>
       <el-form-item label="课程：">
      <el-select size="small" filterable v-model="statustwo" clearable placeholder="全部" @change="changecourse">
        <el-option v-for="item in optionstwo" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
      </el-select>
      </el-form-item>
       <el-form-item label="上课老师：">
      <el-select filterable size="small" v-model="statusthree" clearable placeholder="全部" @change="changeteacher">
         <el-option v-for="item in optionsthree" :key="item.u_id" :label="item.u_name" :value="item.u_id"></el-option>
      </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleadd">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table v-show="listShow" size="small" border :data="listData" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" min-width="50">
      </el-table-column>
      <el-table-column  align="center" label="序号" type="index" min-width="50">
      </el-table-column>
      <el-table-column prop="g_name" label="班级名称" min-width="140" align="center">
        <template slot-scope="scope">
          <a @click="getStudents(scope.row.g_id)" style="cursor:pointer; text-decoration: underline;">{{ scope.row.g_name }}</a>
        </template>
        <!-- <el-link v-for="item in listData" :key="item.g_name">{{ item.g_name }}</el-link> -->
      </el-table-column>
      <el-table-column sortable align="center" prop="count" label="学生数量" min-width="80"> 
      </el-table-column>
      <el-table-column align="center" prop="u_name" label="老师姓名" min-width="100">
      </el-table-column>
      <el-table-column align="center" prop="course" label="课程名称" min-width="120">
      </el-table-column>
       <el-table-column align="center" label="账号状态" min-width="100">
        <template slot-scope="scope">
           <span v-if="scope.row.g_status == 1">正常</span>
           <span v-if="scope.row.g_status == 2">已结课</span>
           <span v-if="scope.row.g_status == 0">隐藏</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="g_addtime" label="添加日期" min-width="120" align="center">
      </el-table-column>
      <!-- <el-table-column sortable prop="g_updatetime" label="更新日期" min-width="120" align="center">
      </el-table-column> -->
      <el-table-column sortable align="center" prop="g_starttime" label="开课日期" min-width="120">
      </el-table-column>
      <el-table-column align="center" prop="g_mark" label="备注" min-width="150">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather" v-show="listShow"></Pagination>

    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog" @close="lose('editForm')" :close-on-click-modal="modal">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm" style="margin-left:-40px">
        <el-form-item label="班级名称" prop="g_name">
          <el-input size="small" v-model="editForm.class_name" auto-complete="off" placeholder="请输入班级名称"></el-input>
        </el-form-item>
        <el-form-item label="开班日期" prop="g_starttime">
           <el-date-picker size="small" v-model="editForm.g_starttime" type="date" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="课程名称" prop="g_course">
          <el-select size="small" v-model="editForm.g_course" clearable placeholder="请选课程">
            <el-option v-for="item in optionstwo" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="老师姓名" prop="g_teacher">
          <el-select size="small" v-model="editForm.g_teacher" clearable placeholder="请选老师">
         <el-option v-for="i in optionsthree" :key="i.u_id" :label="i.u_name" :value="i.u_id">
         </el-option>
      </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="g_mark">
          <el-input size="small" v-model="editForm.g_mark" auto-complete="off" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="g_status">
          <el-radio v-model="editForm.g_status" label="1">正常</el-radio>
          <el-radio v-model="editForm.g_status" label="0">隐藏</el-radio>
          <el-radio v-model="editForm.g_status" label="2">已结课</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 学员列表界面 -->
    <div v-show="studentShow">
      <el-form :inline="true" :model="formStudent" class="user-search">
        <el-form-item style="margin-top: 20px">
          <el-form-item label="搜索：">
            <el-input size="small" v-model="formStudent.keyword" placeholder="请输入学员姓名" @keyup.enter.native="search" style="height: 40px;"></el-input>
          </el-form-item>
          <el-form-item>
           <el-button size="small" type="primary" icon="el-icon-search" @click="studentSearch">搜索</el-button>
          </el-form-item>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="addStudent">添加学员</el-button>
          <el-button size="small" type="primary" @click="goback">返回</el-button>     
        </el-form-item>
      </el-form>
      
      <el-table size="small" border :data="studentList" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%;">
        <el-table-column align="center" type="selection" min-width="60">
        </el-table-column>
        <el-table-column  align="center" label="序号" type="index" min-width="50">
        </el-table-column>
        <el-table-column  align="center" prop="u_name" label="学生姓名" min-width="50">
        </el-table-column>
        <el-table-column  align="center" prop="u_nickname" label="学生昵称" min-width="100">
        </el-table-column>
        <el-table-column  align="center" prop="u_heading" label="头像" min-width="50">
        </el-table-column>
        <el-table-column  align="center" prop="u_phone" label="手机号" min-width="100">
        </el-table-column>
        <el-table-column align="center" prop="u_phone" label="操作" min-width="50">
          <template  slot-scope="scope">
            <el-button v-show="scope.row" size="small" type="danger" icon="el-icon-delete" @click="del(scope.row)">移出班级</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <Pagination v-bind:child-msg="studentPageparm" @callFather="studentPage"></Pagination>
      
      <!-- 用户列表界面 -->
      <el-dialog :title="title" :visible.sync="studentVisible" width="80%" @click="closeDialogStudent" :close-on-click-modal="modal">
        <el-form :inline="true" :model="formUser" class="user-search">
          <el-form-item label="搜索：">
            <el-input size="small" v-model="formUser.keyword" placeholder="请输入用户姓名" @keyup.enter.native="search" style="height: 40px;"></el-input>
          </el-form-item>
          <el-form-item>
           <el-button size="small" type="primary" icon="el-icon-search" @click="userSearch">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table size="small" border :data="userList" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%;">
          <el-table-column align="center" type="selection" min-width="60">
          </el-table-column>
          <el-table-column align="center" label="序号" type="index" min-width="50">
          </el-table-column>
          <el-table-column align="center" prop="u_name" label="学生姓名" min-width="50">
          </el-table-column>
          <el-table-column align="center" prop="u_nickname" label="学生昵称" min-width="50">
          </el-table-column>
          <el-table-column align="center" prop="u_sex" label="性别" min-width="50">
          </el-table-column>
          <el-table-column align="center" prop="u_username" label="账号" min-width="100">
          </el-table-column>
          <el-table-column align="center" prop="u_headimg" label="头像" min-width="50">
            <template slot-scope="scope">
              <img :src="scope.row.u_headimg" style="width: 60px; height: 60px" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="u_phone" label="手机号" min-width="100">
          </el-table-column>
          <el-table-column align="center" prop="u_status" label="操作" min-width="50">
            <template  slot-scope="scope">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="add(scope.row)">添加到班级</el-button>
              <!-- <el-button v-show="delShow" size="small" type="danger" icon="el-icon-delete" @click="del(scope.row)">从班级移除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="userPageparm" @callFather="userPage"></Pagination>

        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialogStudent(g_id)">取消</el-button>
          <el-button size="small" type="primary" :loading="loading" class="title" @click="submitStudent('studentList')">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { deptList, deptSave, deptDelete } from '../../api/userMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      studentVisible: false, //控制添加学员页面显示与隐藏
      title: '添加',
      // 班级列表
      editForm: {
        g_id: '', //班级id
        c_name: '', //课程名称
        g_starttime: '', 
        g_course:'', //课程id
        g_teacher:'', //老师id
        g_mark:'',
        g_status:'',
        u_name:'', //老师姓名
        class_name:'', //班级名称
      },
      // 学生列表
      student: {
        u_id: '',
        u_name: '',
        u_nickname: '',
        u_headimg: '',
        u_phone: '',
      },
      // rules表单验证
      rules: {
        g_id: [{ required: true, message: '请输入班级ID', trigger: 'blur' }],
        g_course: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
        g_starttime:[{ required: true, message: '请输入开班日期', trigger: 'blur' }],
        c_name:[{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        g_teacher:[{ required: true, message: '请输入老师姓名', trigger: 'blur' }],
        g_mark:[{ message: '请输入备注', trigger: 'blur' }],
      },
      formInline: {
        page: 1,
        limit: 10,
        varName: '',
        status:'',//账号状态
        course:'',//课程id
        teacher:'',//老师id
      },
      // 用户表单
      formUser: {
        page: 1,
        limit: 10,
        keyword:'',
      },
      formStudent: {
        page: 1,
        limit: 10,
        keyword:'',
      },
      // 删除部门
      seletedata: {
        ids: '',
      },
      userparm: [], //搜索权限
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      // 学生分页参数
      studentPageparm:{
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      // 用户列表分页参数
      userPageparm:{
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      //用户数据
      listData: [],
      delShow: false,
      addShow: true,
      // 学生列表
      studentList: [],
      studentShow: false,
      listShow: true,
      // 班级id
      g_id:'',
      // 用户列表
      userList: [],
      //动态更新头像组件
      keys:1,
      //下拉状态选择
       options: [{
          status: '1',
          label: '正常'
        }, {
          status: '0',
          label: '隐藏'
        },{
          status: '2',
          label: '已结课'
        }],
        status: '',
        //下拉课程选择
       optionstwo: [{
          status: '1',
          label: '其它课程'
        }],
        statustwo: '',
        //下拉上课老师选择
       optionsthree: [{
          status: '1',
          label: '其它老师'
        }],
        statusthree: '',
        //判定是否需要修改
        jurisdiction:{
          g_status:'',
          needadd:false,
        },
        modal:false,
    }
  },
  // 注册组件
  components: {
    //分页组件
    Pagination,
  },
  created() {
    this.getdata()
    this.getteacher()
    this.getcourse()
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    //获取班级信息
    getinfo(g_id){
      this.$axios({
        url:this.$baseURL+'/manage/grade/getinfo.html',
        method:'GET',
        params:{
          g_id: g_id
        }
      }).then(res => {
        this.editForm.g_id = res.data.g_id //班级id
        this.editForm.c_name = res.data.c_name //课程名称
        this.editForm.class_name = res.data.g_name //班级名称
        this.editForm.g_starttime = res.data.g_starttime
        this.editForm.g_course = res.data.g_course //课程id
        this.editForm.g_teacher = res.data.g_teacher //老师id
        this.editForm.g_mark = res.data.g_mark
        this.editForm.g_status = res.data.g_status
        this.editForm.u_name = res.data.u_name //老师姓名
      })
    },
    // 获取用户列表
    getUser(){
      this.$axios({
        url:this.$baseURL+'/manage/user/list.html',
        method:'POST',
        data:{
          page:this.formUser.page,
          limit:this.formUser.limit,
          keyword:this.formUser.keyword,
        }
      }).then(res=>{
        this.userList = res.data.data
        this.userPageparm.total=res.data.total;
      })
    },
    // 获取学员列表
    getStudents(g_id){
      this.$axios({
        url:this.$baseURL+'/manage/grade/detail.html',
        method:'POST',
        data:{
          g_id: g_id,
          page:this.formStudent.page,
          limit:this.formStudent.limit,
          keyword:this.formStudent.keyword,
        }
      }).then(res=>{
        this.studentList = res.data.data;
        this.studentShow = true;
        this.listShow = false;
        this.g_id = g_id;
        this.studentPageparm.total=res.data.total;
      })
    },
    goback(){
      this.studentShow = false;
      this.listShow = true;
      this.getdata();
    },
    // 获取班级列表
    getdata() {
      this.loading = true
      this.$axios({
        url:this.$baseURL+'/manage/grade/list.html',
        method:'POST',
        data:{
          page:this.formInline.page,
          limit:this.formInline.limit,
          status:this.formInline.status,
          course:this.formInline.course,
          teacher:this.formInline.teacher,
          keyword:this.formInline.varName,
        }
      }).then(res=>{
        this.listData=res.data.data
        this.pageparm.total=res.data.total
        this.loading = false
      })
    },
    //获取课程列表
    getcourse(){
       this.$axios({
            url:this.$baseURL+'/manage/Course/list.html',
            method:'POST',
            data:{
              // page:this.formInline.page,
              limit:30,
            }
          }).then(res=>{
            this.optionstwo=res.data.data
          })
    },
    //获取上课老师列表
    getteacher(){
      this.$axios({
            url:this.$baseURL+'/manage/teacher/list.html',
            method:'POST',
            data:{
              // page:this.formInline.page,
              limit:30,
            }
          }).then(res=>{
            this.optionsthree=res.data.data
          })
    },
    // 搜索事件
    search() {
      this.formInline.page = 1;
      this.getdata();
    },
    userSearch() {
      this.formUser.page = 1;
      this.getUser();
    },
    studentSearch(){
      this.formStudent.page = 1;
      this.getStudents();
    },
    // 班级分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata()
    }, 
    // 学生分页插件事件
    studentPage(parm){
      this.formStudent.page = parm.currentPage
      this.formStudent.limit = parm.pageSize
      this.getStudents()
    },
    // 用户分页插件事件
    userPage(parm){
      this.formUser.page = parm.currentPage
      this.formUser.limit = parm.pageSize
      this.getUser()
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true //编辑界面显示
      this.jurisdiction.needadd = false
      if (row != undefined && row != 'undefined') {
        this.title = '编辑班级信息'
        this.getinfo(row.g_id);
        this.jurisdiction.g_status = row.g_status
      }
    },
    //添加界面
    handleadd(){
      this.title = '添加班级信息'
      this.editForm.g_id = ''
      this.editForm.class_name = ''
      this.editForm.g_starttime = ''
      this.editForm.g_course=''
      this.editForm.c_name=''
      this.editForm.g_teacher=''
      this.editForm.g_mark=''
      this.editForm.g_status ='1' 
      this.editFormVisible = true //编辑界面显示
      this.jurisdiction.needadd = true
    },
    // 添加学员界面
    addStudent(){
      this.studentVisible = true //添加学员界面显示
      this.title = '添加学员信息'
      this.getUser(); //获取学员列表
    },
    // 编辑、增加页面保存方法
    submitForm(editForm) {
      //判断非正规时间
      if(('"'+this.editForm.g_starttime+'"').length>20){
        // 补0
        function timeP(s) {
          return s < 10 ? '0' + s : s
        }
        let timer=new Date(this.editForm.g_starttime)
        this.editForm.g_starttime=timer.getFullYear()+'-'+timeP(timer.getMonth()+1)+'-'+timeP(timer.getDate())+' '+timeP(timer.getHours())+':'+timeP(timer.getMinutes())+':'+timeP(timer.getSeconds());
      }
      //修改状态
      if(this.jurisdiction.g_status != this.editForm.g_status){
        this.$axios({
          url:this.$baseURL+'/manage/grade/status.html',
          method:'PUT',
          data:{
            g_id:this.editForm.g_id,
            g_status:this.editForm.g_status,
          }
        }).then(res=>{
          if(res.code == 1000){
            this.$message.success('状态修改成功')
          }else{
            this.$message.error(res.msg)
          }
        })
      }
      if(this.jurisdiction.needadd){
        //添加班级信息
        this.$axios({
          url:this.$baseURL+'/manage/grade/add.html',
          method:'POST',
          data:{
            g_id:this.editForm.g_id,
            g_name:this.editForm.class_name,
            g_starttime:this.editForm.g_starttime,
            g_course:this.editForm.g_course,
            g_teacher:this.editForm.g_teacher,
            g_mark:this.editForm.g_mark,
          }
        }).then(res=>{
          if(res.code==1000){ 
            this.editFormVisible = false
            this.studentVisible = false 
            this.$message.success('添加成功')
            this.getdata()
          }
        })
      }else{
        //修改班级信息
        this.$axios({
          url:this.$baseURL+'/manage/grade/edit.html',
          method:'PUT',
          data:{
            g_id:this.editForm.g_id,
            g_name:this.editForm.class_name,
            g_starttime:this.editForm.g_starttime,
            g_course:this.editForm.g_course,
            g_teacher:this.editForm.g_teacher,
            g_mark:this.editForm.g_mark,
          }
        }).then(res=>{
          if(res.code==1000){
            this.editFormVisible = false
            this.studentVisible = false
            this.$message.success('修改成功')
            this.getdata()     
          }else {
            this.$message({
              type: "info",
              message: res.msg,
            });
          }       
        })
      }
    },
    // 添加学员保存
    submitStudent(){
      this.studentVisible = false
      this.getStudents(this.g_id)
    },
    // 班级添加学员
    add(row){
      this.$axios({
        url:this.$baseURL+'/manage/grade/student.html',
        method:'POST',
        data:{
          g_id:this.g_id,
          u_id:row.u_id,
        }
      }).then(res=>{
        if(res.code == 1000){
          this.$message.success('添加成功')
          this.delShow = true;
          this.addShow = false;
          this.userList = this.userList.filter(item => item.u_id != row.u_id);
          this.getStudents(this.g_id);
        }else{
          this.$message.info(res.msg);
        }
      })
    },
    // 班级移出学员
    del(row){
      this.$axios({
        url:this.$baseURL+'/manage/grade/student.html',
        method:'DELETE',
        data:{
          g_id:this.g_id,
          u_id:row.u_id,
        }
      }).then(res=>{
        if(res.code == 1000){
          this.$message.success('移出成功')
          this.delShow = false;
          this.addShow = true;
          this.studentList = this.studentList.filter(item => item.u_id !=row.u_id)
        }else{
          this.$message.info(res.msg);
        }
      })
    },
    // 删除班级
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading=true
          this.$axios({
            url:this.$baseURL+'/manage/grade/del.html',
            method:'DELETE',
            data:{
              g_id:row.g_id,
            }
          }).then(res=>{
            if(res.code==1000){
              this.$message.error(res.msg)
              this.getdata()
              this.loading=false
            }else{
              this.$message.info(res.msg)
              this.loading=false
            }
          })
        })
        .catch(() => {})
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false
    },
    // 关闭增加学员弹出框
    closeDialogStudent(){
      this.studentVisible = false
    },
    //下拉框状态事件
    changestatus(e){
      this.formInline.status = e
      this.getdata()
    },
    //下拉框课程事件
    changecourse(e){
      this.formInline.course=e
      this.getdata()
    },
    //下拉框上课老师事件
    changeteacher(e){
      this.formInline.teacher = e
      this.getdata()
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

 
 