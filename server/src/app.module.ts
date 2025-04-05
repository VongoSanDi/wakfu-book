import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './modules/items/items.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ResourcesModule } from './modules/resources/resources.module';
import { ActionsModule } from './modules/actions/actions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
    MongooseModule.forRoot(process.env.MONGODB_URL!), // the env var is type as string | undefined by TS, with "!" we say to TS that this var is always declared
    ItemsModule,
    ActionsModule,
    ResourcesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
