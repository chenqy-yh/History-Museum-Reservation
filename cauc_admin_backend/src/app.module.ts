import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DateModule } from './modules/date/date.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { OrderModule } from './modules/order/order.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RecordModule } from './modules/record/record.module';
import { TestModule } from './modules/test/test.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { global_prefix } from './utils/config';
import { UserModule } from './modules/admin/admin.module';
import { RouterModule } from './modules/router/router.module';
import { GuideModule } from './modules/guide/guide.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { NoticeModule } from './modules/notice/notice.module';
import { TouristModule } from './modules/tourist/tourist.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: `${global_prefix}/static`
    }),
    OrderModule,
    PrismaModule,
    FileUploadModule,
    DateModule,
    TestModule,
    AuthModule,
    RecordModule,
    UserModule,
    RouterModule,
    GuideModule,
    OrderItemModule,
    NoticeModule,
    TouristModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { 
  

}
