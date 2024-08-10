import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artist.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './song.entity';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}
  private readonly songs = [];

  async pagination(options: IPaginationOptions): Promise<Pagination<Song>> {
    // Adding query builder
    // If you need to add query builder you can add it here
    const queryBuilder = this.songsRepository.createQueryBuilder('song');
    queryBuilder.orderBy('song.releaseDate', 'DESC');

    return await paginate<Song>(queryBuilder, options);
  }

  async create(songDTO: CreateSongDTO): Promise<Song> {
    const song = new Song();

    song.title = songDTO.title;
    song.artists = songDTO.artists;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releaseDate = songDTO.releaseDate;

    console.log(songDTO.artists);

    // * #1
    // find all the artists on the based on ids
    const artists = await this.artistsRepository.findByIds(songDTO.artists);
    // * #2
    // set the relation with artist and songs
    song.artists = artists;

    return await this.songsRepository.save(song);
  }

  findAll(): Promise<Song[]> {
    return this.songsRepository.find();
  }

  async findOne(id: number): Promise<Song | null> {
    const song = await this.songsRepository.findOneBy({ id });
    return song || null;
  }

  async update(
    id: number,
    recordToUpdate: UpdateSongDto,
  ): Promise<UpdateResult> {
    const cleanRecord = Object.fromEntries(
      Object.entries(recordToUpdate).filter(
        ([, v]) => v !== undefined && v !== null,
      ),
    );

    const result = await this.songsRepository.update(id, cleanRecord);

    if (result.affected === 0) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async delete(id: number): Promise<void> {
    const deleteResult = await this.songsRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
  }
}
