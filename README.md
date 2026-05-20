# 💰 Finanzas App - Sistema de Gestión Financiera

Aplicación web moderna para gestión, seguimiento y análisis de finanzas personales e institucionales. Construida con **Next.js 16**, **React 19**, **TypeScript** y **Google Sheets API**.

## 🎯 Características Principales

### Dashboard Inteligente
- **KPI Cards**: Visualización clara de ingresos, egresos y balance
- **Período Flexible**: Selector de año con navegación fácil
- **Tabla Analítica**: Desglose por concepto con proporciones
- **Tema Oscuro**: Interfaz moderna y relajante para los ojos

### Gestión de Transacciones
- **Ingresos**: Registro, clasificación y análisis de ingresos
- **Egresos**: Control detallado de gastos por categoría
- **Conceptos**: Sistema flexible de categorías (CRUD)
- **Filtrado Avanzado**: Búsqueda por período, tipo y concepto

### Reportes y Análisis
- **Estadísticas Globales**: Totales, promedios, proporciones
- **Top Categorías**: Las 5 categorías con mayor movimiento
- **Evolución Temporal**: Gráficos de tendencia
- **Análisis Comparativo**: Comparación entre períodos

### Seguridad y Autenticación
- **Auth Context**: Sistema de autenticación robusto
- **Protección de Rutas**: Páginas protegidas por usuario
- **Error Boundaries**: Manejo global de errores React
- **Validación Tipada**: TypeScript en 100% del código

## 🏗️ Arquitectura

```
finanzas-app/
├── app/
│   ├── layout.tsx           # Root layout con ErrorBoundary
│   ├── page.tsx             # Dashboard principal
│   ├── ingresos/            # Gestión de ingresos
│   ├── egresos/             # Gestión de egresos
│   ├── conceptos/           # Gestión de categorías
│   ├── reportes/            # Análisis y reportes
│   ├── auth/                # Autenticación (login/register)
│   └── api/                 # API Routes
│       ├── transacciones/   # CRUD de transacciones
│       ├── conceptos/       # CRUD de conceptos
│       ├── reportes/        # Endpoint de análisis
│       ├── resumen/         # Endpoint de resumen
│       └── auth/            # Autenticación
├── components/
│   ├── Navigation.tsx       # Navbar principal
│   └── ui/                  # Componentes reutilizables
│       ├── Card.tsx         # Card base (3 variantes)
│       ├── Table.tsx        # Tabla tipada genérica
│       ├── Button.tsx       # Botón (4 variantes)
│       ├── Badge.tsx        # Badges de estado
│       ├── FormInput.tsx    # Input/Textarea
│       ├── LoadingState.tsx # Skeleton/Spinner/Pulse
│       └── ErrorBoundary.tsx# Error handling
├── lib/
│   ├── types.ts             # TypeScript interfaces
│   ├── theme.ts             # Constantes de diseño
│   ├── auth.ts              # Funciones de autenticación
│   ├── auth-context.tsx     # React Context para auth
│   ├── google-sheets.ts     # API Google Sheets
│   ├── utils.ts             # Utilidades (formateo, etc)
│   └── supabase.ts          # Legacy (referencia)
└── styles/
    └── globals.css          # Estilos globales
```

## 🚀 Instalación y Setup

### Requisitos
- Node.js 18+
- npm o yarn
- Google Cloud Service Account (para Google Sheets)
- Vercel Account (para deploy)

### Pasos de Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/tuusuario/finanzas-app.git
cd finanzas-app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env.local con variables necesarias

# 4. Ejecutar en desarrollo
npm run dev

# 5. Visitar en navegador
# http://localhost:3000
```

## 📊 API Routes

### Transacciones
```
GET  /api/transacciones?usuario=X&año=Y&tipo=ingreso|egreso
POST /api/transacciones
DELETE /api/transacciones?id=X
```

### Conceptos
```
GET  /api/conceptos?usuario=X&tipo=ingreso|egreso
POST /api/conceptos
```

### Reportes
```
GET /api/reportes?usuario=X&año=Y
```

### Resumen
```
GET /api/resumen?usuario=X&año=Y
```

## 🎨 Diseño y Tema

### Paleta de Colores
- **Primario**: Blue 500 (#3b82f6)
- **Ingresos**: Emerald 600 (#10b981)
- **Egresos**: Red 600 (#dc2626)
- **Balance Positivo**: Cyan 600 (#06b6d4)
- **Fondo**: Slate 950 (#0f172a)
- **Texto**: Slate 100 (#f1f5f9)

### Componentes UI
- **Card**: Default, Premium, Elevated
- **Button**: Primary, Secondary, Danger, Success
- **Badge**: Income, Expense, Balance, Neutral
- **Table**: Genérica y tipada
- **LoadingState**: Spinner, Skeleton, Pulse

## 🔐 Autenticación

### Usuarios Demo
- Usuario: `julian` | Contraseña: `paola123`
- Usuario: `paola` | Contraseña: `julian123`

### Flujo de Auth
1. Login con validación en Google Sheets
2. AuthContext proporciona usuario global
3. Rutas protegidas redirigen sin usuario
4. Logout limpia localStorage

## 🔧 Desarrollo

### Scripts
```bash
npm run dev       # Hot-reload development
npm run build     # Production build
npm start         # Start prod server
npm run lint      # Lint con ESLint
```

## 🚢 Deployment

### Vercel
```bash
git push origin main
# Auto-deploy desde GitHub
```

## 🐛 Troubleshooting

### Build falla
```bash
rm -rf .next node_modules
npm install && npm run build
```

### Problemas de autenticación
- Borrar localStorage en DevTools
- Verificar credenciales en Google Sheets
- Revisar variables de entorno

## 📄 Licencia

MIT License

---

**Última actualización**: Mayo 2026
**Estado**: ✅ Production Ready
**Versión**: 2.0.0
