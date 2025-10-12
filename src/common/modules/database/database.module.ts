import { Module, Provider } from '@nestjs/common';

import { GlobalConfigModule } from '@common/modules/config/global-config.module';

const REPOSITORIES: Provider[] = [];

@Module({
  providers: REPOSITORIES,
  imports: [GlobalConfigModule],
  exports: REPOSITORIES,
})
export class DatabaseModule {}
