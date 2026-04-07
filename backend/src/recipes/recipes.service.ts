import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import {
  CreateRecipeDto,
  RecipeIngredientInputDto,
  UpdateRecipeDto,
} from './dto/create-recipe.dto';

type StarterIngredient = {
  ingredientName: string;
  amountRequired: number;
  unit: string;
  category: string;
};

type StarterRecipe = {
  title: string;
  description: string;
  imageURL: string;
  timeToComplete: number;
  instructions: string;
  ingredients: StarterIngredient[];
};

const STARTER_RECIPES: StarterRecipe[] = [
  {
    title: 'Classic Tomato Basil Pasta',
    description: 'Comfort pasta with fresh tomato sauce, basil, and parmesan.',
    imageURL: '🍝',
    timeToComplete: 25,
    instructions:
      'Boil pasta. Saute garlic in olive oil, add tomatoes, simmer, then toss with basil and parmesan.',
    ingredients: [
      { ingredientName: 'Pasta', amountRequired: 200, unit: 'grams', category: 'Grains' },
      { ingredientName: 'Tomato', amountRequired: 4, unit: 'pieces', category: 'Vegetables' },
      { ingredientName: 'Basil', amountRequired: 10, unit: 'grams', category: 'Vegetables' },
      { ingredientName: 'Parmesan', amountRequired: 60, unit: 'grams', category: 'Dairy' },
      { ingredientName: 'Olive Oil', amountRequired: 2, unit: 'tbsp', category: 'Condiments' },
    ],
  },
  {
    title: 'Garden Veggie Pizza',
    description: 'Crispy pizza topped with tomato sauce, mozzarella, and fresh vegetables.',
    imageURL: '🍕',
    timeToComplete: 35,
    instructions:
      'Spread sauce on dough, top with mozzarella, peppers, onions, and olives, then bake until golden.',
    ingredients: [
      { ingredientName: 'Pizza Dough', amountRequired: 1, unit: 'piece', category: 'Grains' },
      { ingredientName: 'Tomato Sauce', amountRequired: 120, unit: 'ml', category: 'Condiments' },
      { ingredientName: 'Mozzarella', amountRequired: 150, unit: 'grams', category: 'Dairy' },
      { ingredientName: 'Bell Pepper', amountRequired: 1, unit: 'piece', category: 'Vegetables' },
      { ingredientName: 'Onion', amountRequired: 1, unit: 'piece', category: 'Vegetables' },
      { ingredientName: 'Olives', amountRequired: 40, unit: 'grams', category: 'Condiments' },
    ],
  },
  {
    title: 'Mediterranean Salad Bowl',
    description: 'Fresh salad with cucumber, tomato, feta, and lemon dressing.',
    imageURL: '🥗',
    timeToComplete: 15,
    instructions:
      'Chop vegetables, add feta and olives, whisk olive oil with lemon juice, then toss everything together.',
    ingredients: [
      { ingredientName: 'Lettuce', amountRequired: 1, unit: 'head', category: 'Vegetables' },
      { ingredientName: 'Cucumber', amountRequired: 1, unit: 'piece', category: 'Vegetables' },
      { ingredientName: 'Tomato', amountRequired: 2, unit: 'pieces', category: 'Vegetables' },
      { ingredientName: 'Feta Cheese', amountRequired: 100, unit: 'grams', category: 'Dairy' },
      { ingredientName: 'Lemon', amountRequired: 1, unit: 'piece', category: 'Fruits' },
      { ingredientName: 'Olive Oil', amountRequired: 2, unit: 'tbsp', category: 'Condiments' },
    ],
  },
  {
    title: 'Chicken Fried Rice',
    description: 'Fast stir-fry rice with chicken, vegetables, and soy sauce.',
    imageURL: '🍚',
    timeToComplete: 28,
    instructions:
      'Cook chicken, stir-fry vegetables, add rice and soy sauce, then toss in scrambled egg for texture.',
    ingredients: [
      { ingredientName: 'Chicken Breast', amountRequired: 250, unit: 'grams', category: 'Proteins' },
      { ingredientName: 'Cooked Rice', amountRequired: 2, unit: 'cups', category: 'Grains' },
      { ingredientName: 'Carrot', amountRequired: 1, unit: 'piece', category: 'Vegetables' },
      { ingredientName: 'Peas', amountRequired: 80, unit: 'grams', category: 'Vegetables' },
      { ingredientName: 'Egg', amountRequired: 2, unit: 'pieces', category: 'Proteins' },
      { ingredientName: 'Soy Sauce', amountRequired: 2, unit: 'tbsp', category: 'Condiments' },
    ],
  },
  {
    title: 'Creamy Mushroom Soup',
    description: 'Warm and creamy mushroom soup with garlic and herbs.',
    imageURL: '🍲',
    timeToComplete: 30,
    instructions:
      'Saute mushrooms and onion, add broth, simmer, blend partially, then finish with cream.',
    ingredients: [
      { ingredientName: 'Mushroom', amountRequired: 300, unit: 'grams', category: 'Vegetables' },
      { ingredientName: 'Onion', amountRequired: 1, unit: 'piece', category: 'Vegetables' },
      { ingredientName: 'Garlic', amountRequired: 2, unit: 'cloves', category: 'Vegetables' },
      { ingredientName: 'Vegetable Broth', amountRequired: 500, unit: 'ml', category: 'Condiments' },
      { ingredientName: 'Cream', amountRequired: 120, unit: 'ml', category: 'Dairy' },
    ],
  },
  {
    title: 'Classic Beef Burger',
    description: 'Juicy beef burger with lettuce, tomato, and melted cheese.',
    imageURL: '🍔',
    timeToComplete: 22,
    instructions:
      'Season and grill beef patty, toast bun, assemble with cheese, lettuce, tomato, and onion.',
    ingredients: [
      { ingredientName: 'Burger Bun', amountRequired: 1, unit: 'piece', category: 'Grains' },
      { ingredientName: 'Ground Beef', amountRequired: 180, unit: 'grams', category: 'Proteins' },
      { ingredientName: 'Cheddar Cheese', amountRequired: 1, unit: 'slice', category: 'Dairy' },
      { ingredientName: 'Lettuce', amountRequired: 2, unit: 'leaves', category: 'Vegetables' },
      { ingredientName: 'Tomato', amountRequired: 2, unit: 'slices', category: 'Vegetables' },
      { ingredientName: 'Onion', amountRequired: 2, unit: 'slices', category: 'Vegetables' },
    ],
  },
  {
    title: 'Club Sandwich',
    description: 'Triple-layer sandwich with chicken, lettuce, and tomato.',
    imageURL: '🥪',
    timeToComplete: 15,
    instructions:
      'Toast bread, layer chicken, lettuce, tomato, and mayo, then slice into triangles.',
    ingredients: [
      { ingredientName: 'Bread', amountRequired: 3, unit: 'slices', category: 'Grains' },
      { ingredientName: 'Chicken Breast', amountRequired: 120, unit: 'grams', category: 'Proteins' },
      { ingredientName: 'Lettuce', amountRequired: 3, unit: 'leaves', category: 'Vegetables' },
      { ingredientName: 'Tomato', amountRequired: 3, unit: 'slices', category: 'Vegetables' },
      { ingredientName: 'Mayonnaise', amountRequired: 1, unit: 'tbsp', category: 'Condiments' },
    ],
  },
  {
    title: 'Vanilla Celebration Cake',
    description: 'Soft vanilla cake with creamy frosting.',
    imageURL: '🎂',
    timeToComplete: 55,
    instructions:
      'Mix batter ingredients, bake until set, cool completely, then frost and serve.',
    ingredients: [
      { ingredientName: 'Flour', amountRequired: 250, unit: 'grams', category: 'Grains' },
      { ingredientName: 'Sugar', amountRequired: 180, unit: 'grams', category: 'Condiments' },
      { ingredientName: 'Egg', amountRequired: 3, unit: 'pieces', category: 'Proteins' },
      { ingredientName: 'Milk', amountRequired: 180, unit: 'ml', category: 'Dairy' },
      { ingredientName: 'Butter', amountRequired: 120, unit: 'grams', category: 'Dairy' },
    ],
  },
  {
    title: 'Sweet Breakfast Crepes',
    description: 'Thin French-style crepes with fruit and honey.',
    imageURL: '🥞',
    timeToComplete: 20,
    instructions:
      'Whisk batter, rest briefly, cook thin layers in a pan, then fill with fruit and drizzle honey.',
    ingredients: [
      { ingredientName: 'Flour', amountRequired: 140, unit: 'grams', category: 'Grains' },
      { ingredientName: 'Milk', amountRequired: 220, unit: 'ml', category: 'Dairy' },
      { ingredientName: 'Egg', amountRequired: 2, unit: 'pieces', category: 'Proteins' },
      { ingredientName: 'Butter', amountRequired: 20, unit: 'grams', category: 'Dairy' },
      { ingredientName: 'Honey', amountRequired: 2, unit: 'tbsp', category: 'Condiments' },
    ],
  },
  {
    title: 'Berry Yogurt Parfait',
    description: 'Layered yogurt, berries, and crunchy granola.',
    imageURL: '🍨',
    timeToComplete: 8,
    instructions:
      'Layer yogurt, berries, and granola in a glass and serve chilled.',
    ingredients: [
      { ingredientName: 'Yogurt', amountRequired: 200, unit: 'grams', category: 'Dairy' },
      { ingredientName: 'Strawberry', amountRequired: 80, unit: 'grams', category: 'Fruits' },
      { ingredientName: 'Blueberry', amountRequired: 60, unit: 'grams', category: 'Fruits' },
      { ingredientName: 'Granola', amountRequired: 50, unit: 'grams', category: 'Grains' },
    ],
  },
  {
    title: 'Banana Oat Smoothie',
    description: 'Creamy smoothie with banana, oats, and milk.',
    imageURL: '🥤',
    timeToComplete: 5,
    instructions:
      'Blend banana, oats, milk, and honey until smooth.',
    ingredients: [
      { ingredientName: 'Banana', amountRequired: 1, unit: 'piece', category: 'Fruits' },
      { ingredientName: 'Oats', amountRequired: 40, unit: 'grams', category: 'Grains' },
      { ingredientName: 'Milk', amountRequired: 250, unit: 'ml', category: 'Dairy' },
      { ingredientName: 'Honey', amountRequired: 1, unit: 'tbsp', category: 'Condiments' },
    ],
  },
];

@Injectable()
export class RecipesService implements OnModuleInit {
  private readonly logger = new Logger(RecipesService.name);

  constructor(
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private recipeIngredientsRepository: Repository<RecipeIngredient>,
    @InjectRepository(Ingredient)
    private ingredientsRepository: Repository<Ingredient>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedStarterRecipes();
  }

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe = this.recipesRepository.create({
      title: createRecipeDto.title,
      description: createRecipeDto.description,
      imageURL: createRecipeDto.imageURL ?? null,
      timeToComplete: createRecipeDto.timeToComplete ?? 30,
      instructions: createRecipeDto.instructions ?? null,
    });

    if (createRecipeDto.recipeIngredients?.length) {
      recipe.recipeIngredients = await this.buildRecipeIngredients(
        createRecipeDto.recipeIngredients,
      );
    }

    return await this.recipesRepository.save(recipe);
  }

  async findAll(): Promise<Recipe[]> {
    return await this.recipesRepository.find({
      relations: ['recipeIngredients'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: string): Promise<Recipe | null> {
    return await this.recipesRepository.findOne({
      where: { id },
      relations: ['recipeIngredients'],
    });
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe | null> {
    const recipe = await this.findById(id);

    if (!recipe) {
      return null;
    }

    if (updateRecipeDto.title !== undefined) {
      recipe.title = updateRecipeDto.title;
    }

    if (updateRecipeDto.description !== undefined) {
      recipe.description = updateRecipeDto.description;
    }

    if (updateRecipeDto.imageURL !== undefined) {
      recipe.imageURL = updateRecipeDto.imageURL;
    }

    if (updateRecipeDto.timeToComplete !== undefined) {
      recipe.timeToComplete = updateRecipeDto.timeToComplete;
    }

    if (updateRecipeDto.instructions !== undefined) {
      recipe.instructions = updateRecipeDto.instructions;
    }

    if (updateRecipeDto.recipeIngredients !== undefined) {
      recipe.recipeIngredients = await this.buildRecipeIngredients(
        updateRecipeDto.recipeIngredients,
      );
    }

    return await this.recipesRepository.save(recipe);
  }

  async remove(id: string): Promise<void> {
    await this.recipesRepository.delete(id);
  }

  private async seedStarterRecipes(): Promise<void> {
    for (const recipeSeed of STARTER_RECIPES) {
      const existingRecipe = await this.recipesRepository
        .createQueryBuilder('recipe')
        .where('LOWER(recipe.title) = LOWER(:title)', { title: recipeSeed.title })
        .getOne();

      if (existingRecipe) {
        continue;
      }

      const seededIngredients: RecipeIngredient[] = [];

      for (const ingredientSeed of recipeSeed.ingredients) {
        const ingredient = await this.findOrCreateIngredient(ingredientSeed);

        seededIngredients.push(
          this.recipeIngredientsRepository.create({
            ingredientId: ingredient.id,
            ingredientName: ingredient.name,
            amountRequired: ingredientSeed.amountRequired,
            unit: ingredientSeed.unit,
          }),
        );
      }

      const recipe = this.recipesRepository.create({
        title: recipeSeed.title,
        description: recipeSeed.description,
        imageURL: recipeSeed.imageURL,
        timeToComplete: recipeSeed.timeToComplete,
        instructions: recipeSeed.instructions,
        recipeIngredients: seededIngredients,
      });

      await this.recipesRepository.save(recipe);
      this.logger.log(`Seeded starter recipe: ${recipeSeed.title}`);
    }
  }

  private async findOrCreateIngredient(seed: StarterIngredient): Promise<Ingredient> {
    const existingIngredient = await this.ingredientsRepository
      .createQueryBuilder('ingredient')
      .where('LOWER(ingredient.name) = LOWER(:name)', { name: seed.ingredientName })
      .getOne();

    if (existingIngredient) {
      return existingIngredient;
    }

    const ingredient = this.ingredientsRepository.create({
      name: seed.ingredientName,
      quantity: 0,
      unit: seed.unit,
      expiryDate: null,
      category: seed.category,
      bridgeLocation: 'Starter Pantry',
      icon: null,
      adminOnly: true,
    });

    return await this.ingredientsRepository.save(ingredient);
  }

  private async resolveIngredientInput(
    ingredientInput: RecipeIngredientInputDto,
  ): Promise<Ingredient> {
    if (ingredientInput.ingredientId) {
      const linkedIngredient = await this.ingredientsRepository.findOneBy({
        id: ingredientInput.ingredientId,
      });

      if (linkedIngredient) {
        return linkedIngredient;
      }
    }

    return await this.findOrCreateIngredient({
      ingredientName: ingredientInput.ingredientName,
      amountRequired: ingredientInput.amountRequired,
      unit: ingredientInput.unit,
      category: 'Pantry',
    });
  }

  private async buildRecipeIngredients(
    ingredients: RecipeIngredientInputDto[],
  ): Promise<RecipeIngredient[]> {
    const mappedIngredients: RecipeIngredient[] = [];

    for (const ingredientInput of ingredients) {
      const ingredient = await this.resolveIngredientInput(ingredientInput);

      mappedIngredients.push(
        this.recipeIngredientsRepository.create({
          ingredientId: ingredient.id,
          ingredientName: ingredientInput.ingredientName,
          amountRequired: ingredientInput.amountRequired,
          unit: ingredientInput.unit,
        }),
      );
    }

    return mappedIngredients;
  }

  /**
   * Finds recipes where the user has at least 80% of the required ingredients.
   * 
   * @param userInventory Array of ingredients the user has in their pantry
   * @returns Array of recipes that match the 80% threshold
   */
  async findMatchableRecipes(userInventory: Ingredient[]): Promise<Recipe[]> {
    // Get all recipes with their required ingredients
    const allRecipes = await this.findAll();

    // Create a map of ingredient names to quantities for easy lookup
    const inventoryMap = new Map<string, number>();
    userInventory.forEach((ingredient) => {
      inventoryMap.set(ingredient.name.toLowerCase(), ingredient.quantity);
    });

    // Filter recipes based on the 80% ingredient match threshold
    const matchableRecipes = allRecipes.filter((recipe) => {
      if (!recipe.recipeIngredients || recipe.recipeIngredients.length === 0) {
        return true; // Recipes with no required ingredients are always matchable
      }

      const requiredIngredientsCount = recipe.recipeIngredients.length;
      let matchedIngredientsCount = 0;

      // Count how many required ingredients the user has
      recipe.recipeIngredients.forEach((recipeIngredient) => {
        const userHasIngredient = inventoryMap.has(recipeIngredient.ingredientName.toLowerCase());
        if (userHasIngredient) {
          matchedIngredientsCount++;
        }
      });

      // Calculate match percentage
      const matchPercentage = (matchedIngredientsCount / requiredIngredientsCount) * 100;

      // Return recipes with at least 80% match
      return matchPercentage >= 80;
    });

    return matchableRecipes;
  }
}
