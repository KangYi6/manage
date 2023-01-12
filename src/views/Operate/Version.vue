/**
 * 运营管理 版本列表
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营管理</el-breadcrumb-item>
      <el-breadcrumb-item>版本列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.keyword" placeholder="搜索版本名称" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item label="类型：">
        <el-select size="small" v-model="formInline.vtype" clearable placeholder="全部" @change="selectType">
          <el-option v-for="item in typeList" :key="item.type" :label="item.label" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select size="small" filterable v-model="formInline.vstatus" clearable placeholder="全部" @change="selectStatus">
          <el-option v-for="item in statusList" :key="item.status" :label="item.label" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handadd">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" border :data="versionList" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%">
      <el-table-column align="center" type="selection" min-width="60">
      </el-table-column>
      <el-table-column align="center" sortable type="index" label="序号" min-width="50">
      </el-table-column>
      <el-table-column align="center" prop="v_name" label="名称" min-width="100">
      </el-table-column>
      <el-table-column align="center" prop="v_description" label="描述" min-width="300">
      </el-table-column>
      <el-table-column align="center" prop="v_version" label="版本名" min-width="60">
      </el-table-column>
      <el-table-column sortable prop="v_version_code" label="版本号" min-width="80" align="center">
      </el-table-column>
      <el-table-column sortable prop="v_mac" label="MAC" min-width="80" align="center">
      </el-table-column>
      <el-table-column sortable prop="v_type" label="类型" min-width="80" align="center">
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="100">
        <template slot-scope="scope">
           <el-switch v-model="scope.row.v_status" @change="changestatus(scope.row)" active-value=1 inactive-value=0 active-text="正常"></el-switch>
        </template>
      </el-table-column>
      <el-table-column sortable prop="v_force" label="强制更新" min-width="80" align="center">
      </el-table-column>
      <el-table-column sortable align="center" prop="v_addtime" label="上传时间" min-width="120">
      </el-table-column>
      <el-table-column sortable align="center" prop="v_updatetime" label="更新时间" min-width="120">
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
    <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @click="closeDialog" style="height:110%; margin-top: -50px;">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm" style="margin-left: -50px;">
        <el-form-item label="名称" prop="vname">
          <el-input v-model="editForm.vname" placeholder="请输入名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="vdesc">
          <el-input v-model="editForm.vdesc" placeholder="请输入描述（选填）" size="small"></el-input>
        </el-form-item>
        <el-form-item label="版本名" prop="vversion">
          <el-input v-model="editForm.vversion" placeholder="请输入版本名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="vvercode">
          <el-input v-model="editForm.vvercode" placeholder="请输入版本号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="MAC地址" prop="vmac">
          <el-input v-model="editForm.vmac" placeholder="请输入MAC地址（选填）" size="small"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="vtype">
          <el-radio v-model="editForm.vtype" label="1">android_pad_max 长条屏</el-radio>
          <el-radio v-model="editForm.vtype" label="2">android_pad_pad 标准屏</el-radio>
          <el-radio v-model="editForm.vtype" label="3">android_pad_phone 手机</el-radio>
        </el-form-item>
        <el-form-item label="强制更新" prop="vforce">
          <el-radio v-model="editForm.vforce" label="0">否</el-radio>
          <el-radio v-model="editForm.vforce" label="1">是</el-radio> 
        </el-form-item>
        <!-- 上传软件 -->
        <el-form-item label="上传软件" prop="vpath">
          <el-upload class="upload-demo"
          action='https://music.thedream.tech/manage/upload/courseware.html'
          ref="upload"
          :data="{FoldPath:'上传目录',SecretKey:'安全验证'}"
          :src="editForm.vpath"
          :before-remove="beforeRemove"
          :before-upload="uploadApk"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="apkList">
          <el-button size="small" type="primary" style="margin-left:20px;">选择文件</el-button>
          </el-upload>
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
export default {
  data() {
    return {
      formInline: {
        page: 1,
        limit: 10,
        keyword: '',
        vtype: '',
        vstatus: '',
      },
      loading: true,
      versionList: [], //版本列表
      typeList: [
        {
          label: 'android_pad_max',
          type: '1'
        },
        {
          label: 'android_pad',
          type: '2'
        },
        {
          label: 'android_phone',
          type: '3'
        },
      ],
      statusList: [
        {
          label: '正常',
          status: '1'
        },
        {
          label: '隐藏',
          status: '0'
        },
      ],
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      editForm: {
        vid: '', //版本id
        vname: '', //名称
        vdesc: '', //描述
        vversion: '', //版本名称
        vvercode: '', //版本号
        vmac: '', //mac地址
        vtype: '', //类型
        vforce: '', //强制更新
        vpath: '', //软件地址
        apkname: '' //软件名
      },
      apkList: [],
      // 上传的文件
      uplist: [],
      // rules表单验证
      rules: {
        vname: [{ required: true, message: "请输入名称", trigger: "blur" }],
        vversion: [{ required: true, message: "请输入版本名称", trigger: "blur" }],
        vvercode: [{ required: true, message: "请输入版本号", trigger: "blur" }],
        vtype: [{ required: true, message: "请输入类型", trigger: "blur" }],
        vforce: [{ required: true, message: "是否强制更新", trigger: "blur" }],
        vpath: [{ required: true, message: "请输入软件地址", trigger: "blur" }],
      },
      editFormVisible: false, //控制编辑页面显示与隐藏
      needadd: false, //添加弹窗状态
      title: '添加', //弹窗标题
    }
  },
  // 注册组件
  components: { Pagination },
  // 创建完毕
  created() {
    this.getVersion(); 
  },
  methods:{
    //获取版本列表
    getVersion(){
      this.$axios({
        url: this.$baseURL + '/manage/version/list.html',
        method: "POST",
        data: {
          page: this.formInline.page,
          limit: this.formInline.limit,
          keyword: this.formInline.keyword,
          type: this.formInline.vtype,
          status: this.formInline.vstatus,
        },
      }).then((res) => {
        if (res.code === 1000) {
          this.loading = false;
          this.versionList = res.data.data
        }
      })
    },
    //获取版本信息
    getInfo(id){
      this.$axios({
        url: this.$baseURL + '/manage/version/getInfo.html',
        method: "GET",
        params: {
          v_id: id,
        },
      }).then((res) => {
        if (res.code === 1000) {
          this.loading = false;
          this.editForm.vid = res.data.v_id, //版本id
          this.editForm.vname = res.data.v_name, //名称
          this.editForm.vdesc = res.data.v_description, //描述
          this.editForm.vversion = res.data.v_version, //版本名称
          this.editForm.vvercode = res.data.v_version_code, //版本号
          this.editForm.vmac = res.data.v_mac, //mac地址
          this.editForm.vtype = res.data.v_type, //类型
          this.editForm.vforce = res.data.v_force, //强制更新
          this.editForm.vpath = res.data.v_path //软件地址
          this.editForm.apkname = this.editForm.vpath.split('/').slice(-1).toString()
          let apkLists = this.apkList.concat({name:this.editForm.apkname})
          this.apkList = apkLists.slice(-1)
          this.uplist.push({url:res.data.v_path})
        }else{
          this.$message.success(res.msg)
        }
      })
    },
    //显示添加界面
    handadd(){
      this.editFormVisible = true;
      this.editForm.vname = '', //名称
      this.editForm.vdesc = '',//描述
      this.editForm.vversion = '', //版本名称
      this.editForm.vvercode = '', //版本号
      this.editForm.vmac = '', //mac地址
      this.editForm.vtype = '', //类型
      this.editForm.vforce = '', //强制更新
      this.editForm.vpath = '', //软件地址
      this.apkList = [],
      this.title = "添加版本";
      this.needadd = true;
    },
    //显示编辑界面
    handleEdit(row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "编辑课件";
        this.needadd=false
        this.getInfo(row.v_id)
      }
    },
    //保存添加/编辑
    addType() {
      this.loading = true;
      //添加版本
      if(this.needadd){
        this.$axios({
          url: this.$baseURL + "/manage/version/add.html",
          method: "POST",
          data: {
            v_name: this.editForm.vname, //名称
            v_description: this.editForm.vdesc,//描述
            v_version: this.editForm.vversion, //版本名称
            v_version_code: this.editForm.vvercode, //版本号
            v_mac: this.editForm.vmac, //mac地址
            v_type: this.editForm.vtype, //类型
            v_force: this.editForm.vforce, //强制更新
            v_path: this.editForm.vpath, //软件地址
          },
        }).then((res) => {
          if (res.code === 1000) {
            this.editFormVisible = false;
            this.$message({
              type: "success",
              message: "添加成功！",
            });
            this.loading = false;
            this.editForm.vname = '';
            this.editForm.vdesc = '';
            this.editForm.vversion = '';
            this.editForm.vvercode = '';
            this.editFormvmac = '';
            this.editForm.vtype = '';
            this.editForm.vforce = '';
            this.editForm.vpath = '';
            this.formInline.keyword = '';
            this.formInline.vstatus = '';
            this.formInline.vtype = ''; 
            this.getVersion();
          } else {
            this.loading = false;
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
        }).catch(() => {});
      }else{
        //编辑版本
        this.$axios({
        url: this.$baseURL + "/manage/version/edit.html",
        method: "PUT",
        data: {
          v_id: this.editForm.vid,
          v_name: this.editForm.vname, //名称
          v_description: this.editForm.vdesc,//描述
          v_version: this.editForm.vversion, //版本名称
          v_version_code: this.editForm.vvercode, //版本号
          v_mac: this.editForm.vmac, //mac地址
          v_type: this.editForm.vtype, //类型
          v_force: this.editForm.vforce, //强制更新
          v_path: this.editForm.vpath, //软件地址
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.editFormVisible = false;
            this.$message({
              type: "success",
              message: "编辑成功！",
            });
            this.formInline.vtype = ''
            this.formInline.vstatus = ''
            this.getVersion()
            this.loading = false;
          } else {
            this.$message({
              type: "info",
              message: res.msg,
            });
            this.loading = false;
          }
        })
      }
    },
    //删除版本
    deleteType(index,row) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(()=>{
        this.loading = true;
        this.$axios({
          url: this.$baseURL + "/manage/version/del.html",
          method: "DELETE",
          data: {
            v_id: row.v_id,
          },
        }).then((res) => {
          if (res.code === 1000) {
            this.loading = false;
            this.versionList.splice(index,1)
            this.$message.success("删除成功")
            this.getdata()
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
    //状态切换
    changestatus(row){
      this.$axios({
        url: this.$baseURL + "/manage/version/status.html",
        method: "PUT",
        data: {
          v_id: row.v_id,
          v_status: row.v_status,
        },
      }).then((res) => {
        if(res.code == 1000){
          this.$message.success('状态修改成功')
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    //关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
    //版本筛选
    selectStatus(data){
      this.formInline.vstatus = data;
      this.getVersion();
    },
    //类型筛选
    selectType(data){
      this.formInline.vtype = data; 
      this.getVersion();
    },
    //关键词搜索
    search(data){
      this.formInline.keyword = data;
      this.getVersion();
    },
    //分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getXml();
    },
    //本地上传音频文件
    uploadApk(item){
      let formData = new FormData() 
      let file = item
      formData.append('file',file)
      const isLt2M = file.size / 1024 / 1024 < 200
      if(!isLt2M){
        this.$message({
          message: '上传音频文件大小不能超过 200MB!',
          type: 'warning'
        });
        this.audioList = []
      }
      else if(file.type != 'application/vnd.android.package-archive'){
        this.$message({
          message: '上传音频文件只能是apk格式!',
          type: 'warning'
        });
        this.audioList = []
      }
      else{
        this.$axios({
          url: this.$baseURL + "/manage/upload/courseware.html",
          method: "POST",
          data: formData,
          params:{}
        }).then((res) => {
          if(res.code === 1000){
            this.editForm.vpath = res.data
            this.editForm.apkname = file.name;
            this.$message.success(res.msg)
          }else{
            this.$message.warning(res.msg)
          }
        });
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    //删除软件
    beforeRemove(file) {
      this.editForm.vpath = ''
      this.apkList = []
      this.$message.success('删除成功')
    },
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
</style>

 