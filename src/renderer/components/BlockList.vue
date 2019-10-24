<template>
    <div>
        <el-table
                :data="tableData"
                style="width: 100%">
            <el-table-column
                    prop="date"
                    label="Current Block"
                    align="center"
                    minWidth="100%">
                    <el-table-column
                            prop="number"
                            label="ID"
                            align="center"
                            minWidth="20%">
                    </el-table-column>
                    <el-table-column
                            prop="dataHash"
                            label="Block Hash"
                            align="center"
                            minWidth="60%">
                    </el-table-column>
                    <el-table-column
                            prop="txCount"
                            label="Transaction Number"
                            align="center"
                            minWidth="20%">
                    </el-table-column>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="10"
                layout=" prev, pager, next, jumper"
                align="right"
                :total="total">
        </el-pagination>
    </div>
</template>

<script>
  import ipc from '../utils/ipcUtil'
  export default {
    data () {
      return {
        tableData: [],
        pageSize: 10,
        total: 0
      }
    },
    methods: {
      async loadData () {
        try {
          let res = await ipc.send('block/list')
          this.tableData = res.data
          res = await ipc.send('block/count')
          this.total = res.data
        } catch (err) {
          console.log(`load block data err : %s`, err)
        }
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
      }
    },
    created () {
      this.loadData()
    }
  }
</script>