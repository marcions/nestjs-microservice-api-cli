const { dashToPascal } = require("../../../textUtils")


const getModule = (name) => `import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import mongoose, { Connection, PaginateModel, Schema } from 'mongoose';

import { AuthenticationMiddleware } from '@/observables/middlewares';
import { I${dashToPascal(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${dashToPascal(name)}CreateUsecase } from '@/core/${name}/use-cases/${name}-create';
import { ${dashToPascal(name)}DeleteUsecase } from '@/core/${name}/use-cases/${name}-delete';
import { ${dashToPascal(name)}GetByIdUsecase } from '@/core/${name}/use-cases/${name}-get-by-id';
import { ${dashToPascal(name)}ListUsecase } from '@/core/${name}/use-cases/${name}-list';
import { ${dashToPascal(name)}UpdateUsecase } from '@/core/${name}/use-cases/${name}-update';
import { RedisCacheModule } from '@/infra/cache/redis';
import { ConnectionName } from '@/infra/database/enum';
import { ${dashToPascal(name)}, ${dashToPascal(name)}Document, ${dashToPascal(name)}Schema } from '@/infra/database/mongo/schemas/${name}';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { SecretsModule } from '@/infra/secrets';
import { TokenLibModule } from '@/libs/token';
import { MongoRepositoryModelSessionType } from '@/utils/mongoose';

import {
  I${dashToPascal(name)}CreateAdapter,
  I${dashToPascal(name)}DeleteAdapter,
  I${dashToPascal(name)}GetByIdAdapter,
  I${dashToPascal(name)}ListAdapter,
  I${dashToPascal(name)}UpdateAdapter
} from './adapter';
import { ${dashToPascal(name)}Controller } from './controller';
import { ${dashToPascal(name)}Repository } from './repository';

@Module({
  imports: [TokenLibModule, SecretsModule, LoggerModule, RedisCacheModule],
  controllers: [${dashToPascal(name)}Controller],
  providers: [
    {
      provide: I${dashToPascal(name)}Repository,
      useFactory: async (connection: Connection) => {
        type Model = mongoose.PaginateModel<${dashToPascal(name)}Document>;

        // use if you want transaction
        const repository: MongoRepositoryModelSessionType<PaginateModel<${dashToPascal(name)}Document>> = connection.model<
          ${dashToPascal(name)}Document,
          Model
        >(${dashToPascal(name)}.name, ${dashToPascal(name)}Schema as Schema);

        repository.connection = connection;

        // use if you not want transaction
        // const repository: PaginateModel<${dashToPascal(name)}Document> = connection.model<${dashToPascal(name)}Document, Model>(${dashToPascal(name)}.name, ${dashToPascal(name)}Schema as Schema);

        return new ${dashToPascal(name)}Repository(repository);
      },
      inject: [getConnectionToken(ConnectionName.CATS)]
    },
    {
      provide: I${dashToPascal(name)}CreateAdapter,
      useFactory: (${name}Repository: I${dashToPascal(name)}Repository, loggerService: ILoggerAdapter) => {
        return new ${dashToPascal(name)}CreateUsecase(${name}Repository, loggerService);
      },
      inject: [I${dashToPascal(name)}Repository, ILoggerAdapter]
    },
    {
      provide: I${dashToPascal(name)}UpdateAdapter,
      useFactory: (${name}Repository: I${dashToPascal(name)}Repository, loggerService: ILoggerAdapter) => {
        return new ${dashToPascal(name)}UpdateUsecase(${name}Repository, loggerService);
      },
      inject: [I${dashToPascal(name)}Repository, ILoggerAdapter]
    },
    {
      provide: I${dashToPascal(name)}ListAdapter,
      useFactory: (${name}Repository: I${dashToPascal(name)}Repository) => {
        return new ${dashToPascal(name)}ListUsecase(${name}Repository);
      },
      inject: [I${dashToPascal(name)}Repository]
    },
    {
      provide: I${dashToPascal(name)}DeleteAdapter,
      useFactory: (${name}Repository: I${dashToPascal(name)}Repository) => {
        return new ${dashToPascal(name)}DeleteUsecase(${name}Repository);
      },
      inject: [I${dashToPascal(name)}Repository]
    },
    {
      provide: I${dashToPascal(name)}GetByIdAdapter,
      useFactory: (${name}Repository: I${dashToPascal(name)}Repository) => {
        return new ${dashToPascal(name)}GetByIdUsecase(${name}Repository);
      },
      inject: [I${dashToPascal(name)}Repository]
    }
  ],
  exports: [
    I${dashToPascal(name)}Repository,
    I${dashToPascal(name)}CreateAdapter,
    I${dashToPascal(name)}UpdateAdapter,
    I${dashToPascal(name)}ListAdapter,
    I${dashToPascal(name)}DeleteAdapter,
    I${dashToPascal(name)}GetByIdAdapter
  ]
})
export class ${dashToPascal(name)}Module implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(${dashToPascal(name)}Controller);
  }
}
`

module.exports = {
  getModule
}