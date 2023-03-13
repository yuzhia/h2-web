<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['hr:temporary:add']">
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
          v-hasPermi="['hr:temporary:edit']">
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
          v-hasPermi="['hr:temporary:remove']">
          删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="temporaryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工id" align="center" prop="userId" />
      <el-table-column label="暂住证编码" align="center" prop="code" />
      <el-table-column label="暂住证类型" align="center" prop="type" />
      <el-table-column label="开始日期" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="个人缴费" align="center" prop="paid" />
      <el-table-column label="发证日期" align="center" prop="certificateDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.certificateDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收回日期" align="center" prop="recallDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.recallDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退回金额" align="center" prop="amountReturned" />
      <el-table-column label="终止标志" align="center" prop="stoped" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width" width="160px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hr:temporary:edit']">
            修改
          </el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hr:temporary:remove']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改员工暂住证资料对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="temporaryRef" :model="form" :rules="rules" label-width="100px">
        <!-- <el-form-item label="员工id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入员工id" />
        </el-form-item> -->
        <el-form-item label="暂住证编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入暂住证编码" />
        </el-form-item>
        <el-form-item label="暂住证类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入暂住证类型" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startTime">
          <el-date-picker
            clearable
            v-model="form.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker
            clearable
            v-model="form.endTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="个人缴费" prop="paid">
          <el-input v-model="form.paid" placeholder="请输入个人缴费" />
        </el-form-item>
        <el-form-item label="发证日期" prop="certificateDate">
          <el-date-picker
            clearable
            v-model="form.certificateDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发证日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="收回日期" prop="recallDate">
          <el-date-picker
            clearable
            v-model="form.recallDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择收回日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="退回金额" prop="amountReturned">
          <el-input v-model="form.amountReturned" placeholder="请输入退回金额" />
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

<script setup name="Temporary">
import { listTemporary, getTemporary, delTemporary, addTemporary, updateTemporary } from '@/api/hr/personnal/temporary'

const { proxy } = getCurrentInstance()

const users = inject('users')
const props = defineProps(['user'])

const temporaryList = ref([])
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
    type: null,
    startTime: null,
    endTime: null,
    paid: null,
    certificateDate: null,
    recallDate: null,
    amountReturned: null,
    stoped: null
  },
  rules: {
    userId: [{ required: true, message: '员工id不能为空', trigger: 'blur' }],
    code: [{ required: true, message: '暂住证编码不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '暂住证类型不能为空', trigger: 'change' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询员工暂住证资料列表 */
function getList() {
  loading.value = true
  queryParams.value.userId = props.user.userId
  listTemporary(queryParams.value).then((response) => {
    temporaryList.value = response.data.records
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
    type: null,
    startTime: null,
    endTime: null,
    paid: null,
    certificateDate: null,
    recallDate: null,
    amountReturned: null,
    stoped: null,
    remark: null,
    createTime: null,
    updateTime: null
  }
  proxy.resetForm('temporaryRef')
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
  title.value = '添加员工暂住证资料'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getTemporary(_id).then((response) => {
    form.value = response.data
    open.value = true
    title.value = '修改员工暂住证资料'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['temporaryRef'].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateTemporary(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        form.value.userId = props.user.userId
        addTemporary(form.value).then((response) => {
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
    .confirm('是否确认删除员工暂住证资料编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delTemporary(_ids)
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
