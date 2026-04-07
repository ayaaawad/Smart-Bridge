import { DataSource, DataSourceOptions } from 'typeorm';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import { RecipeIngredient } from '../recipes/entities/recipe-ingredient.entity';

const dbPath = process.env.DATABASE_PATH || './data/smartbridge.db';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: dbPath,
  entities: [Ingredient, Recipe, RecipeIngredient],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
};

export const appDataSource = new DataSource(dataSourceOptions);
