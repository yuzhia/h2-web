<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['hr:train:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hr:train:edit']">
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
          v-hasPermi="['hr:train:remove']">
          删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="trainList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工id" align="center" prop="userId" />
      <el-table-column label="培训项目" align="center" prop="trainProgram" />
      <el-table-column label="培训机构" align="center" prop="trainInstitution" />
      <el-table-column label="培训开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="培训结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所获证书" align="center" prop="certificate" />
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width" width="160px">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['hr:train:edit']">
            修改
          </el-button>
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hr:train:remove']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改员工培训记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="trainRef" :model="form" :rules="rules" label-width="100px">
        <!-- <el-form-item label="员工id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入员工id" />
        </el-form-item> -->
        <el-form-item label="培训项目" prop="trainProgram">
          <el-input v-model="form.trainProgram" placeholder="请输入培训项目" />
        </el-form-item>
        <el-form-item label="培训机构" prop="trainInstitution">
          <el-input v-model="form.trainInstitution" placeholder="请输入培训机构" />
        </el-form-item>
        <el-form-item label="培训开始时间" prop="startTime">
          <el-date-picker
            clearable
            v-model="form.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择培训开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="培训结束时间" prop="endTime">
          <el-date-picker
            clearable
            v-model="form.endTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择培训结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="所获证书" prop="certificate">
          <el-input v-model="form.certificate" placeholder="请输入所获证书" />
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

<script setup name="Train">
import { listTrain, getTrain, delTrain, addTrain, updateTrain } from '@/api/hr/personnal/train'

const { proxy } = getCurrentInstance()

const users = inject('users')
const props = defineProps(['user'])

const trainList = ref([])
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
    trainProgram: null,
    trainInstitution: null,
    startTime: null,
    endTime: null,
    certificate: null
  },
  rules: {
    userId: [{ required: true, message: '员工id不能为空', trigger: 'blur' }],
    trainProgram: [{ required: true, message: '培训项目不能为空', trigger: 'blur' }],
    trainInstitution: [{ required: true, message: '培训机构不能为空', trigger: 'blur' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询员工培训记录列表 */
function getList() {
  loading.value = true
  queryParams.value.userId = props.user.userId
  listTrain(queryParams.value).then((response) => {
    trainList.value = response.data.records
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
    trainProgram: null,
    trainInstitution: null,
    startTime: null,
    endTime: null,
    certificate: null,
    createTime: null,
    updateTime: null
  }
  proxy.resetForm('trainRef')
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
  title.value = '添加员工培训记录'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getTrain(_id).then((response) => {
    form.value = response.data
    open.value = true
    title.value = '修改员工培训记录'
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['trainRef'].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateTrain(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        form.value.userId = props.user.userId
        addTrain(form.value).then((response) => {
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
    .confirm('是否确认删除员工培训记录编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delTrain(_ids)
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
