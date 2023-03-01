<template>
  <div class="calendar">
    <h2>{{ data.month }}月</h2>
    <table class="cal" cellspacing="0">
      <thead class="cal-head">
        <th v-for="day in week" :key="day">{{ day }}</th>
      </thead>
      <tbody>
        <tr v-for="(arr, i) in listArr" :key="arr[i]">
          <template v-for="day in arr" :key="`${data.year}-${data.month}-${day}`">
            <CalendarItem v-if="day === undefined"></CalendarItem>
            <CalendarItem v-else @select="selectDay"
              ref="childs"
              :year="data.year"
              :month="data.month"
              :day="day"></CalendarItem>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { getNumberOfMonth } from './utils'
import { ref, reactive, toRef } from 'vue'
import CalendarItem from './CalendarItem.vue'

const props = defineProps({
  year: Number,
  month: Number
})

const emit = defineEmits(['select'])
let data = reactive({
  year: props.year,
  month: props.month
})
let listArr = []
const firstDay = new Date(data.year, data.month - 1, 1).getDay() // 月份从0开始
const week = [
  '周一', '周二', '周三', '周四', '周五', '周六', '周日',
]

const selectedSet = new Set()

const number = getNumberOfMonth(data.year, data.month)
// 设置第一行的数据， 并返回第二行的起始值
const nextIndex = putRowOne(listArr, firstDay)
const row = Math.ceil((number - nextIndex + 1) / 7)
putAll(listArr, nextIndex, number, row)

const {year, month} = toRef(data)

const childs = ref(null)


// 选择所有
function selectByAll() {
  childs.value.forEach(child => child.select());
}

// 选择工作日
function selectByWorkDay() {
  childs.value.forEach(child => child.selectByWork());
}

// 大小周
function selectByBigSmallWork() {
  childs.value.forEach(child => child.selectByBigSmallWork());
}

function unselect() {
  childs.value.forEach(child => child.unselect());
}


function selectDay(date) {
  if (!date.status) {
    let obj = null
    selectedSet.forEach(item => {
      if (item.year === date.year && item.month === date.month && item.day === date.day) {
        obj = item
      }
    })
    selectedSet.delete(obj)
  }
  else {
    selectedSet.add(date)
  }
  emit('select', selectedSet)
}

function getData() {
  const list = []
  childs.value.forEach(child => {
    let {status, year, month, day} = child.get()
    if (status) {
      list.push({
        year, month, day
      })
    }
  });
  return list
}

function getUnSelect() {
  const list = []
  childs.value.forEach(child => {
    let {status, year, month, day} = child.get()
    if (!status) {
      list.push({
        year, month, day
      })
    }
  });
  return list
}

function setData(y, m, d, status) {
  if (y != data.year || m != data.month) return
  childs.value.forEach(item => item.setStatus(y, m, d, status))
}

function putRowOne(arr, firstDay) {
  const fillNum = [1, 2, 3, 4, 5, 6, 0]
  const emptyNum = fillNum.indexOf(firstDay)
  arr[0] = Array(emptyNum)
  let i = emptyNum
  arr[0] = []
  for (; i < 7; i++) {
    arr[0][i] = i - emptyNum + 1
  }
  return i - emptyNum + 1;
}

function putAll(arr, start, end, row) {
  let n = start
  for (let r = 1; r <= row; r++) {
    arr[r] = []
    for (let i = 0; i < 7; i++) {
      if (n > end) break
      arr[r][i] = (n++)
    }
  }
}

/**
 * 反向选择，传入包含年月日的list，如果都不是当前组件的时间，则选中
 */
function reverseSelect(list) {
  childs.value.forEach(item => item.reverseSetStatus(list))
}

function setDataByList(list) {
  const filterList = list.filter(item => {
    return item[0] == data.year && item[1] == data.month
  })
  filterList.forEach(item => setData(item[0], item[1], item[2], true))
}

defineExpose({
  selectByAll,
  selectByWorkDay,
  selectByBigSmallWork,
  unselect,
  getData,
  getUnSelect,
  setData,
  reverseSelect,
  setDataByList
})


</script>

<style scoped>
.calendar {
  display: inline-block;
}

h2 {
  border-bottom: 2px solid rgb(64, 158, 255);
  padding-bottom: 5px;
  margin: 10px 0;
}

table {
  /* border: 1px solid #ccc; */
  text-align: center;
}

.cal-head th {
  /* border: 1px solid #ccc !important; */
  font-weight: bold;
  padding: 10px;
  margin: 10px;
}

td {
  padding: 10px;
  margin: 10px;
  cursor: pointer;
  /* border-right: 1px solid #ccc; */
}

td:hover {
  background-color: #f3f3f4;
}
</style>