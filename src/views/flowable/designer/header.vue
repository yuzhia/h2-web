<script setup>
import BpmnModeler from 'bpmn-js/lib/Modeler'
import DefaultEmptyXML from '../config/defaultEmpty'
// 翻译
import customTranslate from '../config/translate/customTranslate.js'
import translationsCN from '../config/translate/zh.js'

// 标签解析 moddle
import flowableModdleDescriptor from '../config/flowableDescriptor.json'
// 标签解析 Extension
import flowableModdleExtension from '../config/extensions'

import Codemirror from 'codemirror-editor-vue3'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/xml/xml.js'

import { getWorkFlow, updateWorkFlow } from '@/api/flowable/workFlow.js'

const route = useRoute()
const getBpmnByModelId = () => {
  // route.params.id
  // const json = {
  //   id: null,
  //   modelId: '8e9e9e4dae5b11ed8d81165d76b7fc42',
  //   modelKey: 'ninhao',
  //   modelName: '你好',
  //   fileName: '你好',
  //   modelXml:
  //     '<?xml version="1.0" encoding="UTF-8"?>\n<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://flowable.org/modeler" exporter="Flowable Open Source Modeler" exporterVersion="1.1.1-SNAPSHOT">\n  <process id="ninhao" name="你好" isExecutable="true">\n    <startEvent id="startEvent1"></startEvent>\n    <exclusiveGateway id="Gateway_0ze8g5u"></exclusiveGateway>\n    <sequenceFlow id="Flow_0u965i4" sourceRef="startEvent1" targetRef="Gateway_0ze8g5u"></sequenceFlow>\n    <userTask id="Activity_07ki0up">\n      <extensionElements>\n        <flowable:assigneeType xmlns:flowable="http://flowable.org/bpmn"><![CDATA[static]]></flowable:assigneeType>\n      </extensionElements>\n    </userTask>\n    <sequenceFlow id="Flow_0n6xony" sourceRef="Gateway_0ze8g5u" targetRef="Activity_07ki0up"></sequenceFlow>\n  </process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_ninhao">\n    <bpmndi:BPMNPlane bpmnElement="ninhao" id="BPMNPlane_ninhao">\n      <bpmndi:BPMNShape bpmnElement="startEvent1" id="BPMNShape_startEvent1">\n        <omgdc:Bounds height="30.0" width="30.0" x="-195.0" y="195.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape bpmnElement="Gateway_0ze8g5u" id="BPMNShape_Gateway_0ze8g5u">\n        <omgdc:Bounds height="50.0" width="50.0" x="15.0" y="265.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape bpmnElement="Activity_07ki0up" id="BPMNShape_Activity_07ki0up">\n        <omgdc:Bounds height="80.0" width="100.0" x="330.0" y="200.0"></omgdc:Bounds>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge bpmnElement="Flow_0u965i4" id="BPMNEdge_Flow_0u965i4" flowable:sourceDockerX="15.0" flowable:sourceDockerY="15.0" flowable:targetDockerX="25.0" flowable:targetDockerY="25.0">\n        <omgdi:waypoint x="-165.05000037768568" y="210.0"></omgdi:waypoint>\n        <omgdi:waypoint x="40.0" y="210.0"></omgdi:waypoint>\n        <omgdi:waypoint x="40.0" y="265.0"></omgdi:waypoint>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge bpmnElement="Flow_0n6xony" id="BPMNEdge_Flow_0n6xony" flowable:sourceDockerX="25.0" flowable:sourceDockerY="25.0" flowable:targetDockerX="50.0" flowable:targetDockerY="40.0">\n        <omgdi:waypoint x="64.94279318311472" y="290.0"></omgdi:waypoint>\n        <omgdi:waypoint x="213.0" y="290.0"></omgdi:waypoint>\n        <omgdi:waypoint x="213.0" y="240.0"></omgdi:waypoint>\n        <omgdi:waypoint x="330.0" y="240.0"></omgdi:waypoint>\n      </bpmndi:BPMNEdge>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</definitions>',
  //   appSn: null,
  //   categoryCode: null
  // }
  // bpmnData.value = json
  // console.log('bpmnData', bpmnData.value)
  // getWorkFlowById()
}

const props = defineProps({
  modelValue: String, // xml 字符串
  processId: String,
  processName: String,
  translations: Object, // 自定义的翻译文件
  options: {
    type: Object,
    default: () => ({})
  },
  additionalModel: [Object, Array], // 自定义model
  moddleExtension: Object, // 自定义moddle
  onlyCustomizeAddi: {
    type: Boolean,
    default: false
  },
  onlyCustomizeModdle: {
    type: Boolean,
    default: false
  },
  simulation: {
    type: Boolean,
    default: true
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  prefix: {
    type: String,
    default: 'flowable'
  },
  events: {
    type: Array,
    default: () => ['element.click']
  },
  headerButtonSize: {
    type: String,
    default: 'small',
    validator: value => ['default', 'medium', 'small', 'mini'].indexOf(value) !== -1
  },
  headerButtonType: {
    type: String,
    default: 'primary',
    validator: value => ['default', 'primary', 'success', 'warning', 'danger', 'info'].indexOf(value) !== -1
  }
})

// 翻译封装成模块
const TranslateModule = {
  translate: ['value', customTranslate(translationsCN)]
}

// 子传父
const emit = defineEmits(['init-finished'])

const bpmnModeler = ref(null)
const canvas = ref(null)
const bpmnData = ref({})

const defaultZoom = ref(1)
const previewModelVisible = ref(false)
// 模拟
const simulationStatus = ref(false)
const previewResult = ref('')
const previewType = ref('xml')
const recoverable = ref(false)
const revocable = ref(false)
const cmOptions = ref({
  mode: 'xml', // 语言模式
  theme: 'monokai', // 主题
  lineNumbers: false, // 显示行号
  smartIndent: true, // 智能缩进
  readOnly: true,
  indentUnit: 2, // 智能缩进单位为4个空格长度
  foldGutter: true, // 启用行槽中的代码折叠
  styleActiveLine: true // 显示选中行的样式
})
const refFile = ref(null)

const init = () => {
  if (bpmnModeler.value) return
  bpmnModeler.value = new BpmnModeler({
    container: canvas.value,
    additionalModules: [TranslateModule]
  })
  emit('init-finished', bpmnModeler.value)
}

const createNewDiagram = async xml => {
  // 将字符串转换成图显示出来
  // let newId = props.processId || `Process_${new Date().getTime()}`
  // let newName = props.processName || `业务流程_${new Date().getTime()}`
  let newId = bpmnData.value.name || `Process_${new Date().getTime()}`
  let newName = bpmnData.value.code || `业务流程_${new Date().getTime()}`
  if (!isNaN(Number(newId))) {
    newId = `a${newId}`
  }
  // 缺默认xml
  let xmlString = xml || DefaultEmptyXML(newId, newName, props.prefix)
  try {
    let { warnings } = await bpmnModeler.value.importXML(xmlString)
    if (warnings && warnings.length) {
      warnings.forEach(warn => console.warn(warn))
    }
  } catch (e) {
    console.error(`[Process Designer Warn]: ${e?.message || e}`)
  }
}

onMounted(async () => {
  await getWorkFlow(route.params.id).then(res => {
    bpmnData.value = res.data
  })
  init()
  createNewDiagram(bpmnData.value.xmlFile)
})

// 下载流程图到本地
/**
 * @param {string} type
 * @param {*} name
 */
const downloadProcess = async (type, name) => {
  try {
    // 按需要类型创建文件并下载
    if (type === 'xml' || type === 'bpmn') {
      const { err, xml } = await bpmnModeler.value.saveXML()
      // 读取异常时抛出异常
      if (err) {
        console.error(`[Process Designer Warn ]: ${err.message || err}`)
      }
      let { href, filename } = setEncoded(type.toUpperCase(), name, xml)
      downloadFunc(href, filename)
    } else {
      const { err, svg } = await this.bpmnModeler.saveSVG()
      // 读取异常时抛出异常
      if (err) {
        return console.error(err)
      }
      let { href, filename } = setEncoded('SVG', name, svg)
      downloadFunc(href, filename)
    }
  } catch (e) {
    console.error(`[Process Designer Warn ]: ${e.message || e}`)
  }
  // 文件下载方法
  function downloadFunc(href, filename) {
    if (href && filename) {
      let a = document.createElement('a')
      a.download = filename //指定下载的文件名
      a.href = href //  URL对象
      a.click() // 模拟点击
      URL.revokeObjectURL(a.href) // 释放URL 对象
    }
  }
}

// 根据所需类型进行转码并返回下载地址
const setEncoded = (type, filename = 'diagram', data) => {
  const encodedData = encodeURIComponent(data)
  return {
    filename: `${filename}.${type}`,
    href: `data:application/${type === 'svg' ? 'text/xml' : 'bpmn20-xml'};charset=UTF-8,${encodedData}`,
    data: data
  }
}

// 加载本地文件
const importLocalFile = () => {
  const file = refFile.value.files[0]
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onload = function () {
    let xmlStr = this.result
    createNewDiagram(xmlStr)
  }
}

// 预览xml
const previewProcessXML = () => {
  bpmnModeler.value.saveXML({ format: true }).then(({ xml }) => {
    previewResult.value = xml
    previewType.value = 'xml'
    cmOptions.value.mode = 'xml'
    previewModelVisible.value = true
  })
}

// 元素对齐
const elementsAlign = align => {
  const Align = bpmnModeler.value.get('alignElements')
  const Selection = bpmnModeler.value.get('selection')
  const SelectedElements = Selection.get()
  if (!SelectedElements || SelectedElements.length <= 1) {
    this.$message.warning('请按住 Ctrl 键选择多个元素对齐')
    return
  }
  this.$confirm('自动对齐可能造成图形变形，是否继续？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => Align.trigger(SelectedElements, align))
}

// 放大缩小
const processZoomIn = (zoomStep = 0.1) => {
  let newZoom = Math.floor(defaultZoom.value * 100 + zoomStep * 100) / 100
  if (newZoom > 4) {
    throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4')
  }
  defaultZoom.value = newZoom
  bpmnModeler.value.get('canvas').zoom(defaultZoom.value)
}
const processZoomOut = (zoomStep = 0.1) => {
  let newZoom = Math.floor(defaultZoom.value * 100 - zoomStep * 100) / 100
  if (newZoom < 0.2) {
    throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2')
  }
  defaultZoom.value = newZoom
  bpmnModeler.value.get('canvas').zoom(defaultZoom.value)
}
const processZoomTo = (newZoom = 1) => {
  if (newZoom < 0.2) {
    throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2')
  }
  if (newZoom > 4) {
    throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4')
  }
  defaultZoom.value = newZoom
  bpmnModeler.value.get('canvas').zoom(newZoom)
}
const processReZoom = () => {
  defaultZoom.value = 1
  bpmnModeler.value.get('canvas').zoom('fit-viewport', 'auto')
}

// 撤销...
const processRedo = () => {
  bpmnModeler.value.get('commandStack').redo()
}
const processUndo = () => {
  bpmnModeler.value.get('commandStack').undo()
}
const processRestart = () => {
  recoverable.value = false
  revocable.value = false
  createNewDiagram(null)
}

const getWorkFlowById = () => {
  getWorkFlow(route.params.id).then(res => {
    bpmnData.value = res.data[0]
  })
}

const workFlow = ref({})
const saveXML = () => {
  getWorkFlowById()
  bpmnModeler.value.saveXML({ format: false }).then(async ({ xml }) => {
    bpmnData.value.xmlFile = xml
    await updateWorkFlow(bpmnData.value)
    ElMessage({
      message: '保存成功',
      type: 'success'
    })
  })
}
</script>

<template>
  <div class="flex flex-col">
    <!-- header -->
    <div class="w-full min-h-9 flex items-center">
      <slot name="control-header"></slot>
      <template v-if="!$slots['control-header']">
        <el-button-group key="file-control" class="m-1">
          <el-button :size="headerButtonSize" :type="headerButtonType" @click="saveXML">
            <i-ep-folder-opened />保存
          </el-button>
          <el-button :size="headerButtonSize" :type="headerButtonType" @click="refFile.click()">
            <i-ep-folder-opened />打开文件
          </el-button>
          <el-tooltip effect="light">
            <template #content>
              <el-button :size="headerButtonSize" text @click="downloadProcess('xml')">下载为XML文件</el-button>
              <br />
              <el-button :size="headerButtonSize" text @click="downloadProcess('svg')">下载为SVG文件</el-button>
              <br />
              <el-button :size="headerButtonSize" text @click="downloadProcess('bpmn')">下载为BPMN文件</el-button>
            </template>
            <el-button :size="headerButtonSize" :type="headerButtonType"> <i-ep-download />下载文件</el-button>
          </el-tooltip>
          <el-tooltip effect="light">
            <template #content>
              <el-button :size="headerButtonSize" text @click="previewProcessXML">预览XML</el-button>
              <br />
              <!-- <el-button :size="headerButtonSize" text @click="previewProcessJson">预览JSON</el-button> -->
            </template>
            <el-button :size="headerButtonSize" :type="headerButtonType"> <i-ep-view />预览</el-button>
          </el-tooltip>
          <!-- <el-tooltip
            v-if="simulation"
            effect="light"
            :content="simulationStatus ? '退出模拟' : '开启模拟'"
          >
            <el-button
              :size="headerButtonSize"
              :type="headerButtonType"
              @click="processSimulation"
            >
              <i-ep-cpu />模拟
            </el-button>
          </el-tooltip> -->
        </el-button-group>
        <el-button-group key="align-control" class="m-1">
          <el-tooltip effect="light" content="向左对齐">
            <el-button :size="headerButtonSize" @click="elementsAlign('left')">
              <i-ep-histogram class="transform rotate-90" />
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="向右对齐">
            <el-button :size="headerButtonSize" @click="elementsAlign('right')">
              <i-ep-histogram class="transform -rotate-90" />
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="向上对齐">
            <el-button :size="headerButtonSize" @click="elementsAlign('top')">
              <i-ep-histogram class="transform rotate-180" />
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="向下对齐">
            <el-button :size="headerButtonSize" @click="elementsAlign('bottom')">
              <i-ep-histogram class="transform rotate-0" />
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="水平居中">
            <el-button :size="headerButtonSize" @click="elementsAlign('center')">
              <i-ep-histogram class="align align-center" />
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="垂直居中">
            <el-button :size="headerButtonSize" @click="elementsAlign('middle')" class="align">
              <i-ep-histogram class="middle" />
            </el-button>
          </el-tooltip>
        </el-button-group>
        <el-button-group key="scale-control" class="m-1">
          <el-tooltip effect="light" content="缩小视图">
            <el-button :size="headerButtonSize" :disabled="defaultZoom < 0.2" @click="processZoomOut()">
              <i-ep-zoom-out />
            </el-button>
          </el-tooltip>
          <el-button :size="headerButtonSize">{{ Math.floor(defaultZoom * 10 * 10) + '%' }}</el-button>
          <el-tooltip effect="light" content="放大视图">
            <el-button :size="headerButtonSize" :disabled="defaultZoom > 4" @click="processZoomIn()">
              <i-ep-zoom-in />
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="重置视图并居中">
            <el-button :size="headerButtonSize" @click="processReZoom()">
              <i-ep-scale-to-original />
            </el-button>
          </el-tooltip>
        </el-button-group>
        <el-button-group key="stack-control" class="m-1">
          <el-tooltip effect="light" content="撤销">
            <el-button :size="headerButtonSize" :disabled="!revocable" @click="processUndo()">
              <i-ep-refresh-left />
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="恢复">
            <el-button :size="headerButtonSize" :disabled="!recoverable" @click="processRedo()">
              <i-ep-refresh-right />
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="重新绘制">
            <el-button :size="headerButtonSize" @click="processRestart">
              <i-ep-refresh />
            </el-button>
          </el-tooltip>
        </el-button-group>
      </template>
      <!-- 用于打开本地文件-->
      <input
        type="file"
        id="files"
        ref="refFile"
        style="display: none"
        accept=".xml, .bpmn"
        @change="importLocalFile"
      />
    </div>

    <!-- 画图区域 -->
    <div class="containers">
      <div class="canvas" ref="canvas"></div>
    </div>

    <!-- 预览  -->
    <el-dialog :title="`预览${previewType}`" width="60%" v-model="previewModelVisible" append-to-body destroy-on-close>
      <Codemirror v-model:value="previewResult" :options="cmOptions" border :height="600" />
    </el-dialog>
  </div>
</template>

<style scoped>
.containers {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}
.canvas {
  width: 100%;
  height: 100%;
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+)
    repeat !important;
}
.align-center {
  transform: rotate(90deg);
}
.align-center::after {
  transform: rotate(90deg) translate(0, -10%);
}

.middle {
  transform: rotate(0deg);
}
.middle::after {
  transform: rotate(90deg) translate(0, -10%);
}
</style>
