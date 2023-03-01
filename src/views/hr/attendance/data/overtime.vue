<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
            <el-form-item label="加班开始时间" prop="startTime">
                <el-date-picker clearable v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD"
                    placeholder="请选择加班开始时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="加班结束时间" prop="endTime">
                <el-date-picker clearable v-model="queryParams.endTime" type="date" value-format="YYYY-MM-DD"
                    placeholder="请选择加班结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['hr:note:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
                    v-hasPermi="['hr:note:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['hr:note:remove']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="Download" @click="handleExport"
                    v-hasPermi="['hr:note:export']">导出</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="noteList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="加班人" align="center" prop="userid" />
            <el-table-column label="加班类别" align="center" prop="type" />
            <el-table-column label="加班开始时间" align="center" prop="startTime" width="180" />
            <el-table-column label="加班结束时间" align="center" prop="endTime" width="180" />
            <el-table-column label="调整时间(分)" align="center" prop="adjustTime" />
            <el-table-column label="操作人" align="center" prop="operator" />
            <el-table-column label="操作时间" align="center" prop="operationTime" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.operationTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="申请录入状态" align="center" prop="status" />
            <el-table-column label="所属公司" align="center" prop="companyId" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['hr:note:edit']">修改</el-button>
                    <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                        v-hasPermi="['hr:note:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改加班条录入对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="noteRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="加班人" prop="userid">
                    <el-input v-model="form.userid" placeholder="请选择员工" />
                </el-form-item>
                <el-form-item label="时间范围" prop="dateRange">
                    <el-date-picker
                        v-model="form.dateRange"
                        type="datetimerange"
                        range-separator="到"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
                <el-form-item label="所属公司" prop="companyId">
                    <el-input v-model="form.companyId" placeholder="请输入所属公司id" />
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
  
<script setup name="Note">
import { listNote, getNote, delNote, addNote, updateNote } from "@/api/hr/attendance/overtime";

import { listUser, deptTreeSelect } from "@/api/system/user";

const { proxy } = getCurrentInstance();

const noteList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const dateRange = ref([])

const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        userid: null,
        type: null,
        startTime: null,
        endTime: null,
        adjustTime: null,
        operator: null,
        operationTime: null,
        status: null,
        companyId: null,
        isDeleted: null,
    },
    rules: {
        dateRange: [{ required: true, message: "时间不能为空", trigger: "blur" }],
    }
});

const { queryParams, form, rules } = toRefs(data);

const startPickerOpts = (time) => {
    return form.value.endTime ? time.getTime() < new Date(form.value.endTime).getTime() : false
}
const endPickerOpts = (time) => {
    return form.value.startTime ? time.getTime() < new Date(form.value.startTime).getTime() : false
}


listUser().then(res => {

})

/** 查询加班条录入列表 */
function getList() {
    loading.value = true;
    listNote(queryParams.value).then(response => {
        noteList.value = response.rows;
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
        adjustTime: null,
        operator: null,
        operationTime: null,
        status: null,
        companyId: null,
        isDeleted: null,
        createTime: null,
        updateTime: null,
        dateRange: []
    };
    proxy.resetForm("noteRef");
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
    title.value = "添加加班条录入";
}

/** 修改按钮操作 */
function handleUpdate(row) {
    reset();
    const _id = row.id || ids.value
    getNote(_id).then(response => {
        form.value = response.data;
        form.value.dateRange = []
        form.value.dateRange[0] = form.value.startTime
        form.value.dateRange[1] = form.value.endTime
        open.value = true;
        title.value = "修改加班条录入";
    });
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["noteRef"].validate(valid => {
        if (valid) {
            form.value.startTime = form.value.dateRange[0]
            form.value.endTime = form.value.dateRange[1]
            if (form.value.id != null) {
                updateNote(form.value).then(response => {
                    proxy.$modal.msgSuccess("修改成功");
                    open.value = false;
                    getList();
                });
            } else {
                addNote(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除加班条录入编号为"' + _ids + '"的数据项？').then(function () {
        return delNote(_ids);
    }).then(() => {
        getList();
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
    proxy.download('hr/note/export', {
        ...queryParams.value
    }, `note_${new Date().getTime()}.xlsx`)
}

getList();
</script>
  