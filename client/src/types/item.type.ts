interface BaseParameters {
  itemTypeId: number;
  itemSetid: number;
}

interface GraphicParameters {
  gfxId: number;
  femaleGfxId: number;
}

export interface Item {
  id: number;
  level: number;
  baseParameters: BaseParameters;
  graphicParameters: GraphicParameters;
  title: string;
  description: string
  imageUrl: string;
}
