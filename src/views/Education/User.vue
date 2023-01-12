/**
 * 教学管理 用户列表
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教学管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.varName" placeholder="请输入昵称 账号 手机号" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select size="small" v-model="status" clearable placeholder="全部" @change="changestatu">
          <el-option v-for="item in options" :key="item.status" :label="item.label" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="认证老师：">
        <el-select size="small" v-model="statustwo" clearable placeholder="全部" @change="changeteacher">
          <el-option v-for="item in optionstwo" :key="item.status" :label="item.label" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="直播老师：">
        <el-select size="small" v-model="statusthree" clearable placeholder="全部" @change="changeliveteache">
          <el-option v-for="item in optionsthree" :key="item.status" :label="item.label" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="管理员：">
        <el-select size="small" v-model="statusfour" clearable placeholder="全部" @change="changemanage">
          <el-option v-for="item in optionsfour" :key="item.status" :label="item.label" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" border :data="listData" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%">
      <el-table-column align="center" type="selection" min-width="50"></el-table-column>
      <el-table-column align="center" type="index" label="序号" min-width="50"></el-table-column>
      <el-table-column prop="u_nickname" label="昵称" min-width="100" align="center"></el-table-column>
      <el-table-column align="center" prop="u_phone" label="手机号" min-width="100"></el-table-column>
      <el-table-column align="center" label="性别" min-width="50">
        <template slot-scope="scope">
          <span v-if="scope.row.u_sex == 1">男</span>
          <span v-if="scope.row.u_sex == 2">女</span>
          <span v-if="scope.row.u_sex == 3">保密</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.u_headimg" style="width: 60px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column prop="u_username" label="账号" min-width="100" align="center"></el-table-column>
      <el-table-column prop="u_name" label="姓名" min-width="80" align="center"></el-table-column>
      <el-table-column align="center" label="管理员" min-width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.u_manager" @change="changemanager(scope.row)" active-value="1" inactive-value="0" active-text="是"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="认证教师" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.u_teacher == 1">是</span>
          <span v-if="scope.row.u_teacher == 2">审核中</span>
          <span v-if="scope.row.u_teacher == 3">审核失败</span>
          <span v-if="scope.row.u_teacher == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="直播老师" min-width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.u_live_teacher" @change="changeliveteacher(scope.row)" active-value="1" inactive-value="0" active-text="是"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.u_status"
            @change="changestatus(scope.row)"
            active-value="1"
            inactive-value="0"
            active-text="正常"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="u_addtime" label="注册时间" min-width="150"></el-table-column>
      <el-table-column sortable align="center" prop="u_lastlogintime" label="登录时间" min-width="150">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="deleteUser(scope.$index, scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="handteacher(scope.row)"
            v-if="scope.row.u_teacher == 1"
            >认证信息</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="examineteacher(scope.row)"
            >审核教师</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination
      v-bind:child-msg="pageparm"
      @callFather="callFather"
    ></Pagination>
    <!-- 编辑界面 -->
    <el-dialog
      :title="title"
      :visible.sync="editFormVisible"
      width="30%"
      @click="closeDialog"
      :close-on-click-modal="false"
      style="height: 110%; margin-top: -70px"
    >
      <el-form
        label-width="120px"
        :model="editForm"
        :rules="rules"
        ref="listData"
        style="margin-left: -60px"
      >
        <el-form-item label="账号" prop="u_username">
          <el-input
            size="small"
            v-model="editForm.u_username"
            auto-complete="off"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="u_password">
          <el-input
            size="small"
            v-model="editForm.u_password"
            auto-complete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="u_name">
          <el-input
            size="small"
            v-model="editForm.u_name"
            auto-complete="off"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="u_nickname">
          <el-input
            size="small"
            v-model="editForm.u_nickname"
            auto-complete="off"
            placeholder="请输入昵称"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="u_phone">
          <el-input
            size="small"
            v-model="editForm.u_phone"
            auto-complete="off"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="u_sex">
          <el-radio v-model="editForm.u_sex" label="1">男</el-radio>
          <el-radio v-model="editForm.u_sex" label="2">女</el-radio>
          <el-radio v-model="editForm.u_sex" label="3">保密</el-radio>
        </el-form-item>
        <el-form-item label="头像" prop="u_headimg">
          <scoper
            v-bind:imgurl="editForm.u_headimg"
            :key="keys"
            @upimg="uploadimg"
          ></scoper>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            style="margin-left: 27px"
            @click="removeimg"
            v-show="editForm.u_headimg"
            >删除</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="submitForm"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <!-- 教师认证界面 -->
    <el-dialog
      title="教师认证信息"
      :visible.sync="Visibletearcher"
      width="30%"
      align="center"
      :close-on-click-modal="modal"
    >
      <div>已认证</div>
    </el-dialog>
    <!-- 审核教师界面 -->
    <el-dialog
      title="审核教师"
      :visible.sync="examineteachers"
      width="40%"
      align="center"
      :close-on-click-modal="modal"
    >
      <el-form label-width="120px" style="margin-left: -30px">
        <el-form-item label="审核状态">
          <el-radio v-model="examine.u_teacher" label="0">取消</el-radio>
          <el-radio v-model="examine.u_teacher" label="1">审核通过</el-radio>
          <el-radio v-model="examine.u_teacher" label="2">审核中</el-radio>
          <el-radio v-model="examine.u_teacher" label="3">审核失败</el-radio>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input
            size="small"
            v-model="examine.u_mark"
            auto-complete="off"
            placeholder="审核意见"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeexamine">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          class="title"
          @click="examinesuccess"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deptList, deptSave, deptDelete } from "../../api/userMG";
import Pagination from "../../components/Pagination";
import scoper from "../../components/scoper";
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      Visibletearcher: false, //教师认证弹窗
      examineteachers: false, //审核教师弹窗
      title: "添加",
      editForm: {
        u_name: "",
        u_nickname: "",
        u_phone: "",
        u_sex: "",
        u_username: "",
        u_password: "",
        u_headimg: "",
        u_id: "",
        u_status: "",
        u_live_teacher: "",
        u_manage: "",
      },
      // rules表单验证
      rules: {
        u_phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        u_sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        u_username: [
          { required: true, message: "请输入账号", trigger: "blur" },
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        varName: "",
        status: "", //账号状态
        manage: "", //是否管理员
        teacher: "", //是否认证教师
        liveteacher: "", //是否直播教师
      },
      // 删除部门
      seletedata: {
        ids: "",
        token: localStorage.getItem("logintoken"),
      },
      userparm: [], //搜索权限
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      //用户数据
      listData: [],
      //动态更新头像组件
      keys: 1,
      //下拉状态选择
      options: [
        {
          status: "1",
          label: "正常",
        },
        {
          status: "0",
          label: "禁用",
        },
      ],
      status: "",
      //下拉认证教师选择
      optionstwo: [
        {
          status: "1",
          label: "是",
        },
        {
          status: "0",
          label: "否",
        },
      ],
      statustwo: "",
      //下拉直播教师选择
      optionsthree: [
        {
          status: "1",
          label: "是",
        },
        {
          status: "0",
          label: "否",
        },
      ],
      statusthree: "",
      //下拉管理员选择
      optionsfour: [
        {
          status: "1",
          label: "是",
        },
        {
          status: "0",
          label: "否",
        },
      ],
      statusfour: "",
      //判定是否需要修改
      jurisdiction: {
        u_manage: "",
        u_status: "",
        u_live_teacher: "",
      },

      //审核教师
      examine: {
        u_id: "",
        u_teacher: "0",
        u_mark: "",
      },
      modal: false,
    };
  },
  // 注册组件
  components: {
    //分页组件
    Pagination,
    //上传裁剪组件
    scoper,
  },
  created() {
    this.getdata();
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取用户列表
    getdata() {
      this.loading = true;
      // 模拟数据开始
      this.$axios({
        url: this.$baseURL + "/manage/user/list.html",
        method: "POST",
        data: {
          page: this.formInline.page,
          limit: this.formInline.limit,
          status: this.formInline.status,
          manager: this.formInline.manage,
          teacher: this.formInline.teacher,
          liveteacher: this.formInline.liveteacher,
          keyword: this.formInline.varName,
        },
      }).then((res) => {
        this.listData = res.data.data;
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
      this.getdata();
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.keys++;
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "修改";
        this.editForm.u_name = row.u_name;
        this.editForm.u_nickname = row.u_nickname;
        this.editForm.u_phone = row.u_phone;
        this.editForm.u_id = row.u_id;
        this.editForm.u_username = row.u_username;
        this.editForm.u_headimg = row.u_headimg;
        this.editForm.u_sex = row.u_sex;
        this.editForm.u_status = row.u_status;
        this.editForm.u_live_teacher = row.u_live_teacher;
        this.editForm.u_manage = row.u_manager;
        this.jurisdiction.u_status = row.u_status;
        this.jurisdiction.u_live_teacher = row.u_live_teacher;
        this.jurisdiction.u_manage = row.u_manager;
      } else {
        this.title = "添加";
        this.editForm.u_name = "";
        this.editForm.u_nickname = "";
        this.editForm.u_phone = "";
        this.editForm.u_sex = "";
        this.editForm.u_username = "";
        this.editForm.u_password = "";
        this.editForm.u_headimg = "";
      }
    },
    // 编辑、增加页面保存方法
    submitForm() {
      if (this.editForm.u_phone == "") {
        this.$message.error("请输入手机号");
        return;
      } else if (this.editForm.u_sex == "") {
        this.$message.error("请输入性别");
        return;
      } else if (this.editForm.u_username == "") {
        this.$message.error("请输入账号");
        return;
      }
      //修改基本信息
      this.$axios({
        url: this.$baseURL + "/manage/user/edit.html",
        method: "PUT",
        data: {
          u_id: this.editForm.u_id,
          u_nickname: this.editForm.u_nickname,
          u_name: this.editForm.u_name,
          u_phone: this.editForm.u_phone,
          u_username: this.editForm.u_username,
          u_sex: this.editForm.u_sex,
          u_password: this.editForm.u_password,
          u_headimg: this.editForm.u_headimg,
        },
      }).then((res) => {
        if (res.code == 1000) {
          this.editFormVisible = false;
          this.$message.success("修改成功");
          this.getdata();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 删除用户
    deleteUser(index, row) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          this.$axios({
            url: this.$baseURL + "/manage/user/del.html",
            method: "DELETE",
            data: {
              u_id: row.u_id,
            },
          }).then((res) => {
            if (res.code == 1000) {
              this.$message.success(res.msg);
              this.getdata();
              this.loading = false;
            } else {
              this.$message.error(res.msg);
              this.loading = false;
            }
          });
        })
        .catch(() => {});
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
    //下拉框状态事件
    changestatu(e) {
      this.formInline.status = e;
      this.getdata();
    },
    //下拉框认证教师事件
    changeteacher(e) {
      this.formInline.teacher = e;
      this.getdata();
    },
    //下拉框直播教师事件
    changeliveteache(e) {
      this.formInline.liveteacher = e;
      this.getdata();
    },
    //下拉框管理员事件
    changemanage(e) {
      this.formInline.manage = e;
      this.getdata();
    },
    //裁剪好的图片
    uploadimg(upimg) {
      this.editForm.u_headimg = upimg;
      this.keys--;
      this.$message.success("图片上传成功");
    },
    //删除上传图片
    removeimg() {
      this.editForm.u_headimg = "";
      this.keys++;
      this.$message.error("图片删除成功");
    },

    //打开教师认证弹窗
    handteacher(row) {
      this.Visibletearcher = true;
      this.$axios({
        url: this.$baseURL + "/manage/user/teacher.html",
        method: "GET",
        params: {
          u_id: row.u_id,
        },
      }).then((res) => {
        if (res.code != 1000) {
          this.$message.error(res.msg);
        }
      });
    },

    //认证教师
    examineteacher(row) {
      this.examineteachers = true;
      this.examine.u_id = row.u_id;
      this.examine.u_teacher = row.u_teacher;
      this.examine.u_mark = row.u_mark;
    },

    //关闭审核教师弹窗
    closeexamine() {
      this.examineteachers = false;
    },

    //保存审核教师弹窗
    examinesuccess() {
      this.loading = true;
      this.$axios({
        url: this.$baseURL + "/manage/user/teacher.html",
        method: "PUT",
        data: {
          u_id: this.examine.u_id,
          u_teacher: this.examine.u_teacher,
          u_mark: this.examine.u_mark,
        },
      }).then((res) => {
        if (res.code == 1000) {
          this.getdata();
          this.$message.success(res.msg);
          this.loading = false;
          this.examineteachers = false;
        } else {
          this.$message.info(res.msg);
          this.loading = false;
          this.examineteachers = false;
        }
      });
    },

    //修改是否管理员
    changemanager(row) {
      this.$axios({
        url: this.$baseURL + "/manage/user/manage.html",
        method: "PUT",
        data: {
          u_id: row.u_id,
          u_manager: row.u_manager,
        },
      }).then((res) => {
        if (res.code == 1000) {
          this.$message.success("管理员修改成功");
        } else {
          this.$message.info(res.msg);
        }
      });
    },

    //修改是否直播教师
    changeliveteacher(row) {
      this.$axios({
        url: this.$baseURL + "/manage/user/liveteacher.html",
        method: "PUT",
        data: {
          u_id: row.u_id,
          u_live_teacher: row.u_live_teacher,
        },
      }).then((res) => {
        if (res.code == 1000) {
          this.$message.success("直播教师修改成功");
        } else {
          this.$message.info(res.msg);
        }
      });
    },

    //修改状态
    changestatus(row) {
      this.$axios({
        url: this.$baseURL + "/manage/user/status.html",
        method: "PUT",
        data: {
          u_id: row.u_id,
          u_status: row.u_status,
        },
      }).then((res) => {
        if (res.code == 1000) {
          this.$message.success("状态修改成功");
        } else {
          this.$message.info(res.msg);
        }
      });
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
.el-select {
  width: 90px;
}
</style>

 
 