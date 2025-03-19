import { ApiProperty } from '@nestjs/swagger';

export class RetrieveItemFilter {
  @ApiProperty({ required: true })
  locale: string;

  @ApiProperty({ required: false })
  itemTypeId?: number;

  @ApiProperty({ required: false })
  title?: string;
}
