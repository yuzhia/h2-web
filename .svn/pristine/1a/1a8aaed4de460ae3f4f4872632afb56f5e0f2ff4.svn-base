import { defineComponent, h } from 'vue'

/** 列数组映射的控制数组 */
// export type ColumnsOption =
// 	| undefined
// 	| {
// 			/** 是否启用列筛选 */
// 			filterable: boolean
// 			/** 该列是否显示 */
// 			visible: boolean
// 			/** 该列的label */
// 			label: string
// 			/** 该列初始化时的props配置 */
// 			props: any
// 	  }[]

/**
 * table列自动显示隐藏控制组件
 */
export default defineComponent({
	props: {
		effect: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			/** 列数组映射的控制数组 */
			columns_option: undefined,
		}
	},
	methods: {
		/** 自动处理所有列插槽内容 */
		initColumns(columns) {
			console.log(columns);
			this.columns_option = columns.map((it) => ({
				filterable: it.type?.name == 'ElTableColumn', // 当某个列v-if=false的情况，也会占用一个位置，所以这里要判断组件类型
				visible: true,
				label: it.props?.label,
				props: it.props,
			}))
		},
		/** 获取列数组映射的控制数组 */
		getColumnsOption() {
			return this.columns_option
		},
	},
	expose: ['getColumnsOption', 'initColumns'],
	render() {
		if (!this.$slots.default) {
			throw new Error('[x-table-column-filter] need a default slot')
		}
		this.initColumns(this.$slots.default())
		return h(() => {
			if (!this.$slots.default) {
				throw new Error('[x-table-column-filter] need a default slot')
			}
			let slots = this.$slots.default()
			if (!this.effect) {
				return slots
			}
			// 根据映射的控制数组实现对列的过滤
			let result = []
			this.columns_option?.forEach((it, index) => {
				if (it.visible && slots[index]) result.push(slots[index])
			})
			return result
		})
	},
})
