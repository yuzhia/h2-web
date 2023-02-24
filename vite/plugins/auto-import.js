import autoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'

export default function createAutoImport() {
    return autoImport({
        imports: [
            'vue',
            'vue-router',
            'pinia'
        ],
        resolvers: [
            ElementPlusResolver(),
            // 自动导入图标组件
            IconsResolver({
              prefix: 'Icon'
            })
        ],
        dts: false
    })
}
