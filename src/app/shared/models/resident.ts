export class Resident {
  houseNumber: string;
  residentNumber: string;
  expoToken: string

  constructor(houseNumber: string, residentNumber: string, expoToken: string) {
    this.houseNumber = houseNumber;
    this.residentNumber = residentNumber;
    this.expoToken = expoToken;
  }
}