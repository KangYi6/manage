/**
 * 产品管理 产品分类
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      <el-breadcrumb-item>产品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.keyword" placeholder="输入分类名称" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handadd">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" border :data="listData" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%">
      <el-table-column align="center" type="selection" min-width="50">
      </el-table-column>
      <el-table-column align="center" sortable type="index" label="序号" min-width="50">
      </el-table-column>
      <el-table-column align="center" prop="c_name" label="分类名称" min-width="100">
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
      <el-table-column sortable align="center" prop="c_addtime" label="添加日期" min-width="120">
      </el-table-column>
      <el-table-column sortable align="center" prop="c_updatetime" label="更新日期" min-width="120">
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
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog" :close-on-click-modal="modal" style="margin-top:130px">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm" style="margin-left: -50px">
        <el-form-item label="分类名称" prop="c_name">
          <el-input v-model="editForm.c_name" placeholder="请输入分类名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="显示平台" prop="c_platform">
            <el-checkbox v-model="editForm.platform" label="APP"></el-checkbox>
            <el-checkbox v-model="editForm.platform" label="小程序"></el-checkbox>
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
        varLable: "",
        varName: "",
        keyword: "",
      },
      title: "添加",
      // 添加、编辑菜单选项
      // 分类名称
      typeName: [
        { key: "智能钢琴", value: 1 },
        { key: "成人课程", value: 2 },
      ],
      // 编辑表单
      editForm: {
        c_id:'',
        c_status:'',
        c_name:'',
        platform:[""],
      },
      //添加弹窗状态
      needadd:false,
      // rules表单验证
      rules: {
        c_name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        c_platform: [{ required: true, message: "请选择显示平台", trigger: "blur" }],
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
      modal:false,
    };
  },
  // 注册组件
  components: {
    Pagination,
  },

  // 创建完毕
  created() {
    this.getdata(this.formInline);
  },

  methods: {
    // 获取分类列表
    getdata() {
      this.loading = true;
      this.$axios({
        url: this.$baseURL + "/manage/productcate/list.html",
        method: "POST",
        data: {
          page: this.formInline.page,
          limit: this.formInline.limit,
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
        this.title = "编辑分类";
        this.editForm.c_id = row.c_id;
        this.editForm.c_name = row.c_name;
        this.editForm.c_status = row.c_status;
        this.needadd=false
        if(row.c_platform == '1'){
          this.editForm.platform = ['APP'];
        }
        if(row.c_platform == '2'){
          this.editForm.platform = ['小程序'];
        }
        if(row.c_platform == '1,2'){
          this.editForm.platform = ['APP','小程序'];
        }
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
      this.editForm.platform = ['APP'];
    },

    // 添加分类
    addType() {
      this.loading = true;
      if(this.editForm.platform == 'APP'){
        this.editForm.platform = '1';
      }else if(this.editForm.platform == '小程序'){
        this.editForm.platform = '2';
      }else{
        this.editForm.platform = '1,2';
      }
      if(this.needadd){
        this.$axios({
        url: this.$baseURL + "/manage/productcate/add.html",
        method: "POST",
        data: {
          c_name: this.editForm.c_name,
          c_platform: this.editForm.platform,
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
            this.editForm.platform = ['APP'];
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
        }).catch((err) => {
          this.editFormVisible = false;
          this.loading = false;
          this.$message.error("分类信息保存失败，请稍后再试！");
        });
      }else{
        this.$axios({
        url: this.$baseURL + "/manage/productcate/edit.html",
        method: "PUT",
        data: {
          c_id:this.editForm.c_id,
          c_name: this.editForm.c_name,
          c_platform:this.editForm.platform,
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.getdata();
            this.editFormVisible = false;
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
      this.loading = false;
    },

    // 删除分类
    deleteType(index,row) { 
      this.loading = true;
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(()=>{
        this.$axios({
          url: this.$baseURL + "/manage/productcate/del.html",
          method: "DELETE",
          data: {
            c_id: row.c_id,
            c_name: row.c_name,
          },
        }).then((res) => {
          if (res.code === 1000) {
            this.getdata(this.formInline);
            this.$message({
              type: "success",
             message: "删除成功！",
            });
          } else {
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
        })
      })
      .catch((err) => {
        this.editFormVisible = false;
        this.loading = false;
        this.$message.error("分类信息删除失败，请稍后再试！");
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
        url: this.$baseURL + "/manage/productcate/status.html",
        method: "PUT",
        data: {
          c_id:row.c_id,
          c_status: row.c_status,
        },
      }).then((res) => {
        if (res.code === 1000) {
          this.$message.success('状态修改成功');
        }else{
          this.$message.error('状态修改成功');
        }
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
</style>

 
 