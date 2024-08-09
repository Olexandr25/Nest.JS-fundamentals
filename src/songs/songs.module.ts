import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
// import { connection } from 'src/common/constants/connection';

// const mockSongsService = {
//   findAll: () => [{ id: 1, title: 'Test', artist: 'Test', album: 'Test' }],
// };

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
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
