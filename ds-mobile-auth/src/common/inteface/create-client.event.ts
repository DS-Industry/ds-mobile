export interface ICreateClientEvent {
  name: string;
  phone: string;
  correctPhone: string;
  email?: string;
  inn?: string;
  genderId?: string;
  clientTypeId: number;
  birthday?: string;
  isTermsAccepted: number;
  isLetterAccepted: number;
}
