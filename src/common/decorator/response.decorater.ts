import { SetMetadata } from '@nestjs/common';

export const ResponseMassageKey = 'ResponseMassageKey';
export const ResponseMassage = (massage: string) =>
  SetMetadata(ResponseMassageKey, massage);
