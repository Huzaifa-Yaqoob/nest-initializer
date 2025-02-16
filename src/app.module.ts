import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import configuration from "./configuration";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(configuration.mongo.uri),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
