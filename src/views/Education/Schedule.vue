/**
 * 教学管理 排课列表
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教学管理</el-breadcrumb-item>
      <el-breadcrumb-item>排课列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
    <el-form-item label="日期：">
      <el-select size="small" v-model="dates" clearable placeholder="全部" @change="changedate">
         <el-option
           v-for="item in optionsdate"
           :key="item.status"
           :label="item.label"
           :value="item.status">
         </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="状态：">
      <el-select size="small" v-model="status" clearable placeholder="全部" @change="changestatus">
         <el-option
           v-for="item in options"
           :key="item.status"
           :label="item.label"
           :value="item.status">
         </el-option>
      </el-select>
      </el-form-item>
       <el-form-item label="班级：">
      <el-select size="small" filterable v-model="statustwo" clearable placeholder="全部" @change="changeclass">
         <el-option
           v-for="item in classlist"
           :key="item.g_id"
           :label="item.g_name"
           :value="item.g_id">
         </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="老师：">
      <el-select size="small" filterable v-model="statusthree" clearable placeholder="全部" @change="changeteacher">
         <el-option
           v-for="item in teacherlist"
           :key="item.u_id"
           :label="item.u_name"
           :value="item.u_id">
         </el-option>
      </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button> -->
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleadd">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table border size="small" :data="listData" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 150%;">
      <el-table-column align="center" type="selection" min-width="50">
      </el-table-column>
      <el-table-column align="center" label="序号" type="index" min-width="50"> 
      </el-table-column>
      <el-table-column prop="s_starttime" label="开始时间" min-width="80" align="center">
      </el-table-column>
      <el-table-column prop="s_endtime" label="结束时间" min-width="80" align="center">
      </el-table-column>
      <el-table-column prop="s_length" label="上课时长" min-width="80" align="center">
      </el-table-column>
      <el-table-column sortable align="center" prop="s_date" label="上课日期" min-width="120">
      </el-table-column>
      <el-table-column sortable align="center" prop="s_addtime" label="排课时间" min-width="120">
      </el-table-column>
      <el-table-column sortable align="center" prop="s_onclasstime" label="上课时间" min-width="120">
      </el-table-column>
      <el-table-column sortable align="center" prop="s_downclasstime" label="下课时间" min-width="120">
      </el-table-column>
      <el-table-column align="center" prop="g_name" label="班级名称" min-width="80">
      </el-table-column>
      <el-table-column align="center" prop="u_name" label="老师姓名" min-width="80">
      </el-table-column>
       <el-table-column align="center" label="状态" min-width="80">
        <template slot-scope="scope">
           <span v-if="scope.row.s_status == 1">正常</span>
           <span v-if="scope.row.s_status == 2">正在上课</span>
           <span v-if="scope.row.s_status == 0">隐藏</span>
           <span v-if="scope.row.s_status == 3">已上课</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="s_desc" label="描述" min-width="150">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="70%" @click="closeDialog" @close="closedialog" :close-on-click-modal="modal" style="height:120%; margin-top: -100px;">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
      <el-form-item>
        <el-form-item size="small" label="上课日期" prop="s_date" style="float:left; margin-left: -120px;">
          <el-date-picker v-model="editForm.s_date" type="datetime" placeholder="选择上课日期"></el-date-picker>
        </el-form-item>
        <el-form-item size="small" label="上课时间" prop="s_starttime">
          <el-time-picker v-model="editForm.s_starttime" placeholder="选择时间" format="HH:mm"></el-time-picker>
        </el-form-item>
      </el-form-item>

      <el-form-item>
        <el-form-item size="small" label="上课时长" prop="s_length" style="float:left; margin-left: -120px;">
          <el-select v-model="editForm.s_length" placeholder="上课时长">
              <el-option v-for="item in lengthlist" :key="item" :label="item" :value="item"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item size="small" label="上课老师" prop="s_teacher" style="float:left; margin-left: 30px;">
          <el-select v-model="editForm.s_teacher" filterable placeholder="老师" @change="changesteacher">
            <el-option v-for="item in teacherlist" :key="item.u_id" :label="item.u_name" :value="item.u_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课班级" prop="s_grade" style="margin-left: 350px;">
           <el-select size="small" v-model="editForm.s_grade" filterable placeholder="班级">
              <el-option v-for="item in classlist" :key="item.g_id" :label="item.g_name" :value="item.g_id"></el-option>
            </el-select>
        </el-form-item>
      </el-form-item>

        
        <el-form-item label="描述" prop="s_desc">
          <el-input size="small" v-model="editForm.s_desc" auto-complete="off" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="排课状态" prop="s_status">
          <el-radio v-model="editForm.s_status" label="1">正常</el-radio>
          <el-radio v-model="editForm.s_status" label="0">隐藏</el-radio>
          <el-radio v-model="editForm.s_status" label="2">正在上课</el-radio> 
          <el-radio v-model="editForm.s_status" label="3">已上课</el-radio>
        </el-form-item>
        <el-form-item label="排课方式" prop="method" v-show="jurisdiction.needadd">
          <el-radio v-model="editForm.method" label="1">单次单节</el-radio>
          <el-radio v-model="editForm.method" label="2">每天循环</el-radio>
          <el-radio v-model="editForm.method" label="3">隔天循环</el-radio>
          <el-radio v-model="editForm.method" label="4">每周循环</el-radio>
          <el-radio v-model="editForm.method" label="5">隔周循环</el-radio>
        </el-form-item>
        <el-form-item label="结束方式" prop="endmethod" v-show="jurisdiction.needadd&&editForm.method!=1">
          <el-radio v-model="editForm.endmethod" label="1">按排课数量</el-radio>
          <el-radio v-model="editForm.endmethod" label="2">按排课日期</el-radio>
        </el-form-item>
        <el-form-item label="排课数量" prop="numb" v-show="jurisdiction.needadd&&editForm.endmethod==1&&editForm.method!=1">
          <el-input size="small" v-model="editForm.numb" auto-complete="off" placeholder="排课数量为1-30"></el-input>
        </el-form-item>
        <el-form-item label="结束日期" prop="enddate" v-show="jurisdiction.needadd&&editForm.endmethod==2&&editForm.method!=1">
           <el-date-picker v-model="editForm.enddate" type="datetime" placeholder="选择结束日期"></el-date-picker>
        </el-form-item>
         <el-form-item label="排课星期" prop="week" v-show="jurisdiction.needadd&&editForm.method==4||editForm.method==5">
          <el-input size="small" v-model="editForm.week" auto-complete="off" placeholder="请输入星期几"></el-input>
        </el-form-item>
        <el-form-item label="上传视频" prop="s_video">
          <div style="color:red">（* 建议视频大小不超过100MB）</div>
          <el-upload class="avatar-uploader"
               action='https://testmusic.thedream.tech/manage/upload/courseware.html' 
               v-bind:data="{FoldPath:'上传目录',SecretKey:'安全验证'}"
               v-bind:on-progress="uploadVideoProcess"
               v-bind:before-upload="beforeUploadVideo"
               v-bind:show-file-list="false">
           <video v-if="editForm.s_video !='' && !videoFlag"
              v-bind:src="editForm.s_video"
              class="avatar video-avatar"
               controls="controls">
               您的浏览器不支持视频播放
           </video>
          <i v-else-if="editForm.s_video =='' && !videoFlag"
              class="el-icon-plus avatar-uploader-icon"></i>
           <el-progress v-if="videoFlag == true"
               type="circle"
               v-bind:percentage="videoUploadPercent"
               style="margin-top:7px;"></el-progress>
          </el-upload>
          <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 100px;" @click="removevideo" v-show="editForm.s_video">删除视频</el-button>
        </el-form-item>
      </el-form> 
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deptList, deptSave, deptDelete } from '../../api/userMG'
import Pagination from '../../components/Pagination';
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      editForm: {
        s_id: '',
        s_date: '',
        s_starttime: '',
        s_length:'',
        s_grade:'',
        s_teacher:'',
        s_desc:'',
        s_status:'',
        method:'',
        endmethod:'',
        numb:'',
        enddate:'',
        week:'',
        g_name:'',
        u_name:'',
        s_video:'',
      },
      // rules表单验证
      rules: {
        s_length: [{ required: true, message: '请输入时长', trigger: 'blur' }],
        s_grade:[{ required: true, message: '请输入班级名称', trigger: 'blur' }],
        s_teacher:[{ required: true, message: '请输入老师名称', trigger: 'blur' }],
        s_date:[{ required: true, message: '请输入上课日期', trigger: 'blur' }],
        s_starttime:[{ required: true, message: '请输入开始时间', trigger: 'blur' }],
      },
      formInline: {
        page: 1,
        limit: 10,
        status:'',//状态
        date:'',//日期
        grade:'',//班级id
        teacher:'',//老师id
        keyword:''
      },
      // 删除部门
      // seletedata: {
      //   ids: '',
      // },
      // userparm: [], //搜索权限
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      //用户数据
      listData: [],
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
          label: '正在上课'
        },{
          status: '3',
          label: '已上课'
        }],
        status: '',
        //下拉班级选择
        statustwo: '',
        //下拉上课老师选择
        statusthree: '',
        //下拉日期选择
        optionsdate:[{
          status: 'today',
          label: '今天'
        },{
          status: 'yestoday',
          label: '昨天'
        },{
          status: 'week',
          label: '本周'
        },{
          status: 'lastweek',
          label: '上周'
        },{
          status: 'month',
          label: '本月'
        },{
          status: 'lastmonth',
          label: '上月'
        },{
          status: 'year',
          label: '今年'
        },{
          status: 'lastyear',
          label: '去年'
        },],
        dates:'',
        //判定是否需要修改
        jurisdiction:{
          s_status:'',
          needadd:false,
        },
        //班级名称page
        classpage:1,
        //班级列表
        classlist:[],
        //老师名称page
        teacherpage:1,
        //老师列表
        teacherlist:[],
        //时长选择
        lengthlist:[
          '30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120'
        ],
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        videoFlag: false,
        //是否显示进度条
        videoUploadPercent: "",
        //进度条的进度，
        isShowUploadVideo: false,
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
    this.getteacherid()
    this.getclassid()
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取排课列表
    getdata() {
      this.loading = true
      this.$axios({
            url:this.$baseURL+'/manage/schedule/list.html',
            method:'POST',
            data:{
              page:this.formInline.page,
              limit:this.formInline.limit,
              status:this.formInline.status,
              date:this.formInline.date,
              grade:this.formInline.grade,
              teacher:this.formInline.teacher,
              // keyword:this.formInline.keyword,
            }
          }).then(res=>{
            this.listData=res.data.data
            this.pageparm.total=res.data.total
            this.loading = false
          })
    },
    //获取班级名称
    getclassid(){
      this.$axios({
            url:this.$baseURL+'/manage/grade/list.html',
            method:'POST',
            data:{
              page:this.classpage,
              limit:30,
            }
          }).then(res=>{
            if(this.classpage==1){
              this.classlist=res.data.data
            }else{
              this.classlist=this.classlist.concat(res.data.data)
            }
          })
    },
    //获取老师名称
    getteacherid(){
      this.$axios({
            url:this.$baseURL+'/manage/teacher/list.html',
            method:'POST',
            data:{
              page:this.teacherpage,
              limit:30,
            }
          }).then(res=>{
            if(this.teacherpage==1){
              this.teacherlist=res.data.data
            }else{
              this.teacherlist=this.teacherlist.concat(res.data.data)
            }
          })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata()
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '编辑排课信息'
        this.editForm.s_id = row.s_id
        this.editForm.s_date = row.s_date
        this.editForm.s_starttime = `2022-08-20 ${row.s_starttime}`
        this.editForm.s_length=row.s_length
        this.editForm.s_grade=row.s_grade
        this.editForm.s_teacher=row.s_teacher
        this.editForm.s_desc =row.s_desc
        this.editForm.g_name =row.g_name
        this.editForm.u_name =row.u_name
        this.editForm.s_status =row.s_status
        this.editForm.s_video =row.s_video
        this.jurisdiction.s_status=row.s_status
      }
    },
    //添加界面
    handleadd(){
      this.editFormVisible = true
      this.title = '添加排课信息'
      this.editForm.s_id = ''
        this.editForm.s_date = ''
        this.editForm.s_starttime = ''
        this.editForm.s_length=''
        this.editForm.s_grade=''
        this.editForm.s_teacher=''
        this.editForm.s_desc =''
        this.editForm.method='1'
        this.editForm.endmethod=''
        this.editForm.numb=''
        this.editForm.enddate=''
        this.editForm.week=''
        this.editForm.s_status ='1'
        this.editForm.s_video =''
      this.jurisdiction.needadd=true
    },
    // 编辑、增加页面保存方法
    submitForm() {
      //判断非正规时间
      if(('"'+this.editForm.s_date+'"').length>20){
        // 补0
      function timeP(s) {
        return s < 10 ? '0' + s : s
      }
      let timer=new Date(this.editForm.s_date)
      this.editForm.s_date=timer.getFullYear()+'-'+timeP(timer.getMonth()+1)+'-'+timeP(timer.getDate())+' '+timeP(timer.getHours())+':'+timeP(timer.getMinutes())+':'+timeP(timer.getSeconds());
      if(('"'+this.editForm.s_starttime+'"').length>5){
        let starttime=new Date(this.editForm.s_starttime)
        this.editForm.s_starttime=timeP(starttime.getHours())+':'+timeP(starttime.getMinutes())
      }
      if(('"'+this.editForm.enddate+'"').length>20){
        let timers=new Date(this.editForm.enddate)
        this.editForm.enddate=timers.getFullYear()+'-'+timeP(timers.getMonth()+1)+'-'+timeP(timers.getDate())+' '+timeP(timers.getHours())+':'+timeP(timers.getMinutes())+':'+timeP(timers.getSeconds());
      }
      }
      //修改状态
      if(this.jurisdiction.s_status!=this.editForm.s_status){
        this.$axios({
            url:this.$baseURL+'/manage/schedule/status.html',
            method:'PUT',
            data:{
              s_id:this.editForm.s_id,
              s_status:this.editForm.s_status,
            }
          }).then(res=>{
            if(res.code == 1000){
              this.$message.success('状态修改成功');
            }else{
              this.$message.error(res.msg);
            }
          })
      }
      //上传视频
      if(this.editForm.s_video){
        this.$axios({
            url:this.$baseURL+'/manage/schedule/video.html',
            method:'PUT',
            data:{
              s_id:this.editForm.s_id,
              s_video:this.editForm.s_video,
            }
          }).then(res=>{
            if(res.code==1000){
              this.$message.success('保存视频成功')
            }else{
              this.$message.success('保存视频失败')
            }
          })
      }
      if(this.jurisdiction.needadd){
        //添加基本信息
       this.$axios({
            url:this.$baseURL+'/manage/schedule/add.html',
            method:'POST',
            data:{
              s_date:this.editForm.s_date,
              s_starttime:this.editForm.s_starttime,
              s_length:this.editForm.s_length,
              s_teacher:this.editForm.s_teacher,
              s_grade:this.editForm.s_grade,
              s_desc:this.editForm.s_desc,
              method:this.editForm.method,
              endmethod:this.editForm.endmethod,
              numb:this.editForm.numb,
              enddate:this.editForm.enddate,
              week:this.editForm.week,
            }
          }).then(res=>{
            if(res.code==1000){
              this.editFormVisible = false
              this.$message.success('添加成功')
              this.getdata()
              this.jurisdiction.needadd=false
            }
          })
      }else{
         //修改基本信息
       this.$axios({
            url:this.$baseURL+'/manage/schedule/edit.html',
            method:'PUT',
            data:{
              s_id:this.editForm.s_id,
              s_date:this.editForm.s_date,
              s_starttime:this.editForm.s_starttime,
              s_length:this.editForm.s_length,
              s_grade:this.editForm.s_grade,
              s_teacher:this.editForm.s_teacher,
              s_desc:this.editForm.s_desc,
            }
          }).then(res=>{
            if(res.code==1000){
              this.editFormVisible = false
              this.$message.success('修改成功')
              this.getdata()
            }
          })
      }
    },
    // 删除班级
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios({
            url:this.$baseURL+'/manage/schedule/del.html',
            method:'DELETE',
            data:{
              s_id:row.s_id,
            }
          }).then(res=>{
            if(res.code==1000){
              this.$message.error(res.msg)
              this.getdata()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false
    },
    //下拉框状态事件
    changestatus(e){
      this.formInline.status=e
      this.getdata()
    },
    //下拉框班级事件
    changeclass(e){
      this.formInline.grade=e
      this.getdata()
    },
    //下拉框老师事件
    changeteacher(e){
      this.formInline.teacher=e
      this.getdata()
    },
    //下拉框日期事件
    changedate(e){
      this.formInline.date=e
      this.getdata()
    },
    //添加关闭的时候把状态调成false
    closedialog(){
      if(this.jurisdiction.needadd){
        this.jurisdiction.needadd=false
      }
    },
    //上传视频
       beforeUploadVideo(file) {
          var fileSize = file.size / 1024 / 1024 < 200;
          if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {
              this.$message.error("请上传正确的视频格式");
              return false;
          }
          if (!fileSize) {
              this.$message.error("视频大小不能超过200MB");
              return false;
          }
          this.isShowUploadVideo = false;
          let formData = new FormData();
        formData.append('file', file);
          this.$axios({
            url:this.$baseURL+'/manage/upload/courseware.html',
            method:'POST',
            data: formData,
            params:{}
          }).then(res=>{
            if(res.code==1000){
              this.$message.success(res.msg)
              this.editForm.s_video=res.data
              this.isShowUploadVideo = true;
              this.videoFlag = false;
              this.videoUploadPercent = 0;  
            }else{
              this.$message.error(res.msg)
            }
          })
      },
      //进度条
      uploadVideoProcess(event, file, fileList) {
          this.videoFlag = true;
          this.videoUploadPercent = file.percentage.toFixed(0) * 1;
      },
      //上传成功回调
      // handleVideoSuccess(res, file) {
          
      // },
      //删除视频
      removevideo(){
        this.$confirm("确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(()=>{
          this.editForm.s_video=''
        }).catch(()=>{

        })
      },
      //老师选完出现班级
      changesteacher(e){
        this.getclassid(e)
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
  width: 140px;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9 !important;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px !important;
  position: relative !important;
  overflow: hidden !important;
}
.avatar-uploader .el-upload:hover {
  border: 1px dashed #d9d9d9 !important;
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 300px;
  height: 178px;
  display: block;
}
</style>

 
 