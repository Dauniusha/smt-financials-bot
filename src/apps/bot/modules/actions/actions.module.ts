import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ActionsService } from './actions.service';
import * as Commands from './commands';
import * as Handlers from './handlers';
import { UsersModule } from '@core/users/users.module';
import * as Callbacks from './callbacks';
import { FinancialModule } from '@core/financial/financial.module';

@Module({
  imports: [UsersModule, FinancialModule],
  providers: [
    ActionsService,
    ...Object.values(Commands),
    ...Object.values(Handlers),
    ...Object.values(Callbacks),
  ],
  exports: [ActionsService, ...Object.values(Commands)],
})
export class ActionsModule implements OnApplicationBootstrap {
  constructor(private readonly service: ActionsService) {}

  onApplicationBootstrap() {
    this.service.bootstrap();
  }
}
