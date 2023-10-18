import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Put,
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

  @Put('user-profile/update')
  @UseGuards(JwtAuthAccessGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/user-photos',
        filename: (req, file, callback) => {
          const name = v4();
          const ext = extname(file.originalname);
          const filename = name + ext;

          callback(null, filename);
        }
      })
    })
  )
  async updateUserProfile(
    @GetReqUser() reqUser: { user: UserDto; jti: string },
    @Body() updateUserProfile: UpdateUserProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 80000,
            message: 'Photo cannot exceed 80kb'
          }),
          new FileTypeValidator({
            fileType: /.(jpg|jpeg|png)$/
          })
        ]
      })
    )
    file: Express.Multer.File
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

  @Get('user-profile')
  @UseGuards(JwtAuthAccessGuard)
  async getUserProfile(@GetReqUser() reqUser: { user: UserDto; jti: string }) {
    let userDto: UserDto = null;

    try {
      userDto = await this.accountService.getUserProfile(reqUser.user.id);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get user profile');
    }

    return ResSuccessDtoFactory.create(userDto);
  }

  @Get('user-photos/:filename')
  getUserPhotoByFilename(
    @Param('filename') filename: string,
    @Res() res: Response
  ) {
    res.sendFile(filename, { root: './uploads/user-photos' });
  }
}
