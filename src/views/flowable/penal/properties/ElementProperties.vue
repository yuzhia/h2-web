<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  id: String,
  type: String
})

const attributeFormRef = ref(null)
const prefix = ref('flowable')

const elementPropertyList = ref([])
const propertyForm = ref({})
const editingPropertyIndex = ref(-1)
const propertyFormModelVisible = ref(false)

const bpmnElement = ref()
const otherExtensionList = ref()
const bpmnElementProperties = ref()
const bpmnElementPropertyList = ref([])

watch(
  () => props.id,
  val => {
    val && val.length && resetAttributesList()
  },
  { immediate: true }
)

const resetAttributesList = () => {
  bpmnElement.value = window.bpmnInstances.bpmnElement
  otherExtensionList.value = [] // 其他扩展配置
  bpmnElementProperties.value =
    bpmnElement.value.businessObject?.extensionElements?.values?.filter(ex => {
      console.log(ex)
      if (ex.$type !== `${prefix.value}:Properties`) {
        otherExtensionList.value.push(ex)
      }
      return ex.$type === `${prefix.value}:Properties`
    }) ?? []

  // 保存所有的 扩展属性字段
  bpmnElementPropertyList.value = bpmnElementProperties.value.reduce((pre, current) => pre.concat(current.values), [])
  // 复制 显示
  elementPropertyList.value = JSON.parse(JSON.stringify(bpmnElementPropertyList.value ?? []))
}
const openAttributesForm = (attr, index) => {
  editingPropertyIndex.value = index
  propertyForm.value = index === -1 ? {} : JSON.parse(JSON.stringify(attr))
  propertyFormModelVisible.value = true
  nextTick(() => {
    if (attributeFormRef.value) attributeFormRef.value.clearValidate()
  })
}
const removeAttributes = (attr, index) => {
  // this.$confirm("确认移除该属性吗？", "提示", {
  //   confirmButtonText: "确 认",
  //   cancelButtonText: "取 消"
  // })
  //   .then(() => {
  //     elementPropertyList.value.splice(index, 1);
  //     bpmnElementPropertyList.value.splice(index, 1);
  //     // 新建一个属性字段的保存列表
  //     const propertiesObject = window.bpmnInstances.moddle.create(`${prefix.value}:Properties`, {
  //       values: bpmnElementPropertyList.value
  //     });
  //     updateElementExtensions(propertiesObject);
  //     resetAttributesList();
  //   })
  //   .catch(() => console.info("操作取消"));
}
const saveAttribute = () => {
  const { name, value } = propertyForm.value
  console.log(name, value)
  console.log(bpmnElementPropertyList.value)
  if (editingPropertyIndex.value !== -1) {
    console.log('111')
    window.bpmnInstances.modeling.updateModdleProperties(
      window.bpmnInstances.bpmnElement,
      bpmnElementPropertyList.value[editingPropertyIndex.value],
      {
        name,
        value
      }
    )
  } else {
    // 新建属性字段
    const newPropertyObject = window.bpmnInstances.moddle.create(`${prefix.value}:Property`, { name, value })
    // 新建一个属性字段的保存列表
    const propertiesObject = window.bpmnInstances.moddle.create(`${prefix.value}:Properties`, {
      values: bpmnElementPropertyList.value.concat([newPropertyObject])
    })
    updateElementExtensions(propertiesObject)
  }
  propertyFormModelVisible.value = false
  resetAttributesList()
}
const updateElementExtensions = properties => {
  const extensions = window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
    values: otherExtensionList.value.concat([properties])
  })
  window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.bpmnElement, {
    extensionElements: extensions
  })
}
</script>

<template>
  <div class="panel-tab__content">
    <el-table :data="elementPropertyList" size="small" max-height="240" border fit>
      <el-table-column label="序号" width="50px" type="index" />
      <el-table-column label="属性名" prop="name" min-width="100px" show-overflow-tooltip />
      <el-table-column label="属性值" prop="value" min-width="100px" show-overflow-tooltip />
      <el-table-column label="操作" width="90px">
        <template #default="{ row, $index }">
          <el-button link type="" @click="openAttributesForm(row, $index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button link type="" style="color: #ff4d4f" @click="removeAttributes(row, $index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <el-button class="w-full mt-2" size="small" type="primary" @click="openAttributesForm(null, -1)"
        >添加属性</el-button
      >
    </div>

    <el-dialog v-model="propertyFormModelVisible" title="属性配置" width="600px" append-to-body destroy-on-close>
      <el-form :model="propertyForm" label-width="80px" size="small" ref="attributeFormRef" @submit.prevent>
        <el-form-item label="属性名：" prop="name">
          <el-input v-model="propertyForm.name" clearable />
        </el-form-item>
        <el-form-item label="属性值：" prop="value">
          <el-input v-model="propertyForm.value" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="propertyFormModelVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="saveAttribute">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
