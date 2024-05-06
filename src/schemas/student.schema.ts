import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ collection: 'student', timestamps: true })
export class Student {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'school' })
  schoolId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  parentNumber: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  std: string;

  @Prop({ required: true })
  photo: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true, default: false })
  isDelete: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
