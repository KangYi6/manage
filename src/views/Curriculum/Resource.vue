/**
 * 课程管理 资源列表
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>资源列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.keyword" placeholder="输入分类名称" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item label="状态：">
      <el-select size="small" v-model="status" clearable placeholder="全部" @change="selectstatus">
         <el-option
           v-for="item in options"
           :key="item.status"
           :label="item.label"
           :value="item.status">
         </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="类型：">
      <el-select size="small" v-model="type" clearable placeholder="全部" @change="selecttype">
         <el-option
           v-for="item in optionstype"
           :key="item.status"
           :label="item.label"
           :value="item.status">
         </el-option>
      </el-select>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" border :data="listData" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%">
      <el-table-column align="center" type="selection" min-width="50">
      </el-table-column>
      <el-table-column align="center" sortable type="index" label="序号" min-width="50">
      </el-table-column>
      <el-table-column align="center" prop="l_name" label="名称" min-width="150">
      </el-table-column>
      <el-table-column align="center" label="类型" min-width="80">
        <template slot-scope="scope">
           <span v-if="scope.row.l_type==1">视频</span>
           <span v-if="scope.row.l_type==2">xml曲谱</span>
           <span v-if="scope.row.l_type==3">图片</span>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable label="文件大小" min-width="80">
        <template slot-scope="scope">
           <span>{{scope.row.l_size/1024/1024+'MB'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="l_path" align="center" label="文件路径" min-width="300">
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="120">
        <template slot-scope="scope">
           <el-switch v-model="scope.row.l_status" @change="changestatus(scope.row)" active-value=1 inactive-value=0 active-text="正常"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="u_name" label="上传者姓名" min-width="80">
        <template slot-scope="scope">
           <span v-if="scope.row.u_name">{{scope.row.u_name}}</span>
           <span v-if="!scope.row.u_name">{{scope.row.u_nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="l_addtime" label="添加时间" min-width="120">
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
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog" :close-on-click-modal="modal">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="资源名称" prop="l_name">
          <el-input v-model="editForm.l_name" placeholder="请输入名称" size="small"></el-input>
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
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是否显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏

      // 单页数据
      formInline: {
        page: 1,
        limit: 10,
        type:'',
        status:'',
        keyword: "",
      },

      title: "添加",

      // 编辑表单
      editForm: {
        l_id:'',
        l_name:'',
      },
      //添加弹窗状态
      needadd:false,

      // rules表单验证
      rules: {
        l_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
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

      //下拉状态选择
       options: [{
          status: '1',
          label: '正常'
        }, {
          status: '0',
          label: '隐藏'
        }],
        status: '',

        //下拉类型选择
       optionstype: [{
          status: '1',
          label: '视频'
        }, {
          status: '2',
          label: 'xml曲谱'
        }, {
          status: '3',
          label: '图片'
        }],
        type: '',

        modal:false,
    };
  },
  // 注册组件
  components: {
    Pagination,
  },

  // 创建完毕
  created() {
    this.getdata();
  },

  methods: {
    // 获取资源列表
    getdata() {
      this.loading = true;
      this.$axios({
        url: this.$baseURL + "/manage/library/list.html",
        method: "POST",
        data: {
          page: this.formInline.page,
          limit: this.formInline.limit,
          keyword: this.formInline.keyword,
          type: this.formInline.type,
          status: this.formInline.status,
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
        this.title = "编辑资源名称";
        this.editForm.l_id = row.l_id;
        this.editForm.l_name = row.l_name;
        // this.needadd=false
      }
    },
    //显示添加界面
    handadd(){
      this.editFormVisible = true;
      this.title = "添加分类";
      this.editForm.c_id = "";
      this.editForm.c_name = "";
      this.editForm.c_status = "";
      this.needadd=true
    },

    // 添加分类
    addType() {
      this.loading = true;
      if(this.needadd){
        this.$axios({
        url: this.$baseURL + "/manage/productcate/add.html",
        method: "POST",
        data: {
          c_name: this.editForm.c_name,
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.getdata();
            this.editFormVisible = false;
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
        url: this.$baseURL + "/manage/library/edit.html",
        method: "PUT",
        data: {
          l_id:this.editForm.l_id,
          l_name: this.editForm.l_name,
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
            this.$message({
              type: "info",
              message: res.msg,
            });
            this.loading = false;
          }
        })
      }
    },

    // 删除分类
    deleteType(index,row) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(()=>{
        this.loading = true;
        this.$axios({
        url: this.$baseURL + "/manage/library/del.html",
        method: "DELETE",
        data: {
          l_id: row.l_id,
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.listData.splice(index,1)
            this.pageparm.total-=1
            this.$message.success("删除成功")
            this.editFormVisible = false;
            this.loading = false;
          } else {
            this.$message.info(res.msg);
            this.editFormVisible = false;
            this.loading = false;
          }
        })
      }).catch(()=>{})
    },

    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },

     //状态切换
    changestatus(row){
     this.$axios({
        url: this.$baseURL + "/manage/library/status.html",
        method: "PUT",
        data: {
          l_id:row.l_id,
          l_status: row.l_status,
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.$message.success('状态修改成功');
          }else{
            this.$message.error(res.msg)
          }
      })
    },

    //下拉框状态事件
    selectstatus(e){
      this.formInline.status=e
      this.getdata()
    },

    //下拉框类型事件
    selecttype(e){
      this.formInline.type=e
      this.getdata()
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
</style>

 
 