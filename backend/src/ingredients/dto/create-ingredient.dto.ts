export class CreateIngredientDto {
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: Date;
  category: string;
  bridgeLocation?: string;
}

export class UpdateIngredientDto {
  name?: string;
  quantity?: number;
  unit?: string;
  expiryDate?: Date;
  category?: string;
  bridgeLocation?: string;
}
