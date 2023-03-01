<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
        <el-form-item label="假期类别名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入假期类别名称"
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
            v-hasPermi="['hr:category:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['hr:category:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['hr:category:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['hr:category:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="categoryList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="假期类别名称" align="center" prop="name" />
        <el-table-column label="新员工是否可以请假" align="center" prop="reason" />
        <el-table-column label="请假适用范围" align="center" prop="range" />
        <el-table-column label="是否带薪" align="center" prop="isHaveMoney" />
        <el-table-column label="最小请假单位" align="center" prop="unit" />
        <el-table-column label="请假时长取整" align="center" prop="round" />
        <el-table-column label="请假时长核算" align="center" prop="durationAccounting" />
        <el-table-column label="类型" align="center" prop="type" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['hr:category:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['hr:category:remove']">删除</el-button>
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
  
      <!-- 添加或修改假期类别对话框 -->
      <el-dialog :title="title" v-model="open" width="600px" append-to-body>
        <el-form ref="categoryRef" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="假期类别名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入假期类别名称" />
          </el-form-item>
          <el-form-item label="新员工是否可以请假" prop="reason">
            <el-radio-group v-model="form.reason">
                <el-tooltip content="入职就可以请假" placement="top">
                    <el-radio-button :label="0">否</el-radio-button>
                </el-tooltip>
                <el-tooltip content="转正后可以请假" placement="top">
                    <el-radio-button :label="1">是</el-radio-button>
                </el-tooltip>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="请假适用范围" prop="range">
            <el-radio-group v-model="form.range">
                <el-radio-button :label="0">全公司</el-radio-button>
                <el-radio-button :label="1">部门</el-radio-button>
                <el-radio-button :label="2">员工</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否带薪" prop="isHaveMoney">
            <el-radio-group v-model="form.isHaveMoney">
                <el-radio-button :label="0">否</el-radio-button>
                <el-radio-button :label="1">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="最小请假单位" prop="unit">
            <el-radio-group v-model="form.unit">
                <el-radio-button :label="0">小时</el-radio-button>
                <el-radio-button :label="1">半天</el-radio-button>
                <el-radio-button :label="2">全天</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="请假时长取整" prop="round">
            <el-radio-group v-model="form.round">
                <el-radio-button :label="0">不取</el-radio-button>
                <el-radio-button :label="1">向下取</el-radio-button>
                <el-radio-button :label="2">向上取</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="请假时长核算" prop="durationAccounting">
            <el-select v-model="form.durationAccounting" class="w-250px">
                <el-option label="请假时段中包含员工的休息日" :value="0"></el-option>
                <el-option label="请假时段中不包含员工的休息日" :value="1"></el-option>
            </el-select>
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
  
  <script setup name="Category">
  import { listCategory, getCategory, delCategory, addCategory, updateCategory } from "@/api/hr/attendance/leaveCategory";
  
  const { proxy } = getCurrentInstance();
  
  const categoryList = ref([]);
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
      name: null,
      reason: null,
      range: null,
      isHaveMoney: null,
      unit: null,
      round: null,
      durationAccounting: null,
      userId: null,
      type: null,
      companyId: null,
      deptId: null,
      isDeleted: null,
    },
    rules: {
        name: [{ required: true, message: "假期类别名称不能为空", trigger: "blur" }],
    }
  });
  
  const { queryParams, form, rules } = toRefs(data);
  
  /** 查询假期类别列表 */
  function getList() {
    loading.value = true;
    listCategory(queryParams.value).then(response => {
      categoryList.value = response.rows;
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
      name: null,
      reason: 0,
      range: 0,
      isHaveMoney: 0,
      unit: 0,
      round: 0,
      durationAccounting: 0,
      userId: null,
      type: null,
      companyId: null,
      deptId: null,
      isDeleted: null,
      createTime: null,
      updateTime: null
    };
    proxy.resetForm("categoryRef");
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
    title.value = "添加假期类别";
  }
  
  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _id = row.id || ids.value
    getCategory(_id).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改假期类别";
    });
  }
  
  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["categoryRef"].validate(valid => {
      if (valid) {
        if (form.value.id != null) {
          updateCategory(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addCategory(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除假期类别编号为"' + _ids + '"的数据项？').then(function() {
      return delCategory(_ids);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }
  
  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('hr/category/export', {
      ...queryParams.value
    }, `category_${new Date().getTime()}.xlsx`)
  }
  
  getList();
  </script>
  