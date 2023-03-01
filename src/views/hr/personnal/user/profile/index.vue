<template>
   <div class="app-container">
      <el-row :gutter="20">
         <el-col :span="5" :xs="24">
            <el-card class="box-card">
               <template v-slot:header>
                 <div class="clearfix">
                   <span>员工信息</span>
                 </div>
               </template>
               <div>
                  <div class="text-center">
                     <userAvatar :user="state.user" />
                  </div>
                  <ul class="list-group list-group-striped">
                     <li class="list-group-item">
                        <svg-icon icon-class="user" />用户名称
                        <div class="pull-right">{{ state.user.userName }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="phone" />手机号码
                        <div class="pull-right">{{ state.user.phonenumber }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="email" />用户邮箱
                        <div class="pull-right">{{ state.user.email }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="tree" />所属部门
                        <div class="pull-right" v-if="state.user.dept">{{ state.user.dept.deptName }} / {{ state.postGroup }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="peoples" />所属角色
                        <div class="pull-right">{{ state.roleGroup }}</div>
                     </li>
                     <li class="list-group-item">
                        <svg-icon icon-class="date" />创建日期
                        <div class="pull-right">{{ state.user.createTime }}</div>
                     </li>
                  </ul>
               </div>
            </el-card>
         </el-col>
         <el-col :span="19" :xs="24">
            <el-card>
               <template v-slot:header>
                 <div class="clearfix">
                   <span>基本资料</span>
                 </div>
               </template>
               <el-tabs v-model="activeTab">
                  <el-tab-pane label="基本资料" name="userinfo" class="el-tab-pane">
                     <userInfo :user="state.user" />
                  </el-tab-pane>
                  <el-tab-pane label="修改密码" name="resetPwd">
                     <resetPwd />
                  </el-tab-pane>
                  <el-tab-pane label="任职资料" name="jobDescription">
                     <!-- <resetPwd /> -->
                     <h2>任职资料</h2>
                  </el-tab-pane>
                  <el-tab-pane label="员工关系" name="relations">
                     <!-- <resetPwd /> -->
                     <h2>员工关系</h2>
                  </el-tab-pane>
                  <el-tab-pane label="工作经历" name="workExperience">
                     <!-- <resetPwd /> -->
                     <h2>工作经历</h2>
                  </el-tab-pane>
                  <el-tab-pane label="员工合同" name="contract">
                     <!-- <resetPwd /> -->
                     <h2>员工合同</h2>
                  </el-tab-pane>
                  <!-- <el-tab-pane label="员工关系" name="relations">
                     <h2>员工关系</h2>
                  </el-tab-pane> --> 
                  <el-tab-pane label="员工保险" name="insurance">
                     <!-- <resetPwd /> -->
                     <h2>员工保险</h2>
                  </el-tab-pane>
                  <el-tab-pane label="员工证件" name="identification">
                     <!-- <resetPwd /> -->
                     <h2>员工证件</h2>
                  </el-tab-pane>
                  <el-tab-pane label="专业技术等级证书" name="certificate">
                     <!-- <resetPwd /> -->
                     <h2>专业技术等级证书</h2>
                  </el-tab-pane>
                  <el-tab-pane label="员工暂住证" name="temporaryResidencePermit">
                     <!-- <resetPwd /> -->
                     <h2>员工暂住证</h2>
                  </el-tab-pane>
                  <el-tab-pane label="教育经历" name="educationalExperience">
                     <!-- <resetPwd /> -->
                     <h2>教育经历</h2>
                  </el-tab-pane>
                  <el-tab-pane label="培训记录" name="trainingRecords">
                     <!-- <resetPwd /> -->
                     <h2>培训记录</h2>
                  </el-tab-pane>
                  <el-tab-pane label="其他资料" name="other">
                     <!-- <resetPwd /> -->
                     <h2>其他资料</h2>
                  </el-tab-pane>
               </el-tabs>
            </el-card>
         </el-col>
      </el-row>
   </div>
</template>

<script setup name="Profile">
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";

const activeTab = ref("userinfo");
const state = reactive({
  user: {},
  roleGroup: {},
  postGroup: {}
});

function getUser() {
  getUserProfile().then(response => {
    state.user = response.data;
    state.roleGroup = response.roleGroup;
    state.postGroup = response.postGroup;
  });
};

getUser();
</script>

<style scoped lang="scss">
.app-container {
   .el-tabs__item {
      padding: 0 10px !important;
   }
}

   
</style>