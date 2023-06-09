import { IsArray, IsOptional, IsString } from 'class-validator';

export interface OutputBlockData {
  id?: string;
  data: any;
  type: any;
}

export class CreatePostDto {
  @IsString()
  title: string;

  @IsArray()
  body: OutputBlockData[];

  @IsOptional()
  @IsArray()
  tags: string;
}
