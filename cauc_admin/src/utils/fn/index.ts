import { ElMessage, ElMessageBox } from "element-plus";

// format 2023-09-20T11:49:20.400Z YYYY-MM-DD HH:mm 需要注意上午下午
export function formatDateTime(inputDate: string): string {
  const dateObj = new Date(inputDate);
  const formattedDate = dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const [datePart, timePart] = formattedDate.split(', ');
  const [month, day, year] = datePart.split('/');
  const [time, period] = timePart.split(' ');

  return `${year}-${month}-${day} ${time} ${period}`;
}


// h -> 1000*3600 m -> 1000*60 s -> 1000
export const timeFormat = (time: string): number => {
  if (time.includes('d')) {
    return parseInt(time) * 24 * 3600 * 1000
  }
  if (time.includes('h')) {
    return parseInt(time) * 3600 * 1000
  }
  if (time.includes('m')) {
    return parseInt(time) * 60 * 1000
  }
  if (time.includes('s')) {
    return parseInt(time) * 1000
  }
  return 0;
}

// throttle
export const throttle = (fn: Function, delay: number) => {
  let last = 0;
  return (...args: any) => {
    const now = Date.now();
    if (now - last > delay) {
      fn(...args);
      last = now;
    } else {
      ElMessage.error('操作过于频繁，请稍后再试');
    }
  }
}

// 对象比较 
export const compare = (obj1: any, obj2: any): boolean => {
  const obj1_str = JSON.stringify(obj1);
  const obj2_str = JSON.stringify(obj2);
  return obj1_str === obj2_str;
}


// 操作前提示
export const confirm = (msg: string, fn: Function) => {
  return ElMessageBox.confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    fn();
  })
}


// 获得订单预订时间段 YYYY-MM-DD st mm:hh - ed mm:hh
export const getOrderTimeFrame = (order: IOrder, withDate = true) => {
  if (!order.orderItems || order.orderItems?.length === 0) {
    return "无";
  } else {
    const st_time = order.orderItems[0].order_time;
    const ed_time = order.orderItems[order.orderItems.length - 1].order_time;
    //ed_time 往后推30分钟
    const ed_time_30 = new Date(ed_time);
    ed_time_30.setMinutes(ed_time_30.getMinutes() + 30);
    if (withDate) {
      //返回 YYYY-MM-DD st mm:hh - ed mm:hh
      return `${formatDateTime(st_time).split(" ")[0]} ${formatDateTime(st_time).split(" ")[1]
        } - ${formatDateTime(ed_time_30.toISOString()).split(" ")[1]}`;
    } else {
      //返回 st mm:hh - ed mm:hh
      return `${formatDateTime(st_time).split(" ")[1]
        } - ${formatDateTime(ed_time_30.toISOString()).split(" ")[1]}`;
    }
  }
};


// 获得订单预订总人数
export const getTotalSize = (order: IOrder) => {
  if (!order.orderItems || order.orderItems?.length === 0) {
    return 0;
  } else {
    return order.orderItems.reduce((pre, cur) => cur.size + pre, 0);
  }
};


// 根据 2023-10-26T01:00:00.000Z 获取 st mm:hh ed mm:hh + 30min
export const getOrderItemTimeFrame = (orderItem: IOrderItem) => {
  const st_time = orderItem.order_date;
  const ed_time = new Date(st_time);
  ed_time.setMinutes(ed_time.getMinutes() + 30);
  return `${formatDateTime(st_time).split(" ")[1]
    } - ${formatDateTime(ed_time.toISOString()).split(" ")[1]}`;
}