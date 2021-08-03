export class Supervisor {
  superNum: string;
  expoToken: string;
  email: string

  constructor(superNum: string, expoToken: string, email: string) {
    this.superNum = superNum;
    this.expoToken = expoToken;
    this.email = email;
  }
}