<script setup>
import { ref, watch} from 'vue'
import { Search as IconSearch, RefreshRight as IconRefreshRight, Filter as IconFilter } from '@element-plus/icons-vue'

const props = defineProps({
	/** 搜索框的值，支持v-model */
	searchWord: {
		type: String,
		default: '',
	},
	/** 是否隐藏搜索框 */
	hideSearch: {
		type: Boolean,
		default: false,
	},
	/** 搜索框的placeholder */
	searchPlaceholder: {
		type: String,
		default: '请输入搜索词',
	},
	/** 搜索框样式 */
	searchStyle: {
		type: Object,
		default: () => ({ width: '180px' }),
	},
	/** 启用列筛选功能，配合x-table-column-filter组件使用 */
	tableColumns: {
		type: Array
	},
})

const emit = defineEmits({
	/** 触发搜索 */
	search: (search_word) => typeof search_word == 'string',
	/** 点击刷新按钮 */
	refresh: null,
	/** 更新搜索框的值 */
	'update:search-word': null,
})

const onSearchInputChange = (v) => {
	emit('update:search-word', v)
	emit('search', v)
}

const search_word = ref(props.searchWord)
watch(
	() => search_word.value,
	(val) => emit('update:search-word', val)
)
watch(
	() => props.searchWord,
	(val) => {
		if (val != search_word.value) search_word.value = val
	}
)
</script>
<template>
	<el-row class="mb-2 flex w-full flex-wrap items-center overflow-x-auto">
		<el-col :xs="24" :sm="12">
			<div class="flex flex-wrap items-center justify-start py-1">
				<slot></slot>
			</div>
		</el-col>
		<el-col :xs="24" :sm="12">
			<div class="flex items-center space-x-2 py-1 md:justify-end">
				<slot name="before-right"></slot>
				<el-input
					v-if="!hideSearch"
					v-model="search_word"
					:prefix-icon="IconSearch"
					:placeholder="searchPlaceholder"
					clearable
					:style="searchStyle"
					@change="onSearchInputChange"
				/>
				<el-button :icon="IconRefreshRight" @click="emit('refresh')"></el-button>
				<el-dropdown v-if="Array.isArray(tableColumns)" trigger="click" :hide-on-click="false" size="small">
					<el-button>
						<el-icon>
							<IconFilter />
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
				<slot name="after-right"></slot>
			</div>
		</el-col>
	</el-row>
</template>
