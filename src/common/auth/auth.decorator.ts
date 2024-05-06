import { SetMetadata } from '@nestjs/common';
import { AUTH_IS_PUBLIC_KEY } from 'src/utils/constans';

export const Public = () => SetMetadata(AUTH_IS_PUBLIC_KEY, true);
