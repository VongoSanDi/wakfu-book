import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActionDocument = HydratedDocument<Action>;

@Schema({ _id: false })
class Definition {
  @Prop()
  id: number;

  @Prop()
  effect: string;
}

@Schema()
export class Action {
  @Prop({ type: Definition })
  definition: Definition;

  @Prop({ type: Object })
  description: Record<string, string>;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
