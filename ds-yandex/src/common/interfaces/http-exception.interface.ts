export interface IHttpException {
  timestamp: Date;
  status: number;
  message: string;
  path: string;
}
