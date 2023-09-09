import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import voteLog from 'vite-plugin-console-info'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    voteLog({
      style:() =>{
          return ''
      },
    })
  ],
})
