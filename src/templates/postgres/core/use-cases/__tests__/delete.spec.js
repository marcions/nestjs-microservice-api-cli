const { dashToPascal } = require("../../../../../textUtils")

const getCoreUsecaseDeleteTest = (name) => `import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { ${dashToPascal(name)}DeleteInput, ${dashToPascal(name)}DeleteUsecase } from '@/core/${name}/use-cases/${name}-delete';
import { I${dashToPascal(name)}DeleteAdapter } from '@/modules/${name}/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { TestUtils } from '@/utils/tests';

import { I${dashToPascal(name)}Repository } from '../../repository/${name}';
import { ${dashToPascal(name)}Entity } from './../../entity/${name}';

describe(${dashToPascal(name)}DeleteUsecase.name, () => {
  let usecase: I${dashToPascal(name)}DeleteAdapter;
  let repository: I${dashToPascal(name)}Repository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: I${dashToPascal(name)}Repository,
          useValue: {}
        },
        {
          provide: I${dashToPascal(name)}DeleteAdapter,
          useFactory: (${name}Repository: I${dashToPascal(name)}Repository) => {
            return new ${dashToPascal(name)}DeleteUsecase(${name}Repository);
          },
          inject: [I${dashToPascal(name)}Repository]
        }
      ]
    }).compile();

    usecase = app.get(I${dashToPascal(name)}DeleteAdapter);
    repository = app.get(I${dashToPascal(name)}Repository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as ${dashToPascal(name)}DeleteInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Required', path: ${dashToPascal(name)}Entity.nameOf('id') }]);
      }
    );
  });

  const input: ${dashToPascal(name)}DeleteInput = {
    id: TestUtils.getMockUUID()
  };

  test('when ${name} not found, should expect an error', async () => {
    repository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(input)).rejects.toThrow(ApiNotFoundException);
  });

  const ${name} = new ${dashToPascal(name)}Entity({
    id: TestUtils.getMockUUID(),
    name: 'dummy'
  });

  test('when ${name} deleted successfully, should expect a ${name}', async () => {
    repository.findById = jest.fn().mockResolvedValue(${name});
    repository.updateOne = jest.fn();

    await expect(usecase.execute(input)).resolves.toEqual({
      ...${name},
      deletedAt: expect.any(Date)
    });
  });
});
`

module.exports = {
  getCoreUsecaseDeleteTest
}