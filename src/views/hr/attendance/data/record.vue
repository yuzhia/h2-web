<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="工号" prop="jobNumber">
                <el-input v-model="queryParams.jobNumber" placeholder="请输入工号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="部门" prop="dept">
                <el-input v-model="queryParams.dept" placeholder="请输入部门" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-upload action="http://localhost:8080/attendanceRecord/upload" :headers="{
                    'Authorization': token
                }" v-model:file-list="fileList" :limit="1" accept="xls" @success="handleSuccess" @error="handleError">
                    <el-button type="primary">点击上传excel文件</el-button>
                </el-upload>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="recordList">
            <el-table-column label="考勤开始年份" align="center" prop="startYear" />
            <el-table-column label="考勤结束年份" align="center" prop="endYear" />
            <el-table-column label="考勤开始月份" align="center" prop="startMonth" />
            <el-table-column label="考勤结束月份" align="center" prop="endMonth" />
            <el-table-column label="考勤开始日期" align="center" prop="startDay" />
            <el-table-column label="考勤结束日期" align="center" prop="endDay" />
            <el-table-column label="工号" align="center" prop="jobNumber" />
            <el-table-column label="姓名" align="center" prop="name" />
            <el-table-column label="部门" align="center" prop="dept" />
            <el-table-column label="打卡时间" align="center" prop="clockTime" />
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
            @pagination="getList" />

    </div>
</template>
  
<script setup name="Record">
import { listRecord } from "@/api/hr/record";
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance();

const recordList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        startYear: null,
        endYear: null,
        startMonth: null,
        endMonth: null,
        startDay: null,
        endDay: null,
        tabulationTime: null,
        jobNumber: null,
        name: null,
        dept: null,
        clockTime: null,
        isDeleted: null,
    }
});

const { queryParams } = toRefs(data);

const token = 'Bearer ' + getToken()

const fileList = ref([])

const handleSuccess = (res, file) => {
    if (res.code === 500) {
        ElMessage.error('文件上传失败，请另存试一下')
        fileList.value = []
        return
    }
    ElMessage.success('上传成功')
    // TODO 重新加载数据
}

const handleError = (res, file) => {
    ElMessage.error(res.message)
}


/** 查询考勤记录列表 */
function getList() {
    loading.value = true;
    listRecord(queryParams.value).then(response => {
        recordList.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
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

getList();
</script>
  