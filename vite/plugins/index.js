import vue from '@vitejs/plugin-vue'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import Unocss from 'unocss/vite' // 样式

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

export default function createVitePlugins(viteEnv, isBuild = false) {
    const vitePlugins = [
        vue(), Unocss(),      
        Components({
            resolvers: [
                IconsResolver({
                    enabledCollections: ['ep']
                }),
                ElementPlusResolver()
            ]
        }),
        Icons({autoInstall: true})
    ]
    vitePlugins.push(createAutoImport())
	vitePlugins.push(createSetupExtend())
    vitePlugins.push(createSvgIcon(isBuild))
	isBuild && vitePlugins.push(...createCompression(viteEnv))
    return vitePlugins
}
