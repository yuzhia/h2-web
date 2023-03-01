<template>
    <td :class="{active: state.status}" @click="handleClick">{{state.day}}</td>
</template>

<script setup>
import { ref, reactive, toRef, watch } from 'vue'
const props = defineProps({
  year: Number,
  month: Number,
  day: Number
})

const emit = defineEmits(['select', 'unselect'])
const state = reactive({
  status: false,
  year: props.year,
  month: props.month,
  day: props.day
})

const selectData = reactive({
  y: 0,
  m: 0,
  d:0
})


const {status, year, month, day} = toRef(state)

// console.log(state);

const handleClick = () => {
  if (state.year === undefined || state.month === undefined || state.day === undefined) return
  state.status = !state.status
  emit('select', {
    status: state.status ? true : false,
    year: state.year, 
    month: state.month, 
    day: state.day})
}

// 选择
function select() {
  state.status = true
  if (state.year === undefined || state.month === undefined || state.day === undefined) return
  emit('select', {
    status: state.status ? true : false,
    year: state.year, 
    month: state.month, 
    day: state.day})
}

// 不选
function unselect() {
  state.status = false
  if (state.year === undefined || state.month === undefined || state.day === undefined) return
  emit('select', {
    status: state.status,
    year: state.year, 
    month: state.month, 
    day: state.day
  })
}

// 工作日
function selectByWork() {
  unselect()
  const {year, month, day} = state
  if ([1, 2, 3, 4, 5].indexOf(new Date(year, month - 1, day).getDay()) !== -1) {
    state.status = true
    emit('select', {
      status: state.status,
      year: state.year, 
      month: state.month, 
      day: state.day
    })
  }
}

// 大小周
function selectByBigSmallWork() {
  unselect()
  const {year, month, day} = state
  const week = new Date(year, month - 1, day).getDay()
  // 周日不选
  if (week === 0) {
    return
  }
  // 周六且双数天
  if (week === 6 && day % 2 === 0) {
    return
  }
  state.status = true
  emit('select', {
    status: state.status,
    year: state.year, 
    month: state.month, 
    day: state.day
  })
}

/**
 * 传入年月日，如果是当前时间，则根据status的值设置状态
 * @param {*} year 
 * @param {*} month 
 * @param {*} day 
 * @param {*} status true or false (选中或未选中)
 */
function setStatus(year, month, day, status) {
  if (year == state.year && month == state.month && day == state.day) {
    state.status = status
  }
}

/**
 * 反向选择，传入包含年月日的list，如果都不是当前组件的时间，则选中
 */
function reverseSetStatus(list) {
  // 只要有一个时间相等，则返回true
  let flag = list.some(time => {
    const year = time[0]
    const month = time[1]
    const day = time[2]
    return year == state.year && month == state.month && day == state.day
  })
  if (flag) return
  // 都不相等，则选中
  select()
}

// watch(
//   state,
//   (newValue, oldValue) => {
//     console.log('值发生了变更', newValue, oldValue);
//   },
//   { deep: true }
// );

defineExpose({
  select,
  selectByWork,
  selectByBigSmallWork,
  unselect,
  get: () => {
    return {
      ...state
    }
  },
  setStatus,
  reverseSetStatus
})


</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
  transition: .2s all ease-in-out;
}
.active {
  background: #7bed9f !important;
}

</style>