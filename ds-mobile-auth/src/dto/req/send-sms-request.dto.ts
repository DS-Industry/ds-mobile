export class SendSmsRequestDto {
  messages: [
    {
      recipient: string;
      'message-id': string;
      sms: {
        originator: string;
        context: {
          text: string;
        };
      };
    },
  ];
}
