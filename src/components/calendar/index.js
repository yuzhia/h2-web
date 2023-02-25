import Calendar from './Calendar.vue'




function install(Vue) {
  console.log('install');
  Vue.component('my-calendar', Calendar)
}

export default {
  install
}