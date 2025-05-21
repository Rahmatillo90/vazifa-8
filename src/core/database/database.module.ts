import { Global, Module } from '@nestjs/common';
import { DataBaseService } from './database.service';
import { SeederModule } from './seeders/seeder.module';

@Global()
@Module({
  imports: [SeederModule],
  providers: [DataBaseService],
  exports: [DataBaseService],
})
export class DataBaseModule {}
