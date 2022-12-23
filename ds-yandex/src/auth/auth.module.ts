import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from '@/auth/strategies/api-key.strategy';

@Module({
  imports: [ConfigModule, PassportModule.register({})],
  providers: [AuthService, ApiKeyStrategy],
})
export class AuthModule {}
