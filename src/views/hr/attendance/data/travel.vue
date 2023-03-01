<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <!-- <el-form-item label="用户" prop="userid">
          <el-input
            v-model="queryParams.userid"
            placeholder="请输入用户"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item> -->
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
            v-hasPermi="['hr:travel:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['hr:travel:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['hr:travel:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['hr:travel:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="travelList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户" align="center" prop="userid" />
        <el-table-column label="出差类别" align="center" prop="type" />
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
        <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="公司" align="center" prop="companyId" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['hr:travel:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['hr:travel:remove']">删除</el-button>
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
  
      <!-- 添加或修改出差录入对话框 -->
      <el-dialog :title="title" v-model="open" width="500px" append-to-body>
        <el-form ref="travelRef" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户id" prop="userid">
            <el-input v-model="form.userid" placeholder="请选择用户" />
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker clearable
              v-model="form.startTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker clearable
              v-model="form.endTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择结束时间">
            </el-date-picker>
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
  
  <script setup name="Travel">
  import { listTravel, getTravel, delTravel, addTravel, updateTravel } from "@/api/hr/attendance/travel";
  
  const { proxy } = getCurrentInstance();
  
  const travelList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(false);
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
      userid: null,
      type: null,
      startTime: null,
      endTime: null,
      operator: null,
      operationTime: null,
      status: null,
      companyId: null,
      isDeleted: null,
    },
    rules: {
    }
  });
  
  const { queryParams, form, rules } = toRefs(data);
  
  /** 查询出差录入列表 */
  function getList() {
    loading.value = true;
    listTravel(queryParams.value).then(response => {
      travelList.value = response.rows;
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
      type: null,
      startTime: null,
      endTime: null,
      operator: null,
      operationTime: null,
      status: null,
      companyId: null,
      isDeleted: null,
      createTime: null,
      updateTime: null
    };
    proxy.resetForm("travelRef");
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
    title.value = "添加出差录入";
  }
  
  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _id = row.id || ids.value
    getTravel(_id).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改出差录入";
    });
  }
  
  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["travelRef"].validate(valid => {
      if (valid) {
        if (form.value.id != null) {
          updateTravel(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addTravel(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除出差录入编号为"' + _ids + '"的数据项？').then(function() {
      return delTravel(_ids);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }
  
  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('hr/travel/export', {
      ...queryParams.value
    }, `travel_${new Date().getTime()}.xlsx`)
  }
  
  getList();
  </script>
  