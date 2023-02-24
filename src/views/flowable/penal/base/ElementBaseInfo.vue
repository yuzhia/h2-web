<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({
  businessObject: Object,
  type: String,
  idEditDisabled: {
    type: Boolean,
    default: false
  }
})

const elementBaseInfo = ref({})
let bpmnElement

watch(
  () => props.businessObject,
  (newVal, oldVal) => {
    if (newVal) {
      nextTick(() => resetBaseInfo())
    }
  }
)

const resetBaseInfo = () => {
  bpmnElement = window?.bpmnInstances?.bpmnElement || {}
  elementBaseInfo.value = JSON.parse(JSON.stringify(bpmnElement.businessObject))
  if (elementBaseInfo.value && elementBaseInfo.value.$type === 'bpmn:SubProcess') {
    elementBaseInfo.value['isExpanded'] = elementBaseInfo.value.di?.isExpanded
  }
}

const updateBaseInfo = key => {
  if (key === 'id') {
    window.bpmnInstances.modeling.updateProperties(bpmnElement, {
      id: elementBaseInfo.value[key],
      di: { id: `${elementBaseInfo.value[key]}_di` }
    })
    return
  }
  if (key === 'isExpanded') {
    window?.bpmnInstances?.modeling.toggleCollapse(bpmnElement)
    return
  }
  const attrObj = Object.create(null)
  attrObj[key] = elementBaseInfo.value[key]
  window.bpmnInstances.modeling.updateProperties(bpmnElement, attrObj)
}

onBeforeUnmount(() => {
  bpmnElement = null
})
</script>

<template>
  <div class="panel-tab__content w-120">
    <el-form size="small" label-width="90px" @submit.prevent>
      <el-form-item label="ID">
        <el-input v-model="elementBaseInfo.id" :disabled="idEditDisabled" clearable @change="updateBaseInfo('id')" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input
          v-model="elementBaseInfo.name"
          :disabled="idEditDisabled"
          clearable
          @change="updateBaseInfo('name')"
        />
      </el-form-item>
      <!--流程的基础属性-->
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <el-form-item label="版本标签">
          <el-input v-model="elementBaseInfo.versionTag" clearable @change="updateBaseInfo('versionTag')" />
        </el-form-item>
        <el-form-item label="可执行">
          <el-switch
            v-model="elementBaseInfo.isExecutable"
            active-text="是"
            inactive-text="否"
            @change="updateBaseInfo('isExecutable')"
          />
        </el-form-item>
      </template>
      <el-form-item v-if="elementBaseInfo.$type === 'bpmn:SubProcess'" label="状态">
        <el-switch
          v-model="elementBaseInfo.isExpanded"
          active-text="展开"
          inactive-text="折叠"
          @change="updateBaseInfo('isExpanded')"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<!-- <script>
export default {
  name: 'ElementBaseInfo',
  props: {
    businessObject: Object,
    type: String,
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      elementBaseInfo: {}
    }
  },
  watch: {
    businessObject: {
      immediate: false,
      handler: function (val) {
        if (val) {
          this.$nextTick(() => this.resetBaseInfo())
        }
      }
    }
  },
  methods: {
    resetBaseInfo() {
      this.bpmnElement = window?.bpmnInstances?.bpmnElement || {}
      this.elementBaseInfo = JSON.parse(
        JSON.stringify(this.bpmnElement.businessObject)
      )
      if (
        this.elementBaseInfo &&
        this.elementBaseInfo.$type === 'bpmn:SubProcess'
      ) {
        this.elementBaseInfo['isExpanded'] = this.elementBaseInfo.di?.isExpanded
      }
    },
    updateBaseInfo(key) {
      if (key === 'id') {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          id: this.elementBaseInfo[key],
          di: { id: `${this.elementBaseInfo[key]}_di` }
        })
        return
      }
      if (key === 'isExpanded') {
        window?.bpmnInstances?.modeling.toggleCollapse(this.bpmnElement)
        return
      }
      const attrObj = Object.create(null)
      attrObj[key] = this.elementBaseInfo[key]
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj)
    }
  },
  beforeUnmount() {
    this.bpmnElement = null
  }
}
</script> -->
