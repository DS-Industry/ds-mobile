export class CreateClientRequestDto {
  name: string;
  phone: string;
  correctPhone: string;
  email?: string;
  inn?: string;
  genderId?: string;
  clientTypeId: string;
  birthday?: string;
}
