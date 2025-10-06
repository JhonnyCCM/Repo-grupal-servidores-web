import type { CompraItem } from '../value-objects.js'

export class Compra {
  constructor(
    public id: string,
    public buyerId: string,
    public items: CompraItem[],
  ) {}
}