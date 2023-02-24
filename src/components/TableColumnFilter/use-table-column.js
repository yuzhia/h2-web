import { watch, ref, nextTick, computed } from 'vue'

// export type ColumnsOption = {
// 	/** 是否启用列筛选 */
// 	filterable: boolean
// 	/** 该列是否显示 */
// 	visible: boolean
// 	/** 该列的label */
// 	label: string
// 	/** 列的原始配置参数 */
// 	origin: any
// }

// export type ColumnsOptions = ColumnsOption[] | undefined

const useTableColumns = (tableRef) => {
	/** 表格的列 */
	const columns = ref(undefined)

	/**
	 * 手动初始化列
	 * @param tableRef <el-table>组件的ref
	 */
	const initColumns = (tableRef) => {
		let cols = tableRef?.store?.states?.columns?.value
		if (cols && Array.isArray(cols)) {
			columns.value = cols.map((it) => ({
				filterable: true,
				visible: true,
				label: it.label ? it.label : it.no,
				origin: it,
			}))
		}
	}

	watch(tableRef, (table) => {
		if (table) {
			nextTick(() => nextTick(() => initColumns(table)))
		} else {
			columns.value = undefined
		}
	})

	/**
	 * 计算列是否显示
	 * @param label 列的label或列的下标，在嵌套表头时父级不计入下标，只计所有最子级作为下标
	 */
	const columnVisible = (label) => {
		if (!columns) return true
		const find = typeof label == 'number' ? columns.value?.[label] : columns.value?.find((i) => i.label == label)
		return find ? find.visible : true
	}

	return {
		columns,
		initColumns,
		columnVisible,
	}
}

export default useTableColumns
