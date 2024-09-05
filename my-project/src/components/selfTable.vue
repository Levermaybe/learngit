<template>
  <div class="tableView">
    <!-- table -->
    <el-table
        ref="table"
        v-loading="tableConfig.loading"
        :data="tableData"
        :element-loading-text="tableConfig.loadingText"
        :height="tableHeight"
        :default-sort="tableConfig.defaultSort"
        :border="tableConfig.border || true"
        :stripe="tableConfig.stripe || true"
        :highlight-current-row="tableConfig.highlight || true"
        row-key="dataCode"
        @current-change="handleRowCurrentChange"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        @row-dblClick="handleDblClick"
        @select="handleSelect"
        @select-all="handleSelectAll"
    >
        <!-- 可配置select -->
        <el-table-column
            v-if="tableConfig.rowSelect"
            :reserve-selection="tableConfig.reserveSelection"
            type="selection"
            width="45"
        ></el-table-column>
        <!-- 可配置index -->
        <el-table-column
            v-if="tableConfig.rowIndex"
            label="序号"
            width="70"
            align="center"
        >
            <template #default="scope">
                <span>
                    {{ (tableConfig.page - 1) * tableConfig.pageSize + scope.$index + 1 }}
                </span>
            </template>
        </el-table-column>
        <!-- content -->
        <el-table-column
            v-for="item in tableColumns"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
            :sortable="item.sortable"
            :fixed="item.fixed"
            :align="item.align || 'center'"
            :min-width="item.width || 125"
            :show-overflow-tooltip="tableConfig.showTooltip || true"
        >
            <!-- 二级表头 -->
            <template
                v-if="item.children && item.children.length > 0"
            >
                <el-table-column
                    v-for="child in item.children"
                    :key="child.prop"
                    :label="child.label"
                    :prop="child.prop"
                    :sortable="child.sortable"
                    :fixed="child.fixed"
                    :align="child.align || 'center'"
                    :min-width="child.width || 125"
                    :show-overflow-tooltip="tableConfig.showTooltip || true"
                ></el-table-column>
            </template>
            <!-- 非二级表头 -->
            <template
                v-if="!item.children || item.children.length === 0"
                #default="scope"
            >
                <!-- 自定义插槽 自定义展示内容及绑定方法 -->
                <slot
                    v-if="item.slot"
                    :name="item.prop"
                    :row="scope.row"
                    :index="scope.$index"
                ></slot>
                <!-- 需要value转换label的列 -->
                <slot
                    v-else-if="item.needChange"
                    name="valToLabel"
                    :row="scope.row"
                    :index="scope.$index"
                    :prop="item.prop"
                    :options="item.options"
                ></slot>
                <!-- 正常展示 -->
                <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
        </el-table-column>
    </el-table>
    <!-- pagination -->
    <el-pagination
        v-if="tableConfig.pagination"
        class="pageView"
        :current-page="tableConfig.currentPage"
        :page-size="tableConfig.pageSize"
        :page-sizes="tableConfig.pageSizes || [20, 30, 40, 50, 100]"
        :total="tableConfig.total"
        layout="total, sizes, prev, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
    nmae: 'SelfTable',
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        tableColumns: {
            type: Array,
            default: () => []
        },
        tableConfig: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {}
    },
    computed: {
        tableHeight() {
            return this.tableConfig.tableHeight || '100%';
        },
    },
    beforeUpdate() {
        this.$nextTick(() => {
            //数据加载完重新渲染表格
            this.$refs['table'].deLayout()
        })
    },
    methods: {
        // 切换pageSize
        handleSizeChange(val) {
            this.$emit('handleSizeChange', val);
        },
        //切换currentChange
        handleCurrentChange(val) {
            this.$emit('handleCurrentChange', val);
        },
        // 行单选
        handleRowcurrentChange(val) {
            this.$emit('handleRowcurrentChange', val);
        },
        //行多选
        handleSelectionChange(val) {
            this.$emit('handleSelectionChange', val);
        },
        //行点击
        handleRowClick(val) {
            this.$emit('handleRowClick', val);
        },
        //行双击
        handleDblClick(val) {
            this.$emit('handleDblClick', val);
        },
        //行选择
        handleSelect(selectArrRow, selectRow) {
            this.$emit('handleSelect', selectArrRow, selectRow);
        },
        //全选
        handleSelectAll(selectArrRow) {
            this.$emit('handleSelectAll', selectArrRow)
        }
    }
}
</script>

<style lang="less" scoped>
::v-deep {
    .el-pagination{
        margin-top: 10px;
        text-align: right;
    }
}
</style>