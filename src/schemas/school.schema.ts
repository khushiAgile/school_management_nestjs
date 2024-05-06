import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SchoolDocument = HydratedDocument<School>;

@Schema({ collection: 'school', timestamps: true })
export class School {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  photo: string;

  @Prop()
  password: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
