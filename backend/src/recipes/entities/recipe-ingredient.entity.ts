import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Recipe } from './recipe.entity';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  recipeId: string;

  @Column({ type: 'uuid', nullable: false })
  ingredientId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  ingredientName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amountRequired: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  unit: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @ManyToOne(() => Ingredient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;
}
