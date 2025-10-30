# Características de la Página Principal

## 🎨 Diseño Visual

### Layout Mobile-First
- **Max-width**: 600px (centrado en pantallas grandes)
- **Responsive Design**: Se adapta perfectamente a móvil, tablet y desktop
- **Gradiente de Fondo**: Transición suave de primary-50 a blanco

### Componentes Visuales

#### 1. Profile Header
- Foto de perfil circular de 120px
- Border blanco de 4px con sombra
- Nombre en tipografía bold 3xl/4xl
- Descripción opcional en gris 600
- Animación fade-in al cargar

#### 2. Social Buttons
- Botones circulares con gradientes de marca
- Iconos de: Instagram, TikTok, YouTube, Twitter, LinkedIn, Facebook
- Hover effect: scale 110% + sombra XL
- Transición suave de 300ms
- Animación slide-up al cargar

#### 3. Product Cards
- Grid responsivo: 1 columna (móvil) / 2 columnas (tablet+)
- Imagen aspect-square con zoom en hover
- Nombre, descripción (line-clamp-2) y precio
- Icono de enlace externo
- Shadow MD → XL en hover
- Scale 102% + translate -1px en hover
- Animación fade-in al cargar

#### 4. Content Cards
- Grid de 1 columna (full width)
- Preview automático de YouTube e Instagram
- Click para mostrar embed
- Icono del tipo de contenido (YouTube/Instagram)
- Badge "Click para vista previa" si tiene embed
- Transición suave al expandir

## 🔍 Funcionalidad de Búsqueda

### SearchBar Component
- Input con icono de lupa (Search icon)
- Placeholder personalizable
- Botón de limpiar (X) cuando hay texto
- Animaciones en hover
- Focus ring primary-500
- Shadow SM → MD en hover

### Búsqueda con Debounce
- **Delay**: 500ms
- **Filtrado Local**: Por nombre y descripción
- **Case Insensitive**: No distingue mayúsculas/minúsculas
- **Tracking**: Se registra cada búsqueda en BD después del debounce

### Búsquedas Independientes
- Búsqueda de productos separada de contenidos
- Cada sección mantiene su propio estado
- No hay interferencia entre secciones

## 📊 Sistema de Tracking (Analytics)

### Eventos Rastreados

#### 1. Page View
- **Cuándo**: Al cargar la página (useEffect en mount)
- **Datos**: userId
- **Endpoint**: POST /api/analytics/view
- **Base de Datos**: Tabla PageView

#### 2. Search Queries
- **Cuándo**: Después del debounce (500ms)
- **Datos**: userId, query, type (product/content)
- **Endpoint**: POST /api/analytics/search
- **Base de Datos**: Tabla SearchQuery

#### 3. Click Events
- **Cuándo**: Al hacer click en cualquier elemento
- **Tipos**: social, product, content
- **Datos**: userId, itemType, itemId
- **Endpoint**: POST /api/analytics/click
- **Base de Datos**: Tabla ClickEvent
- **Incrementa**: contador de views en Product/Content

### Hook useTracking
```typescript
const { trackPageView, trackClick, trackSearch } = useTracking({ userId });

// Track page view
trackPageView();

// Track click
trackClick('product', productId);
trackClick('content', contentId);
trackClick('social', socialLinkId);

// Track search
trackSearch(query, 'product');
trackSearch(query, 'content');
```

## 🎭 Loading States

### Skeleton Screens
- **SkeletonProfileHeader**: Header animado con pulse
- **SkeletonSocialButtons**: 3 círculos animados
- **SkeletonCard**: Cards genéricas con pulse animation

### Estados de Carga
1. **Inicial**: Skeleton mientras carga datos del servidor
2. **Búsqueda**: Sin skeleton, filtrado instantáneo
3. **Empty States**: Mensajes amigables cuando no hay resultados

## 🚀 Animaciones

### Keyframes Definidas
```css
@keyframes fadeIn - Opacidad 0 → 1
@keyframes slideUp - Desplazamiento Y+20 → 0 + Opacidad
@keyframes slideDown - Desplazamiento Y-20 → 0 + Opacidad
@keyframes scaleIn - Scale 0.9 → 1 + Opacidad
@keyframes pulse - Opacidad 1 → 0.5 → 1
```

### Clases de Animación
- `.animate-fade-in` - 0.6s ease-in
- `.animate-slide-up` - 0.6s ease-out
- `.animate-slide-down` - 0.6s ease-out
- `.animate-scale-in` - 0.4s ease-out

### Efectos Hover
- **Cards**: scale(1.02) + translateY(-1px) + shadow-xl
- **Social Buttons**: scale(1.1) + shadow-xl
- **Images**: scale(1.1) en hover

## 🔗 Manejo de Enlaces

### Enlaces Externos
- **target**: `_blank` (abre en nueva pestaña)
- **rel**: `noopener noreferrer` (seguridad)
- **onClick**: Tracking antes de navegar

### Preview de Contenido
- **YouTube**: iframe embed automático
- **Instagram**: blockquote con script embed
- **Click to Preview**: Primera acción muestra preview, segunda navega

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px (sm) - 1 columna
- **Tablet**: 640px+ (sm) - 2 columnas productos
- **Desktop**: 768px+ (md) - Mejor espaciado

### Grid System
```css
/* Productos */
grid-cols-1 sm:grid-cols-2

/* Contenidos */
grid-cols-1 (siempre full width)
```

## 🎨 Paleta de Colores

### Primary Colors
- **primary-50**: Fondo suave
- **primary-500**: Focus rings
- **primary-600**: Botones y precios
- **primary-700**: Hover states

### Neutral Colors
- **gray-50**: Backgrounds
- **gray-200**: Borders, skeletons
- **gray-400**: Icons inactive
- **gray-500**: Secondary text
- **gray-600**: Body text
- **gray-800**: Headings

### Social Brand Colors
- **Instagram**: purple-600 → pink-600
- **YouTube**: red-600 → red-700
- **TikTok**: black → gray-800
- **Twitter**: blue-400 → blue-600
- **LinkedIn**: blue-600 → blue-800
- **Facebook**: blue-500 → blue-700

## 🎯 Características de Accesibilidad

### Focus Visible
- Outline 2px solid primary-500
- Offset 2px
- Aplicado a todos los elementos focuseables

### Keyboard Navigation
- Todos los botones y enlaces son navegables
- Focus visible claro
- Tab order lógico

### Screen Readers
- Alt text en imágenes
- Title en enlaces
- Semantic HTML (section, h2, etc)

## 💾 Optimizaciones

### Imágenes
- Next.js Image component con lazy loading
- Fill + object-cover para aspect ratio
- Priority en foto de perfil

### Memoización
- useMemo para filtrado de productos
- useMemo para filtrado de contenidos
- useCallback en funciones de tracking

### Debouncing
- 500ms delay en búsquedas
- Reduce requests a la API
- Mejora performance

## 📝 Truncado de Texto

### Line Clamp Utilities
```css
.line-clamp-1 - 1 línea max
.line-clamp-2 - 2 líneas max
.line-clamp-3 - 3 líneas max
```

### Uso
- **Nombre Producto**: line-clamp-2
- **Descripción Producto**: line-clamp-2
- **Nombre Contenido**: line-clamp-1
- **Descripción Contenido**: line-clamp-2

## 🔒 Seguridad

### Enlaces Externos
- `rel="noopener"`: Previene window.opener hijacking
- `rel="noreferrer"`: No envía referrer header
- `target="_blank"`: Abre en nueva pestaña

### Tracking Asíncrono
- Try-catch en todas las requests
- Console.error para debugging
- No bloquea UI en caso de error

## 🚦 Estados de la UI

### Empty States
1. **No user/profile**: Welcome page con botón de login
2. **No products**: "No se encontraron productos"
3. **No contents**: "No se encontró contenido"
4. **No search results**: Mensaje específico por sección
5. **No data at all**: "No hay contenido disponible todavía"

### Loading States
1. **Initial load**: Suspense con skeleton screens
2. **Search**: Instant filter, no loading
3. **Navigation**: Browser default

## 📦 Componentes Reutilizables

### Hooks
- `useDebounce<T>` - Debouncing genérico
- `useTracking` - Analytics tracking

### Components
- `ProfileHeader` - Header con foto y info
- `SocialButtons` - Botones de redes sociales
- `SearchBar` - Input de búsqueda
- `ProductCard` - Card de producto
- `ContentCard` - Card de contenido
- `SkeletonCard` - Loading placeholder
- `ProfilePageClient` - Container principal

## 🎬 Flujo de Usuario

1. **Landing**: Usuario ve página principal
2. **Load**: Tracking de page view automático
3. **View**: Usuario ve profile header + social buttons
4. **Scroll**: Usuario explora productos y contenidos
5. **Search**: Usuario busca productos/contenidos (debounced tracking)
6. **Click Social**: Tracking + navegación a red social
7. **Click Product**: Tracking + incremento views + navegación
8. **Click Content**:
   - Primera vez: Muestra preview (YouTube/Instagram)
   - Segunda vez: Tracking + navegación

## 📈 Métricas Capturadas

### Por Usuario
- Total page views
- Productos más vistos
- Contenidos más vistos
- Redes sociales más clickeadas
- Búsquedas más frecuentes
- Términos de búsqueda populares

### Agregadas
- Views por día/semana/mes
- Click-through rate por item
- Search queries trending
- Conversion funnel

## 🎨 Customización

### Temas
Los colores están centralizados en Tailwind config:
```typescript
// tailwind.config.ts
colors: {
  primary: { ... }
}
```

### Animaciones
Las animaciones están en globals.css y son fáciles de modificar:
```css
@keyframes fadeIn { ... }
```

### Layout
Max-width de la página:
```typescript
// ProfilePageClient.tsx
<div className="max-w-2xl mx-auto">
```

## 🐛 Manejo de Errores

### Tracking Errors
- Try-catch en todos los tracking calls
- Console.error para debugging
- No afecta UX si falla

### Image Errors
- Next.js Image fallback automático
- Alt text siempre presente

### Search Errors
- Filtrado local, no puede fallar
- Empty state si no hay resultados

## 📱 Progressive Web App Ready

### Performance
- Server-side rendering (SSR)
- Static generation donde posible
- Image optimization automática
- Code splitting automático

### UX
- Smooth animations
- Instant feedback
- Loading states
- Error boundaries ready
