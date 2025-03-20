import { ApiProperty } from '@nestjs/swagger';

export class RetrieveActionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  effect: string;

  @ApiProperty()
  description: string;
}
