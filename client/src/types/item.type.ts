interface BaseParameters {
  itemTypeId: number;
  itemSetid: number;
}

export interface Item {
  id: number;
  level: number;
  baseParameters: BaseParameters;
  title: string;
  description: string
}
