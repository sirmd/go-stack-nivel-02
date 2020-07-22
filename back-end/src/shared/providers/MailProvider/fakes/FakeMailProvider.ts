import IMailProvide from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

interface IMessage {
  to: string;
  body: string;
}

export default class FakeMailProvider implements IMailProvide {
  private messages: ISendMailDTO[] = [];

  public async sendMail(message: ISendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}
