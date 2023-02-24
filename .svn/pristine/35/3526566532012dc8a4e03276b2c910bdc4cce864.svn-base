<script setup>
import { ref } from 'vue'

const props = defineProps({
  businessObject: Object,
  type: String
})

const loopCharacteristics = ref('')
const defaultLoopInstanceForm = ref('')
const loopInstanceForm = ref('')
</script>

<template>
  <div class="panel-tab__content">
    <el-form size="small" label-width="90px" @submit.prevent>
      <el-form-item label="回路特性">
        <el-select v-model="loopCharacteristics">
          <!--bpmn:MultiInstanceLoopCharacteristics-->
          <el-option label="并行" value="ParallelMultiInstance" />
          <el-option label="串行" value="SequentialMultiInstance" />
          <!--bpmn:StandardLoopCharacteristics-->
          <el-option label="无" value="Null" />
        </el-select>
      </el-form-item>
      <template
        v-if="
          loopCharacteristics === 'ParallelMultiInstance' ||
          loopCharacteristics === 'SequentialMultiInstance'
        "
      >
        <el-form-item label="基数" key="loopCardinality">
          <el-input v-model="loopInstanceForm.loopCardinality" clearable />
        </el-form-item>
        <el-form-item label="集合" key="collection">
          <el-input v-model="loopInstanceForm.collection" clearable />
        </el-form-item>
        <el-form-item label="元素变量" key="elementVariable">
          <el-input v-model="loopInstanceForm.elementVariable" clearable />
        </el-form-item>
        <el-form-item label="完成条件" key="completionCondition">
          <el-input v-model="loopInstanceForm.completionCondition" clearable />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
