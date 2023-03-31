import { ExternalClientStatus } from '../../../../common/enums/external-client-status.enum';

export class GetExistingSessionResponseDto {
  token: string;
  clientStatus: ExternalClientStatus;
}
