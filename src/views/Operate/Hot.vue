/**
 * 运营管理 热门推荐
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营管理</el-breadcrumb-item>
      <el-breadcrumb-item>热门推荐</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.keyword" placeholder="搜索曲谱名" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item label="推荐：">
        <el-select size="small" v-model="formInline.command" clearable placeholder="全部" @change="selectcommand">
          <el-option v-for="item in commandList" :key="item.status" :label="item.label" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" border :data="xmlList" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%">
      <el-table-column align="center" type="selection" min-width="60">
      </el-table-column>
      <el-table-column align="center" sortable type="index" label="序号" min-width="50">
      </el-table-column>
      <el-table-column align="center" prop="m_title" label="曲谱名" min-width="100">
      </el-table-column>
      <el-table-column align="center" prop="u_nickname" label="上传用户" min-width="100">
      </el-table-column>
      <!-- <el-table-column align="center" prop="m_path" label="曲谱地址" min-width="300">
      </el-table-column> -->
      <el-table-column sortable prop="u_phone" label="手机号" min-width="80" align="center">
      </el-table-column> 
      
      <el-table-column sortable align="center" prop="m_addtime" label="上传时间" min-width="120">
      </el-table-column>
      <el-table-column sortable align="center" prop="m_updatetime" label="更新时间" min-width="120">
      </el-table-column>
      <el-table-column align="center" label="推荐" min-width="100">
        <template slot-scope="scope">
           <el-switch v-model="scope.row.p_command" @change="changecomm(scope.row)" active-value=1 inactive-value=0 active-text="推荐"></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
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
        command: '',
      },
      loading: true,
      xmlName: '',
      userName: '',
      command: '',
      xmlList: [], //曲谱列表
      userList: [], //用户列表
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      //推荐筛选
      commandList:[{
        status: '1',
        label: '是'
      }, {
        status: '0',
        label: '否'
      }],
    }
  },
  // 注册组件
  components: { Pagination },
  // 创建完毕
  created() {
    this.getXml();
  },
  methods:{
    //获取曲谱列表
    getXml(){
      this.$axios({
        url: this.$baseURL + '/manage/musicxml/list.html',
        method: "POST",
        data: {
          page: this.formInline.page,
          limit: this.formInline.limit,
          keyword: this.formInline.keyword,
          command: this.formInline.command,
        },
      }).then((res) => {
        if (res.code === 1000) {
          this.loading = false;
          this.xmlList = res.data.data
        }
      })
    },
    selectXml(){},
    selectUser(){},
    selectPush(){},
    search(){
      this.getXml()
    },
    // 推荐筛选
    selectcommand(data){
      this.formInline.command = data
      this.getXml()
    },
    //分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getXml();
    },
    //推荐切换
    changecomm(row){
      this.$axios({
        url: this.$baseURL + "/manage/musicxml/command.html",
        method: "POST",
        data: {
          m_id: row.m_id,
          m_command: row.m_command,
        },
      }).then((res) => {
        if(res.code==1000){
          this.$message({
            type: "success",
            message: "推荐修改成功！",
          });
        }else{
          this.$message.error(res.msg)
        }
      })
    },
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
</style>

 