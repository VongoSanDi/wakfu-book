interface BaseParameters {
  itemTypeId: number;
  itemSetid: number;
}

interface GraphicParameters {
  gfxId: number;
  femaleGfxId: number;
}

interface Data {
  id: number;
  level: number;
  baseParameters: BaseParameters;
  graphicParameters: GraphicParameters;
  title: string;
  description: string
  imageUrl: string;
}

interface Meta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  page: number;
  pageCount: number;
  take: number;
  totalCount: number;
}

export interface PaginatedItem {
  data: Data[],
  meta: Meta
}
