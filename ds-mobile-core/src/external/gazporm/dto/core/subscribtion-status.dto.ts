export class SubscribtionStatusDto {
  items: Item[];
  count: number;
}

class Item {
  id: number;
  status: string;
  start_at: Date;
  expiration_at: Date;
  created_at: Date;
  updated_at: Date;
  refresh_at: Date;
  partner_user_id: string;
  promotion: {
    id: string;
    public_id: string;
  };
}
