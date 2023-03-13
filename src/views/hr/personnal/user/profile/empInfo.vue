<template>
  <el-form ref="userRef" :model="form" :rules="rules" label-width="80px">
    <div class="flex flex-wrap">
      <div v-for="item in formList" :key="item.id" class="w-1/4">
        <el-form-item :label="item.name" label-position="left" :prop="item.code" label-width="100px">
          <el-input v-if="item.displayType == '0'" v-model="form[item.code]" :placeholder="`请输入${item.name}`" />
          <el-input v-if="item.displayType == '1'" v-model.number="form[item.code]" />
          <el-select
            v-if="item.displayType == '3'"
            v-model="form[item.code]"
            :placeholder="`请选择字典`"
            multiple
            collapse-tags
            collapse-tags-tooltip>
            <el-option
              v-for="dict in item.dictList"
              :key="dict.dictCode"
              :label="dict.dictLabel"
              :value="dict.dictCode + ''" />
          </el-select>
          <el-select v-if="item.displayType == '4'" v-model="form[item.code]" :placeholder="`请选择字典`">
            <el-option
              v-for="dict in item.dictList"
              :key="dict.dictCode"
              :label="dict.dictLabel"
              :value="dict.dictCode + ''" />
          </el-select>
          <div v-if="item.displayType == '2'">
            <el-date-picker
              v-if="item.dateType == '0'"
              v-model="form[item.code]"
              type="date"
              value-format="YYYY-MM-DD"
              :placeholder="`选择${item.name}`" />
            <el-date-picker
              v-if="item.dateType == '1'"
              v-model="form[item.code]"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              :placeholder="`选择${item.name}`" />
            <el-time-picker v-if="item.dateType == '2'" v-model="form[item.code]" :placeholder="`选择${item.name}`" />
          </div>
          <el-input
            v-if="item.displayType == '5'"
            v-model="form[item.code]"
            :rows="3"
            type="textarea"
            :placeholder="`请输入${item.name}`" />
        </el-form-item>
      </div>
    </div>

    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { listField, saveVal, listFieldVal } from '@/api/hr/personnal/field'
import { getDicts } from '@/api/system/dict/data'

const route = useRoute()
const userId = route.params.id
const userRef = ref()

const props = defineProps({
  user: {
    type: Object
  },
  tableId: String
})

const { proxy } = getCurrentInstance()

const rules = ref({})

const formList = ref([])
const form = ref({})

listFieldVal(userId).then((res) => {
  for (let item of res.data) {
    if (item.displayType == '3') {
      form.value[item.code] = item.value.split(',')
    } else {
      form.value[item.code] = item.value
    }
  }
})

const listFields = () => {
  listField(props.tableId).then((res) => {
    // 动态添加验证
    for (let item of res.data) {
      if (item.isRequired == 1 || item.displayType == '4') {
        rules.value[item.code] = [{ required: true, message: `${item.name}不能为空`, trigger: 'blur' }]
      }
    }
    formList.value = res.data
  })
}

listFields()

/** 提交按钮 */
function submit() {
  userRef.value.validate((valid) => {
    if (valid) {
      let param = { ...form.value }
      param.userId = props.user.userId
      param.tableId = props.tableId
      for (let val in param) {
        if (Array.isArray(param[val])) {
          param[val] = param[val].join(',')
        }
      }
      saveVal(param).then(() => {
        console.log('保存成功')
      })
    }
  })
}
</script>
