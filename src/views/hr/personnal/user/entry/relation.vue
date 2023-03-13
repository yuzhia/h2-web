<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['hr:relation:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hr:relation:edit']">
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
          v-hasPermi="['hr:relation:remove']">
          删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="relationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工id" align="center" prop="userId" />
      <el-table-column label="关系" align="center" prop="relation" />
      <el-table-column label="姓名" align="center" prop="relName" />
      <el-table-column label="出生日期" align="center" prop="bornDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.bornDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作单位" align="center" prop="workPlace" />
      <el-table-column label="职务" align="center" prop="duty" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['hr:relation:edit']">
            修改
          </el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hr:relation:remove']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改员工关系对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="relationRef" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="员工" prop="userId">
          <el-select v-model="form.userId" placeholder="请选择员工">
            <el-option v-for="item in users" :key="item.userId" :label="item.userName" :value="item.userId" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="关系" prop="relation">
          <el-input v-model="form.relation" placeholder="请输入关系" />
        </el-form-item>
        <el-form-item label="姓名" prop="relName">
          <el-input v-model="form.relName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="出生日期" prop="bornDate">
          <el-date-picker
            clearable
            v-model="form.bornDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择出生日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="工作单位" prop="workPlace">
          <el-input v-model="form.workPlace" placeholder="请输入工作单位" />
        </el-form-item>
        <el-form-item label="职务" prop="duty">
          <el-input v-model="form.duty" placeholder="请输入职务" />
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

<script setup name="Relation">
import { listRelation, getRelation, delRelation, addRelation, updateRelation } from '@/api/hr/personnal/relation'

const { proxy } = getCurrentInstance()

const props = defineProps(['user'])

const relationList = ref([])
const open = ref(false)
const loading = ref(false)
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
    relation: null,
    relName: null,
    bornDate: null,
    workPlace: null,
    duty: null
  },
  rules: {
    userId: [{ required: true, message: '员工不能为空', trigger: 'blur' }],
    relation: [{ required: true, message: '关系不能为空', trigger: 'blur' }],
    relName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

const users = inject('users')

/** 查询员工关系列表 */
function getList() {
  loading.value = false
  queryParams.value.userId = props.user.userId
  listRelation(queryParams.value).then((response) => {
    relationList.value = response.data.records
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
    relation: null,
    relName: null,
    bornDate: null,
    workPlace: null,
    duty: null,
    remark: null,
    createTime: null,
    updateTime: null
  }
  proxy.resetForm('relationRef')
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
  title.value = '添加员工关系'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getRelation(_id).then((response) => {
    form.value = response.data
    open.value = true
    title.value = '修改员工关系'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['relationRef'].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateRelation(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        form.value.userId = props.user.userId
        addRelation(form.value).then((response) => {
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
    .confirm('是否确认删除员工关系编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delRelation(_ids)
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
