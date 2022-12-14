import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

//element-ui plus按需引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import {resolve} from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  base:'./',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') ,
      '@css':resolve(__dirname, 'src/assets/css') 
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // server:{
  //   proxy:{
  //     '/server': {
  //       target: {
  //       host:'http://127.0.0.1',
  //       port:3000,
  //       },
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/server/, '')
  //     },
  //   },
  // },
})
