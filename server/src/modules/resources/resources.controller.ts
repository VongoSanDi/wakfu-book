import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiPaginationQuery } from '../../common/decorators/pagination.decorator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PaginatedResponse } from '../../common/types/response.type';
import { LocaleFilterValidation } from '../../common/validations/locale-validation';
import { PageOptionsDtoValidation } from '../../common/validations/page-options.validation';
import { handleZodValidation } from '../../common/validations/zod-error.helper';
import { RetrieveResourceDto } from './dto/retrieve-resource.dto';
import { ResourcesService } from './resources.service';
import { RetrieveResourceFilter, RetrieveResourcesFilterValidation } from './validations/resources.validation';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) { }

  @Get(':locale')
  @ApiOperation({ summary: 'Retrieve all actions' })
  @ApiParam({ name: 'locale', required: true, type: String, example: 'fr' })
  @ApiQuery({ name: 'id', required: false, type: Number, example: '1' })
  @ApiPaginationQuery()
  @ApiResponse({
    status: 200,
    type: RetrieveResourceDto,
  })
  async find(
    @Param('locale') locale: string,
    @Query() query: Partial<RetrieveResourceFilter>,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PaginatedResponse<RetrieveResourceDto>> {
    const validatedLocale = handleZodValidation(
      LocaleFilterValidation.safeParse(locale),
      { message: 'Invalid local parameters', logError: true },
    );
    const validatedQuery = handleZodValidation(
      RetrieveResourcesFilterValidation.safeParse(query),
      { message: 'Invalid query parameters', logError: true },
    );
    const validatedPageOptions = handleZodValidation(
      PageOptionsDtoValidation.safeParse(pageOptionsDto),
      { message: 'Invalid pagination parameters', logError: true },
    );

    const pageOptionsInstance = new PageOptionsDto(validatedPageOptions);

    const { data, itemCount, totalCount } = await this.resourcesService.find(
      validatedLocale,
      validatedQuery,
      pageOptionsInstance,
    );

    return { data, itemCount, totalCount, pageOptionsDto: pageOptionsInstance };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(+id);
  }
}
