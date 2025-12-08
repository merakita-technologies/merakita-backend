import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesResolver } from './properties.resolver';
import { Property } from './entities/property.entity';
import { RoomUnit } from './entities/room-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, RoomUnit])],
  providers: [PropertiesService, PropertiesResolver],
  exports: [PropertiesService],
})
export class PropertiesModule {}

