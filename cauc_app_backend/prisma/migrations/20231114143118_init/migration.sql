-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `openid` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NULL DEFAULT '微信用户',
    `avatar` VARCHAR(191) NULL DEFAULT 'https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/boy.png',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_openid_key`(`openid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Record` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `t_size_am` INTEGER NOT NULL DEFAULT 0,
    `t_size_pm` INTEGER NOT NULL DEFAULT 0,
    `order_size_list` VARCHAR(191) NOT NULL DEFAULT '0,0,0,0,0,0,0,0,0,0,0,0',
    `order_book_list` VARCHAR(191) NOT NULL DEFAULT '0,0,0,0,0,0,0,0,0,0,0,0',
    `full` BOOLEAN NOT NULL DEFAULT false,
    `close` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Record_date_key`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `org_type` INTEGER NOT NULL,
    `organize` VARCHAR(191) NOT NULL,
    `pm_name` VARCHAR(191) NOT NULL,
    `pm_tel` DECIMAL(65, 30) NOT NULL,
    `order_date` VARCHAR(191) NOT NULL,
    `need` BOOLEAN NOT NULL DEFAULT false,
    `operate_status` INTEGER NOT NULL DEFAULT 0,
    `order_status` INTEGER NOT NULL DEFAULT 0,
    `error_status` INTEGER NOT NULL DEFAULT 0,
    `sub_pm_type` VARCHAR(191) NOT NULL,
    `verify_url` VARCHAR(191) NOT NULL,
    `openid` VARCHAR(191) NOT NULL,
    `recordId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `order_date` VARCHAR(191) NOT NULL,
    `order_time` DATETIME(3) NOT NULL,
    `order_time_idx` INTEGER NOT NULL,
    `size` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `openid` VARCHAR(191) NOT NULL,
    `orderId` INTEGER NOT NULL,
    `guide_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL DEFAULT '普通管理员',
    `tel` VARCHAR(191) NOT NULL,
    `mail` VARCHAR(191) NOT NULL,
    `sex` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `avatar` VARCHAR(191) NOT NULL DEFAULT 'https://cauc-static-1300131488.cos.ap-beijing.myqcloud.com/boy.png',
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `status` INTEGER NOT NULL DEFAULT 0,
    `f_admin_id` INTEGER NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    UNIQUE INDEX `Admin_tel_key`(`tel`),
    UNIQUE INDEX `Admin_mail_key`(`mail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `adminId` INTEGER NOT NULL,
    `action` INTEGER NOT NULL,
    `action_name` VARCHAR(191) NOT NULL,
    `remark` VARCHAR(191) NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guide` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `staff_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `group` VARCHAR(191) NULL,
    `tel` VARCHAR(191) NOT NULL,
    `guide_time` INTEGER NOT NULL DEFAULT 0,
    `status` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Guide_staff_id_key`(`staff_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `delay` INTEGER NOT NULL DEFAULT 5000,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_openid_fkey` FOREIGN KEY (`openid`) REFERENCES `User`(`openid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `Record`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_openid_fkey` FOREIGN KEY (`openid`) REFERENCES `User`(`openid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_guide_id_fkey` FOREIGN KEY (`guide_id`) REFERENCES `Guide`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_f_admin_id_fkey` FOREIGN KEY (`f_admin_id`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminLog` ADD CONSTRAINT `AdminLog_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
