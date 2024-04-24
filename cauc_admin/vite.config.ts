import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig((config) => {
  const { command, mode } = config
  console.log(process.cwd());
  loadEnv(mode, process.cwd())
  return {
    plugins: [
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName(i) {
          return `__tla_${i}`
        },
      }),
      AutoImport({
        imports: ['vue'],
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      // build view
      visualizer(),
      vue(),
    ],
    resolve: {
      alias: {
        '@': '/src'
      }
    },
  }
})
