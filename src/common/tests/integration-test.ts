import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { GracefulShutdownService } from 'nestjs-graceful-shutdown/build/main/lib/graceful-shutdown.service';

export type TestContext = { module: TestingModule };

export class IntegrationTest {
  private readonly moduleBuilder: TestingModuleBuilder;
  private readonly testName: string;
  private readonly testFunction: (context: TestContext) => void;
  private readonly context: TestContext = { module: null };

  constructor(
    testName: string,
    moduleBuilder: TestingModuleBuilder,
    testFunction: (context: TestContext) => void,
  ) {
    this.testName = testName;
    this.moduleBuilder = moduleBuilder;
    this.testFunction = testFunction;

    this.run();
  }

  private run() {
    describe(this.testName, () => {
      beforeAll(async () => {
        this.context.module = await this.moduleBuilder
          .overrideProvider(GracefulShutdownService)
          .useValue({})
          .compile();
      });

      afterAll(async () => {
        await this.context.module.close();
      });

      this.testFunction(this.context);
    });
  }
}
