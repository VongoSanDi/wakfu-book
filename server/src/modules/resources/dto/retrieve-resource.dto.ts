import { ApiProperty } from "@nestjs/swagger";

class Definition {
  @ApiProperty()
  id: number;

  @ApiProperty()
  resourceType: number;

  @ApiProperty()
  isBlocking: boolean;

  @ApiProperty()
  idealRainRangeMin: number;

  @ApiProperty()
  idealRainRangeMax: number;

  @ApiProperty()
  idealTemperatureRangeMin: number;

  @ApiProperty()
  idealTemperatureRangeMax: number;

  @ApiProperty()
  iconGfxId: number;

  @ApiProperty()
  lastEvolutionStep: number;

  @ApiProperty()
  usableByHeroes: boolean;

  @ApiProperty()
  ideaRain: number;
}

export class RetrieveResourceDto {
  @ApiProperty()
  definition: Definition;

  @ApiProperty()
  title: string;
}
