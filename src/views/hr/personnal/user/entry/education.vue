<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['hr:education:add']">
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hr:education:edit']">
          修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hr:education:remove']">
          删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="educationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工id" align="center" prop="userId" />
      <el-table-column label="学历" align="center" prop="degree" />
      <el-table-column label="学校名称" align="center" prop="school" />
      <el-table-column label="主修专业" align="center" prop="major" />
      <el-table-column label="入学时间" align="center" prop="admissionTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.admissionTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毕业时间" align="center" prop="graduationTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.graduationTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学位证书" align="center" prop="degreeCertificate" />
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width" width="160px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hr:education:edit']">
            修改
          </el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hr:education:remove']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改员工教育经历对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="educationRef" :model="form" :rules="rules" label-width="100px">
        <!-- <el-form-item label="员工id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入员工id" />
        </el-form-item> -->
        <el-form-item label="学历" prop="degree">
          <el-input v-model="form.degree" placeholder="请输入学历" />
        </el-form-item>
        <el-form-item label="学校名称" prop="school">
          <el-input v-model="form.school" placeholder="请输入学校名称" />
        </el-form-item>
        <el-form-item label="主修专业" prop="major">
          <el-input v-model="form.major" placeholder="请输入主修专业" />
        </el-form-item>
        <el-form-item label="入学时间" prop="admissionTime">
          <el-date-picker
            clearable
            v-model="form.admissionTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择入学时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="毕业时间" prop="graduationTime">
          <el-date-picker
            clearable
            v-model="form.graduationTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择毕业时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="学位证书" prop="degreeCertificate">
          <el-input v-model="form.degreeCertificate" placeholder="请输入学位证书" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Education">
import { listEducation, getEducation, delEducation, addEducation, updateEducation } from '@/api/hr/personnal/education'

const { proxy } = getCurrentInstance()

const users = inject('users')
const props = defineProps(['user'])

const educationList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: null,
    degree: null,
    school: null,
    major: null,
    admissionTime: null,
    graduationTime: null,
    degreeCertificate: null
  },
  rules: {
    userId: [{ required: true, message: '员工id不能为空', trigger: 'blur' }],
    degree: [{ required: true, message: '学历不能为空', trigger: 'blur' }],
    school: [{ required: true, message: '学校名称不能为空', trigger: 'blur' }],
    major: [{ required: true, message: '主修专业不能为空', trigger: 'blur' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询员工教育经历列表 */
function getList() {
  loading.value = true
  queryParams.value.userId = props.user.userId
  listEducation(queryParams.value).then((response) => {
    educationList.value = response.data.records
    total.value = response.data.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    userId: null,
    degree: null,
    school: null,
    major: null,
    admissionTime: null,
    graduationTime: null,
    degreeCertificate: null,
    createTime: null,
    updateTime: null
  }
  proxy.resetForm('educationRef')
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加员工教育经历'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getEducation(_id).then((response) => {
    form.value = response.data
    open.value = true
    title.value = '修改员工教育经历'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['educationRef'].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateEducation(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        form.value.userId = props.user.userId
        addEducation(form.value).then((response) => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  let _ids = []
  row.id ? _ids.push(row.id) : _ids.push(ids.value)
  proxy.$modal
    .confirm('是否确认删除员工教育经历编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delEducation(_ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}

watch(
  () => props.user,
  () => {
    if (props.user) {
      getList()
    }
  }
)
</script>
