import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient, Ingredient])],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
