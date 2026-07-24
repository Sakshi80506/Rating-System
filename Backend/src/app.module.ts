import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [AdminModule, UserModule, StoreModule],
})
export class AppModule {}