import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTimestampsConfig } from 'mongoose';

export type TopPageDocument = HydratedDocument<TopPageModel> & SchemaTimestampsConfig;

export enum TopLevelCategory {
    Courses,
    Services,
    Books,
    Products,
}

export class HhData {
    @Prop()
    count: number;

    @Prop()
    juniorSalary: number;

    @Prop()
    middleSalary: number;

    @Prop()
    seniorSalary: number;
    
    @Prop()
    updatedAt: Date;
}

class TopPageAdvantage {
    @Prop()
    title: string;

    @Prop()
    description: string;
}

@Schema({ timestamps: true })
export class TopPageModel {
    @Prop({ enum: TopLevelCategory })
    firstCategory: TopLevelCategory;

    @Prop()
    secondCategory: string;

    @Prop({ unique: true })
    alias: string;

    @Prop()
    title: string;

    @Prop()
    category: string;

    @Prop(HhData)
    hh?: HhData;

    @Prop([TopPageAdvantage])
    advantages: TopPageAdvantage[];

    @Prop()
    seoText: string;

    @Prop()
    tagsTitle: string;

    @Prop([String])
    tags: string[];
}

const TopPageSchema = SchemaFactory.createForClass(TopPageModel);

TopPageSchema.index({ title: 'text', seoText: 'text' });

export { TopPageSchema };
