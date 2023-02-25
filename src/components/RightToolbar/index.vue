<template>
  <div class="top-right-btn" :style="style">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top" v-if="search">
        <el-button circle icon="Search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button circle icon="Refresh" @click="refresh()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="显隐列" placement="top" v-if="columns">
        <el-button circle icon="Menu" @click="showColumn()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="显隐列" placement="top" v-if="Array.isArray(tableColumns)" >
        <el-dropdown trigger="click" :hide-on-click="false" size="small">
					<el-button>
						<el-icon>
							<i-ep-filter />
						</el-icon>
					</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<div class="py-1">
								<el-dropdown-item v-for="it in tableColumns">
									<el-checkbox v-if="it.filterable" v-model="it.visible">{{ it.label }}</el-checkbox>
								</el-dropdown-item>
							</div>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
      </el-tooltip>
    </el-row>
    <el-dialog :title="title" v-model="open" append-to-body>
      <el-transfer
        :titles="['显示', '隐藏']"
        v-model="value"
        :data="columns"
        @change="dataChange"
      ></el-transfer>
    </el-dialog>
  </div>
</template>

<script setup>
import {add, update, get} from '@/api/hr/individuation'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const route = useRoute()

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true,
  },
  columns: {
    type: Array,
  },
  search: {
    type: Boolean,
    default: true,
  },
  gutter: {
    type: Number,
    default: 10,
  },
  	/** 启用列筛选功能，配合x-table-column-filter组件使用 */
	tableColumns: {
		type: Array
	},
})

const emits = defineEmits(['update:showSearch', 'queryTable']);

// 显隐数据
const value = ref([]);
// 弹出层标题
const title = ref("显示/隐藏");
// 是否显示弹出层
const open = ref(false);

const style = computed(() => {
  const ret = {};
  if (props.gutter) {
    ret.marginRight = `${props.gutter / 2}px`;
  }
  return ret;
});

// 搜索
function toggleSearch() {
  emits("update:showSearch", !props.showSearch);
}

// 刷新
function refresh() {
  emits("queryTable");
}



// 右侧列表元素变化
function dataChange(data) {
  const obj = {
    userId: userStore.userId,
    path: route.path,
    hidden: data.join(',')
  }
  add(obj)
  for (let item in props.columns) {
    const key = props.columns[item].key;
    props.columns[item].visible = !data.includes(key);
  }
}

// 打开显隐列dialog
function showColumn() {
  open.value = true;
}

get({userId: userStore.userId, path: route.path}).then((res) => {
  if (res.data) {
    // 如果数据库有数据
    const hiddenList = res.data.hidden.split(',')
    for (let item in props.columns) {
      if (res.data?.hidden != '') {
        if (hiddenList.indexOf(item) !== -1) {
          props.columns[item].visible = false
          value.value.push(parseInt(item))
        } else {
          props.columns[item].visible = true
        }
      }else {
        props.columns[item].visible = true
      }
    }
  } else {
    // 显隐列初始默认隐藏列
    for (let item in props.columns) {
      if (props.columns[item].visible === false) {
        // value 隐藏的 key 列表
        value.value.push(parseInt(item));
      }
    }
  }
})

</script>

<style lang='scss' scoped>
:deep(.el-transfer__button) {
  border-radius: 50%;
  display: block;
  margin-left: 0px;
}
:deep(.el-transfer__button:first-child) {
  margin-bottom: 10px;
}

.my-el-transfer {
  text-align: center;
}
</style>