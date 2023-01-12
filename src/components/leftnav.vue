/**
* 左边菜单
*/ 
<template>
  <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path" unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
    <div class="logobox">
      <img class="logoimg" src="../assets/img/logo.png" alt="">
    </div>
    <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuname">
      <template slot="title">
        <i class="iconfont" :class="menu.icon"></i>
        <span>{{menu.menuname}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="chmenu in menu.menus" :index="'/'+chmenu.url" :key="chmenu.menuid">
          <i class="iconfont" :class="chmenu.icon"></i>
          <span>{{chmenu.menuname}}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
// import { menu } from '../api/userMG'
export default {
  name: 'leftnav',
  data() {
    return {
      collapsed: false,
      allmenu: []
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    // 获取图形验证码
    let res = {
      success: true,
      data: [
        {
          menuid: 1,
          icon: 'li-icon-xiangmuguanli',
          menuname: '教学管理',
          url: null,
          hasThird: null,
          menus:[
            {
              menuid: 2,
              icon: 'icon-cat-skuQuery',
              menuname: '用户列表',
              hasThird: 'N',
              url: 'Education/User',
              menus: null
            },
            {
              menuid: 3,
              icon: 'icon-order-manage',
              menuname: '班级列表',
              hasThird: 'N',
              url: 'Education/Class',
              menus: null
            },
            {
              menuid: 72,
              icon: 'icon-cus-manage',
              menuname: '排课列表',
              hasThird: 'N',
              url: 'Education/Schedule',
              menus: null
            },
            {
              menuid: 4,
              icon: 'icon-order-manage',
              menuname: '作业列表',
              hasThird: 'N',
              url: 'Education/Homework',
              menus: null
            },
          ]
        },
        
        {
          menuid: 38,
          icon: 'li-icon-gongsiguanli',
          menuname: '课程管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 39,
              icon: 'icon-cat-skuBasic',
              menuname: '课程列表',
              hasThird: 'N',
              url: 'Curriculum/Curriculum',
              menus: null
            },
            {
              menuid: 40,
              icon: 'icon-provider-manage',
              menuname: '课件列表',
              hasThird: 'N',
              url: 'Curriculum/Courseware',
              menus: null
            },
            {
              menuid: 41,
              icon: 'icon-promotion-manage',
              menuname: '资源列表',
              hasThird: 'N',
              url: 'Curriculum/Resource',
              menus: null
            },
          ]
        },
      
        {
          menuid: 128,
          icon: 'li-icon-shangchengxitongtubiaozitihuayuanwenjian91',
          menuname: '产品管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 129,
              icon: 'icon-provider-manage',
              menuname: '产品分类',
              hasThird: 'N',
              url: 'Product/Type',
              menus: null
            },
            {
              menuid: 130,
              icon: 'icon-cat-skuBasic',
              menuname: '产品列表',
              hasThird: 'N',
              url: 'Product/Product',
              menus: null
            }
          ]
        },
        {
          menuid: 140,
          icon: 'li-icon-zhifupeizhi1',
          menuname: '文章管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 141,
              icon: 'icon-cms-manage',
              menuname: '文章列表',
              hasThird: 'N',
              url: 'Article/Article',
              menus: null
            },
            {
              menuid: 145,
              icon: 'icon-cat-skuBasic',
              menuname: 'banner列表',
              hasThird: 'H',
              url: 'Article/Banner',
              menus: null
            }
          ]
        },
        {
          menuid: 50,
          icon: 'li-icon-zhifupeizhi1',
          menuname: '运营管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 51,
              icon: 'icon-cms-manage',
              menuname: '热门推荐',
              hasThird: 'N',
              url: 'Operate/Hot',
              menus: null
            },
            {
              menuid: 52,
              icon: 'icon-cms-manage',
              menuname: '版本列表',
              hasThird: 'N',
              url: 'Operate/Version',
              menus: null
            },
            {
              menuid: 53,
              icon: 'icon-cms-manage',
              menuname: '基础设置',
              hasThird: 'N',
              url: 'Operate/BasicSetting',
              menus: null
            }
          ]
        },
        
      ],
      msg: 'success'
    }
          this.allmenu = res.data
    
    // menu(localStorage.getItem('logintoken'))
    //   .then(res => {
    //     console.log(JSON.stringify(res))
    //     if (res.success) {
    //       this.allmenu = res.data
    //     } else {
    //       this.$message.error(res.msg)
    //       return false
    //     }
    //   })
    //   .catch(err => {
    //     this.$message.error('菜单加载失败，请稍后再试！')
    //   })
    // 监听
    this.$root.Bus.$on('toggle', value => {
      this.collapsed = !value
    })
  }
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}
.el-menu-item-group__title {
  padding: 0px;
}
.el-menu-bg {
  background-color: #1f2d3d !important;
}
.el-menu {
  border: none;
}
.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}
.logoimg {
  height: 40px;
}
</style>