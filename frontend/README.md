# SmartBridge Frontend

Interactive Pantry Manager Frontend built with Vue 3, Vite, Tailwind CSS, and Pinia.

## Project Structure

```
src/
├── components/                 # Reusable UI components
│   ├── InventoryDashboard.vue
│   ├── StatCard.vue
│   ├── ExpirationWarning.vue
│   ├── CategoryCard.vue
│   └── RecipeCard.vue
├── views/
│   └── BridgeDashboard.vue     # Main dashboard with bridge animation
├── stores/                     # Pinia state management
│   ├── inventory.js            # Ingredient inventory store
│   └── recipes.js              # Recipes store
├── composables/                # Reusable composition functions
├── App.vue                     # Root component
├── main.js                     # Entry point
└── style.css                   # Global styles (Tailwind)
```

## Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Features

### 🌉 Bridge Opening Animation
- Stylized bridge graphic that opens when button is clicked
- 3D perspective transforms for immersive effect
- Smooth transitions revealing inventory underneath
- Custom Tailwind animations

### 📦 Inventory Management
- View all ingredients organized by category
- Visual indicators for expiring items
- Display quantity, unit, expiry date, and location
- Category-based organization with emojis

### ⏰ Expiration Tracking
- Automatic detection of items expiring within 7 days
- Warning banner with days until expiry
- Color-coded indicators (yellow: expiring soon, red: expired)

### 👨‍🍳 Recipe Suggestions
- Display recipes you can make with current inventory
- 80% ingredient match algorithm
- Visual indicators showing which ingredients you have
- Emoji-based recipe representation

## State Management (Pinia)

### Inventory Store (`stores/inventory.js`)
- **State**: `ingredients`, `loading`, `error`
- **Computed**: `ingredientsByCategory`, `expiringItems`, `expiredItems`
- **Actions**: `fetchIngredients()`, `addIngredient()`, `removeIngredient()`

### Recipes Store (`stores/recipes.js`)
- **State**: `recipes`, `matchableRecipes`, `loading`, `error`
- **Actions**: `fetchRecipes()`, `findMatchableRecipes()`

## Styling

Using Tailwind CSS with custom bridge theme colors:
- Primary: Bridge blues (`from-bridge-600 to-bridge-500`)
- Gradients for stats cards (blue, yellow, purple, green)
- Custom animations for bridge opening
- Responsive grid layouts

## API Integration

The frontend proxies API calls to the backend:
- Backend: `http://localhost:3000`
- Frontend Dev: `http://localhost:5173`
- Proxy route: `/api/*` → `http://localhost:3000/*`

Currently using mock data for demo. Replace with real API calls when ready:

```javascript
// Example: Replace mock with real API
const response = await axios.get('/api/ingredients')
ingredients.value = response.data
```

## Next Steps

1. Connect to real backend API endpoints
2. Add user authentication
3. Implement ingredient add/edit/delete functionality
4. Create shopping list generation
5. Add recipe filtering and search
6. Implement user preferences and favorites

---

**SmartBridge** - Opening bridges to better meal planning! 🌉
