import { ExternalClientStatus } from '../../../../common/enums/external-client-status.enum';

export class CreateGazpromClientResponseDto {
  token: string;
  clientStatus: ExternalClientStatus;
}
