export class SubscribtionStatusDto {
  items: Item[];
  count: number;

  constructor(items: Item[], count: number) {
    this.items = items;
    this.count = count;
  }
}

class Item {
  id: string;
  status: string;
  start_at: string;
  expiration_at: string;
  created_at: string;
  updated_at: string;
  refreshed_at: string;
  partner_user_id: string;
  promotion: {
    id: string;
    public_id: string;
  };
}
