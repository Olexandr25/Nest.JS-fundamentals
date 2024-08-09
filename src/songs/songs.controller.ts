// import { Connection } from './../common/constants/connection';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  // Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Scope,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './song.entity';
import { SongsService } from './songs.service';

@Controller({
  path: 'songs',
  scope: Scope.REQUEST,
})
export class SongsController {
  // constructor(
  //   private songsService: SongsService,
  //   @Inject('CONNECTION')
  //   private connection: Connection,
  // ) {
  //   console.log(
  //     `THIS IS CONNECTION STRING: ${this.connection.CONNECTION_STRING}`,
  //   );
  // }
  constructor(private songsService: SongsService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<Song>> {
    try {
      limit = limit > 100 ? 100 : limit;
      // return this.songsService.findAll(); // * #1
      return this.songsService.pagination({
        page,
        limit,
      });
    } catch (error) {
      throw new HttpException(
        'Server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Song> {
    try {
      const song = await this.songsService.findOne(id);
      if (!song) {
        throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
      }
      return song;
    } catch (error) {
      if (error instanceof HttpException) {
        // Якщо це HttpException, то просто перекидаємо її далі
        throw error;
      }
      // Якщо це інша помилка, обробляємо її як внутрішню помилку сервера
      throw new HttpException(
        'Server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Post()
  create(@Body() createSongDTO: CreateSongDTO): Promise<Song> {
    return this.songsService.create(createSongDTO);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK) // Вказуємо, що при успішному оновленні буде повернуто статус 200
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDTO: UpdateSongDto,
  ): Promise<UpdateResult> {
    try {
      const result = await this.songsService.update(id, updateSongDTO);

      if (result.affected === 0) {
        // Якщо документ не знайдено, повертаємо помилку 404
        throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
      }

      // Повертаємо результат оновлення разом із статусом 200
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        // Якщо це HttpException, перекидаємо його далі
        throw error;
      }
      // Якщо це інша помилка, повертаємо помилку сервера
      throw new HttpException(
        'Server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.songsService.delete(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Якщо це HttpException, то просто перекидаємо її далі
      }
      // Якщо це інша помилка, обробляємо її як внутрішню помилку сервера
      throw new HttpException(
        'Server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
