export class Plan {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number,
    public durationInMonths: number,
    public features: string[],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public isActive: boolean = false,
  ) {}
}