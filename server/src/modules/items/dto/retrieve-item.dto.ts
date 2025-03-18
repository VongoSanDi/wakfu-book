import { ApiProperty } from '@nestjs/swagger';

class BaseParametersDto {
  @ApiProperty()
  itemTypeId: number;

  @ApiProperty()
  itemSetId: number;
}

export class RetrieveItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  level: number;

  @ApiProperty({ type: BaseParametersDto })
  baseParameters: BaseParametersDto;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
