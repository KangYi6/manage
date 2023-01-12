// 导入组件
import Vue from 'vue';
import Router from 'vue-router';
// 登录
import login from '@/views/login';
// 首页
import index from '@/views/index';


/** 教学管理 */
// 用户列表
import User from '@/views/Education/User';
// 班级列表
import Class from '@/views/Education/Class';
// 排课列表
import Schedule from '@/views/Education/Schedule';
// 作业列表
import Homework from '@/views/Education/Homework';


/** 课程管理 */
// 课程列表
import Curriculum from '@/views/Curriculum/Curriculum';
// 课件列表
import Courseware from '@/views/Curriculum/Courseware';
// 资源列表
import Resource from '@/views/Curriculum/Resource';


/** 产品管理 */
// 产品分类
import Type from '@/views/Product/Type';
// 产品列表
import Product from '@/views/Product/Product';


/** 文章管理 */
// 文章列表
import Article from '@/views/Article/Article';
// Banner列表
import Banner from '@/views/Article/Banner';


/** 运营管理 */
// 热门推荐
import Hot from '@/views/Operate/Hot';
// 版本列表
import Version from '@/views/Operate/Version';
// 基础设置
import BasicSetting from '@/views/Operate/BasicSetting';


/** 系统管理 */
// 菜单管理
import Module from '@/views/system/Module';
// 角色管理
import Role from '@/views/system/Role';
// 系统环境变量
import Variable from '@/views/system/Variable';
// 图表界面
import statistics from '@/views/charts/statistics';


// 启用路由
Vue.use(Router);

// 导出路由 
export default new Router({
    routes: [
    {
        path: '/',
        name: '',
        component: login,
        hidden: true,
        name:'登录',
        meta: {
            requireAuth: false
        }
    }, {
        path: '/login',
        name: '登录',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    }, {
        path: '/index',
        name: '首页',
        component: index,
        iconCls: 'el-icon-tickets',
        children: [{
            path: '/Education/User',
            name: '商品管理',
            component: User,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/Product/Product',
            name: '产品列表',
            component: Product,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/Article/Article',
            name: '文章列表',
            component: Article,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/Education/Class',
            name: '交易订单',
            component: Class,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/Education/Schedule',
            name: '用户管理',
            component: Schedule,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/system/Module',
            name: '菜单管理',
            component: Module,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/system/Role',
            name: '角色管理',
            component: Role,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/Article/Banner',
            name: 'banner列表',
            component: Banner,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/system/Variable',
            name: '系统环境变量',
            component: Variable,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/Education/Homework',
            name: '作业列表',
            component: Homework,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/Product/Type',
            name: '产品分类',
            component: Type,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/charts/statistics',
            name: '数据可视化',
            component: statistics,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/Curriculum/Curriculum',
            name: '课程列表',
            component: Curriculum,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/Curriculum/Courseware',
            name: '课件列表',
            component: Courseware,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/Curriculum/Resource',
            name: '资源列表',
            component: Resource,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/Operate/Hot',
            name: '热门推荐',
            component: Hot,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/Operate/Version',
            name: '版本列表',
            component: Version,
            meta: {
                requireAuth: true
            }
        }, 
        {
            path: '/Operate/BasicSetting',
            name: '版本列表',
            component: BasicSetting,
            meta: {
                requireAuth: true
            }
        }
        ]
    }]
})
