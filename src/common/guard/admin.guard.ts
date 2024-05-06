import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../common/auth/DTO/signin.dto';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return false;
    }

    return request.user.roles === UserRole.Admin;
  }
}
