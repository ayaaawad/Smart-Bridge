import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RecipeIngredient } from './recipe-ingredient.entity';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageURL: string | null;

  @Column({ type: 'integer', default: 30 })
  timeToComplete: number; // in minutes

  @Column({ type: 'text', nullable: true })
  instructions: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe, {
    eager: true,
    cascade: true,
  })
  recipeIngredients: RecipeIngredient[];
}
