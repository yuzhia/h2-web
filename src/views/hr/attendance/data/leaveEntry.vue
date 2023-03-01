<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="请假人id" prop="userid">
        <el-input
          v-model="queryParams.userid"
          placeholder="请输入请假人id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker clearable
          v-model="queryParams.startTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker clearable
          v-model="queryParams.endTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="操作人" prop="operator">
        <el-input
          v-model="queryParams.operator"
          placeholder="请输入操作人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作时间" prop="operationTime">
        <el-date-picker clearable
          v-model="queryParams.operationTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择操作时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="所属公司id" prop="companyId">
        <el-input
          v-model="queryParams.companyId"
          placeholder="请输入所属公司id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否删除" prop="isDeleted">
        <el-input
          v-model="queryParams.isDeleted"
          placeholder="请输入是否删除"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['hr:entry:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hr:entry:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hr:entry:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['hr:entry:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="entryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="请假人" align="center" prop="userid" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请录入状态" align="center" prop="status" />
      <el-table-column label="请假类别" align="center" prop="type" />
      <el-table-column label="所属公司" align="center" prop="companyId" />
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="操作时间" align="center" prop="operationTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.operationTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['hr:entry:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['hr:entry:remove']">删除</el-button>
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

    <!-- 添加或修改请假录入对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="entryRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="请假人" prop="userid">
          <el-input v-model="form.userid" placeholder="请选择员工" />
        </el-form-item>
        <el-form-item label="请假类别" prop="type">
          <el-select v-model="form.type" >
            <el-option
                v-for="item in leaveCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围" prop="dataRange">
            <el-date-picker
                v-model="form.dataRange"
                type="datetimerange"
                range-separator="到"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
            />
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

<script setup name="Entry">
import { listEntry, getEntry, delEntry, addEntry, updateEntry } from "@/api/hr/attendance/entry";
import { listCategory } from "@/api/hr/attendance/leaveCategory";

const { proxy } = getCurrentInstance();

const entryList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const dataRange = ref([])
const form = ref({})
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userid: null,
    startTime: null,
    endTime: null,
    operator: null,
    operationTime: null,
    status: null,
    type: null,
    companyId: null,
    isDeleted: null,
  },
  rules: {
    userid: [{ required: true, message: "员工不能为空", trigger: "blur" }],
    type: [{ required: true, message: "请假类别不能为空", trigger: "blur" }],
    dataRange: [{ required: true, message: "时间不能为空", trigger: "blur" }],
  }
});

const { queryParams, rules } = toRefs(data);

const leaveCategoryList = ref([])
// 查询请假类别列表
listCategory().then(res => {
  leaveCategoryList.value = res.rows
})

/** 查询请假录入列表 */
function getList() {
  loading.value = true;
  listEntry(queryParams.value).then(response => {
    entryList.value = response.rows;
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
    userid: null,
    startTime: null,
    endTime: null,
    operator: null,
    operationTime: null,
    status: null,
    type: null,
    companyId: null,
    isDeleted: null,
    createTime: null,
    updateTime: null,
    dataRange: []
  };
  proxy.resetForm("entryRef");
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
  title.value = "添加请假录入";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getEntry(_id).then(response => {
    form.value = response.data;
    form.value.dataRange = []
    form.value.dataRange[0] = form.value.startTime
    form.value.dataRange[1] = form.value.endTime
    // form.value.dataRange = form.value.startTime.concat(form.value.endTime)
    open.value = true;
    title.value = "修改请假录入";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["entryRef"].validate(valid => {
    if (valid) {
        form.value.startTime = form.value.dataRange[0]
        form.value.endTime = form.value.dataRange[1]
      if (form.value.id != null) {
        updateEntry(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEntry(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除请假录入编号为"' + _ids + '"的数据项？').then(function() {
    return delEntry(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('hr/entry/export', {
    ...queryParams.value
  }, `entry_${new Date().getTime()}.xlsx`)
}

getList();
</script>
