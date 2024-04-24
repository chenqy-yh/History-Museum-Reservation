import * as XLSX from 'xlsx';
import { getOrderTimeFrame } from '@/utils/fn/index'
import { orderStatusMap } from '@/utils/enum/order.enum'


export const toExcel = (tableData: IOrder[], excel_name: string = '报表') => {
    console.log('table_data:', tableData)
    const new_excel_data = tableData.map(table_item => {
        // 参观日期
        const order_date = table_item.order_date;
        // 星期几
        const order_date_week = new Date(order_date!).getDay();
        // 参观团体
        const organize = table_item.organize;
        // 参观时间
        const order_time = getOrderTimeFrame(table_item, false);
        // 上午下午
        const am_pm = table_item.orderItems![0].order_time_idx < 6 ? '上午' : '下午';
        // 参观人数 逗号分割
        const size = table_item.orderItems!.map(item => item.size).join(',');
        // 参观总人数
        const total_size = table_item.orderItems!.reduce((pre, cur) => cur.size + pre, 0);
        // 是否需要解说
        const need = table_item.need ? '是' : '否';
        // 校内校外团队
        const org_type = table_item.org_type === 1 ? '校内' : '校外';
        // 解说员 列表 逗号分割
        const guide_name = table_item.orderItems!.map(item => item.guide?.name).join(',');
        // 完成情况
        const status = orderStatusMap[table_item.order_status!];
        return {
            '参观日期': order_date,
            '星期号': order_date_week,
            '参观团体': organize,
            '参观时间': am_pm + ' ' + order_time,
            '参观人数': size,
            '总人数': total_size,
            '是否需要解说': need,
            '校内校外团队': org_type,
            '解说员': guide_name,
            '完成情况': status,
        }
    })
    const data = XLSX.utils.json_to_sheet(new_excel_data)//此处tableData.value为表格的数据
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, data, excel_name)//test-data为自定义的sheet表名
    XLSX.writeFile(wb, excel_name + '.xlsx')//test.xlsx为自定义的文件名
}

