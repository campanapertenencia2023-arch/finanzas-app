# CLAUDE.md - FINANZAS SISTEMA

Guía para Claude Code trabajando en este repositorio.

## 📋 Descripción del Proyecto

**Sistema de Gestión Financiera** - Aplicación web moderna para registro, análisis y reporte de transacciones financieras. 

**Objetivo**: Proporcionar interfaz clara, usable y profesional para gestión de ingresos, egresos y análisis financiero.

## 🔧 Tech Stack

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Next.js** | 16.2.4 | Framework SSR/SSG |
| **React** | 19.2.4 | UI Components |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling (Dark theme) |
| **Framer Motion** | 12.38.0 | Animations |
| **Google Sheets API** | 171.4.0 | Data storage |
| **Lucide React** | 1.14.0 | Icons |

## 📁 Estructura de Carpetas

```
finanzas-app/
├── app/                      # App Router (Next.js 13+)
│   ├── page.tsx              # Dashboard principal
│   ├── layout.tsx            # Root layout + ErrorBoundary
│   ├── ingresos/page.tsx     # Página de ingresos
│   ├── egresos/page.tsx      # Página de egresos
│   ├── conceptos/page.tsx    # Gestión de conceptos
│   ├── reportes/page.tsx     # Página de reportes
│   ├── auth/
│   │   ├── login/page.tsx    # Login page
│   │   └── register/page.tsx # Register page
│   ├── api/
│   │   ├── auth/login/route.ts
│   │   ├── transacciones/route.ts
│   │   ├── conceptos/route.ts
│   │   ├── reportes/route.ts
│   │   └── resumen/route.ts
│   └── globals.css
├── components/
│   ├── Navigation.tsx        # Navbar
│   └── ui/                   # Componentes reutilizables
│       ├── Card.tsx          # Base card (3 variants)
│       ├── Button.tsx        # Botón (4 variants)
│       ├── Badge.tsx         # Status badges
│       ├── Table.tsx         # Tabla tipada
│       ├── FormInput.tsx     # Input/Textarea
│       ├── LoadingState.tsx  # Loader variants
│       └── ErrorBoundary.tsx # Error handler
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── theme.ts              # Design tokens & colors
│   ├── auth.ts               # Auth functions
│   ├── auth-context.tsx      # React Context
│   ├── google-sheets.ts      # Sheets integration
│   ├── utils.ts              # Utilities
│   └── supabase.ts           # Legacy
└── styles/
    └── globals.css           # Global styles
```

## 🎨 Temas y Colores

**Archivo**: `lib/theme.ts`

### Paleta
- **Primario**: `#3b82f6` (Blue)
- **Ingresos**: `#10b981` (Emerald)
- **Egresos**: `#dc2626` (Red)
- **Balance+**: `#06b6d4` (Cyan)
- **Fondo**: `#0f172a` (Slate-950)
- **Texto**: `#f1f5f9` (Slate-100)

### Componentes Reutilizables
- **Card**: `default` | `premium` (gradiente) | `elevated`
- **Button**: `primary` | `secondary` | `danger` | `success`
- **Badge**: `income` | `expense` | `balance` | `neutral`
- **Table**: Genérica con tipos `<T>`
- **LoadingState**: `spinner` | `skeleton` | `pulse`

## 🚀 Comandos Principales

```bash
# Development
npm run dev       # Hot-reload en http://localhost:3000

# Production
npm run build     # Build Next.js
npm start         # Servidor producción

# Linting
npm run lint      # ESLint check
```

## 🔐 Autenticación

**Sistema**: Google Sheets + localStorage

**Usuarios Demo**:
- `julian` / `paola123`
- `paola` / `julian123`

**Flujo**:
1. Login → Validación en Sheets
2. Token guardado en localStorage
3. AuthContext proporciona user global
4. Rutas protegidas redirigen si no hay user
5. Logout limpia storage y context

## 📊 API Routes

Todas las rutas esperan `usuario` (id del usuario) como parámetro:

```
GET  /api/transacciones?usuario=X&año=Y&tipo=ingreso|egreso
POST /api/transacciones                     # Create
GET  /api/conceptos?usuario=X&tipo=ingreso|egreso
POST /api/conceptos                         # Create
GET  /api/reportes?usuario=X&año=Y
GET  /api/resumen?usuario=X&año=Y
```

## 📝 Tipos TypeScript

Ver `lib/types.ts`:

```typescript
type Transaccion = {
  usuario: string;
  tipo: 'ingreso' | 'egreso';
  fecha: string;
  concepto: string;
  monto: number;
  año: number;
};

type ResumenConcepto = {
  concepto: string;
  ingresos: number;
  egresos: number;
  balance: number;
};

type ReporteAnalytics = {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  conceptosMasAltos: Array<{ concepto: string; monto: number; porcentaje: number }>;
};
```

## 🔧 Desarrollo

### Patrón de Componentes
```typescript
// UI Components: props tipados, sin lógica
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'elevated';
  className?: string;
}

// Pages: 'use client' + hooks + fetch
'use client';
export default function Page() {
  const [data, setData] = useState<Type[]>([]);
  useEffect(() => { /* fetch */ }, [dependencies]);
  return <Layout>content</Layout>;
}

// API Routes: typed requests/responses
export async function GET(req: NextRequest) {
  // validate query params
  // call lib functions
  return NextResponse.json<ApiResponse<T>>({ success, data });
}
```

### Convenciones
- Componentes: `PascalCase.tsx`
- Páginas: `page.tsx` en carpeta de ruta
- Funciones: `camelCase.ts`
- Tipos: `PascalCase` en `types.ts`
- Constantes: `UPPER_CASE`

## 🚢 Deployment

**Plataforma**: Vercel

**Configuración**:
1. Conectar repo GitHub en Vercel Dashboard
2. Set environment variables
3. Auto-deploy en cada push a `main`

**Variables de Entorno**:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GOOGLE_SHEETS_API_KEY
GOOGLE_SERVICE_ACCOUNT_EMAIL
```

## ✅ Estado del Proyecto

| Item | Status |
|------|--------|
| Dashboard | ✅ Completo |
| Ingresos/Egresos | ✅ CRUD funcional |
| Conceptos | ✅ Gestión completa |
| Reportes | ✅ Analytics básico |
| Autenticación | ✅ Google Sheets auth |
| Error Handling | ✅ Error Boundary global |
| Theme | ✅ Dark mode unificado |
| Deployment | ✅ Vercel ready |

## 📚 Documentación

- `README.md` — Guía usuario
- `lib/types.ts` — Tipos TypeScript
- `lib/theme.ts` — Diseño y colores
- `.claude/CLAUDE.md` — Este archivo

## 🐛 Debug Tips

```bash
# Build problems
rm -rf .next && npm run build

# Type errors
npx tsc --noEmit

# Linting
npm run lint --fix

# Dev reload
# Ctrl+R en navegador durante npm run dev
```

## 🚫 Temas NO Incluidos

Este proyecto es **exclusivamente financiero**. No incluye:
- ❌ Análisis político o territorial
- ❌ Gestión de líderes o estructuras
- ❌ Prospección estadística
- ❌ Análisis de riesgos
- ❌ Políticas o documentos normativos

Para esos temas, referir a otros proyectos.

## 📞 Contacto

**Cliente**: Usuario Finanzas
**Desarrollador**: Claude AI (Anthropic)
**Última actualización**: Mayo 2026
**Versión**: 2.0.0 (Production Ready)
