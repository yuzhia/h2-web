<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['hr:jobrecord:add']">
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
          v-hasPermi="['hr:jobrecord:edit']">
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
          v-hasPermi="['hr:jobrecord:remove']">
          删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="jobrecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工id" align="center" prop="userId" />
      <el-table-column label="单位名称" align="center" prop="unitName" />
      <el-table-column label="开始时间" align="center" prop="startDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="离职原因" align="center" prop="dimReason" />
      <el-table-column label="职务" align="center" prop="duty" />
      <el-table-column label="离职薪资" align="center" prop="salary" />
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width" width="160px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hr:jobrecord:edit']">
            修改
          </el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hr:jobrecord:remove']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改工作经历对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="jobrecordRef" :model="form" :rules="rules" label-width="100px">
        <!-- <el-form-item label="员工id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入员工id" />
        </el-form-item> -->
        <el-form-item label="单位名称" prop="unitName">
          <el-input v-model="form.unitName" placeholder="请输入单位名称" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker
            clearable
            v-model="form.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            :disabled-date="handleStart"
            placeholder="请选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            clearable
            v-model="form.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            :disabled-date="handleEnd"
            placeholder="请选择结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="离职原因" prop="dimReason">
          <el-input v-model="form.dimReason" placeholder="请输入离职原因" />
        </el-form-item>
        <el-form-item label="职务" prop="duty">
          <el-input v-model="form.duty" placeholder="请输入职务" />
        </el-form-item>
        <el-form-item label="离职薪资" prop="salary">
          <el-input v-model="form.salary" placeholder="请输入离职薪资" />
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

<script setup name="Jobrecord">
import { listJobrecord, getJobrecord, delJobrecord, addJobrecord, updateJobrecord } from '@/api/hr/personnal/jobrecord'

const { proxy } = getCurrentInstance()

const users = inject('users')
const props = defineProps(['user'])

const jobrecordList = ref([])
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
    unitName: null,
    startDate: null,
    endDate: null,
    dimReason: null,
    duty: null,
    salary: null
  },
  rules: {
    userId: [{ required: true, message: '员工id不能为空', trigger: 'blur' }],
    unitName: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
    startDate: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
    endDate: [{ required: true, message: '结束日期不能为空', trigger: 'blur' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

const handleStart = (time) => {
  if (form.value.endDate) {
    return new Date(form.value.endDate).getTime() < time.getTime()
  } else {
    return time.getTime() > Date.now()
  }
}
const handleEnd = (time) => {
  if (form.value.startDate) {
    // 结束时间可以和开始时间是同一天 就减去的86400000 是第二天就不用减
    return new Date(form.value.startDate).getTime() - 86400000 > time.getTime()
  } else {
    return time.getTime() > Date.now()
  }
}

/** 查询工作经历列表 */
function getList() {
  loading.value = true
  queryParams.value.userId = props.user.userId
  listJobrecord(queryParams.value).then((response) => {
    jobrecordList.value = response.data.records
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
    unitName: null,
    startDate: null,
    endDate: null,
    dimReason: null,
    duty: null,
    salary: null,
    createTime: null,
    updateTime: null
  }
  proxy.resetForm('jobrecordRef')
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
  title.value = '添加工作经历'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getJobrecord(_id).then((response) => {
    form.value = response.data
    open.value = true
    title.value = '修改工作经历'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['jobrecordRef'].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateJobrecord(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        form.value.userId = props.user.userId
        addJobrecord(form.value).then((response) => {
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
    .confirm('是否确认删除工作经历编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delJobrecord(_ids)
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
