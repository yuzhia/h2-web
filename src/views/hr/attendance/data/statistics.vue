<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="选择时间" prop="startTime">
                <el-date-picker
                    v-model="queryParams.startTime"
                    type="month"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    placeholder="选择时间"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">提交</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="statisticsList" @selection-change="handleSelectionChange">
            <el-table-column label="姓名" align="center" prop="name" />
            <el-table-column label="所属部门" align="center" prop="employeeId" />
            <el-table-column label="工作时数" align="center">
                <el-table-column label="标准" align="center"  prop="standardWorkTime" />
                <el-table-column label="实际" align="center"  prop="actualWorkTime" />
            </el-table-column>
            <el-table-column label="迟到次数" align="center" prop="lateNum" />
            <el-table-column label="早退次数" align="center" prop="leaveEarly" />
            <el-table-column label="加班时数" align="center" prop="overtime" />
            <el-table-column label="出勤天数（标准/实际）" align="center">
                <template #default="scope">
                    <div>{{ scope.row.standardAttendanceDays }} / {{ scope.row.actualAttendanceDays }}</div>
                </template>
            </el-table-column>
            <el-table-column label="出差（天）" align="center" prop="travelDays" />
            <el-table-column label="旷工（天）" align="center" prop="absentDays" />
            <el-table-column label="请假（天）" align="center" prop="leaveDays" />
            <!-- 请假类别 -->
            <el-table-column
              align="center"
              v-for="(item, index) in leaveTableData"
              :key="index"
              :prop="item.value"
              :label="item.label"
            >
            </el-table-column>

        </el-table>
    </div>
</template>

<script setup>
import request from '@/utils/request'

const { proxy } = getCurrentInstance();

const statisticsList = ref([]);
const loading = ref(false);
const showSearch = ref(true);
const total = ref(0);

const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    startTime: '2018-08-01 00:00:00',
})

const handleSelectionChange = () => {

}

const listStatistics = () => {
    return request({
        url: '/attendanceStatistics/list',
        method: 'get',
    })
}


const calculate = (query) => {
    return request({
        url: '/attendanceStatistics',
        method: 'get',
        params: query
    })
}

// 表头数据
const leaveTableData = ref([])

/** 查询考勤记录列表 */
function getList() {
    loading.value = true;
    listStatistics().then(res => {
        console.log(res);
        for (let i = 0; i < res.data.length; i++) {
          for (let leave of res.data[i].leaveType) {
            if (i == 0) {
              leaveTableData.value.push({value: leave.id, label: leave.name})
            }
            res.data[i][leave.id] = leave.days
          }
        }
        console.log(res.data);
        statisticsList.value = res.data;
        // total.value = response.total;
        loading.value = false;
    });
}

/** 搜索按钮操作 */
async function handleQuery() {
    queryParams.value.pageNum = 1;
    await calculate(queryParams.value)
    getList()
}

/** 重置按钮操作 */
function resetQuery() {
    proxy.resetForm("queryRef");
    handleQuery();
}

/** 导出按钮操作 */
function handleExport() {
    proxy.download('/attendanceStatistics/export',{
        ...queryParams.value
    }, `attendanceStatistics_${new Date().getTime()}.xlsx`)
}

getList()

</script>