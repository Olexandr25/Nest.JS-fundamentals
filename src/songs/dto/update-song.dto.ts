import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  readonly title: string;

  // @IsOptional()
  // @IsArray()
  // @IsString({
  //   each: true,
  // })
  // readonly artists: string[];

  @IsDateString()
  @IsOptional()
  readonly releaseDate: Date;

  @IsMilitaryTime()
  @IsOptional()
  readonly duration: string;

  @IsString()
  @IsOptional()
  readonly lyrics: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly artists;
}
