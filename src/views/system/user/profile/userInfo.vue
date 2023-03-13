<template>
   <el-form ref="userRef" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="用户昵称" prop="nickName">
         <el-input v-model="user.nickName" maxlength="30" />
      </el-form-item>
	  
	  <el-form-item label="身份证" prop="idCard">
		  <el-input v-model="user.idCard" placeholder="请输入身份证号"></el-input>
	  </el-form-item>
	  
	  <el-form-item label="省份" prop="province">
	     <!-- <el-input v-model="user.province" placeholder="请选择省份"/>-->
		 <el-select v-model="user.province" placeholder="请选择省份">
		     <el-option
		       v-for="item in province"
		       :key="item.value"
		       :label="item.label"
		       :value="item.value">
		     </el-option>
		   </el-select>
	  </el-form-item>
	  
	  <el-form-item label="籍贯" prop="idCard">
	  	<el-input v-model="user.nativePlace" placeholder="请输入籍贯"></el-input>
	  </el-form-item>
	  
	  <el-form-item label="民族" prop="nationality">
	    <!-- <el-input v-model="user.nationality" placeholder="请选择民族"/> -->
		<el-select v-model="user.nationality" placeholder="请选择民族">
		    <el-option
		      v-for="item in nationality"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value">
		    </el-option>
		  </el-select>
	  </el-form-item>
	  
	  <el-form-item label="出生年月" prop="birthday">
		 <div class="block">
		     <el-date-picker
		       v-model="user.birthday"
		       type="date"
		       placeholder="选择日期">
		     </el-date-picker>
		   </div>
	  </el-form-item>
	  
	  <el-form-item label="婚姻状况" prop="maritalStatus">
	  <el-select v-model="user.maritalStatus" placeholder="请选择婚姻状况">
	      <el-option
	        v-for="item in maritalStatus"
	        :key="item.value"
	        :label="item.label"
	        :value="item.value">
	      </el-option>
	    </el-select>
	  </el-form-item>
	  
	  <el-form-item label="结婚日期" prop="weddingDate">
	     <!-- <el-input v-model="user.maritalStatus" placeholder="请选择婚姻状况"/> -->
		 <div class="block">
		     <el-date-picker
		       v-model="user.weddingDate"
		       type="date"
		       placeholder="选择日期">
		     </el-date-picker>
		   </div>
	  </el-form-item>
	  <el-form-item label="身高" prop="height">
	     <el-input v-model="user.height" placeholder="请输入身高"/>
	  </el-form-item>
	  <el-form-item label="毕业日期" prop="graduation">
	     <!-- <el-input v-model="user.graduation" placeholder="请选择毕业日期"/> -->
		 <div class="block">
		     <el-date-picker
		       v-model="user.graduation"
		       type="date"
		       placeholder="请选择毕业日期">
		     </el-date-picker>
		   </div>
	  </el-form-item>
	  <el-form-item label="专业" prop="major">
	     <el-input v-model="user.major" placeholder="请输入专业"/>
	  </el-form-item>
	  <el-form-item label="毕业学校" prop="graduationSchool">
	     <el-input v-model="user.graduationSchool" placeholder="请输入毕业学校"/>
	  </el-form-item>
	  <el-form-item label="学历" prop="educationalBackground">
	     <el-input v-model="user.educationalBackground" placeholder="请选择学历"/>
	  </el-form-item>
	  <el-form-item label="学位" prop="degree">
	     <el-input v-model="user.degree" placeholder="请输入学位"/>
	  </el-form-item>
	  <el-form-item label="政治面貌" prop="politicalStatus">
	     <el-input v-model="user.politicalStatus" placeholder="请选择政治面貌"/>
	  </el-form-item>
	  <el-form-item label="英语级别" prop="englishLevel">
	     <el-input v-model="user.englishLevel" placeholder="请输入英语级别"/>
	  </el-form-item>
	  <!-- //TODO:单选加输入 -->
	  <el-form-item label="其他语言" prop="otherLanguage">
	     <el-input v-model="user.otherLanguage" placeholder="请选择民族"/>
	  </el-form-item>
	
	  <el-form-item label="电脑技术" prop="computerTechnology">
	     <el-input v-model="user.computerTechnology"/>
	  </el-form-item>
	  
	  <el-form-item label="驾驶执照" prop="drivingLicence">
	     <el-input v-model="user.drivingLicence"/>
	  </el-form-item>
	  
	  <el-form-item label="兴趣爱好" prop="interest">
	     <el-input v-model="user.interest"/>
	  </el-form-item>
	  
	  <el-form-item label="其他技能" prop="otherSkills">
	     <el-input v-model="user.otherSkills"/>
	  </el-form-item>
	  
	  <el-form-item label="配偶工号" prop="spouseJobNumber">
	     <el-input v-model="user.spouseJobNumber"/>
	  </el-form-item>
	  
	  <el-form-item label="配偶姓名" prop="spouseName">
	     <el-input v-model="user.spouseName"/>
	  </el-form-item>
	  
	  <el-form-item label="子女数" prop="childrenNumber">
	     <el-input v-model="user.childrenNumber"/>
	  </el-form-item>
	  
	  <el-form-item label="计划生育证" prop="familyPlanningCertificate">
	     <el-input v-model="user.familyPlanningCertificate"/>
	  </el-form-item>
	  
	  <el-form-item label="紧急联络人" prop="emergencyContact">
	     <el-input v-model="user.emergencyContact"/>
	  </el-form-item>
	  
	  <el-form-item label="关系" prop="relationship">
	     <el-input v-model="user.relationship"/>
	  </el-form-item>
	  
	  <el-form-item label="联络电话" prop="contactNumber">
	     <el-input v-model="user.contactNumber"/>
	  </el-form-item>
	  <strong></strong>
	  <el-form-item label="手机" prop="mobilePhone">
	     <el-input v-model="user.mobilePhone"/>
	  </el-form-item>
	  
	  <el-form-item label="电话" prop="telephone">
	     <el-input v-model="user.telephone"/>
	  </el-form-item>
	  
	  <el-form-item label="电子邮件" prop="email">
	     <el-input v-model="user.email"/>
	  </el-form-item>
	  
	  <el-form-item label="联络地址" prop="contactAddress">
	     <el-input v-model="user.contactAddress"/>
	  </el-form-item>
	  
	  <el-form-item label="家庭住址" prop="address">
	     <el-input v-model="user.address"/>
	  </el-form-item>
	  
	  <el-form-item label="邮政编码" prop="postalCode">
	     <el-input v-model="user.postalCode"/>
	  </el-form-item>
	  
	  <el-form-item label="户口类型" prop="householdAccountType">
	     <el-input v-model="user.householdAccountType"/>
	  </el-form-item>
	  
	  <el-form-item label="户口所在地" prop="domicile">
	     <el-input v-model="user.domicile"/>
	  </el-form-item>
	  
      <!-- <el-form-item label="邮箱" prop="email">
         <el-input v-model="user.email" maxlength="50" />
      </el-form-item> -->
      <el-form-item label="性别">
         <el-radio-group v-model="user.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
         </el-radio-group>
      </el-form-item>
      <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
      </el-form-item>
   </el-form>
</template>

<script setup>
import { updateUserProfile } from "@/api/system/user";

const props = defineProps({
  user: {
    type: Object
  }
});

const { proxy } = getCurrentInstance();

const rules = ref({
  nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  email: [{ required: true, message: "邮箱地址不能为空", trigger: "blur" }, { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
  phonenumber: [{ required: true, message: "手机号码不能为空", trigger: "blur" }, { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }],
});

/** 提交按钮 */
function submit() {
  proxy.$refs.userRef.validate(valid => {
    if (valid) {
      updateUserProfile(props.user).then(response => {
        proxy.$modal.msgSuccess("修改成功");
      });
    }
  });
};
/** 关闭按钮 */
function close() {
  proxy.$tab.closePage();
};
</script>
