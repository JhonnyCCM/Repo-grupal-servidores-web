import type { ICategory } from '../value-objects.js'

export class Product {
  constructor(
    public id: string | number,
    public name: string,
    public description: string = '',
    public category: ICategory | string = '',
    public price: number = 0,
    public stock: number = 0,
    public rating: number = 0,
    public imageUrl: string = '',
    public isActive: boolean = true,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
