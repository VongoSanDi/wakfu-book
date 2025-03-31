import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ResourceDocument = HydratedDocument<Resource>;
@Schema({ _id: false })
class Definition {
  @Prop()
  id: number;

  @Prop()
  resourceType: number;

  @Prop()
  isBlocking: boolean;

  @Prop()
  idealRainRangeMin: number;

  @Prop()
  idealRainRangeMax: number;

  @Prop()
  idealTemperatureRangeMin: number;

  @Prop()
  idealTemperatureRangeMax: number;

  @Prop()
  iconGfxId: number;

  @Prop()
  lastEvolutionStep: number;

  @Prop()
  usableByHeroes: boolean;

  @Prop()
  idealRain: number;
}

@Schema()
export class Resource {
  @Prop({ type: Definition })
  definition: Definition;

  @Prop({ type: Object, required: true })
  title: Record<string, string>; // Stocke les traductions (fr, en, es, pt, etc.)
}
export const ResourceSchema = SchemaFactory.createForClass(Resource);
