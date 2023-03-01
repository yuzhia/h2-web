<template>
    <div class="scheduling" style="padding-top: 10px">
        <el-row>
            <el-col :span="4" :offset="10">
                <el-button @click="prev">上一年</el-button>
                {{ config.year }}年
                <el-button @click="next">下一年</el-button>
            </el-col>
            <el-col :span="6" :offset="4">
                <el-button-group>
                    <el-button size="small" type="primary" @click="selectAll()">选择所有</el-button>
                    <el-button size="small" type="primary" @click="selectByWorkDay()">工作日</el-button>
                    <el-button size="small" type="primary" @click="selectByBigSmallWork()">大小周</el-button>
                    <el-button size="small" type="primary" @click="clean()">清除选择</el-button>
                    <el-button size="small" type="primary" @click="saveScheduling()">保存排版</el-button>
                </el-button-group>
            </el-col>
        </el-row>

        <div id="calendar">
        <my-calendar v-for="(m, i) in config.month"
            ref="calrendarRefs"
            :key="`${config.year}-${m}`"
            :year="config.year" 
            :month="m"
            @select="handleSelect"
        >
        </my-calendar>


    </div>

    </div>
    
</template>

<script setup>

import {reactive, ref} from 'vue'
import {addUser, listUser, updateUser} from '@/api/hr/user'
import $msg from '@/plugins/modal'

const route = useRouter()

let config = reactive({
    year:new Date().getFullYear(),
    month: [1,2,3,4,5,6,7,8,9,10,11,12]
})

// const resData = reactive({
//     time: "2023-1-1,2023-1-2,2023-1-6",
//     classesGroupId: "54605dde9e6349feafc95802b891dff9",
//     company: 2
// })

const data = reactive({
    time: '',
    classesGroupId: "54605dde9e6349feafc95802b891dff9",
    // company: 2,
    isPut: false
})

onMounted(() => {
    data.classesGroupId = route.currentRoute.value.query.classesGroupId
    console.log(data);
    loadTime()
})

function loadTime() {
    clean()
    // 查询排班列表
    listUser().then(res => {
        // const list = res.data.map(row => row.time)
        //             .map(time => time.split('-').map(t => Number(t)))
        const list = res.data.map(row => row.time)
        .map(obj => {
            return obj.split('-')
        })
        if (list.length > 0) {
            data.isPut = true
            setDataByList(list)
        }
    })
}


// 日历组件引用
const calrendarRefs = ref(null)

// 选择所有
function selectAll() {
    calrendarRefs.value.forEach(item => item.selectByAll())
}

// 工作日
function selectByWorkDay() {
    calrendarRefs.value.forEach(item => item.selectByWorkDay())
}

// 大小周
function selectByBigSmallWork() {
    calrendarRefs.value.forEach(item => item.selectByBigSmallWork())
}

// 清除选择
function clean() {
    calrendarRefs.value.forEach(item => item.unselect())
}

// 获取选中的日期列表
function getSelected() {
    const list = []
    calrendarRefs.value.forEach(item => {
        let monthData = item.getData()
        list.push(...monthData)
    })
    console.log(list);
    return list;
}

// 获取未选中的日期列表
function getUnSelect() {
    const list = []
    calrendarRefs.value.forEach(item => {
        let monthData = item.getUnSelect()
        list.push(...monthData)
    })
    console.log(list);
    return list;
}

function saveScheduling() {
    const list = getSelected()
    console.log(list);
    const params = []
    let objList = list.map(item => {
        return {
            classesGroupId: data.classesGroupId,
            time: `${item.year}-${item.month}-${item.day} 00:00:00`
            // time: new Date(item.year, item.month, item.day).getTime() // `${item.year}-${item.month}-${item.day}`
        }
    })
    // params = objList
    console.log(objList);
    if (data.isPut) {
        updateUser(objList).then(res => {
            console.log(res);
            $msg.msgSuccess(res.msg)
        })
        .catch(err => {
            console.log(err);
            $msg.msgError(err.msg)
        })
    } else {
        addUser(objList)
        .then(res => {
            console.log(res);
            $msg.msgSuccess(res.msg)
        })
        .catch(err => {
            console.log(err);
            $msg.msgError(err.msg)
        })
    }
    loadTime()
    
}

// 设置某一天的状态(true, false)
function setData(year, month, day, status) {
    console.log('setData', year != config.year, config.year);
    if (year != config.year) return
    console.log('index:', year, month, day);
    calrendarRefs.value.forEach(item => item.setData(year, month, day, status));
}

function setDataByList(list) {
    calrendarRefs.value.forEach(item => item.setDataByList(list));
}

function reverseSelect(list) {
    calrendarRefs.value.forEach(item => item.reverseSelect(list));
}

function handleSelect(set) {
    // console.log(set);
}

function prev() {
    config.year--
    config.month = [1,2,3,4,5,6,7,8,9,10,11,12]
    loadTime()

}

function next() {
    config.year++
    config.month = [1,2,3,4,5,6,7,8,9,10,11,12]
    loadTime()
}

</script>

<style lang="scss" scoped>
#calendar {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-evenly;
    padding: 10px;
}
.is-selected {
  color: #1989fa;
}
</style>