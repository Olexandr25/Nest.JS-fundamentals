import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from 'src/artists/artist.entity';
import { Song } from './song.entity';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
// import { connection } from 'src/common/constants/connection';

// const mockSongsService = {
//   findAll: () => [{ id: 1, title: 'Test', artist: 'Test', album: 'Test' }],
// };

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist])],
  controllers: [SongsController],
  providers: [
    SongsService,
    // * #1
    // {
    //   provide: SongsService,
    //   useClass: SongsService,
    // },
    // * #2
    // {
    //   provide: SongsService,
    //   useValue: mockSongsService,
    // },
    // * #3
    // {
    //   provide: 'CONNECTION',
    //   useValue: connection,
    // },
  ],
})
export class SongsModule {}
