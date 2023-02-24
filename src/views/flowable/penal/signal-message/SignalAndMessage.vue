<script setup>
import { ref, computed } from 'vue'

const signalList = ref([])
const messageList = ref([])
const modelVisible = ref(false)
const modelType = ref('')
const modelObjectForm = ref([])

const modelConfig = computed(() => {
  if (modelType.value === 'message') {
    return { title: '创建消息', idLabel: '消息ID', nameLabel: '消息名称' }
  } else {
    return { title: '创建信号', idLabel: '信号ID', nameLabel: '信号名称' }
  }
})

const openModel = type => {
  modelType.value = type
  modelObjectForm.value = {}
  modelVisible.value = true
}

const addNewObject = () => {}
</script>

<template>
  <div class="panel-tab__content">
    <div class="flex justify-between pb-2">
      <span
        ><el-icon style="margin-right: 8px; color: #555555"
          ><i-ep-menu /></el-icon
        >消息列表</span
      >
      <el-button size="small" type="primary" @click="openModel('message')"
        >创建新消息</el-button
      >
    </div>
    <el-table :data="messageList" size="small" border>
      <el-table-column type="index" label="序号" width="60px" />
      <el-table-column
        label="消息ID"
        prop="id"
        max-width="300px"
        show-overflow-tooltip
      />
      <el-table-column
        label="消息名称"
        prop="name"
        max-width="300px"
        show-overflow-tooltip
      />
    </el-table>
    <div
      class="flex justify-between pb-2"
      style="padding-top: 8px; margin-top: 8px; border-top: 1px solid #eeeeee"
    >
      <span
        ><el-icon style="margin-right: 8px; color: #555555"
          ><i-ep-menu /></el-icon
        >信号列表</span
      >
      <el-button size="small" type="primary" @click="openModel('signal')">
        创建新信号
      </el-button>
    </div>
    <el-table :data="signalList" size="small" border>
      <el-table-column type="index" label="序号" width="60px" />
      <el-table-column
        label="信号ID"
        prop="id"
        max-width="300px"
        show-overflow-tooltip
      />
      <el-table-column
        label="信号名称"
        prop="name"
        max-width="300px"
        show-overflow-tooltip
      />
    </el-table>

    <el-dialog
      v-model="modelVisible"
      :title="modelConfig.title"
      :close-on-click-modal="false"
      width="400px"
      append-to-body
      destroy-on-close
    >
      <el-form
        :model="modelObjectForm"
        size="small"
        label-width="90px"
        @submit.prevent
      >
        <el-form-item :label="modelConfig.idLabel">
          <el-input v-model="modelObjectForm.id" clearable />
        </el-form-item>
        <el-form-item :label="modelConfig.nameLabel">
          <el-input v-model="modelObjectForm.name" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="modelVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addNewObject"
          >保 存</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>
