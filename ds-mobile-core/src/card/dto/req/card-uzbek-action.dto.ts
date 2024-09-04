import {IsDefined, IsString} from "class-validator";

export class CardUzbekActionDto{
    @IsString()
    @IsDefined()
    accessToken: string;
    @IsString()
    @IsDefined()
    code: string;
    @IsString()
    @IsDefined()
    devNumber: string;
}