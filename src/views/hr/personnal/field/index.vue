<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="字段名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入字段名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入字段编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
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
          v-hasPermi="['hr:field:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hr:field:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hr:field:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="fieldList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="关联表" align="center" prop="tableId">
        <template #default="{ row }">
          <div>
            {{
              row.tableId == "0"
                ? "基本资料"
                : row.tableId == "1"
                ? "任职资料"
                : "其他资料"
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="字段名称" align="center" prop="name" />
      <el-table-column label="字段编码" align="center" prop="code" />
      <el-table-column label="数据显示类型" align="center" prop="displayType">
        <template #default="{ row }">
          <div v-for="dict in emp_display_type" :key="dict.value">
            {{ dict.value == row.displayType ? dict.label : "" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否必填" align="center" prop="isRequired">
        <template #default="{ row }">
          <div>{{ row.isRequired == 1 ? "是" : "否" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="正则表达式" align="center" prop="regex" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            inline-prompt
            active-text="显示"
            inactive-text="隐藏"
            :active-value="1"
            :inactive-value="0"
            @change="statusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="orderNum" />
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hr:field:edit']"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hr:field:remove']"
            >删除</el-button
          >
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

    <!-- 添加或修改自定义字段对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fieldRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="关联表" prop="tableId">
          <el-select
            v-model="form.tableId"
            placeholder="请选择关联表"
            :disabled="title == '修改自定义字段'"
          >
            <el-option
              v-for="item in tableOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="字段名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入字段名称" />
        </el-form-item>
        <el-form-item label="字段编码" prop="code">
          <el-input
            v-model="form.code"
            placeholder="请输入字段编码"
            :disabled="title == '修改自定义字段'"
          />
        </el-form-item>
        <el-form-item label="数据显示类型" prop="displayType">
          <el-select
            v-model="form.displayType"
            placeholder="请选择"
            size="default"
          >
            <el-option
              v-for="dict in emp_display_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <div>
          <el-form-item
            v-if="form.displayType == '2'"
            label="选择时间类型"
            prop="dictTypeId"
          >
            <el-radio-group v-model="form.dateType" size="default">
              <el-tooltip content="2023-03-08" placement="bottom">
                <el-radio-button :label="0">日期</el-radio-button>
              </el-tooltip>
              <el-tooltip content="2023-03-08 12:23:21" placement="bottom">
                <el-radio-button :label="1">日期时间</el-radio-button>
              </el-tooltip>
              <el-tooltip content="12:23:21" placement="bottom">
                <el-radio-button :label="2">时间</el-radio-button>
              </el-tooltip>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="form.displayType == '3' || form.displayType == '4'"
            label="选择字典"
            prop="dictTypeId"
          >
            <el-select
              v-model="form.dictType"
              placeholder="请选择字典"
              size="default"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.dictId"
                :label="item.dictName"
                :value="item.dictType"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="是否必填" prop="isRequired">
          <el-radio-group v-model="form.isRequired">
            <el-radio-button :label="0">否</el-radio-button>
            <el-radio-button :label="1">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="正则表达式" prop="regex">
          <el-input v-model="form.regex" placeholder="请输入正则表达式" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number
            v-model="form.orderNum"
            controls-position="right"
            :min="0"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入描述" />
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

<script setup name="Field">
import {
  listField,
  pageField,
  getField,
  delField,
  saveField,
  updateField,
} from "@/api/hr/personnal/field";
import { optionselect } from "@/api/system/dict/type";


const { proxy } = getCurrentInstance();
const { emp_data_type, emp_display_type, sys_show_hide } = proxy.useDict(
  "emp_data_type",
  "emp_display_type",
  "sys_show_hide"
);

const fieldList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");


const isRegExp = (reg) => {
    let isReg;
    try {
        isReg = eval(reg) instanceof RegExp
    } catch (e) {
        isReg = false
    }
    return isReg
}

const checkReg = (rule, value, callback) => {
    if (value) {
        if (!isRegExp(value)) {
            return callback(new Error('请检查输入格式1111'))
        } else {
            callback()
        }
    }else {
        callback()
    }
}

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tableId: "0",
    name: null,
    code: null,
    dataType: null,
    dateType: 0,
    displayType: "0",
    dictType: null,
    remark: null,
    isRequired: 0,
    regex: null,
    status: 1,
    orderNum: 0,
    isDeleted: null,
  },
  rules: {
    name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
    code: [{ required: true, message: "编码不能为空", trigger: "blur" }],
    regex: [{ required: false, validator: checkReg, trigger:'change'}],
  },
});

const { queryParams, form, rules } = toRefs(data);


// 选择表
const tableOptions = [
  { value: "0", label: "基本资料" },
  { value: "1", label: "任职资料" },
  { value: "2", label: "其他资料" },
];

// 所有字典
const typeOptions = ref([]);
optionselect().then((res) => {
  typeOptions.value = res.data;
});

const statusChange = (data) => {
  updateField(data).then(() => {
    proxy.$modal.msgSuccess("修改成功");
  });
};

/** 查询自定义字段列表 */
function getList() {
  loading.value = true;
  pageField(queryParams.value).then((response) => {
    fieldList.value = response.rows;
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
    tableId: "0",
    name: null,
    code: null,
    dataType: null,
    dateType: 0,
    displayType: "0",
    dictType: null,
    remark: null,
    isRequired: 0,
    regex: null,
    status: 1,
    orderNum: 0,
    createTime: null,
    updateTime: null,
    isDeleted: null,
  };
  proxy.resetForm("fieldRef");
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
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加自定义字段";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value;
  getField(_id).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改自定义字段";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fieldRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateField(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        saveField(form.value).then((response) => {
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
  proxy.$modal
    .confirm('是否确认删除自定义字段编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delField(_ids);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "hr/field/export",
    {
      ...queryParams.value,
    },
    `field_${new Date().getTime()}.xlsx`
  );
}

getList();
</script>
