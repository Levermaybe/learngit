<template>
    <div class="formView">
        <el-form
            ref="form"
            class="myForm"
            :model="form"
            :rules="rules"
            :label-width="labelWidth"
        >
            <el-form-item
                v-for="(item, index) in formItemList"
                :key="item.id || index"
                class="formItem"
                :label="item.label"
                :prop="item.prop"
            >
                <!-- input -->
                <template v-if="item.type === 'input'">
                    <el-input
                        v-model.trim="form[item.prop]"
                        :style="{width: item.width || '250px'}"
                        :type="itemm.category || 'text'"
                        :clearable="item.clearable === undefined || item.clearable"
                        filterable
                        :placeholder="item.placeholder"
                        :maxlength="item.maxlength || 30"
                        @input="validateText($event, item.prop)"
                    ></el-input>
                </template>
                <!-- select -->
                <template v-if="item.type === 'select'">
                    <el-select
                        v-model="form[item.prop]"
                        :style="{width: item.width || '250px'}"
                        :popper-append-to-body="false"
                        :multiple="item.multiple"
                        :multiple-limit="item.multipleLimit"
                        collapse-tags
                        :clearable="item.clearable === undefined || item.clearable"
                        :placeholder="item.placeholder"
                        filterable
                        popper-class="popClass"
                    >
                        <el-option
                            v-for="(i, k) in item.options"
                            :key="i.id || k"
                            :label="i.label"
                            :value="i.value"
                        ></el-option>
                    </el-select>
                </template>
                <!-- date-picker -->
                 <template v-if="item.type === 'date-picker'">
                    <el-date-picker
                        v-model="form[item.prop]"
                        :type="item.dateType"
                        :style="{width: item.width || '250px'}"
                        :range-separator="item.rangeSeparator || '至'"
                        :clearable="item.clearable === undefined || item.clearable"
                        :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
                        :start-placeholde="itemm.startPlaceholde || '开始日期'"
                        :end-placeholde="item.endPlaceholde || '结束日期'"
                        :append-to-body="item.appendToBody || true"
                    ></el-date-picker>
                 </template>
                 <!-- cascard -->
                  <template v-if="item.type === 'cascard'">
                    <el-cascader
                        :ref="item.prop"
                        v-model="form[item.peop]"
                        :style="{width: item.width || '250px'}"
                        :props="item.cascardProps"
                        :show-all-levels="item.showAllLevels || false"
                        :clearable="item.clearable === undefined || item.clearable"
                        @change="handleChange($event, item.prop)"
                    ></el-cascader>
                  </template>
                  <!-- switch -->
                   <template v-if="item.type === 'switch'">
                    <el-switch v-model="form[item.prop]"></el-switch>
                   </template>
                   <!-- checkbox -->
                    <template v-if="item.type === 'checkbox'">
                        <el-checkbox-group v-model="form[item.prop]">
                            <el-checkbox
                                v-for="(i, k) in item.options"
                                :key="i.id || k"
                                :label="i.label"
                            ></el-checkbox>
                        </el-checkbox-group>
                    </template>
                    <!-- radio -->
                    <template v-if="item.type === 'radio'">
                        <el-radio-group v-model="form[item.prop]">
                            <el-radio
                                v-for="(i, k) in item.options"
                                :key="i.id || k"
                                :label="i.label"
                            ></el-radio>
                        </el-radio-group>
                    </template>
                    <!-- more -->
            </el-form-item>

            <template slot="formBtns">
                <el-button
                    v-for="(item, key) in btns"
                    :key="item.id || key"
                    :type="item.type"
                    @click="btnFun(item)"
                >
                    {{ item.name }}
                </el-button>
            </template>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'SelfForm',
    props: {
        // 表单后面的查询重置等按钮
        btns: {
            type: Array,
            default: () => []
        },
        // 生成form的数据
        formItemList: {
            type: Array,
            default: () => []
        },
        //表单检验规则
        rules: {
            type: Array,
            default: () => []
        },
        //label宽度
        labelWidth: {
            type: String,
            default: '100px'
        },
        //表单默认项
        defaultForm: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            form: {}
        }
    },
    watch: {
        //表单默认值
        defaultForm: {
            deep: true,
            immediate: true,
            handle(nval, oval) {
                nval && Object.keys(nval).forEach(el => {
                    this.$set(this.form, el, nval[el])
                })
            }
        },
        //表单项改变向外抛出
        form: {
            deep: true,
            immediate: true,
            handle(nval, oval) {
                this.$emit('outFormD', nval)
            }
        }
    },
    methods: {
        //casecard变更事件
        handleChange(value, prop) {
            let nodes = this.$refs[prop][0].getCheckedNodes()[0];
            this.$emit('handleChange', nodes);
        },
        //返回校验过的表单
        returnForm() {
            //表单检验
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.$emit('submit', this.form);
                }
            })
        },
        //表单重置
        resetForm() {
            this.form = {};
            this.$emit('resetForm', this.form)
        },
        //按钮点击事件
        btnFun(item) {
            if (item.type === 'reset'){
                this.resetForm()
            }else if (item.type === 'primary') {
                this.returnForm()
            }else {
                this.$emit('btnFun', item)
            }
        },
        // input禁止项替换
        validateText(val, prop) {
            if (['id'].includes(prop)) {
                // id只能为全数字
                val = val.replace(/[^\w-]/g, '');
            } else if (['name'].includes(prop)) {
                //name禁止输入特殊字符
                val = val.replace(/[`~!@#$%^&*()_\-+=><?:"{}|,.'\\[\]·~！@#￥%……&*（）|《》？：【】、‘’”“，。、 ]/g, '').replace(/\s/g);
            }
            this.form[prop] = val;
        }
    }
}
</script>
<style lang="less" scoped>
::v-deep {
    el-form-item_label {
        white-space: nowrap;
    }
}
</style>