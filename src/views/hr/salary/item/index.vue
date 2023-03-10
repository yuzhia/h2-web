<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="primary"
               plain
               icon="Plus"
               @click="handleAdd"
               v-hasPermi="['system:post:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="success"
               plain
               icon="Edit"
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['system:post:edit']"
            >修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="Delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:post:remove']"
            >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               icon="Download"
               @click="handleExport"
               v-hasPermi="['system:post:export']"
            >导出</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" :columns="columns" @queryTable="getList" ></right-toolbar>
      </el-row>

        <el-table v-loading="loading" :data="itemList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="项目名称" align="center" prop="name" v-if="columns[0].visible" />
          <el-table-column label="数据类型" align="center" prop="dataType" v-if="columns[1].visible" >
            <template #default="{ row }">
              <div>{{ row.dataType === 0 ? '数据型' : row.dataType === 1 ? '字符型' : '日期型' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="项目长度" align="center" prop="itemLen" v-if="columns[2].visible" />
          <el-table-column label="小数位数" align="center" prop="decimalDigits" v-if="columns[3].visible" />
          <el-table-column label="项目类型" align="center" prop="itemType" v-if="columns[4].visible" >
            <template #default="{ row }">
              <div v-if="row.itemType === 0">公式</div>
              <div v-else-if="row.itemType === 1">固定</div>
              <div v-else-if="row.itemType === 2">变动</div>
              <div v-else>休假补工资</div>
            </template>
          </el-table-column>
          <el-table-column label="序号" align="center" prop="order" v-if="columns[5].visible" />
          <el-table-column label="公式" align="center" prop="desc" v-if="columns[6].visible" />
          <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:post:edit']">修改</el-button>
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:post:remove']">删除</el-button>
              </template>
          </el-table-column>
        </el-table>

      <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize"
         @pagination="getList"
      />


      <!-- 添加或修改薪资项目对话框 -->
      <el-dialog :title="title" v-model="open" width="500px" append-to-body>
         <el-form ref="postRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="项目名称" prop="name">
               <el-input v-model="form.name" placeholder="请输入项目名称" />
            </el-form-item>
            <el-form-item label="数据类型" prop="dataType">
              <el-select v-model="form.dataType" placeholder="Select" size="default">
                <el-option
                  v-for="item in dataValList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="项目类型" prop="itemType">
              <el-select v-model="form.itemType" placeholder="Select" size="default">
                <el-option
                  v-for="item in typeValList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="项目长度" prop="itemLen">
               <el-input-number v-model="form.itemLen" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="小数位数" prop="decimalDigits">
               <el-input-number v-model="form.decimalDigits" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="序号" prop="order">
              <el-input-number v-model="form.order" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item v-if="form.itemType === 0" label="公式" prop="desc">
               <el-input v-model="form.desc" type="textarea" placeholder="请输入内容" />
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

<script setup name="Item">
import { listItem, addItem, delItem, getItem, updateItem } from "@/api/hr/salary/item";

const { proxy } = getCurrentInstance();

const route = useRoute()

const itemList = ref([]);
const open = ref(false);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const dataValList = [
  {value: 0,label: '数据型',},
  {value: 1,label: '字符型',},
  {value: 2,label: '日期型',},
]
const typeValList = [
  {value: 0,label: '公式',},
  {value: 1,label: '固定',},
  {value: 2,label: '变动',},
  {value: 3,label: '休假补工资',},
]

// 列显隐信息
const columns = ref([
  { key: 0, label: `项目名称`, visible: true },
  { key: 1, label: `数据类型`, visible: true },
  { key: 2, label: `项目长度`, visible: true },
  { key: 3, label: `小数位数`, visible: true },
  { key: 4, label: `项目类型`, visible: true },
  { key: 5, label: `序号`, visible: false },
  { key: 6, label: `公式`, visible: true }
]);


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
  },
  rules: {
    name: [{ required: true, message: "薪资项目名称不能为空", trigger: "blur" }],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询岗位列表 */
function getList() {
  loading.value = true;
  console.log(queryParams.value);
  listItem(queryParams.value).then(response => {
    console.log(response);
    itemList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    name: undefined,
    dataType: 0,
    itemLen: 12,
    decimalDigits: 2,
    itemType: 0,
    order: undefined,
    desc: undefined
  };
  proxy.resetForm("postRef");
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加薪资项目";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  getItem(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改薪资项目";
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["postRef"].validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {
        updateItem(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addItem(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  const ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除岗位编号为"' + ids + '"的数据项？').then(function() {
    return delItem(ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/post/export", {
    ...queryParams.value
  }, `post_${new Date().getTime()}.xlsx`);
}

getList();
</script>