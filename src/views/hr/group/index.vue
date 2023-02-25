<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="班组名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入班组名称"
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
            v-hasPermi="['hr:group:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['hr:group:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['hr:group:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['hr:group:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch"  @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="groupList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="班组名称" align="center" prop="name" />
        <el-table-column label="班组代码" align="center" prop="classesGroupId" />
        <el-table-column label="是否计时班组" align="center" prop="isTimingClass" />
        <el-table-column label="计时班组工时" align="center" prop="classesHours" />
        <el-table-column label="班组类型" align="center" prop="type">
          <template #default="{ row }">
            <div>{{ row.type===0?'公司':row.type===1?'部门':'员工' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="所属公司" align="center" prop="company" />
        <el-table-column label="所属部门" align="center" prop="department" />
        <el-table-column label="备注" align="center" prop="desc" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['hr:group:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['hr:group:remove']">删除</el-button>
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
  
      <!-- 添加或修改班组信息对话框 -->
      <el-dialog :title="title" v-model="open" width="500px" append-to-body>
        <el-form ref="groupRef" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="班组名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入班组名称" />
          </el-form-item>
          <el-form-item label="班组代码" prop="classesGroupId">
            <el-input v-model="form.classesGroupId" placeholder="请输入班组代码" />
          </el-form-item>
          <el-form-item label="班组类型" prop="type">
            <el-select v-model="form.type">
              <el-option
              v-for="item in classesGroupTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.type === 0" label="所属公司" prop="company">
            <el-input v-model="form.company" placeholder="请输入所属公司" />
          </el-form-item>
          <el-form-item v-if="form.type === 1" label="所属部门" prop="department">
            <el-input v-model="form.department" placeholder="请输入所属部门" />
          </el-form-item>
          <el-form-item v-if="form.type === 2" label="员工">
            <el-button>选择员工</el-button>
          </el-form-item>
          <el-form-item label="计时班组工时" prop="classesHours">
            <el-radio-group v-model="form.isTimingClass">
              <el-radio-button label="0">不计时</el-radio-button>
              <el-radio-button label="1">计时</el-radio-button>
            </el-radio-group>
            <el-input v-if="form.isTimingClass == 1" v-model="form.classesHours" class="mt-1" placeholder="请输入计时班组工时(此班组算多少小时的工时)" />
          </el-form-item>
          <el-form-item label="备注" prop="desc">
            <el-input v-model="form.desc" placeholder="请输入备注" />
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
  
  <script setup >
  import { listGroup, getGroup, delGroup, addGroup, updateGroup } from "@/api/hr/group";
  
  const { proxy } = getCurrentInstance();
  const route = useRoute()

  const groupList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");


const isClassesHours = ref('计时')

  const classesGroupTypes = [
    {value: 0,label: '公司',},
    {value: 1,label: '部门',},
    {value: 2,label: '员工',},
  ]

  // 列显隐信息
const columns = ref([
  { key: 0, label: `班组名称`, visible: true },
  { key: 1, label: `是否计时班组`, visible: true },
  { key: 2, label: `计时班组工时`, visible: true },
  { key: 3, label: `班组类型`, visible: true },
  { key: 4, label: `所属公司`, visible: true },
  { key: 5, label: `所属部门`, visible: true },
  { key: 6, label: `备注`, visible: true }
]);
  
  const data = reactive({
    form: {},
    queryParams: {
      pageNum: 1,
      pageSize: 10,
      classesGroupId: null,
      name: null,
      isTimingClass: null,
      classesHours: null,
      desc: null,
      type: null,
      company: null,
      department: null,
      isDeleted: null,
    },
    rules: {
      name: [{ required: true, message: "班组名称不能为空", trigger: "blur" }],
      classesGroupId: [{ required: true, message: "班组代码不能为空", trigger: "blur" }],
    }
  });
  
  const { queryParams, form, rules } = toRefs(data);
  
  /** 查询班组信息列表 */
  function getList() {
    loading.value = true;
    listGroup(queryParams.value).then(response => {
      groupList.value = response.rows;
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
      classesGroupId: null,
      name: null,
      isTimingClass: 0,
      classesHours: null,
      desc: null,
      type: 0,
      company: null,
      department: null,
      isDeleted: null,
      createTime: null,
      updateTime: null
    };
    proxy.resetForm("groupRef");
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
    title.value = "添加班组信息";
  }
  
  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _id = row.id || ids.value
    getGroup(_id).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改班组信息";
    });
  }
  
  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["groupRef"].validate(valid => {
      if (valid) {
        if (form.value.id != null) {
          updateGroup(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addGroup(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除班组信息编号为"' + _ids + '"的数据项？').then(function() {
      return delGroup(_ids);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }
  
  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('hr/group/export', {
      ...queryParams.value
    }, `group_${new Date().getTime()}.xlsx`)
  }
  
  getList();
  </script>
  