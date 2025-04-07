import { ApiProperty } from '@nestjs/swagger';

class BaseParametersDto {
  @ApiProperty()
  itemTypeId: number;

  @ApiProperty()
  itemSetId: number;
}

class GraphicParametersDto {
  @ApiProperty()
  gfxId: number;

  @ApiProperty()
  femaleGfxId: number;
}

// Definition.equipEffects.effect
class EffectDefinition {
  @ApiProperty()
  id: number;

  @ApiProperty()
  actionId: number;

  @ApiProperty()
  areaShape: number;

  @ApiProperty()
  areaSize: number[];

  @ApiProperty()
  params: number[];
}

class Effect {
  @ApiProperty({ type: EffectDefinition })
  definition: EffectDefinition
}

class EquipEffects {
  @ApiProperty({ type: Effect })
  effect: Effect
}

export class RetrieveItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  level: number;

  @ApiProperty({ type: BaseParametersDto })
  baseParameters: BaseParametersDto;

  @ApiProperty({ type: GraphicParametersDto })
  graphicParameters: GraphicParametersDto;

  @ApiProperty({ type: EquipEffects })
  equipEffects: EquipEffects[];

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
