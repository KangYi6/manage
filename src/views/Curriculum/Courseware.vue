/**
 * 教学管理 课件列表
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教学管理</el-breadcrumb-item>
      <el-breadcrumb-item>课件列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.keyword" placeholder="搜索文章标题" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item label="课程：">
        <el-select size="small" filterable v-model="courses" width="200" clearable placeholder="请选择" @change="selectcourse" @clear="clearcourses">
          <el-option v-for="item in courselist" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课本：">
        <el-select size="small" filterable v-model="textbook" clearable placeholder="请选择" @change="selecttextbook" @clear="clearbook">
          <el-option v-for="item in textbooklist" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课时：">
        <el-select size="small" filterable v-model="classhour" clearable placeholder="请选择" @change="selectclasshour">
          <el-option v-for="item in classhourlist" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型：">
        <el-select size="small" filterable v-model="type" clearable placeholder="全部" @change="selecttype">
          <el-option v-for="item in types" :key="item.status" :label="item.label" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select size="small" v-model="status" clearable placeholder="全部" @change="selectstatus">
          <el-option v-for="item in statusoptions" :key="item.status" :label="item.label" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handadd">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" border :data="listData" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%">
      <el-table-column align="center" type="selection" min-width="60">
      </el-table-column>
      <el-table-column align="center" sortable type="index" label="序号" min-width="50">
      </el-table-column>
      <el-table-column align="center" prop="cw_name" label="名称" min-width="100">
      </el-table-column>
      <el-table-column align="center" prop="cw_desc" label="描述" min-width="300">
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="100">
        <template slot-scope="scope">
           <el-switch v-model="scope.row.cw_status" @change="changestatus(scope.row)" active-value=1 inactive-value=0 active-text="正常"></el-switch>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="cw_addtime" label="添加时间" min-width="120">
      </el-table-column>
      <el-table-column align="center" label="付费" min-width="80">
        <template slot-scope="scope">
           <span v-if="scope.row.cw_free==1">是</span>
           <span v-if="scope.row.cw_free==0">否</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="cw_sort" label="排序" min-width="80" align="center">
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
    <el-dialog :title="title" :visible.sync="editFormVisible" width="70%" @click="closeDialog" @close="closeform" :close-on-click-modal="modal" style="height:110%; margin-top: -100px;">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm" style="margin-left:-40px">
        <el-form-item label="名称" prop="cw_name">
          <el-input v-model="editForm.cw_name" placeholder="请输入名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="cw_desc">
          <el-input v-model="editForm.cw_desc" placeholder="请输入描述（选填）" size="small"></el-input>
        </el-form-item>
        <el-form-item>
        <!-- 课程、课本、课时、排序 -->
          <el-form-item label="所属课程" prop="course" style="float:left; margin-left:-120px">
            <el-select size="small" filterable v-model="editForm.classid" clearable :placeholder="editForm.class" @change="selectcourse" @clear="clearcourses">
              <el-option v-for="item in courselist" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属课本" prop="textbook" style="float:left;">
          <el-select size="small" filterable v-model="editForm.bookid" clearable :placeholder="editForm.book" @change="selecttextbook">
            <el-option v-for="item in textbooklist" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="所属课时" prop="classhour" style="float:left;">
            <el-select size="small" filterable v-model="editForm.cw_pid" clearable :placeholder="editForm.hour" @change="selectclasshour">
              <el-option v-for="item in classhourlist" :key="item.c_id" :label="item.c_name" :value="item.c_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="cw_sort" style="float:left;" >
            <el-input v-model="editForm.cw_sort" placeholder="请输入描述（选填）" size="small" type="number"></el-input>
          </el-form-item>
        </el-form-item>
        <!-- 付费 -->
        <el-form-item label="付费" prop="cw_free" style="">
          <el-radio v-model="editForm.cw_free" label='1'>是</el-radio>
          <el-radio v-model="editForm.cw_free" label='0'>否</el-radio>
        </el-form-item>
        <!-- 类型 -->
        <el-form-item label="类型" prop="cw_type">
          <el-radio-group v-model="editForm.cw_type">
            <el-radio label='1'>视频</el-radio>
            <el-radio label='2'>曲谱</el-radio>
            <el-radio label='3'>瀑布流</el-radio>
            <el-radio label='4'>涂色</el-radio>
            <el-radio label='5'>选择题</el-radio>
          </el-radio-group>    
        </el-form-item>
        <!-- 上传封面 -->
        <el-form-item label="视频封面" prop="thumb" v-show="editForm.cw_type==1">
          <scoper class="scoper" v-bind:imgurl="editForm.thumb" :key="keys" @upimg="uploadimg" :autoCropWidth="scropWidth1" :autoCropHeight="scropHeight1" autoCrop=false></scoper>
          <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 27px;" @click="removeimg('thumb')" v-show="editForm.thumb">删除</el-button>
        </el-form-item>
        <!-- 上传视频 -->
        <el-form-item label="上传视频" prop="s_video" v-show="editForm.cw_type==1">
          <div style="color:red">（* 建议视频大小不超过100MB）</div>
          <el-upload class="avatar-uploader"
            :action = "uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-progress="uploadVideoProcess"
          >
            <video v-if="editForm.s_video !='' && videoFlag == false"
              :src="editForm.s_video"
              class="avatar video-avatar"
              controls="controls"
              :key="menuKey">
              您的浏览器不支持视频播放
            </video>
            <i v-else-if="editForm.s_video =='' && videoFlag == false" class="el-icon-plus avatar-uploader-icon"></i>
            <!-- 进度显示 -->
            <el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:7px;"></el-progress>
          </el-upload>
          <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 100px;" @click="removevideo" v-show="editForm.s_video">删除视频</el-button>
        </el-form-item>
        <!-- 上传曲谱 -->
        <el-form-item v-show="(editForm.cw_type==2 || editForm.cw_type==3)" prop="editForm.xml">
          <!-- 1.资源列表上传 -->
          <el-button size="small" type="primary" @click="addXml" style="float:left; margin-top:3px;">资源列表</el-button>
          <el-button size="small" type="primary" @click="aiXml" style="float:left; margin-top:3px;">AI曲谱</el-button>
          <!-- 2.本地上传 -->
          <el-upload class="upload-demo"
          action='https://music.thedream.tech/manage/upload/courseware.html'
          ref="upload"
          :data="{FoldPath:'上传目录',SecretKey:'安全验证'}"
          :src="editForm.xml"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :before-upload="uploadFile"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary" style="float:left; margin-left:12px; margin-top: 4px;">本地添加</el-button>
          </el-upload>
        </el-form-item>
        <!-- 过关分数 -->
        <el-form-item label="过关分数" prop="pass" v-show="(editForm.cw_type==2 || editForm.cw_type==3)">
          <el-input-number :max="100" v-model="editForm.pass" placeholder="请输入分数" size="small" type="number" :min="1" @blur="blurinputpass"></el-input-number>
        </el-form-item>
        <!-- 模式 -->
        <el-form-item label="模式" prop="mode" v-show="(editForm.cw_type==2 || editForm.cw_type==3)">
          <el-radio v-model="editForm.mode" label='0'>卡住</el-radio>
          <el-radio v-model="editForm.mode" label='1'>跟弹</el-radio>
        </el-form-item>
        <!-- 左右手 -->
        <el-form-item label="左右手" prop="hands" v-show="(editForm.cw_type==2 || editForm.cw_type==3)">
          <el-radio v-model="editForm.hands" label='0'>双手</el-radio>
          <el-radio v-model="editForm.hands" label='1'>左手</el-radio>
          <el-radio v-model="editForm.hands" label='2'>右手</el-radio>
        </el-form-item>
        <!-- 节拍器 -->
        <el-form-item label="节拍器" prop="metronome" v-show="(editForm.cw_type==2 || editForm.cw_type==3)">
          <el-radio v-model="editForm.metronome" label = '0'>关闭</el-radio>
          <el-radio v-model="editForm.metronome" label = '1'>打开</el-radio>
        </el-form-item>
        <!-- 速度 -->
        <el-form-item label="速度" prop="tempo" v-show="(editForm.cw_type==2 || editForm.cw_type==3)">
          <el-input-number :max="300" v-model="editForm.tempo" placeholder="请输入速度" size="small" type="number" :min="10" @blur="blurinputtempo"></el-input-number>
        </el-form-item>
        <!-- 键盘提示 -->
        <el-form-item label="键盘提示" prop="keytips" v-show="(editForm.cw_type==2 || editForm.cw_type==3)">
          <el-radio v-model="editForm.keytips" label='auto'>自动</el-radio>
          <el-radio v-model="editForm.keytips" label='open'>打开</el-radio>
          <el-radio v-model="editForm.keytips" label='close'>关闭</el-radio>
        </el-form-item>
        <!-- 选择题 -->
        <el-form-item label="标题文字" prop="title_text" v-show="editForm.cw_type==5">
          <el-input v-model="editForm.title_text" placeholder="请输入标题" size="small"></el-input>
        </el-form-item>
        <!-- 标题图片 -->
        <el-form-item label="标题图片" prop="title_img" v-show="editForm.cw_type==5">
          <scoper class="scoper" v-bind:imgurl="editForm.title_img" :key="keys" @upimg="titleimg" :autoCropWidth="scropWidth1" :autoCropHeight="scropHeight1" autoCrop=false></scoper>
          <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 27px;" @click="removeimg('title_img')" v-show="editForm.title_img">删除</el-button>
        </el-form-item>
        <!-- 上传音频 -->
        <el-form-item label="上传音频" v-show="(editForm.cw_type==5)" prop="title_audio">
          <el-upload class="upload-demo"
          action='https://music.thedream.tech/manage/upload/courseware.html'
          ref="upload"
          :data="{FoldPath:'上传目录',SecretKey:'安全验证'}"
          :src="editForm.title_audio"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :before-upload="uploadAudio"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="audioList">
          <el-button size="small" type="primary" style="margin-left:20px;">选择文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="选项类型" prop="select_type" v-show="(editForm.cw_type==5)">
          <el-radio v-model="editForm.select_type" label='1'>文字</el-radio>
          <el-radio v-model="editForm.select_type" label='2'>图片</el-radio>
        </el-form-item>
        <!-- 选项A -->
        <el-form-item label="选项A" prop="select_a_text" v-show="(editForm.cw_type==5 && editForm.select_type==1)">
          <el-input v-model="editForm.select_a_text" placeholder="请输入选项A内容" size="small"></el-input>
       </el-form-item>
        <el-form-item label="选项A" prop="select_a_img" v-show="(editForm.cw_type==5 && editForm.select_type==2)">
          <scoper class="scoper" v-bind:imgurl="editForm.select_a_img" :key="keys" @upimg="select_a_img" :autoCropWidth="scropWidth1" :autoCropHeight="scropHeight1" autoCrop=false></scoper>
          <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 27px;" @click="removeimg('select_a_img')" v-show="editForm.select_a_img">删除</el-button>
        </el-form-item>
        <!-- 选项B -->
        <el-form-item label="选项B" prop="select_b_text" v-show="(editForm.cw_type==5 && editForm.select_type==1)">
          <el-input v-model="editForm.select_b_text" placeholder="请输入选项B内容" size="small"></el-input>
        </el-form-item>
        <el-form-item label="选项B" prop="select_b_img" v-show="(editForm.cw_type==5 && editForm.select_type==2)">
          <scoper class="scoper" v-bind:imgurl="editForm.select_b_img" :key="keys" @upimg="select_b_img" :autoCropWidth="scropWidth1" :autoCropHeight="scropHeight1" autoCrop=false></scoper>
          <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 27px;" @click="removeimg('select_b_img')" v-show="editForm.select_b_img">删除</el-button>
        </el-form-item>
        <!-- 选项C -->
        <el-form-item label="选项C" prop="select_c_text" v-show="(editForm.cw_type==5 && editForm.select_type==1 && editForm.select_b_text != '')">
          <el-input v-model="editForm.select_c_text" placeholder="请输入选项C内容（选填）" size="small"></el-input>
        </el-form-item>
        <el-form-item label="选项C" prop="select_c_img" v-show="(editForm.cw_type==5 && editForm.select_type==2 && editForm.select_b_img != '')">
          <scoper class="scoper" v-bind:imgurl="editForm.select_c_img" :key="keys" @upimg="select_c_img" :autoCropWidth="scropWidth1" :autoCropHeight="scropHeight1" autoCrop=false></scoper>
          <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 27px;" @click="removeimg('select_c_img')" v-show="editForm.select_c_img">删除</el-button>
        </el-form-item>
        <!-- 选项D -->
        <el-form-item label="选项D" prop="select_d_text" v-show="(editForm.cw_type==5 && editForm.select_type==1 && editForm.select_c_text != '')">
          <el-input v-model="editForm.select_d_text" placeholder="请输入选项D内容（选填）" size="small"></el-input>
        </el-form-item>
        <el-form-item label="选项D" prop="select_d_img" v-show="(editForm.cw_type==5 && editForm.select_type==2 && editForm.select_c_img != '')">
          <scoper class="scoper" v-bind:imgurl="editForm.select_d_img" :key="keys" @upimg="select_d_img" :autoCropWidth="scropWidth1" :autoCropHeight="scropHeight1" autoCrop=false></scoper>
          <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 27px;" @click="removeimg('select_d_img')" v-show="editForm.select_d_img">删除</el-button>
        </el-form-item>
        <!-- 正确选项 -->
        <el-form-item label="正确选项" prop="right_answer" v-show="(editForm.cw_type==5)">
          <el-radio v-model="editForm.right_answer" label='A'></el-radio>
          <el-radio v-model="editForm.right_answer" label='B'></el-radio>
          <el-radio v-model="editForm.right_answer" label='C'></el-radio>
          <el-radio v-model="editForm.right_answer" label='D'></el-radio>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="addType">保存</el-button>
      </div>
      </el-dialog>
      <!-- 弹窗显示资源列表 -->
      <el-dialog title="资源列表" :visible.sync="fileShow" width="80%" @click="closeList" :close-on-click-modal="modal">
        <el-form :inline="true" :model="formFile" class="user-search" style="margin-top:-20px">
          <el-form-item label="搜索：">
            <el-input size="small" v-model="formFile.keyword" placeholder="搜索资源名称" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" icon="el-icon-search" @click="searchFile">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table size="small" border :data="xmlList" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%;">
          <el-table-column align="center" type="selection" min-width="50">
          </el-table-column>
          <el-table-column align="center" label="序号" type="index" min-width="50">
          </el-table-column>
          <el-table-column align="center" prop="l_name" label="名称" min-width="80">
          </el-table-column>
          <el-table-column align="center" prop="l_type" label="类型" min-width="50">
          </el-table-column>
          <el-table-column align="center" prop="l_size" label="文件大小" min-width="50">
          </el-table-column>
          <el-table-column align="center" prop="l_path" label="文件路径	" min-width="100">
          </el-table-column>
          <el-table-column align="center" prop="u_status" label="操作" min-width="50">
            <template  slot-scope="scope">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="addfile(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeList">取消</el-button>
          <el-button size="small" type="primary" :loading="loading" class="title" @click="submitFile">保存</el-button>
        </div>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparmfile" @callFather="callFatherfile"></Pagination>
      </el-dialog>

      <!-- 弹窗显示AI曲谱列表 -->
      <el-dialog title="AI曲谱列表" :visible.sync="aiShow" width="80%" @click="closeAiList" :close-on-click-modal="modal">
        <el-form :inline="true" :model="formAi" class="user-search" style="margin-top:-20px">
          <el-form-item label="搜索：">
            <el-input size="small" v-model="formAi.keyword" placeholder="搜索资源名称" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" icon="el-icon-search" @click="searchFile">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table size="small" border :data="aiList" highlight-current-row v-loading="loading" element-loading-text="拼命加载中" style="width: 100%;">
          <el-table-column align="center" type="selection" min-width="50">
          </el-table-column>
          <el-table-column align="center" label="序号" type="index" min-width="50">
          </el-table-column>
          <el-table-column align="center" prop="m_title" label="名称" min-width="80">
          </el-table-column>
          <el-table-column align="center" prop="m_updatetime" label="更新时间" min-width="50">
          </el-table-column>
          <el-table-column align="center" prop="m_price" label="价格" min-width="50">
          </el-table-column>
          <el-table-column align="center" prop="m_path" label="文件路径	" min-width="100">
          </el-table-column>
          <el-table-column align="center" prop="u_status" label="操作" min-width="50">
            <template  slot-scope="scope">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="addAi(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeAiList">取消</el-button>
          <el-button size="small" type="primary" :loading="loading" class="title" @click="submitAi">保存</el-button>
        </div>
        <!-- 分页组件 -->
        <Pagination v-bind:child-msg="pageparmAi" @callFather="callFatherAi"></Pagination>
      </el-dialog>
  </div>
</template>

<script>
import Pagination from "../../components/Pagination";
import scoper from '../../components/scoper';
export default {
  data() {
    return {
      //视频上传
      uploadUrl: 'https://music.thedream.tech/manage/upload/courseware.html',
      componentKey: null, //应付多个组件的情况 记录当前组件的key值
      menuKey: 1, //用来强制刷新
      videoFlag: false,  //进度条相关的
      videoUploadPercent: 0,  //进度条相关的
      aiList:[], //AI曲谱列表
      xmlList:[], //资源列表
      fileList:[], //添加xml文件
      audioList:[], //添加音频文件
      fileShow: false,
      aiShow:false,
      videoFlag:false,
      keys: 1,
      //裁剪尺寸
      scropWidth1:1920,
      scropHeight1:1080,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是否显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      //单页数据
      formInline: {
        page: 1,
        limit: 10,
        course: '',
        textbook: '',
        period:'',
        type:'',
        status:'',
        keyword: '',
      },
      coursedata: 0,
      bookdata: 0,
      title: "添加",
      //编辑表单
      editForm: {
        cw_name: '',
        cw_desc: '',
        cw_id: '',
        cw_type: '',
        cw_sort: '',
        thumb: '',
        video: '',        
        path: '1',
        course: '',
        classid: '', //所属课程id
        class: '', //所属课程
        bookid: '', //所属课本id
        book: '', //所属课本
        hour: '', //所属课时
        cw_pid: '', //所属课时id
        c_id: '', //所属课件id
        cw_free: '',
        textbook: '',
        s_video: '',
        xml: '',
        xmlname: '',
        pass: '', //过关分数
        mode: '', //模式
        hands: '', //左右手
        metronome: '', //节拍器
        tempo: '', //速度
        keytips: '', //键盘提示
        title_text: '', //标题(文字)
        title_img: '',	//标题(图片)
        title_audio: '', //标题(音频)
        audioname: '',
        select_type: '',//选项类型
        select_a_img: '',	//选项A
        select_a_text: '', //选项A
        select_b_img: '',	//选项B	
        select_b_text: '',	//选项B	
        select_c_img: '', //选项C	
        select_c_text: '',	//选项C	
        select_d_img: '',	//选项D	
        select_d_text: '',	//选项D	
        right_answer: '',	//正确选项	A & B & C & D
      },
      needadd:false,//添加弹窗状态
      // rules表单验证
      rules: {
        cw_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        course: [{ required: true, message: "请输入所属课程", trigger: "blur" }],
        textbook: [{ required: true, message: "请输入所属课本", trigger: "blur" }],
        classhour: [{ required: true, message: "请输入所属课时", trigger: "blur" }],
        cw_free: [{ required: true, message: "请选择是否付费", trigger: "blur" }],
        cw_type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        s_video: [{ required: true, message: "请上传视频", trigger: "blur" }],
        title_text: [{ required: true, message: "请输入标题文字", trigger: "blur" }],
        select_type: [{ required: true, message: "请选择选项类型", trigger: "blur" }],
        select_a_img: [{ required: true, message: "请添加选项A图片", trigger: "blur" }],
        select_b_img: [{ required: true, message: "请添加选项B图片", trigger: "blur" }],
        select_a_text: [{ required: true, message: "请输入选项A内容", trigger: "blur" }],
        select_b_text: [{ required: true, message: "请输入选项B内容", trigger: "blur" }],
        right_answer: [{ required: true, message: "请选择正确选项", trigger: "blur" }],
      },
      //搜索权限
      userparm: [],
      //用户数据
      listData: [],
      //调用文件表单
      formFile:{
        page:1,
        limit:10,
        keyword:'',
      },
      formAi:{
        page:1,
        limit:10,
        keyword:'',
      },
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      pageparmfile: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      pageparmAi: {
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      //课程列表
      courselist:[{name:''}],
      courses:'',
      //课本列表
      textbooklist:[],
      textbook:'',
      //课时列表
      classhourlist:[],
      classhour:'',
      //类型筛选
      types: [{
        status: '1',
        label: '视频'
      }, {
        status: '2',
        label: '曲谱'
      }, {
        status: '3',
        label: '选择题'
      }],
      type:'',
      //状态筛选
      statusoptions:[{
        status: '1',
        label: '正常'
      }, {
        status: '0',
        label: '隐藏'
      }],
      status: '',
      dialogimg: false,
      dialogvideo: false,  
      //允许上传个数
      loadlimit: 2,    
      // 所属课程列表
      pidlist: [],
      //上传提示
      uploadtips: "视频",
      //上传的文件
      uplist: [],
      upaudiolist: [],
      modal: false,
      type: '', //资源列表类型
    };
  },
  // 注册组件
  components: {
    Pagination, scoper,
  },
  // 创建完毕
  created() {
    this.getdata();
    this.getcourse();
  },
  methods: {
    //显示编辑界面
    handleEdit(row) {
      this.editFormVisible = true;
      if (row != undefined && row != "undefined") {
        this.title = "编辑课件";
        this.needadd = false;
        this.coursedata = 1;
        this.bookdata = 1;
        this.editForm.cw_id = row.cw_id;
        this.getinfo(row.cw_id)
      }
    },
    //获取课件信息
    getinfo(id){
      this.$axios({
        url: this.$baseURL + "/manage/courseware/getInfo.html",
        method: "GET",
        params: {
          cw_id:id
        },
      }).then((res) => {
        if (res.code === 1000) {
          this.editForm.cw_name = res.data.cw_name;
          this.editForm.cw_desc = res.data.cw_desc;
          this.editForm.cw_type = res.data.cw_type.toString();
          this.editForm.cw_sort = res.data.cw_sort;
          this.editForm.cw_free = res.data.cw_free.toString();
          this.editForm.classid = res.data.course; //课程id
          this.editForm.bookid = res.data.textbook; //课本id
          this.editForm.cw_pid = res.data.cw_pid; //课时id
          if(res.data.cw_type == 1){
            this.editForm.thumb= res.data.cw_content.thumb;
            this.editForm.s_video = res.data.cw_content.video;
            this.uplist.push({url:res.data.cw_content.thumb},{url:res.data.cw_content.video})
            this.keys++
          }else if(res.data.cw_type == 2 || res.data.cw_type == 3){
            this.editForm.xml = res.data.cw_content.xml;
            this.editForm.pass = res.data.cw_content.pass;
            this.editForm.mode = res.data.cw_content.mode.toString();
            this.editForm.hands = res.data.cw_content.hands;
            this.editForm.metronome = res.data.cw_content.metronome.toString();
            this.editForm.tempo = res.data.cw_content.tempo;
            this.editForm.keytips = res.data.cw_content.keytips;
            this.editForm.xmlname = this.editForm.xml.split('/').slice(-1).toString()
            let fileLists = this.fileList.concat({name:this.editForm.xmlname})
            this.fileList = fileLists.slice(-1)
            this.uplist.push({url:res.data.cw_content.xml})
          }else if(res.data.cw_type == 5){
            this.editForm.title_text = res.data.cw_content.title_text
            this.editForm.title_img = res.data.cw_content.title_img
            this.editForm.title_audio = res.data.cw_content.title_audio
            this.editForm.select_a_img = res.data.cw_content.select_a_img
            this.editForm.select_a_text = res.data.cw_content.select_a_text
            this.editForm.select_b_img = res.data.cw_content.select_b_img
            this.editForm.select_b_text = res.data.cw_content.select_b_text
            this.editForm.select_c_img = res.data.cw_content.select_c_img
            this.editForm.select_c_text = res.data.cw_content.select_c_text
            this.editForm.select_d_img = res.data.cw_content.select_d_img
            this.editForm.select_d_text = res.data.cw_content.select_d_text
            this.editForm.right_answer = res.data.cw_content.right_answer
            this.editForm.audioname = this.editForm.title_audio.split('/').slice(-1).toString()
            let audioLists = this.audioList.concat({name:this.editForm.audioname})
            this.audioList = audioLists.slice(-1)
            this.uplist.push({url:res.data.cw_content.title_audio})
            if(res.data.cw_content.select_a_img != ''){
              this.editForm.select_type = '2'
            }else if(res.data.cw_content.select_a_img == ''){
              this.editForm.select_type = '1'
            }
          }
          this.getcourse(this.editForm.classid)
          
          
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    //获取课程
    getcourse(){
      this.$axios({
        url: this.$baseURL + "/manage/course/list.html",
        method: "POST",
        data: {
          limit:9999,
          status:1,
        },
      }).then((res) => {
        if (res.code === 1000) {
          this.courselist = res.data.data
          let arr = [];
          this.courselist.forEach(item => {
            if(item.c_id==this.editForm.classid){
              arr = item
            }
          })
          this.editForm.class = arr.c_name
          this.gettextbook(this.editForm.classid)
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    //获取课本
    gettextbook(id){
      this.$axios({
        url: this.$baseURL + "/manage/course/list.html",
        method: "POST",
        data: {
          limit:9999,
          course:id,
          status:1,
        },
      }).then((res) => {
        if (res.code === 1000) {
          if(this.coursedata == 0){
            this.textbooklist = []
          }else if(this.coursedata == 1){
            this.textbooklist = res.data.data    
          }
          let arr = [];
          this.textbooklist.forEach(item => {
            if(item.c_id==this.editForm.bookid){
              arr = item
            }
          })
          this.editForm.book = arr.c_name
          this.getclasshour(this.editForm.bookid)
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    //获取课时
    getclasshour(id){
      this.$axios({
        url: this.$baseURL + "/manage/course/list.html",
        method: "POST",
        data: {
          limit:9999,
          course:id,
          status:1,
        },
      }).then((res) => {
        if (res.code === 1000) {
          if(this.bookdata == 0){
            this.classhourlist = []
          }else if(this.bookdata == 1){
            this.classhourlist = res.data.data
          }
          let arr = [];
          this.classhourlist.filter(item => {
            if(item.c_id==this.editForm.cw_pid){
              arr = item
            }
          })
          this.editForm.hour = arr.c_name
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    //获取课件
    getdata() {
      this.loading = true;
      this.$axios({
        url: this.$baseURL + "/manage/courseware/list.html",
        method: "POST",
        data: {
          page: this.formInline.page,
          limit: this.formInline.limit,
          keyword: this.formInline.keyword,
          course: this.formInline.course,
          textbook: this.formInline.textbook,
          period: this.formInline.period,
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
    //切换课程
    selectcourse(e){
      this.textbook = ''
      this.classhour = ''
      this.formInline.course = e
      this.editForm.classid = e
      // 重新切换课程时，课本和课时内容为空
      this.editForm.book = '';
      this.editForm.hour = '';
      this.coursedata = 1;
      this.gettextbook(e)
    },
    //清除课程数据
    clearcourses(){
      this.formInline.course = '';
      this.formInline.period = '';
      this.formInline.textbook = '';
      this.editForm.book = '';
      this.editForm.hour = '';
      this.coursedata = 0;
    },
    //切换课本
    selecttextbook(e){
      this.classhour=''
      this.formInline.textbook = e
      this.editForm.bookid = e
      this.bookdata = 1;
      // 重新切换课本时，课时内容为空
      this.editForm.hour = '';
      this.getclasshour(e)
    },
    //清除课本数据
    clearbook(){
      this.formInline.period = '';
      this.formInline.textbook = '';
      this.classhour='';
      this.editForm.hour = '';
      this.bookdata = 0;
    },
    //切换课时
    selectclasshour(e){
      this.formInline.period = e
      this.getdata()
    },
    // 关键词搜索
    search(){
      this.getdata()
    },
    //本地上传xml文件
    uploadFile(item){
      let formData = new FormData() 
      let file = item
      formData.append('file',file)
      this.$axios({
        url: this.$baseURL + "/manage/upload/courseware.html",
        method: "POST",
        data: formData,
        params:{}
      }).then((res) => {
        if(res.code === 1000){
          this.editForm.xml = res.data;
          this.editForm.xmlname = file.name;
          this.$message.success(res.msg)
        }else{
          this.$message.error(res.msg)
        }
      });
    },
    //本地上传音频文件
    uploadAudio(item){
      let formData = new FormData() 
      let file = item
      formData.append('file',file)
      const isLt2M = file.size / 1024 / 1024 < 5
      if(!isLt2M){
        this.$message({
          message: '上传音频文件大小不能超过 5MB!',
          type: 'warning'
        });
        this.audioList = []
      }
      else if(file.type != 'audio/mp3'){
        this.$message({
          message: '上传音频文件只能是mp3格式!',
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
            this.editForm.title_audio = res.data
            this.editForm.audioname = file.name;
            this.$message.success(res.msg)
          }else{
            this.$message.warning(res.msg)
          }
        });
      }
    },
    handleRemove(file) {
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
      if(this.editForm.cw_type == 2 || this.editForm.cw_type == 3){
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      }
      else if(this.editForm.cw_type == 5){
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + this.audioList.length} 个文件`);
      }
    },
    //删除xml曲谱
    beforeRemove(file) {
      if(file.name.indexOf('xml') != -1){
        this.editForm.xml = ''
        this.fileList = []
        this.$message.success('删除成功')
      }else if(file.name.indexOf('mp3') != -1){
        this.editForm.title_audio = ''
        this.audioList = []
        this.$message.success('删除成功')
      }
    },
    //资源列表点击添加文件
    addfile(e){
      this.xmlList = this.xmlList.filter(item => item.l_id != e.l_id)
      this.fileList = this.fileList.concat(e)
      this.fileList = this.fileList.slice(-1).concat({name:e.l_name}).slice(-1)
      this.editForm.xml = e.l_path
      this.fileShow = false
    },
    addAi(e){
      this.aiList = this.aiList.filter(item => item.m_id != e.m_id)
      this.fileList = this.fileList.concat(e)
      this.fileList = this.fileList.slice(-1).concat({name:e.m_title}).slice(-1)
      this.editForm.xml = e.m_path
      this.aiShow = false
    },
    //打开资源列表弹窗界面
    addXml(){
      this.fileShow = true;
      this.getfile()
    },
    aiXml(){
      this.aiShow = true;
      this.getAi()
    },
    //获取资源列表
    getfile() {
      if(this.editForm.cw_type == 1){
        this.type = 1
      }else if(this.editForm.cw_type == 2 || this.editForm.cw_type == 3){
        this.type = 2
      }else{
        this.type = 3
      }
      this.loading = true;
      this.$axios({
        url: this.$baseURL + "/manage/library/list.html",
        method: "POST",
        data: {
          page: this.formFile.page,
          limit: this.formFile.limit,
          keyword: this.formFile.keyword,
          type: this.type,
        },
      }).then((res) => {
        this.xmlList = res.data.data;
        // 分页赋值
        this.pageparmfile.total = res.data.total;
        this.loading = false;
      });
    },
    // 获取AI曲谱
    getAi(){
      this.$axios({
        url: this.$baseURL + "/musicxml/musicxml/list.html",
        method: "POST",
        data: {
          page: this.formAi.page,
          limit: this.formAi.limit,
          keyword: this.formAi.keyword,
        },
      }).then((res) => {
        this.aiList = res.data.data;
        // 分页赋值
        this.pageparmAi.total = res.data.total;
        this.loading = false;
      });
    },
    //关闭文件列表弹出框
    closeList(){
      this.fileShow = false;
    },
    closeAiList(){
      this.aiShow = false;
    },
    //保存文件列表
    submitFile(){
      this.fileShow = false
    },
    submitAi(){
      this.aiShow = false
    },
    //视频验证 
    beforeAvatarUpload(file) {
      //限制文件最大不能超过1GB
      const fileSize = file.size / 1024 / 1024 < 1024;
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!fileSize) {
        this.$message.error("视频大小不能超过1GB");
        return false;
      }
    },
    //进度条
    uploadVideoProcess(file) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percent.toFixed(0);
    },
    //视频上传成功
    async handleAvatarSuccess(res, file) {
      this.menuKey++;
      var formData = new FormData()
      let files = file.raw
      formData.append('file', files);
      this.$axios({
        url:this.$baseURL+'/manage/upload/courseware.html',
        method:'POST',
        data: formData,
        params:{}
      }).then(res=>{
        if(res.code==1000){
          this.isShowUploadVideo = true;
          this.videoFlag = false; //进度条恢复到初始状态
          this.videoUploadPercent = 0;
          this.$message.success(res.msg)
          this.editForm.s_video = res.data;
        }else{
          this.$message.error(res.msg)
        }
      })  
    },
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
    //裁剪好的图片
    uploadimg(upimg) {
      this.editForm.thumb = upimg;
      this.keys--;
      this.$message.success("图片上传成功");
    },
    titleimg(upimg){
      this.editForm.title_img = upimg;
      this.keys--;
      this.$message.success("图片上传成功");
    },
    select_a_img(upimg){
      this.editForm.select_a_img = upimg;
      this.keys--;
      this.$message.success("图片上传成功");
    },
    select_b_img(upimg){
      this.editForm.select_b_img = upimg;
      this.keys--;
      this.$message.success("图片上传成功");
    },
    select_c_img(upimg){
      this.editForm.select_c_img = upimg;
      this.keys--;
      this.$message.success("图片上传成功");
    },
    select_d_img(upimg){
      this.editForm.select_d_img = upimg;
      this.keys--;
      this.$message.success("图片上传成功");
    },
    //删除上传图片
    removeimg(e) {
      if(e == 'thumb'){
        this.editForm.thumb = '';
      }else if(e == 'title_img'){
        this.editForm.title_img = '';
      }else if(e == 'select_a_img'){
        this.editForm.select_a_img = '';
      }else if(e == 'select_b_img'){
        this.editForm.select_b_img = '';
      }else if(e == 'select_c_img'){
        this.editForm.select_c_img = '';
      }else if(e == 'select_d_img'){
        this.editForm.select_d_img = '';
      }
      this.keys++;
      this.$message.success("图片删除成功");
    },
    //分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage;
      this.formInline.limit = parm.pageSize;
      this.getdata();
    },
    callFatherfile(parm){
      this.formFile.page = parm.currentPage;
      this.formFile.limit = parm.pageSize;
      this.getfile();
    },
    callFatherAi(parm){
      this.formAi.page = parm.currentPage;
      this.formAi.limit = parm.pageSize;
      this.getAi();
    },
    //搜索事件
    search() {
      this.formInline.page = 1;
      this.getdata();
    },
    searchFile(){
      this.formFile.page = 1;
      this.getfile();
    },
    //显示添加界面
    handadd(){
      this.needadd=true;
      this.editFormVisible = true;
      this.title = "添加课件";
      this.formInlineNull()
      this.getdata()
      this.typeNull()
      this.type1Null()
      this.type2Null()
      this.type5Null()
    },
    formInlineNull(){
      this.formInline.course = '';
      this.formInline.period = '';
      this.formInline.status = '';
      this.formInline.keyword = '';
      this.formInline.textbook = '';
      this.formInline.type = '';
    },
    typeNull(){
      this.editForm.cw_name = '';
      this.editForm.cw_desc = '';
      this.editForm.classid = '';
      this.editForm.bookid = '';
      this.editForm.cw_pid = '';
      this.editForm.class = '';
      this.editForm.book = '';
      this.editForm.hour = '';
      this.courses = '';
      this.textbook = '';
      this.editForm.cw_sort = '';
      this.editForm.cw_free='0';
      this.editForm.cw_type = '1';

    },
    type1Null(){
      this.editForm.thumb= '',
      this.editForm.s_video = '';
    },
    type2Null(){
      this.editForm.xml = '';
      this.fileList = [];
      this.editForm.pass= '80';
      this.editForm.mode = '0';
      this.editForm.hands = '0';
      this.editForm.metronome = '0';
      this.editForm.tempo = '100';
      this.editForm.keytips = 'auto';
    },
    type5Null(){
      this.editForm.select_type = '1';
      this.editForm.title_text = ''
      this.editForm.title_img = ''
      this.editForm.title_audio = ''
      this.editForm.select_a_img = ''
      this.editForm.select_a_text = ''
      this.editForm.select_b_img = ''
      this.editForm.select_b_text = ''
      this.editForm.select_c_img = ''
      this.editForm.select_c_text = ''
      this.editForm.select_d_img = ''
      this.editForm.select_d_img = ''
      this.editForm.select_d_text = ''
      this.editForm.right_answer = 'A'
      this.audioList = []
    },
    //保存添加/编辑
    addType() {
      this.loading = true;
      //添加课件
      if(this.needadd){
        if(this.editForm.cw_type == 1){
          this.$axios({
            url: this.$baseURL + "/manage/courseware/add.html",
            method: "POST",
            data: {
              cw_name: this.editForm.cw_name,
              cw_desc: this.editForm.cw_desc,
              cw_pid: this.editForm.cw_pid,
              cw_type: this.editForm.cw_type,
              cw_sort: this.editForm.cw_sort,
              cw_free:this.editForm.cw_free,
              thumb: this.editForm.thumb,
              video: this.editForm.s_video,
            },
          }).then((res) => {
            if (res.code === 1000) {
              this.editFormVisible = false;
              this.$message({
                type: "success",
                message: "添加成功！",
              });
              this.loading = false;
              this.formInlineNull()
              this.getdata();
            } else {
              this.loading = false;
              this.$message({
                type: "info",
                message: res.msg,
              });
            }
          }).catch(() => {});
        }else if(this.editForm.cw_type == 2 || this.editForm.cw_type == 3){
          this.$axios({
            url: this.$baseURL + "/manage/courseware/add.html",
            method: "POST",
            data: {
              cw_name: this.editForm.cw_name,
              cw_desc: this.editForm.cw_desc,
              cw_pid: this.editForm.cw_pid,
              cw_type: this.editForm.cw_type,
              cw_sort: this.editForm.cw_sort,
              cw_free: this.editForm.cw_free,
              xml: this.editForm.xml,
              pass: this.editForm.pass,
              mode: Number(this.editForm.mode),         
              hands: this.editForm.hands,
              metronome: Number(this.editForm.metronome),
              tempo: this.editForm.tempo,
              keytips: this.editForm.keytips,
            },
          }).then((res) => {
            if (res.code === 1000) {
              this.editFormVisible = false;
              this.$message({
                type: "success",
                message: "添加成功！",
              });
              this.loading = false;
              this.formInlineNull()
              this.getdata();
            } else {
              this.loading = false;
              this.$message({
                type: "info",
                message: res.msg,
              });
            }
          }).catch(() => {});
        }else if(this.editForm.cw_type == 4){
          this.$axios({
            url: this.$baseURL + "/manage/courseware/add.html",
            method: "POST",
            data: {
              cw_name: this.editForm.cw_name,
              cw_desc: this.editForm.cw_desc,
              cw_pid: this.editForm.cw_pid,
              cw_type: this.editForm.cw_type,
              cw_sort: this.editForm.cw_sort,
              cw_free:this.editForm.cw_free,
            },
          }).then((res) => {
            if (res.code === 1000) {
              this.editFormVisible = false;
              this.$message({
                type: "success",
                message: "添加成功！",
              });
              this.loading = false;
              thia.formInlineNull()         
              this.getdata();
            } else {
              this.loading = false;
              this.$message({
                type: "info",
                message: res.msg,
              });
            }
          }).catch(() => {});
        }else if(this.editForm.cw_type == 5){
          this.$axios({
            url: this.$baseURL + "/manage/courseware/add.html",
            method: "POST",
            data: {
              cw_name: this.editForm.cw_name,
              cw_desc: this.editForm.cw_desc,
              cw_pid: this.editForm.cw_pid,
              cw_type: this.editForm.cw_type,
              cw_sort: this.editForm.cw_sort,
              cw_free: this.editForm.cw_free,
              title_text: this.editForm.title_img,
              title_audio: this.editForm.title_audio,
              select_a_img: this.editForm.select_a_img,
              select_a_text: this.editForm.select_a_text,
              select_b_img: this.editForm.select_b_img,
              select_b_text: this.editForm.select_b_text,
              select_c_img: this.editForm.select_c_img,
              select_c_text: this.editForm.select_c_text,
              select_d_img: this.editForm.select_d_img,
              select_d_img: this.editForm.select_d_img,
              select_d_text: this.editForm.select_d_text,
              right_answer: this.editForm.right_answer,
            },
          }).then((res) => {
            if (res.code === 1000) {
              this.editFormVisible = false;
              this.$message({
                type: "success",
                message: "添加成功！",
              });
              this.loading = false;
              this.formInlineNull();
              this.getdata();
            } else {
              this.loading = false;
              this.$message({
                type: "info",
                message: res.msg,
              });
            }
          }).catch(() => {});
        } 
      }else{
        //编辑课件
        if(this.editForm.cw_type == 1){
          this.$axios({
            url: this.$baseURL + "/manage/courseware/edit.html",
            method: "PUT",
            data: {
              cw_id: this.editForm.cw_id,
              cw_name: this.editForm.cw_name,
              cw_desc: this.editForm.cw_desc,
              cw_pid: this.editForm.cw_pid,
              cw_free: this.editForm.cw_free,
              cw_type: this.editForm.cw_type,
              cw_sort: this.editForm.cw_sort,
              thumb: this.editForm.thumb,
              video: this.editForm.s_video,
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
              this.formInlineNull()
              this.type2Null()
              this.type5Null()
            } else {
              this.loading = false;
              this.$message({
                type: "info",
                message: res.msg,
              });
            }
          })
        }else if(this.editForm.cw_type == 2 || this.editForm.cw_type == 3){
          this.$axios({
            url: this.$baseURL + "/manage/courseware/edit.html",
            method: "PUT",
            data: {
              cw_id: this.editForm.cw_id,
              cw_name: this.editForm.cw_name,
              cw_desc: this.editForm.cw_desc,
              cw_pid: this.editForm.cw_pid,
              cw_free:this.editForm.cw_free,
              cw_type: this.editForm.cw_type,
              cw_sort: this.editForm.cw_sort,
              xml: this.editForm.xml,
              pass: this.editForm.pass,
              mode: this.editForm.mode,
              hands: this.editForm.hands,
              metronome: this.editForm.metronome,
              tempo: this.editForm.tempo,
              keytips: this.editForm.keytips,
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
              this.formInlineNull()
              this.type1Null()
              this.type5Null()
            } else {
              this.loading = false;
              this.$message({
                type: "info",
                message: res.msg,
              });
            }
          })
        }else if(this.editForm.cw_type == 4){
          this.$axios({
            url: this.$baseURL + "/manage/courseware/edit.html",
            method: "PUT",
            data: {
              cw_id: this.editForm.cw_id,
              cw_name: this.editForm.cw_name,
              cw_desc: this.editForm.cw_desc,
              cw_pid: this.editForm.cw_pid,
              cw_free:this.editForm.cw_free,
              cw_type: this.editForm.cw_type,
              cw_sort: this.editForm.cw_sort,
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
              this.formInlineNull()
              this.type1Null()
              this.type2Null()
              this.type5Null()
            } else {
              this.loading = false;
              this.$message({
                type: "info",
                message: res.msg,
              });
            }
          })
        }else if(this.editForm.cw_type == 5){   
          this.$axios({
            url: this.$baseURL + "/manage/courseware/edit.html",
            method: "PUT",
            data: {
              cw_id: this.editForm.cw_id,
              cw_name: this.editForm.cw_name,
              cw_desc: this.editForm.cw_desc,
              cw_pid: this.editForm.cw_pid,
              cw_free:this.editForm.cw_free,
              cw_type: this.editForm.cw_type,
              cw_sort: this.editForm.cw_sort,
              title_text: this.editForm.title_text,
              title_img: this.editForm.title_img,
              title_audio: this.editForm.title_audio,
              select_a_img: this.editForm.select_a_img,
              select_a_text: this.editForm.select_a_text,
              select_b_img: this.editForm.select_b_img,
              select_b_text: this.editForm.select_b_text,
              select_c_img: this.editForm.select_c_img,
              select_c_text: this.editForm.select_c_text,
              select_d_img: this.editForm.select_d_img,
              select_d_text: this.editForm.select_d_text,
              right_answer: this.editForm.right_answer,
            },
          }).then((res) => {
            if (res.code === 1000) {
              if(this.editForm.select_type == '1'){
                this.editForm.select_a_img = ''
                this.editForm.select_b_img = ''
                this.editForm.select_c_img = ''
                this.editForm.select_d_img = ''
              }else if(this.editForm.select_type == '2'){
                this.editForm.select_a_text = ''
                this.editForm.select_b_text = ''
                this.editForm.select_c_text = ''
                this.editForm.select_d_text = ''
              }
              this.getdata();
              this.editFormVisible = false;
              this.$message({
                type: "success",
                message: "编辑成功！",
              });
              this.loading = false;
              this.formInlineNull()
              this.type1Null()
              this.type2Null()
            } else {
              this.loading = false;
              this.$message({
                type: "info",
                message: res.msg,
              });
            }
          })  
        }
      }
    },
    //删除课件
    deleteType(index,row) {
      this.$confirm("确定要删除吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(()=>{
        this.loading = true;
        this.$axios({
        url: this.$baseURL + "/manage/courseware/del.html",
        method: "DELETE",
        data: {
          cw_id:row.cw_id
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.loading = false;
            this.listData.splice(index,1)
            this.$message.success("删除成功")
          } else {
            this.$message({
              type: "info",
              message: res.msg,
            });
            this.loading = false;
          }
        })
      })
      .catch(() => {});
    },
    //关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
    },
    //状态切换
    changestatus(row){
      this.$axios({
        url: this.$baseURL + "/manage/courseware/status.html",
        method: "PUT",
        data: {
          cw_id:row.cw_id,
          cw_status: row.cw_status,
        },
      }).then((res) => {
          if (res.code === 1000) {
            this.$message.success('状态修改成功');
          }else{
            this.$message.error(res.msg)
          }
      })
    },
    //筛选类型
    selecttype(e){
      this.formInline.type=e
      this.getdata()
    },
    //筛选状态
    selectstatus(e){
      this.formInline.status = e
      this.getdata()
    },
    //分数超过100时自动设置最高
    blurinputpass(e){
      if(e.target.value > 100){
        this.editForm.pass = 100
      }else if(e.target.value < 1){
        this.editForm.pass = 1
      }
    },
    //速度超过300时自动设置最高
    blurinputtempo(e){
      if(e.target.value > 300){
        this.editForm.tempo = 300
      }else if(e.target.value < 10){
        this.editForm.tempo = 10
      }
    },
    //关闭编辑添加页时上传列表归零
    closeform(){
      this.uplist=[]
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

.scoper{
  width: 135px;
  height: 135px;
  border: 1px dashed #d9d9d9;
}
.scoper:hover {
  border-color: #409EFF;
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

 
 