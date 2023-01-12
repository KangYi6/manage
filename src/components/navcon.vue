/**
* 头部菜单
*/ 
<template>
  <div>
  <el-menu class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff" active-text-color="#fff">
    <el-button class="buttonimg">
      <img class="showimg" :src="collapsed?imgsq:imgshow" @click="toggle(collapsed)">
    </el-button>
    <el-submenu index="2" class="submenu">
      <!-- <template slot="title">{{user.userRealName}}</template> -->
      <template slot="title">欢迎您，{{name}}</template>
      <!-- <el-menu-item index="2-1">设置</el-menu-item> -->
      <el-menu-item @click="content()" index="2-2">个人中心</el-menu-item>
      <el-menu-item @click="exit()" index="2-3">退出</el-menu-item>
    </el-submenu>
  </el-menu>
  <el-dialog title="个人中心" :visible.sync="Visiblecontent" width="30%" align="center">
    <el-form label-width="120px" style="margin-left: -30px;">
        <el-form-item label="账号">
          <span>{{user.u_username}}</span>
        </el-form-item>
        <el-form-item label="昵称">
          <span>{{user.u_nickname}}</span>
        </el-form-item>
        <el-form-item label="电话号码">
          <span>{{user.u_phone}}</span>
        </el-form-item>
        <el-form-item label="最后登录">
          <span>{{user.u_lastlogintime}}</span>
        </el-form-item>
      </el-form>
</el-dialog>
</div>
</template>
<script>
import { loginout } from '../api/userMG'
export default {
  name: 'navcon',
  data() {
    return {
      collapsed: true,
      imgshow: require('../assets/img/show.png'),
      imgsq: require('../assets/img/sq.png'),
      user: {},
      name:'',
      Visiblecontent:false,
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    if(localStorage.getItem('user')){
      this.user = JSON.parse(localStorage.getItem('user'))
      // console.log(this.user);
      this.name=this.user.u_nickname
    }
  },
  methods: {
    // 退出登录
    exit() {
      this.$confirm('退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setTimeout(() => {
            this.$store.commit('logout', 'false')
            this.$router.push({ path: '/login' })
            // 退出登录后清空缓存
            var storage = window.localStorage;
            storage.clear()
            this.$message({
              type: 'success',
              message: '已退出登录!'
            })
          }, 1000)
          
        })
        .catch(() => {})
    },
    // 切换显示
    toggle(showtype) {
      this.collapsed = !showtype
      this.$root.Bus.$emit('toggle', this.collapsed)
    },

    content(){
      this.Visiblecontent=true
    },
  }
}
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
}
.submenu {
  float: right;
}
.buttonimg {
  height: 20px;
  background-color: transparent;
  border: none;
}
.showimg {
  width: 26px;
  height: 26px;
  position: absolute;
  top: 17px;
  left: 17px;
}
.showimg:active {
  border: none;
}
</style>