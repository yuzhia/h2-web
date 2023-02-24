<script setup>
import ElementBaseInfo from './base/ElementBaseInfo.vue'
import SignalAndMessage from './signal-message/SignalAndMessage.vue'
import ElementListeners from './listeners/ElementListeners.vue'
import ElementProperties from './properties/ElementProperties.vue'
import ElementTask from './task/ElementTask.vue'
import ElementMultiInstance from './multi-instance/ElementMultiInstance.vue'
import FlowCondition from './flow-condition/FlowCondition.vue'

const props = defineProps({
  bpmnModeler: Object,
  width: String,
  idEditDisabled: {
    type: Boolean,
    default: true
  }
})

const activeTab = ref('base')
const elementId = ref('')
const elementType = ref('')
const elementBusinessObject = ref({}) // 元素 businessObject 镜像，提供给需要做判断的组件使用
const conditionFormVisible = ref(false) // 流转条件设置
const formVisible = ref(false) //表单配置

const initModels = () => {
  // 初始化 modeler 以及其他 moddle
  let timer
  if (!props.bpmnModeler) {
    // 避免加载时 流程图 并未加载完成
    timer = setTimeout(() => initModels(), 10)
    return
  }
  if (timer) clearTimeout(timer)
  window.bpmnInstances = {
    modeler: props.bpmnModeler,
    modeling: props.bpmnModeler.get('modeling'),
    moddle: props.bpmnModeler.get('moddle'),
    eventBus: props.bpmnModeler.get('eventBus'),
    bpmnFactory: props.bpmnModeler.get('bpmnFactory'),
    elementFactory: props.bpmnModeler.get('elementFactory'),
    elementRegistry: props.bpmnModeler.get('elementRegistry'),
    replace: props.bpmnModeler.get('replace'),
    selection: props.bpmnModeler.get('selection')
  }
  // console.log(window.bpmnInstances)
  getActiveElement()
}

const getActiveElement = () => {
  // 初始第一个选中元素 bpmn:Process
  initFormOnChanged(null)
  props.bpmnModeler.on('import.done', e => {
    initFormOnChanged(null)
  })
  // 监听选择事件，修改当前激活的元素以及表单
  props.bpmnModeler.on('selection.changed', ({ newSelection }) => {
    initFormOnChanged(newSelection[0] || null)
  })
  props.bpmnModeler.on('element.changed', ({ element }) => {
    // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
    if (element && element.id === elementId.value) {
      initFormOnChanged(element)
    }
  })
}

// 初始化数据
const initFormOnChanged = element => {
  let activatedElement = element
  // 没有选择元素
  if (!activatedElement) {
    activatedElement =
      window.bpmnInstances.elementRegistry.find(el => el.type === 'bpmn:Process') ??
      window.bpmnInstances.elementRegistry.find(el => el.type === 'bpmn:Collaboration')
  }
  if (!activatedElement) return
  console.log(`select element changed: id: ${activatedElement.id} , type: ${activatedElement.businessObject.$type}`)
  // 全局设置当前激活元素
  window.bpmnInstances.bpmnElement = activatedElement
  elementId.value = activatedElement.id
  elementType.value = activatedElement.type.split(':')[1] || ''
  elementBusinessObject.value = JSON.parse(JSON.stringify(activatedElement.businessObject))
  conditionFormVisible.value = !!(
    elementType.value === 'SequenceFlow' &&
    activatedElement.source &&
    activatedElement.source.type.indexOf('StartEvent') === -1
  )
  formVisible.value = elementType.value === 'UserTask' || elementType.value === 'StartEvent'
}

initModels()
</script>

<template>
  <div class="process-panel__container w-120">
    <el-collapse v-model="activeTab">
      <el-collapse-item name="base">
        <template #title>
          <div class="panel-tab__title">
            <el-icon class="mr-2"><i-ep-info-filled /></el-icon>常规
          </div>
        </template>
        <element-base-info
          :id-edit-disabled="idEditDisabled"
          :business-object="elementBusinessObject"
          :type="elementType"
        />
      </el-collapse-item>
      <el-collapse-item name="task" v-if="elementType.indexOf('Task') !== -1" key="task">
        <template #title>
          <div class="panel-tab__title">
            <el-icon class="mr-2"><i-ep-checked /></el-icon>任务
          </div>
        </template>
        <element-task :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="multiInstance" v-if="elementType.indexOf('Task') !== -1" key="multiInstance">
        <template #title>
          <div class="panel-tab__title">
            <el-icon class="mr-2"><i-ep-help-filled /></el-icon>多实例
          </div>
        </template>
        <element-multi-instance :business-object="elementBusinessObject" :type="elementType" />
      </el-collapse-item>
      <!-- <el-collapse-item
        name="taskListeners"
        v-if="elementType === 'UserTask'"
        key="taskListeners"
      >
        <template #title>
          <div class="panel-tab__title">
            <el-icon class="mr-2"><i-ep-bell-filled /></el-icon>任务监听器
          </div>
        </template>
        <user-task-listeners :id="elementId" :type="elementType" />
      </el-collapse-item> -->
      <el-collapse-item name="listeners" key="listeners">
        <template #title>
          <div class="panel-tab__title">
            <el-icon class="mr-2"><i-ep-bell-filled /></el-icon>执行监听器
          </div>
        </template>
        <element-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="condition" v-if="conditionFormVisible" key="condition">
        <template #title>
          <div class="panel-tab__title">
            <el-icon class="mr-2"><i-ep-promotion /></el-icon>流转条件
          </div>
        </template>
        <flow-condition :business-object="elementBusinessObject" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="condition" v-if="elementType === 'Process'" key="message">
        <template #title>
          <div class="panel-tab__title">
            <el-icon class="mr-2"><i-ep-comment /></el-icon>消息与信号
          </div>
        </template>
        <signal-and-message />
      </el-collapse-item>
      <el-collapse-item name="extensions" key="extensions">
        <template #title>
          <div class="panel-tab__title">
            <el-icon class="mr-2"><i-ep-circle-plus /></el-icon>扩展属性
          </div>
        </template>
        <element-properties :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="other" key="other">
        <template #title>
          <div class="panel-tab__title">
            <el-icon class="mr-2"><i-ep-promotion /></el-icon>其他
          </div>
        </template>
        <div class="px-4 py-2">
          <div class="flex">
            <div class="element-property__label">元素文档：</div>
            <div class="flex-1">
              <el-input type="textarea" size="small" resize="vertical" :autosize="{ minRows: 2, maxRows: 4 }" />
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.process-panel__container {
  box-sizing: border-box;
  padding: 0 8px;
  border-left: 1px solid #eeeeee;
  box-shadow: 0 0 8px #cccccc;
  max-height: 100%;
  overflow-y: scroll;
}

.panel-tab__content {
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid #eeeeee;
  padding: 8px 16px;
}
.panel-tab__title {
  font-weight: 600;
  padding: 0 8px;
  font-size: 1.1em;
  line-height: 1.2em;
}
</style>
