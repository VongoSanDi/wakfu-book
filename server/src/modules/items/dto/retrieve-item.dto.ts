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

export class RetrieveItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  level: number;

  @ApiProperty({ type: BaseParametersDto })
  baseParameters: BaseParametersDto;

  @ApiProperty({ type: GraphicParametersDto })
  graphicParameters: GraphicParametersDto;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
