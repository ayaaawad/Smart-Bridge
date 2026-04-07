# SmartBridge Backend

Interactive Pantry Manager - Backend API built with NestJS, TypeORM, and SQLite.

## Project Structure

```
src/
├── database/              # Database configuration & setup
├── ingredients/           # Ingredients module
│   ├── entities/
│   │   └── ingredient.entity.ts
│   ├── ingredients.service.ts
│   └── ingredients.module.ts
├── recipes/               # Recipes module
│   ├── entities/
│   │   ├── recipe.entity.ts
│   │   └── recipe-ingredient.entity.ts
│   ├── recipes.service.ts
│   └── recipes.module.ts
├── app.module.ts
└── main.ts
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration (database path, port, etc.)

3. **Initialize database:**
   The database will be automatically created and synchronized when the app starts.

4. **Start the development server:**
   ```bash
   npm run start:dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm run start:prod
   ```

## Key Features Implemented

### Entities
- **Ingredient**: Name, quantity, unit, expiry date, category, bridge location
- **Recipe**: Title, description, image URL
- **RecipeIngredient**: Junction table linking recipes with required ingredients

### Services

#### IngredientsService
- CRUD operations for ingredients
- Filter by category
- Find all ingredients

#### RecipesService
- CRUD operations for recipes
- **`findMatchableRecipes(userInventory)`**: Returns recipes where user has ≥80% of required ingredients

## API Endpoints (Ready for Phase 2)

Will be implemented in next phase:
- `GET /ingredients` - List all ingredients
- `POST /ingredients` - Create ingredient
- `GET /recipes` - List all recipes
- `POST /recipes` - Create recipe
- `POST /recipes/matchable` - Get recipes matching user's inventory

## Database Schema

### Ingredients Table
```sql
id (UUID, PK)
name (VARCHAR)
quantity (DECIMAL)
unit (VARCHAR)
expiryDate (DATETIME)
category (VARCHAR)
bridgeLocation (VARCHAR)
createdAt (DATETIME)
updatedAt (DATETIME)
```

### Recipes Table
```sql
id (UUID, PK)
title (VARCHAR)
description (TEXT)
imageURL (VARCHAR)
createdAt (DATETIME)
updatedAt (DATETIME)
```

### Recipe Ingredients Table
```sql
id (UUID, PK)
recipeId (UUID, FK)
ingredientId (UUID, FK)
ingredientName (VARCHAR)
amountRequired (DECIMAL)
unit (VARCHAR)
```

## Development Scripts

- `npm run start:dev` - Start in watch mode
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:cov` - Generate coverage report

## Next Steps (Phase 2)

1. Create REST controllers for Ingredients and Recipes modules
2. Add DTOs (Data Transfer Objects)
3. Implement error handling and validation
4. Add API documentation (Swagger/OpenAPI)
5. Implement authentication & authorization
6. Add comprehensive tests

---

**SmartBridge** - Opening bridges to better meal planning! 🌉
