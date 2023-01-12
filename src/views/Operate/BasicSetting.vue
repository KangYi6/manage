/**
 * 运营管理 版本列表
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营管理</el-breadcrumb-item>
      <el-breadcrumb-item>基础设置</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row class="tac">
      <!-- 左侧导航栏 -->
      <el-col :span="4">
        <h5></h5>
        <el-menu default-active="2" class="el-menu-vertical-demo" :unique-opened="true" style="border-right: 1px solid #D3D3D3;">
          <el-submenu index="1" default-active="1-1">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>基础设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="hotkeys">热门搜索词</el-menu-item>
              <el-menu-item index="1-2" @click="quicks">快捷消息</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
      <!-- 右侧编辑栏 -->
      <el-col :span="20">
        <!-- 热门搜索词 -->
        <div v-show="hotkey_show" class="show">
          <div style="width: 100%;">
            <el-input class="input-new-tag" v-if="hotkeyVisible" v-model="hotkeyValue" ref="savehotInput" size="small" @keyup.enter.native="inputHotkey" @blur="inputHotkey"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="hotkeyShow" type="primary" icon="el-icon-plus">添加</el-button>
          </div>
          <el-tag class="tag" v-for="item in hotkey" :key="item" closable :disable-transitions="false" @close="hotkeyClose(item)">
            {{item}}
          </el-tag> 
        </div>
        <!-- 快捷消息 -->
        <div v-show="quick_show" class="show">
          <div style="width: 100%;">
            <el-button size="small" type="primary" @click="sort">修改排序</el-button>
            <el-input class="input-new-tag" v-if="quickVisible" v-model="quickValue" ref="savequickInput" size="small" @keyup.enter.native="inputQuick" @blur="inputQuick"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="quickShow" type="primary" icon="el-icon-plus">添加</el-button>
          </div>
          <el-tag class="tag" v-for="item,index in quick" :key="index" closable :disable-transitions="false" @close="quickClose(item)">
            {{item}}
          </el-tag>
          <el-dialog title="快捷消息列表" :visible.sync="sort_show" center width="60%"  style="height: 120%; margin-top: -120px;">
            <div class="draggable">
              <el-table row-key="id" border :data="quickData">
              <el-table-column align="center" v-for="(item,index) in oldList" :key="`col_${index}`" :prop="newList[index].prop" :label="item.label"> 
              </el-table-column>  
              </el-table>
            </div>
            <!-- 保存、取消按钮 -->
            <div slot="footer" class="dialog-footer">
              <el-button size="small" @click="closeList">取消</el-button>
              <el-button size="small" type="primary" class="title" @click="sort">保存</el-button>
            </div>
          </el-dialog>
        </div>
      </el-col>
    </el-row>   
  </div>
</template>
<script>
import Pagination from "../../components/Pagination";
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      hotkey: [],
      hotkeyVisible: false, //关键词输入框显示
      quickVisible: false, //关键词输入框显示
      hotkeyValue: '', //关键词输入值
      quickValue: '', //快捷消息输入值
      oldList: [],
      newList: [],
      quick: [],
      quickData: [{info:''}],
      tableConfig: {
        tableItems: [
          {
            label: '快捷消息（鼠标拖拽完成顺序修改）',
            prop: 'info',
          },
        ]
      },
      sort_show: false,
      hotkey_show: false,
      quick_show: false,
    }
  },
  // 注册组件
  components: { Pagination },
  // 创建完毕
  created() {
    this.getdata();
  },
  mounted(){
    // 调用 table拖拽排序
    this.oldList = JSON.parse(JSON.stringify(this.tableConfig.tableItems))
    this.newList = JSON.parse(JSON.stringify(this.tableConfig.tableItems))
  },
  methods:{
    // 显示快捷消息弹窗
    sort(){
      if(this.sort_show==false){
        this.sort_show = true;
        setTimeout(()=>{
          this.rowDrop() 
        },2000)
      }else if(this.sort_show==true){
        this.sort_show = false;
        this.rowDrop();
        this.edit();
        this.getdata();
      }
    },
    // 显示热门搜索词
    hotkeys(){
      if(this.hotkey_show == false){
        this.hotkey_show = true
        this.quick_show = false
      }else if(this.hotkey_show == true){
        this.hotkey_show = false
      }
    },
    // 显示快捷消息
    quicks(){
      if(this.quick_show == false){
        this.quick_show = true
        this.hotkey_show = false
      }else if(this.quick_show == true){
        this.quick_show = false
      }
    },
    // 关闭快捷消息弹窗
    closeList(){
      this.sort_show = false
    },
    //获取数据
    getdata(){
      this.$axios({
        url: this.$baseURL + '/manage/set/index.html',
        method: "GET",
        params: {},
      }).then((res) => {
        if (res.code === 1000) {
          this.hotkey = JSON.parse(res.data.hotkey)
          this.quick = JSON.parse(res.data.quick)
          let arr = []
          this.quick.map(item => {
            arr.push(Object.assign({ info: item }))
          })
          this.quickData = arr
        }
      })
    },
    //编辑
    edit(){
      this.$axios({
        url: this.$baseURL + "/manage/set/index.html",
        method: "POST",
        data: {
          hotkey: JSON.stringify(this.hotkey),
          quick: JSON.stringify(this.quick),
        },
      }).then((res) => {
        if (res.code === 1000) {
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
    },
    //清除热门搜索词
    hotkeyClose(item) {
      this.hotkey.splice(this.hotkey.indexOf(item), 1);
      this.edit()
      this.getdata()
    },
    //清除快捷消息
    quickClose(item) {
      this.quick.splice(this.quick.indexOf(item), 1);
      this.edit()
      this.getdata()
    },
    //显示添加关键词输入框
    hotkeyShow() {
      this.hotkeyVisible = true;
      this.$nextTick(_ => {
        this.$refs.savehotInput.$refs.input.focus();
      });
    },
    // 显示添加快捷消息输入框
    quickShow() {
      this.quickVisible = true;
      this.$nextTick(_ => {
        this.$refs.savequickInput.$refs.input.focus();
      });
    },
    //输入关键词
    inputHotkey() {
      if (this.hotkeyValue) {
        this.hotkey.push(this.hotkeyValue);
      }
      this.edit();
      this.getdata();
      this.hotkeyVisible = false;
      this.hotkeyValue = '';
    },
    //输入快捷消息
    inputQuick() {
      if (this.quickValue) {
        this.quick.push(this.quickValue);
      }
      this.edit();
      this.getdata()
      this.quickVisible = false;
      this.quickValue = '';
    },
    //行拖拽
    rowDrop() {
      //此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector('.draggable .el-table__body-wrapper tbody');
      const _this = this;
      Sortable.create(tbody, {
        //指定父元素下可被拖拽的子元素
        draggable: ".draggable .el-table__row",
        onEnd({newIndex, oldIndex}) {
          const currRow = _this.quick.splice(oldIndex, 1)[0];
          _this.quick.splice(newIndex, 0, currRow);
        }
      });
    },
  },
}
</script>

<style scoped>
  .tag {
    margin-right: 10px; 
    margin-top: 15px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .show{
    margin-top: 35px;
    /* height: 400px; */
    /* border: 1px solid #333; */
  }
</style>

 