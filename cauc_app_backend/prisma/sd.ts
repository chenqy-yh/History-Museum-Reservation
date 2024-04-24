import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


function getFormattedDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

// 输入日期，判断当日是否为周6 日
function isWeekend(date: Date) {
    return date.getDay() === 0 || date.getDay() === 6;
}

const main = async () => {
    // --------------- C L E A N    A L L    D B ------------------
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.record.deleteMany({});

    await prisma.user.deleteMany({});
    await prisma.guide.deleteMany({});
    await prisma.admin.deleteMany({});


    // --------------- I N I T    R E C O R D ------------------

    // 从2023年9月1号开始，每天插入一条数据，一直插入到2023年12月31号

    const startDate = new Date('2023-09-01');
    const endDate = new Date('2024-04-01');
    const oneDay = 1000 * 60 * 60 * 24;
    const days = (endDate.getTime() - startDate.getTime()) / oneDay;
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate.getTime() + oneDay * i);
        await prisma.record.create({
            data: {
                date: getFormattedDate(date),
                close: isWeekend(date),
            }
        })
    }


    // 创建管理员
    await prisma.admin.create({
        data: {
            username: 'a1140710816',
            password: 'yinhan123',
            nickname: 'chenqy',
            sex: 0,
            tel: '13333333333',
            status: 0,
            mail: 'qq@qq.com',
            role: 'super',
        }
    })

}


main().catch(e => {
    console.error(e)
    process.exit(1)
}).finally(async () => {
    await prisma.$disconnect()
});