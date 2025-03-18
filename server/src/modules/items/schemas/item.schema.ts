import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

// BaseParameters : caractéristiques de l'objet
@Schema({ _id: false })
class BaseParameters {
  @Prop({ required: true })
  itemTypeId: number;

  @Prop()
  itemSetId: number;

  @Prop({ required: true })
  rarity: number;

  @Prop()
  bindType: number;

  @Prop()
  minimumShardSlotNumber: number;

  @Prop()
  maximumShardSlotNumber: number;
}

// UseParameters : paramètres d'utilisation
@Schema({ _id: false })
class UseParameters {
  @Prop()
  useCostAp: number;

  @Prop()
  useCostMp: number;

  @Prop()
  useCostWp: number;

  @Prop()
  useRangeMin: number;

  @Prop()
  useRangeMax: number;

  @Prop()
  useTestFreeCell: boolean;

  @Prop()
  useTestLos: boolean;

  @Prop()
  useTestOnlyLine: boolean;

  @Prop()
  useTestNoBorderCell: boolean;

  @Prop()
  useWorldTarget: number;
}

// GraphicParameters : apparence de l'objet
@Schema({ _id: false })
class GraphicParameters {
  @Prop({ required: true })
  gfxId: number;

  @Prop()
  femaleGfxId: number;
}

// Definition de l'effet d'un objet
@Schema({ _id: false })
class EffectDefinition {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  actionId: number;

  @Prop({ required: true })
  areaShape: number;

  @Prop({ type: [Number], default: [] })
  areaSize: number[];

  @Prop({ type: [Number], default: [] })
  params: number[];
}

@Schema({ _id: false })
class Effect {
  @Prop({ required: true, type: EffectDefinition })
  definition: EffectDefinition;
}
const EffectSchema = SchemaFactory.createForClass(Effect);

@Schema()
class DefinitionItem {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  level: number;

  @Prop({ required: true, type: BaseParameters })
  baseParameters: BaseParameters;

  @Prop({ required: true, type: UseParameters })
  useParameters: UseParameters;

  @Prop({ required: true, type: GraphicParameters })
  graphicParameters: GraphicParameters;
}

@Schema()
class Definition {
  @Prop({ type: DefinitionItem })
  item: DefinitionItem;

  @Prop({ type: [{ effect: EffectSchema }], default: [] })
  useEffects: { effect: Effect }[];

  @Prop({ type: [{ effect: EffectSchema }], default: [] })
  useCriticalEffects: { effect: Effect }[];

  @Prop({
    type: [{ effect: { type: EffectSchema, required: true } }],
    default: [],
  })
  equipEffects: { effect: Effect }[];
}

// Item principal
@Schema()
export class Item {
  @Prop({ required: true, type: Definition })
  definition: Definition;

  @Prop({ type: Object, required: true })
  title: Record<string, string>; // Stocke les traductions (fr, en, es, pt, etc.)

  @Prop({ type: Object, required: true })
  description: Record<string, string>; // Stocke les descriptions (fr, en, es, pt, etc.)
}

export const ItemSchema = SchemaFactory.createForClass(Item);
