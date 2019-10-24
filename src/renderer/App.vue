<template>
  <div id="app">
    <!--<router-view></router-view>-->
    <!--<el-input type="text" v-model="channel" aria-placeholder="please input channel name"></el-input>-->
    <!--<el-input type="text" v-model="message" aria-placeholder="please input message"></el-input>-->
    <!--<el-button type="text" @click="sendMessage()">点击打开 Dialog</el-button>-->

    <!--<el-dialog-->
            <!--ref="updaterDialog"-->
            <!--:title="title"-->
            <!--:visible.sync="centerDialogVisible"-->
            <!--width="30%"-->
            <!--center>-->
      <!--<span>{{body}}</span>-->
      <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>-->
  <!--</span>-->
    <!--</el-dialog>-->
      <layout></layout>
  </div>
</template>

<script>
  import ElDialog from '../../node_modules/element-ui/packages/dialog/src/component.vue'
  import Sender from './utils/ipcUtil'
  import ElInput from '../../node_modules/element-ui/packages/input/src/input.vue'
  import Layout from '@/views/layout/Layout'
  export default {
    components: {
      ElInput,
      ElDialog,
      Layout},
    data () {
      return {
        name: 'electron-fabric',
        message: '222',
        // 0: 默认状态，1: 有新版本，待下载，2: 下载完成，待安装
        status: 0,
        progress: {
          percent: 0
        },
        centerDialogVisible: false,
        title: '提示',
        body: '需要注意的是内容是默认不居中的',
        channel: 'channel'
      }
    },
    created () {
      console.log(111)
      const mapNumbers = require('electron').remote.require('/opt/shurenwei/development/electron/electron-fabric/src/main/mapNumber')
      // 渲染进程
      const withRendererCb = mapNumbers.withRendererCallback(x => x + 1)
      const withLocalCb = mapNumbers.withLocalCallback()
      mapNumbers.asyncMessage().then(message => {
        console.log(message)
      })

      console.log(withRendererCb, withLocalCb)
      // [undefined, undefined, undefined], [2, 3, 4]
      this.$electron.ipcRenderer.on('ping', (event, args) => {
        console.log(args)
      })

      this.$electron.ipcRenderer.on('update-available', (event, args) => {
        console.log(args)
        this.body = args.releaseNotes
        this.setDialog()
      })

      this.$electron.ipcRenderer.on('download-progress', (event, args) => {
        console.log(event)
        console.log(args)
      })

      this.$electron.ipcRenderer.on('downloaded', (event, args) => {
        console.log(event)
        console.log(args)
      })
    },
    methods: {
      setDialog () {
        this.title = '发现新版本v0.0.2'
        this.centerDialogVisible = true
      },
      download () {
        this.$electron.ipcRenderer.send('download-now', this.message)
      },
      update () {
        this.$electron.ipcRenderer.send('update-now', '')
      },
      sendMessage () {
        Sender.send(this.channel, this.message).then((data) => {
          console.log(data)
        })
      }
    }
  }
</script>

<style>
  /* CSS */
</style>
