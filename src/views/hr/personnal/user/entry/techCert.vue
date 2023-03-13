<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['hr:cert:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hr:cert:edit']">
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
          v-hasPermi="['hr:cert:remove']">
          删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="certList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工id" align="center" prop="userId" />
      <el-table-column label="证件名称" align="center" prop="name" />
      <el-table-column label="证件编号" align="center" prop="no" />
      <el-table-column label="发证单位" align="center" prop="unit" />
      <el-table-column label="证件开始日期" align="center" prop="startDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件结束日期" align="center" prop="endDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提示到期终止标识" align="center" prop="stoped" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width" width="160px">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['hr:cert:edit']">
            修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['hr:cert:remove']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改专业技术等级证书对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="certRef" :model="form" :rules="rules" label-width="100px">
        <!-- <el-form-item label="员工id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入员工id" />
        </el-form-item> -->
        <el-form-item label="证件名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入证件名称" />
        </el-form-item>
        <el-form-item label="证件编号" prop="no">
          <el-input v-model="form.no" placeholder="请输入证件编号" />
        </el-form-item>
        <el-form-item label="发证单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入发证单位" />
        </el-form-item>
        <el-form-item label="证件开始日期" prop="startDate">
          <el-date-picker
            clearable
            v-model="form.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择证件开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="证件结束日期" prop="endDate">
          <el-date-picker
            clearable
            v-model="form.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择证件结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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

<script setup name="Cert">
import { listCert, getCert, delCert, addCert, updateCert } from '@/api/hr/personnal/techCert'

const { proxy } = getCurrentInstance()

const users = inject('users')
const props = defineProps(['user'])

const certList = ref([])
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
    name: null,
    no: null,
    unit: null,
    startDate: null,
    endDate: null,
    stoped: null
  },
  rules: {
    userId: [{ required: true, message: '员工id不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '证件名称不能为空', trigger: 'blur' }],
    no: [{ required: true, message: '证件编号不能为空', trigger: 'blur' }],
    unit: [{ required: true, message: '发证单位不能为空', trigger: 'blur' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询专业技术等级证书列表 */
function getList() {
  loading.value = true
  queryParams.value.userId = props.user.userId
  listCert(queryParams.value).then((response) => {
    certList.value = response.data.records
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
    name: null,
    no: null,
    unit: null,
    startDate: null,
    endDate: null,
    stoped: null,
    remark: null,
    createTime: null,
    updateTime: null
  }
  proxy.resetForm('certRef')
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
  title.value = '添加专业技术等级证书'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getCert(_id).then((response) => {
    form.value = response.data
    open.value = true
    title.value = '修改专业技术等级证书'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['certRef'].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateCert(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        form.value.userId = props.user.userId
        addCert(form.value).then((response) => {
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
    .confirm('是否确认删除专业技术等级证书编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delCert(_ids)
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
