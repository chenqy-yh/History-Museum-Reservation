import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DateModule } from './date/date.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { OrderModule } from './order/order.module';
import { PrismaModule } from './prisma/prisma.module';
import { RecordModule } from './record/record.module';
import { TestModule } from './test/test.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { global_prefix } from './utils/config';
import { UserModule } from './user/user.module';
import { HttpModule } from './http/http.module';

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
    HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
