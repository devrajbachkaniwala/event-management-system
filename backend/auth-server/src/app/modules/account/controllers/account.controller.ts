import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthAccessGuard } from 'src/app/guards';
import { IAccountService, accountServiceToken } from '../services';
import { ResErrorDtoFactory, ResSuccessDtoFactory, UserDto } from 'src/app/dto';
import { Request } from 'express';
import { UpdateUserProfileDto } from '../dto';

@Controller({ path: 'account', version: '1' })
export class AccountController {
  constructor(
    @Inject(accountServiceToken)
    private readonly accountService: IAccountService
  ) {}

  @Post('update-user-profile')
  @UseGuards(JwtAuthAccessGuard)
  async userProfile(
    @Req() req: Request,
    @Body() updateUserProfile: UpdateUserProfileDto
  ) {
    let userDto: UserDto = null;
    try {
      const user = req.user as typeof req.user & { user: UserDto };
      userDto = await this.accountService.updateUserProfile(
        user.user?.id,
        updateUserProfile
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to update user profile');
    }

    return ResSuccessDtoFactory.create(userDto);
  }
}
