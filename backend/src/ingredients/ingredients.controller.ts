import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto, UpdateIngredientDto } from './dto/create-ingredient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('ingredients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createIngredientDto: CreateIngredientDto, @Request() req) {
    return await this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  async findAll() {
    return await this.ingredientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ingredientsService.findById(id);
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    return await this.ingredientsService.findByCategory(category);
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return await this.ingredientsService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.ingredientsService.remove(id);
  }
}

