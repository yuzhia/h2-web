<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="班组代码" prop="classesgroupId">
        <el-input
          v-model="queryParams.classesgroupId"
          placeholder="请输入所属班组代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班次名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入班次名称"
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
          v-hasPermi="['hr:classes:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hr:classes:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hr:classes:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['hr:classes:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="classesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属班组代码" align="center" prop="classesgroupId" />
      <el-table-column label="班次名称" align="center" prop="name" />
      <el-table-column label="开始时间小时" align="center" prop="startHour" />
      <el-table-column label="结束时间小时" align="center" prop="endHour" />
      <el-table-column label="允许迟到多久" align="center" prop="arriveLateTime" />
      <el-table-column label="允许早走多久" align="center" prop="leaveEarlyTime" />
      <el-table-column label="是否上班免卡" align="center" prop="freeCardWork" />
      <el-table-column label="是否下班免卡" align="center" prop="freeCardAfterWork" />
      <el-table-column label="是否加班段" align="center" prop="isOvertimePeriod" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['hr:classes:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['hr:classes:remove']">删除</el-button>
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

    <!-- 添加或修改班次对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="classesRef" :model="form" inline :rules="rules" label-width="130px">
        <el-form-item label="班次名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入班次名称" />
        </el-form-item>
        <el-form-item label="班组" prop="classesgroupId">
          <el-select v-model="form.classesgroupId">
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div>
          <el-form-item label="班次开始时间" prop="startHour">
            <el-input class="w-16" v-model="form.startHour" placeholder="" /> <span class="w-8 h-8 border text-center">时</span> 
            <el-input class="w-16" v-model="form.startMinutes" placeholder="" /> <span class="w-8 h-8 border text-center">分</span> 
          </el-form-item>
          <el-form-item label="班次结束时间" prop="endHour">
            <el-input class="w-16" v-model="form.endHour" placeholder="" /> <span class="w-8 h-8 border text-center">时</span> 
            <el-input class="w-16" v-model="form.endMinutes" placeholder="" /> <span class="w-8 h-8 border text-center">分</span> 
          </el-form-item>
        </div>
        <el-form-item label="是否加班段" prop="isOvertimePeriod" @change="radioChange('isOvertimePeriod')">
          <el-radio-group style="width: 192px;" v-model="form.isOvertimePeriod">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否录加班条" prop="isRecord" @change="radioChange('isRecord')">
          <el-radio-group v-model="form.isRecord">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <div>
          <el-form-item label="是否允许迟到" prop="isAllowLate" @change="radioChange('isAllowLate')">
            <el-radio-group style="width: 192px;" v-model="form.isAllowLate">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.isAllowLate===1" label="允许迟到多久" prop="arriveLateTime">
            <el-input-number class="w-192px!" v-model="form.arriveLateTime" controls-position="right" placeholder="请输入允许迟到多久" />
          </el-form-item>
        </div>

        <div>
          <el-form-item label="是否允许早退" prop="isAllowLeave" @change="radioChange('isAllowLeave')">
            <el-radio-group style="width: 192px;" v-model="form.isAllowLeave">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.isAllowLeave===1" label="允许早走多久" prop="leaveEarlyTime">
            <el-input-number class="w-192px!" v-model="form.leaveEarlyTime" controls-position="right" placeholder="请输入允许早走多久" />
          </el-form-item>
        </div>

        <div>
          <el-form-item label="是否计缺勤" prop="isAbsenceWork" @change="radioChange('isAbsenceWork')">
            <el-radio-group v-model="form.isAbsenceWork">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <div  v-if="form.isAbsenceWork===1">
            <el-form-item label="迟到多久计缺勤" prop="isAbsenceWorkLate">
              <el-input-number class="w-192px!" v-model="form.isAbsenceWorkLate" controls-position="right" placeholder="请输入迟到多久计缺勤" />
            </el-form-item>    
            <el-form-item label="早退多久计缺勤" prop="isAbsenceWorkLeave">
              <el-input-number class="w-192px!" v-model="form.isAbsenceWorkLeave" controls-position="right" placeholder="请输入早退多久计缺勤" />
            </el-form-item>
          </div>
        </div>

        <el-form-item label="是否上班免卡" prop="freeCardWork" @change="radioChange('freeCardWork')">
          <el-radio-group style="width: 192px;" v-model="form.freeCardWork">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否下班免卡" prop="freeCardAfterWork" @change="radioChange('freeCardAfterWork')">
          <el-radio-group v-model="form.freeCardAfterWork">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="迟到扣多少工时" prop="isReduceMoneyLate">
          <el-input v-model="form.isReduceMoneyLate" placeholder="请输入迟到扣多少工时" />
        </el-form-item>
        <el-form-item label="早退扣多少工时" prop="isReduceMoneyLeave">
          <el-input v-model="form.isReduceMoneyLeave" placeholder="请输入早退扣多少工时" />
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

<script setup name="Classes">
import { listClasses, getClasses, delClasses, addClasses, updateClasses } from "@/api/hr/attendance/classes";
import { listGroup } from "@/api/hr/attendance/group";

const { proxy } = getCurrentInstance();

const route = useRoute()

const classesList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    classesgroupId: null,
    name: null,
    startHour: null,
    startMinutes: null,
    endHour: null,
    endMinutes: null,
    arriveLateTime: null,
    leaveEarlyTime: null,
    seriousLate: null,
    absenteeismLate: null,
    freeCardWork: null,
    freeCardAfterWork: null,
    isOvertimePeriod: null,
    overtimeType: null,
    isRecord: null,
    isAbsenceWork: null,
    isAllowLate: null,
    isAllowLeave: null,
    isReduceMoneyLate: null,
    isReduceMoneyLeave: null,
    isAbsenceWorkLate: null,
    isAbsenceWorkLeave: null,
    companyId: null,
    isDeleted: null,
  },
  rules: {
    name: [{ required: true, message: "班次名称不能为空", trigger: "blur" }],
    classesgroupId: [{ required: true, message: "班组不能为空", trigger: "blur" }],
    startHour: [{ required: true, message: "班次开始时间不能为空", trigger: "blur" }],
    endHour: [{ required: true, message: "班次结束时间不能为空", trigger: "blur" }],
  }
});

const { queryParams, form, rules } = toRefs(data);


const radioChange = (str) => {
  if (str == 'isAllowLate' && form.value[str] === 0) {
    form.value.arriveLateTime = null
  }
  if (str == 'isAllowLeave' && form.value[str] === 0) {
    form.value.leaveEarlyTime = null
  }
  if (str == 'isAbsenceWork' && form.value[str] === 0) {
    form.value.isAbsenceWorkLate = null
    form.value.isAbsenceWorkLeave = null
  }
}

const groupList = ref([])
// 查询班组
listGroup().then(res => {
  groupList.value = res.rows
})

/** 查询班次列表 */
function getList() {
  loading.value = true;
  listClasses(queryParams.value).then(response => {
    classesList.value = response.rows;
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
    classesgroupId: null,
    name: null,
    startHour: null,
    startMinutes: null,
    endHour: null,
    endMinutes: null,
    arriveLateTime: null,
    leaveEarlyTime: null,
    seriousLate: null,
    absenteeismLate: null,
    freeCardWork: 0,
    freeCardAfterWork: 0,
    isOvertimePeriod: 0,
    overtimeType: null,
    isRecord: 0,
    isAbsenceWork: 0,
    isAllowLate: 0,
    isAllowLeave: 0,
    isReduceMoneyLate: null,
    isReduceMoneyLeave: null,
    isAbsenceWorkLate: null,
    isAbsenceWorkLeave: null,
    companyId: null,
    isDeleted: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("classesRef");
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
  title.value = "添加班次";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getClasses(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改班次";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["classesRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateClasses(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addClasses(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除班次编号为"' + _ids + '"的数据项？').then(function() {
    return delClasses(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('hr/classes/export', {
    ...queryParams.value
  }, `classes_${new Date().getTime()}.xlsx`)
}

getList();
</script>

<style lang="scss" scoped>
</style>
