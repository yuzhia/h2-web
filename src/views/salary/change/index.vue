<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="员工" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入员工"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属公司" prop="companyId">
        <el-input
          v-model="queryParams.companyId"
          placeholder="请输入所属公司"
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
          v-hasPermi="['hr:change:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hr:change:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hr:change:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['hr:change:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" :columns="columns" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="changeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="项目名称" align="center" prop="name"  v-if="columns[0].visible" />
      <el-table-column label="员工" align="center" prop="userId"  v-if="columns[1].visible"/>
      <el-table-column label="异动前薪资" align="center" prop="salaryBeforeChange" v-if="columns[2].visible" />
      <el-table-column label="异动后薪资" align="center" prop="salaryAfterChange" v-if="columns[3].visible" />
      <el-table-column label="异动原因" align="center" prop="changeReason" v-if="columns[4].visible" />
      <el-table-column label="异动时间" align="center" prop="changeTime" width="180" v-if="columns[5].visible">
        <template #default="scope">
          <span>{{ parseTime(scope.row.changeTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['hr:change:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['hr:change:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改薪资异动对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="changeRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="项目名称" prop="name">
          <el-select v-model="form.salaryItemId" placeholder="请选择项目名称" size="default">
            <el-option
              v-for="item in itemTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="员工" prop="userId">
          <el-tree-select v-model="form.userId" :data="userList" :render-after-expand="false" />
        </el-form-item>
        <el-form-item label="异动前薪资" prop="salaryBeforeChange">
          <el-input-number v-model="form.salaryBeforeChange" controls-position="right" :min="0" :step="0.1" :precision="2" />
        </el-form-item>
        <el-form-item label="异动后薪资" prop="salaryAfterChange">
          <el-input-number v-model="form.salaryAfterChange" controls-position="right" :min="0" :step="0.1" :precision="2" />
        </el-form-item>
        <el-form-item label="异动时间" prop="changeTime">
          <el-date-picker
            v-model="form.changeTime"
            type="date"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="异动原因" prop="changeReason">
            <el-input v-model="form.changeReason" type="textarea" placeholder="请输入内容" />
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

<script setup name="Change">
import { listChange, getChange, delChange, addChange, updateChange } from "@/api/salary/change";
import { getItemType } from "@/api/salary/item";
import { numMulti } from '@/utils/hr.js'

const { proxy } = getCurrentInstance();

const changeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const userList = [
  {
    value: '1',
    label: '公司1',
    children: [
      {
        value: '2',
        label: '部门1',
        children: [
          {
            value: '111',
            label: '员工1',
          },
        ],
      },
    ],
  }
]

// 列显隐信息
const columns = ref([
  { key: 0, label: `项目名称`, visible: true },
  { key: 1, label: `员工`, visible: true },
  { key: 2, label: `异动前薪资`, visible: true },
  { key: 3, label: `异动后薪资`, visible: true },
  { key: 4, label: `异动原因`, visible: true },
  { key: 5, label: `异动时间`, visible: true },
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    salaryBeforeChange: null,
    salaryAfterChange: null,
    changeReason: null,
    changeTime: null,
    userId: null,
    companyId: null,
    salaryItemId: null,
    isDeleted: null
  },
  rules: {
    salaryItemId: [{ required: true, message: "薪资项目名称不能为空", trigger: "blur" }],
    userId: [{ required: true, message: "员工不能为空", trigger: "blur" }],
    salaryBeforeChange: [{ required: true, message: "异动前薪资不能为空", trigger: "blur" }],
    salaryAfterChange: [{ required: true, message: "异动后薪资不能为空", trigger: "blur" }],
    changeTime: [{ required: true, message: "异动时间不能为空", trigger: "blur" }],
  }
});

const { queryParams, form, rules } = toRefs(data);

const itemTypeList = ref([])

getItemType().then(res => {
  console.log(res);
  itemTypeList.value = res.data
})

/** 查询薪资异动列表 */
function getList() {
  loading.value = true;
  listChange(queryParams.value).then(response => {
    response.rows.forEach(item => {
      item.salaryBeforeChange /= 100
      item.salaryAfterChange /= 100
    });
    changeList.value = response.rows;
    console.log(changeList.value);
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    salaryBeforeChange: 0,
    salaryAfterChange: 0,
    changeReason: null,
    changeTime: null,
    userId: null,
    companyId: null,
    salaryItemId: null,
    createTime: null,
    updateTime: null,
    isDeleted: null
  };
  proxy.resetForm("changeRef");
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

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加薪资异动";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getChange(_id).then(response => {
    const item = response.data
    item.salaryBeforeChange /= 100
    item.salaryAfterChange /= 100
    form.value = item;
    open.value = true;
    title.value = "修改薪资异动";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["changeRef"].validate(valid => {
    if (valid) {
      form.value.salaryBeforeChange = numMulti(form.value.salaryBeforeChange, 100)
      form.value.salaryAfterChange = numMulti(form.value.salaryAfterChange, 100)
      if (form.value.id != null) {
        updateChange(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addChange(form.value).then(response => {
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除薪资异动编号为"' + _ids + '"的数据项？').then(function() {
    return delChange(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('hr/change/export', {
    ...queryParams.value
  }, `change_${new Date().getTime()}.xlsx`)
}

getList();
</script>
