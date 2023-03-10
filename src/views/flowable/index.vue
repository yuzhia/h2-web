<script setup>
import { listWorkFlow, addWorkFlow, deleteWorkFlow, updateWorkFlow } from '@/api/flowable/workFlow.js'
import {parseTime} from '@/utils/hr.js'

const router = useRouter()

const tableData = ref([])

const dialogTableVisible = ref(false)

const ruleFormRef = ref() // 验证

const list = () => {
    listWorkFlow().then(res => {
      tableData.value = res.rows
    })
}

list()

const rules = {
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '标识不能为空', trigger: 'blur' }],
  system: [{ required: true, message: '系统不能为空', trigger: 'blur' }]
}

// 删除
const deleteClick = id => {
  deleteWorkFlow(id).then(() => {
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
    list()
  })
}

const workFlowId = ref()
const confirmClick = async () => {
  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (title.value == '添加') {
        await addWorkFlow(workFlow.value).then(res => {
          workFlowId.value = res.data.id
        })
      } else {
        await updateWorkFlow(workFlow.value).then(res => {
          workFlowId.value = res.data.id
        })
      }
      router.push(`/flowable/bpmn/designer/${workFlowId.value}`)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const workFlow = ref({})
const title = ref('添加')

const clickAddButton = () => {
  title.value = '添加'
  workFlow.value = {}
  dialogTableVisible.value = true
}

const clickEditButton = data => {
  title.value = '编辑'
  dialogTableVisible.value = true
  workFlow.value = { ...data }
}

// 格式化时间
const dateFormatter = (row, column) => {
  return parseTime(row.updateTime)
}

const closeDialog = () => {
  // 重置验证规则
  ruleFormRef.value.resetFields()
}
</script>

<template>
  <div class="app-container">
    <el-button class="my-2" type="primary" size="default" @click="clickAddButton">添加</el-button>
    <el-table :data="tableData" style="">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="KEY" />
      <el-table-column prop="type" label="分类名称" />
      <el-table-column prop="updateTime" label="更新时间" :formatter="dateFormatter" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag v-if="row.status == 0" class="ml-2" type="info">草稿</el-tag>
          <el-tag v-else-if="row.status == 1" class="ml-2" type="warning">待发布</el-tag>
          <el-tag v-else-if="row.status == 2" class="ml-2" type="success">启用</el-tag>
          <el-tag v-else class="ml-2" type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-tooltip effect="dark" content="流程图预览" placement="top">
              <div class="text-14px px-2 py-1 cursor-pointer color-#536dfe">
                <i-ep-view />
              </div>
            </el-tooltip>
            <el-tooltip effect="dark" content="发布" placement="top">
              <div class="text-14px px-2 py-1 cursor-pointer color-#536dfe">
                <i-ep-video-play @click="row.status = 2" />
              </div>
              <el-icon><video-play /></el-icon>流转条件
            </el-tooltip>
            <el-tooltip effect="dark" content="停用" placement="top">
              <div class="text-14px px-2 py-1 cursor-pointer color-#536dfe">
                <i-ep-circle-close @click="row.status = 3" />
              </div>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改" placement="top">
              <div class="text-14px px-2 py-1 cursor-pointer color-#536dfe">
                <i-ep-edit @click="clickEditButton(row)" />
              </div>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <div>
                <el-popconfirm title="是否确认删除?" @confirm="deleteClick(row.id)">
                  <template #reference>
                    <div class="text-14px px-2 py-1 cursor-pointer color-#ed6f6f">
                      <i-ep-delete />
                    </div>
                  </template>
                </el-popconfirm>
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改弹框 -->
    <el-dialog v-model="dialogTableVisible" :title="title" width="30%" @close="closeDialog">
      <el-form
        label-position="right"
        label-width="100px"
        :model="workFlow"
        :rules="rules"
        style="max-width: 460px"
        ref="ruleFormRef"
      >
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="workFlow.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="标识" prop="code" required>
          <el-input v-model="workFlow.code" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="所属系统" prop="type" required>
          <el-input v-model="workFlow.type" placeholder="请输入" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmClick"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
