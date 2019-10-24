<template>
    <el-container>
        <el-header class="header">
            <vheader></vheader>
        </el-header>
        <el-container>
            <el-aside>
                <nav-menu></nav-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
  import NavMenu from '@/components/NavMenu'
  import Header from '@/components/Header'
  export default {
    name: 'App',
    components: {
      'NavMenu': NavMenu,
      'vheader': Header
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>
<style>
    .el-container{
        position: absolute;
        width: 100%;
        top: 0px ;
        left: 0 ;
        bottom: 0;
    }
    .el-header{
        padding: 0;
        z-index: 1000;
    }
    .el-header .fr{
        float: right;
    }
    .el-header .el-menu{
        border-bottom: none;
    }
    .el-aside, .el-main{
        padding-top: 60px;
    }
    .el-aside{
        background: #545c64;
    }
    .el-aside .el-menu{
        border-right: none;
    }
    .header {
        background-color: #409EFF;
        color: #fff;
        line-height: 60px;
    }

</style>
