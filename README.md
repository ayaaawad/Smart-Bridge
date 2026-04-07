# SmartBridge - Interactive Pantry Manager

A full-stack application that helps users manage their pantry inventory and discover recipes based on available ingredients.

## Project Structure

```
smart-bridge/
├── backend/          # NestJS Backend API
│   ├── src/
│   │   ├── database/
│   │   ├── ingredients/
│   │   ├── recipes/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── frontend/         # Vue 3 + Vite Frontend (Phase 2)
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.vue
    └── package.json
```

## Getting Started

### Backend (Phase 1) ✅
```bash
cd backend
npm install
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Frontend (Phase 2)
Coming soon with Vue 3, Vite, Pinia, and Tailwind CSS.

## Key Features

### Phase 1: Backend ✅
- ✅ NestJS with TypeScript
- ✅ SQLite database with TypeORM
- ✅ Ingredient management
- ✅ Recipe management with ingredient relationships
- ✅ **Smart recipe matching**: Finds recipes where user has ≥80% of required ingredients

### Planned Features (Phase 2+)
- Vue 3 frontend with Vite
- State management with Pinia
- Tailwind CSS styling
- User authentication
- Real-time inventory tracking
- Recipe filtering & sorting
- Shopping list generation

## Technology Stack

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: SQLite + TypeORM
- **Node.js**: 18+

### Frontend (Upcoming)
- **Framework**: Vue 3
- **Build Tool**: Vite
- **State Management**: Pinia
- **Styling**: Tailwind CSS

## License

MIT

---

**SmartBridge** - Opening bridges to better meal planning! 🌉
