import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { JwtAuthAccessGuard } from 'src/app/guards';
import { IAccountService, accountServiceToken } from '../services';
import { ResErrorDtoFactory, ResSuccessDtoFactory, UserDto } from 'src/app/dto';
import { Response } from 'express';
import { UpdateUserProfileDto } from '../dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 } from 'uuid';
import { GetReqUser } from 'src/app/decorators';

@Controller({ path: 'account', version: '1' })
export class AccountController {
  constructor(
    @Inject(accountServiceToken)
    private readonly accountService: IAccountService
  ) {}

  @Post('update-user-profile')
  @UseGuards(JwtAuthAccessGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/user-profiles',
        filename: (req, file, callback) => {
          const name = v4();
          const ext = extname(file.originalname);
          const filename = name + ext;

          callback(null, filename);
        }
      })
    })
  )
  async userProfile(
    @GetReqUser() reqUser: { user: UserDto; jti: string },
    @Body() updateUserProfile: UpdateUserProfileDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    let userDto: UserDto = null;
    try {
      userDto = await this.accountService.updateUserProfile(
        reqUser.user.id,
        updateUserProfile,
        file
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to update user profile');
    }

    return ResSuccessDtoFactory.create(userDto);
  }

  @Get('user-photos/:filename')
  getUserPhotoByFilename(
    @Param('filename') filename: string,
    @Res() res: Response
  ) {
    res.sendFile(filename, { root: './uploads/user-profiles' });
  }
}
