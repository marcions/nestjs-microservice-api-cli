
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCoreUsecaseUpdate = (name) => `import { I${capitalizeFirstLetter(name)}Repository } from '@/core/${name}/repository/${name}';
import { ${capitalizeFirstLetter(name)}UpdateInput, ${capitalizeFirstLetter(name)}UpdateOutput, ${capitalizeFirstLetter(name)}UpdateSchema } from '@/modules/${name}/types';
import { ValidateSchema } from '@/utils/decorators/validate-schema.decorator';
import { ApiNotFoundException } from '@/utils/exception';

import { ${capitalizeFirstLetter(name)}Entity } from './../entity/${name}';

export class ${capitalizeFirstLetter(name)}UpdateUsecase {
  constructor(private readonly ${name}Repository: I${capitalizeFirstLetter(name)}Repository) {}

  @ValidateSchema(${capitalizeFirstLetter(name)}UpdateSchema)
  async execute(input: ${capitalizeFirstLetter(name)}UpdateInput): Promise<${capitalizeFirstLetter(name)}UpdateOutput> {
    const ${name} = await this.${name}Repository.findById(input.id);

    if (!${name}) {
      throw new ApiNotFoundException('${name}NotFound');
    }

    const ${name}Finded = new ${capitalizeFirstLetter(name)}Entity(${name});

    const entity = new ${capitalizeFirstLetter(name)}Entity({ ...${name}Finded, ...input });

    await this.${name}Repository.updateOne({ id: entity.id }, entity);

    const updated = await this.${name}Repository.findById(entity.id);

    return new ${capitalizeFirstLetter(name)}Entity(updated);
  }
}
`

module.exports = {
  getCoreUsecaseUpdate
}