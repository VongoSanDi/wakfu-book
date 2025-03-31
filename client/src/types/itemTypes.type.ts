interface Definition {
  id: number;
  parentId: number;
  equipmentPositions: string[];
  equipmentDisabledPosition: string[];
  isRecyclable: boolean;
  isVisibleInAnimation: boolean;
}

export interface ItemTypes {
  definition: Definition;
  title: string;
}
