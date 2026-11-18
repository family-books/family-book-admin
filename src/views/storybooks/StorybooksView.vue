<template>
  <div>
    <el-card class="filter-card">
      <el-form inline>
        <el-form-item label="订单状态"><el-select v-model="status" clearable placeholder="全部状态" style="width:160px" @change="search"><el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" @click="search">查询</el-button></el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="orders" stripe v-loading="loading">
        <el-table-column label="绘本" min-width="240"><template #default="{row}"><div class="book"><el-image :src="row.photoUrl" fit="cover" :preview-src-list="[row.photoUrl]"/><div><b>{{row.childName}}的{{row.templateName}}</b><span>{{row.childAge}}岁 · {{row.childInterest||'未填写兴趣'}}</span><small>{{row.coverTitle}}</small></div></div></template></el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="195" show-overflow-tooltip />
        <el-table-column label="金额" width="95"><template #default="{row}">¥{{row.totalAmount}} × {{row.quantity}}</template></el-table-column>
        <el-table-column label="状态" width="100"><template #default="{row}"><el-tag :type="tagType(row.orderStatus)">{{statusLabel(row.orderStatus)}}</el-tag></template></el-table-column>
        <el-table-column label="收货信息" min-width="240"><template #default="{row}"><div>{{row.recipientName}} {{row.phone}}</div><small>{{row.fullAddress}}</small></template></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170" />
        <el-table-column label="操作" width="245" fixed="right"><template #default="{row}"><el-dropdown @command="(value:string)=>changeStatus(row,value)"><el-button size="small">更新状态<el-icon class="el-icon--right"><ArrowDown/></el-icon></el-button><template #dropdown><el-dropdown-menu><el-dropdown-item command="generating">生成中</el-dropdown-item><el-dropdown-item command="printing">印刷中</el-dropdown-item><el-dropdown-item command="completed">已完成</el-dropdown-item></el-dropdown-menu></template></el-dropdown><el-button v-if="['paid','generating','printing'].includes(row.orderStatus)" size="small" type="primary" @click="openShip(row)">发货</el-button></template></el-table-column>
      </el-table>
      <el-pagination class="pagination" v-model:current-page="page" v-model:page-size="pageSize" :total="total" layout="total, prev, pager, next, sizes" :page-sizes="[10,20,50]" @current-change="load" @size-change="load" />
    </el-card>
    <el-dialog v-model="shipVisible" title="确认绘本发货" width="460px"><el-form label-width="90px"><el-form-item label="订单号">{{selected?.orderNo}}</el-form-item><el-form-item label="快递公司"><el-input v-model="expressCompany" placeholder="例如：顺丰速运"/></el-form-item><el-form-item label="快递单号"><el-input v-model="trackingNo" placeholder="请输入快递单号"/></el-form-item></el-form><template #footer><el-button @click="shipVisible=false">取消</el-button><el-button type="primary" :loading="submitting" @click="submitShip">确认发货</el-button></template></el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getStorybookOrders, shipStorybookOrder, updateStorybookOrderStatus } from '@/api/storybooks'
import type { StorybookOrder } from '@/types'
const loading=ref(false),orders=ref<StorybookOrder[]>([]),status=ref(''),page=ref(1),pageSize=ref(20),total=ref(0),shipVisible=ref(false),submitting=ref(false),selected=ref<StorybookOrder|null>(null),expressCompany=ref('顺丰速运'),trackingNo=ref('')
const statusOptions=[{label:'已支付',value:'paid'},{label:'生成中',value:'generating'},{label:'印刷中',value:'printing'},{label:'已发货',value:'shipped'},{label:'已完成',value:'completed'},{label:'已取消',value:'cancelled'}]
const statusLabel=(value:string)=>statusOptions.find(i=>i.value===value)?.label||({pending_payment:'待支付'} as Record<string,string>)[value]||value
const tagType=(value:string)=>value==='completed'?'success':value==='shipped'?'primary':value==='cancelled'?'info':value==='paid'?'warning':''
const load=async()=>{loading.value=true;try{const res=await getStorybookOrders({page:page.value,pageSize:pageSize.value,status:status.value||undefined});orders.value=res.data.list;total.value=res.data.total}finally{loading.value=false}}
const search=()=>{page.value=1;load()}
const changeStatus=async(row:StorybookOrder,value:string)=>{await updateStorybookOrderStatus(row.id,value);ElMessage.success('状态已更新');load()}
const openShip=(row:StorybookOrder)=>{selected.value=row;trackingNo.value='';shipVisible.value=true}
const submitShip=async()=>{if(!selected.value||!expressCompany.value.trim()||!trackingNo.value.trim()){ElMessage.warning('请填写完整快递信息');return}submitting.value=true;try{await shipStorybookOrder(selected.value.id,expressCompany.value,trackingNo.value);ElMessage.success('已确认发货');shipVisible.value=false;load()}finally{submitting.value=false}}
onMounted(load)
</script>

<style scoped>
.filter-card{margin-bottom:20px}.pagination{margin-top:20px;justify-content:flex-end}.book{display:flex;align-items:center;gap:12px}.book .el-image{width:52px;height:66px;border-radius:6px;background:#eee}.book>div{display:flex;min-width:0;flex-direction:column;gap:4px}.book span,.book small,td small{color:#909399;font-size:12px}.book b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
</style>
