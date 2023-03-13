<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['hr:contact:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hr:contact:edit']">
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
          v-hasPermi="['hr:contact:remove']">
          删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contactList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工" align="center" prop="userId" />
      <el-table-column label="合同号" align="center" prop="code" />
      <el-table-column label="合同期限" align="center" prop="term" />
      <el-table-column label="合同终止条件" align="center" prop="endCondition" />
      <el-table-column label="合同类型" align="center" prop="type" />
      <el-table-column label="合同起始日期" align="center" prop="startDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同截止日期" align="center" prop="endDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同签订日期" align="center" prop="conDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.conDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="终止合同日期" align="center" prop="conEndDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.conEndDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试用期" align="center" prop="probation" width="180" />
      <el-table-column label="试用期满日期" align="center" prop="probationEndDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.probationEndDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同终止状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width" width="160px">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['hr:contact:edit']">
            修改
          </el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hr:contact:remove']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改员工合同对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="contactRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="员工" prop="userId">
          <el-select v-model="form.userId" placeholder="请选择员工">
            <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="合同号" prop="code">
          <el-input v-model="form.code" placeholder="请输入合同号" />
        </el-form-item>
        <el-form-item label="合同期限" prop="term">
          <el-input v-model="form.term" placeholder="请输入合同期限" />
        </el-form-item>
        <el-form-item label="合同终止条件" prop="endCondition">
          <el-input v-model="form.endCondition" placeholder="请输入合同终止条件" />
        </el-form-item>
        <el-form-item label="合同起始日期" prop="startDate">
          <el-date-picker
            clearable
            v-model="form.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择合同起始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="合同截止日期" prop="endDate">
          <el-date-picker
            clearable
            v-model="form.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择合同截止日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="合同签订日期" prop="conDate">
          <el-date-picker
            clearable
            v-model="form.conDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择合同签订日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="终止合同日期" prop="conEndDate">
          <el-date-picker
            clearable
            v-model="form.conEndDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择终止合同日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="试用期" prop="probation">
          <el-input v-model="form.probation" placeholder="请输入试用期" />
        </el-form-item>
        <el-form-item label="试用期满日期" prop="probationEndDate">
          <el-date-picker
            clearable
            v-model="form.probationEndDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择试用期满日期"></el-date-picker>
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

<script setup name="Contact">
import { listContact, getContact, delContact, addContact, updateContact } from '@/api/hr/personnal/contact'

const { proxy } = getCurrentInstance()

const props = defineProps(['user'])

const contactList = ref([])
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
    code: null,
    term: null,
    endCondition: null,
    type: null,
    startDate: null,
    endDate: null,
    conDate: null,
    conEndDate: null,
    probation: null,
    probationEndDate: null,
    status: null
  },
  rules: {
    code: [{ required: true, message: '合同号不能为空', trigger: 'blur' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

const users = inject('users')

/** 查询员工合同列表 */
function getList() {
  loading.value = true
  queryParams.value.userId = props.user.userId
  listContact(queryParams.value).then((response) => {
    contactList.value = response.data.records
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
    code: null,
    term: null,
    endCondition: null,
    type: null,
    startDate: null,
    endDate: null,
    conDate: null,
    conEndDate: null,
    probation: null,
    probationEndDate: null,
    status: null,
    remark: null,
    createTime: null,
    updateTime: null
  }
  proxy.resetForm('contactRef')
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
  title.value = '添加员工合同'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getContact(_id).then((response) => {
    form.value = response.data
    open.value = true
    title.value = '修改员工合同'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['contactRef'].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateContact(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        form.value.userId = props.user.userId
        addContact(form.value).then((response) => {
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
    .confirm('是否确认删除员工合同编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delContact(_ids)
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
