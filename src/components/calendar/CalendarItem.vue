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


const {status, year, month, day} = toRef(state)

// console.log(state);

const handleClick = () => {
  if (state.year === 'undefined' || state.month === 'undefined' || state.day === 'undefined') return
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
  if (state.year === 'undefined' || state.month === 'undefined' || state.day === 'undefined') return
  emit('select', {
    status: state.status ? true : false,
    year: state.year, 
    month: state.month, 
    day: state.day})
}

// 不选
function unselect() {
  state.status = false
  if (state.year === 'undefined' || state.month === 'undefined' || state.day === 'undefined') return
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

function setStatus(year, month, day, status) {
  if (year === state.year && month === state.month && day === state.day)
    state.status = status
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
  setStatus
})


</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}
.active {
  background: #7bed9f !important;
}

</style>