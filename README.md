# Link in Bio - Aplicación Web

Una aplicación web completa de "Link in Bio" construida con Next.js 14+, TypeScript, Tailwind CSS y Prisma con SQLite.

## Características

- 🔐 **Autenticación**: Sistema de login con NextAuth.js
- 📊 **Analytics**: Tracking de visitas, clics y búsquedas
- 🎨 **Diseño Responsivo**: Totalmente adaptable con Tailwind CSS
- 📱 **Perfiles Personalizables**: Foto, descripción y enlaces sociales
- 🛍️ **Productos**: Showcase de productos con imágenes y precios
- 🔗 **Enlaces**: Gestión de contenido y enlaces
- 📈 **Dashboard Admin**: Panel de control con estadísticas

## Tecnologías

- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos**: SQLite con Prisma ORM
- **Autenticación**: NextAuth.js v5
- **Encriptación**: bcryptjs

## Estructura del Proyecto

```
linkbio/
├── app/
│   ├── (public)/
│   │   └── [username]/         # Perfiles públicos
│   ├── admin/
│   │   ├── login/              # Página de login
│   │   └── dashboard/          # Panel de administración
│   ├── api/
│   │   ├── auth/               # Endpoints de NextAuth
│   │   └── analytics/          # APIs de tracking
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Página de inicio
├── lib/
│   ├── auth.ts                 # Configuración de NextAuth
│   └── prisma.ts               # Cliente de Prisma
├── prisma/
│   └── schema.prisma           # Esquema de base de datos
└── types/
    └── next-auth.d.ts          # Tipos de NextAuth
```

## Esquema de Base de Datos

### Modelos Principales

- **User**: Usuarios del sistema
- **Profile**: Información de perfil (nombre, foto, descripción)
- **SocialLink**: Enlaces a redes sociales
- **Product**: Productos para mostrar
- **Content**: Enlaces de contenido

### Analytics

- **PageView**: Registro de vistas de página
- **ClickEvent**: Tracking de clics
- **SearchQuery**: Búsquedas realizadas

## Instalación y Configuración

1. **Instalar dependencias**:
```bash
npm install
```

2. **Configurar variables de entorno**:
```bash
cp .env.example .env
# Editar .env con tus valores
```

3. **Inicializar base de datos**:
```bash
npm run prisma:push
npm run prisma:generate
```

4. **Crear usuario de prueba** (opcional):
```bash
# Puedes crear usuarios directamente en la base de datos
# o agregar un seed script
```

5. **Iniciar servidor de desarrollo**:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run prisma:generate` - Genera el cliente de Prisma
- `npm run prisma:push` - Sincroniza el esquema con la BD
- `npm run prisma:studio` - Abre Prisma Studio

## Rutas Principales

- `/` - Página de inicio
- `/admin/login` - Login de administrador
- `/admin/dashboard` - Dashboard de administración
- `/[username]` - Perfil público del usuario

## APIs de Analytics

### POST /api/analytics/view
Registra una vista de página.
```json
{
  "userId": "user_id"
}
```

### POST /api/analytics/click
Registra un clic en un elemento.
```json
{
  "userId": "user_id",
  "itemType": "product|content|social",
  "itemId": "item_id"
}
```

### POST /api/analytics/search
Registra una búsqueda.
```json
{
  "userId": "user_id",
  "query": "término de búsqueda",
  "type": "tipo de búsqueda"
}
```

## Personalización

### Tema de Colores

Edita `tailwind.config.ts` para personalizar los colores:

```typescript
colors: {
  primary: {
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  },
}
```

### Animaciones

Las animaciones personalizadas están definidas en `app/globals.css` y `tailwind.config.ts`.

## Seguridad

- Las contraseñas se encriptan con bcryptjs
- Autenticación JWT con NextAuth.js
- Validación de sesiones en rutas protegidas
- Variables de entorno para datos sensibles

## Producción

Para desplegar en producción:

1. Cambiar `NEXTAUTH_SECRET` en `.env`
2. Configurar base de datos de producción (PostgreSQL, MySQL, etc.)
3. Actualizar `NEXTAUTH_URL` con tu dominio
4. Construir la aplicación: `npm run build`
5. Iniciar: `npm start`

## Próximas Características

- [ ] CRUD completo para productos y enlaces
- [ ] Carga de imágenes
- [ ] Temas personalizables
- [ ] Exportación de datos analytics
- [ ] API pública
- [ ] Múltiples usuarios/equipos

## Licencia

MIT

## Soporte

Para reportar bugs o solicitar características, abre un issue en el repositorio.
