export class RecipeIngredientInputDto {
  ingredientId?: string;
  ingredientName: string;
  amountRequired: number;
  unit: string;
}

export class CreateRecipeDto {
  title: string;
  description: string;
  imageURL?: string;
  timeToComplete?: number;
  instructions?: string;
  recipeIngredients?: RecipeIngredientInputDto[];
}

export class UpdateRecipeDto {
  title?: string;
  description?: string;
  imageURL?: string;
  timeToComplete?: number;
  instructions?: string;
  recipeIngredients?: RecipeIngredientInputDto[];
}
