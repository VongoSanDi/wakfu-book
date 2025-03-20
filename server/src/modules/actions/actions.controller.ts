import { Controller, Get, Param, Query } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiPaginationQuery } from '../../common/decorators/pagination.decorator';
import { RetrieveActionDto } from './dto/retrieve-action.dto';
import { PaginatedResponse } from '../../common/types/response.type';
import { handleZodValidation } from '../../common/validations/zod-error.helper';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageOptionsDtoValidation } from '../../common/validations/page-options.validation';
import { LocaleFilterValidation } from '../../common/validations/locale-validation';
import {
  RetrieveActionFilter,
  RetrieveActionsFilterValidation,
} from './validations/actions.validation';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get(':locale')
  @ApiOperation({ summary: 'Retrieve all actions' })
  @ApiParam({ name: 'locale', required: true, type: String, example: 'fr' })
  @ApiQuery({ name: 'id', required: false, type: Number, example: '1' })
  @ApiPaginationQuery()
  @ApiResponse({
    status: 200,
    type: RetrieveActionDto,
  })
  async find(
    @Param('locale') locale: string,
    @Query() query: Partial<RetrieveActionFilter>,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PaginatedResponse<RetrieveActionDto>> {
    const validatedLocale = handleZodValidation(
      LocaleFilterValidation.safeParse(locale),
      { message: 'Invalid local parameters', logError: true },
    );
    const validatedQuery = handleZodValidation(
      RetrieveActionsFilterValidation.safeParse(query),
      { message: 'Invalid query parameters', logError: true },
    );
    const validatedPageOptions = handleZodValidation(
      PageOptionsDtoValidation.safeParse(pageOptionsDto),
      { message: 'Invalid pagination parameters', logError: true },
    );
    const pageOptionsInstance = new PageOptionsDto(validatedPageOptions);

    const { data, itemCount, totalCount } = await this.actionsService.find(
      validatedLocale,
      validatedQuery,
      pageOptionsInstance,
    );

    return { data, itemCount, totalCount, pageOptionsDto: pageOptionsInstance };
  }

  @Get(':locale/:id')
  findOne(@Param('id') id: string) {
    return this.actionsService.findOne(+id);
  }
}
