import { Location } from './location.dto';
import { Box } from './box.dto';
import { Price } from './price.dto';

export class Carwash {
  id: string;
  name: string;
  isActive: boolean;
  address: string;
  location: Location;
  boxes: Box[];
  price: Price[];
}
