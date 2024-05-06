import { Body, Controller, Post } from '@nestjs/common';
import { ResponseMassage } from 'src/common/decorator/response.decorater';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninDTO } from './DTO/signin.dto';
import { Public } from './auth.decorator';
import * as SUCCESS_MASSAGE from '../../utils/constans/sucessMassage';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @Public()
  @ResponseMassage(SUCCESS_MASSAGE.SIGNIN)
  @ApiBody({ type: SigninDTO })
  signIn(@Body() signinData: SigninDTO) {
    return this.authService.signin(signinData);
  }
}
