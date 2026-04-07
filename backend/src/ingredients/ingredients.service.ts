import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientsRepository: Repository<Ingredient>,
  ) {}

  async create(createIngredientDto: Partial<Ingredient>): Promise<Ingredient> {
    const ingredient = this.ingredientsRepository.create(createIngredientDto);
    return await this.ingredientsRepository.save(ingredient);
  }

  async findAll(): Promise<Ingredient[]> {
    return await this.ingredientsRepository.find({
      order: {
        category: 'ASC',
        name: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<Ingredient | null> {
    return await this.ingredientsRepository.findOneBy({ id });
  }

  async findByCategory(category: string): Promise<Ingredient[]> {
    return await this.ingredientsRepository.findBy({ category });
  }

  async update(id: string, updateIngredientDto: Partial<Ingredient>): Promise<Ingredient | null> {
    await this.ingredientsRepository.update(id, updateIngredientDto);
    return await this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.ingredientsRepository.delete(id);
  }
}
