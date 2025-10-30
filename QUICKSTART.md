# Guía de Inicio Rápido

## 🚀 Iniciar la Aplicación

La aplicación ya está completamente configurada y lista para usar. Sigue estos pasos:

### 1. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

### 2. Acceder a la aplicación

- **Página de inicio**: http://localhost:3000
- **Login de Admin**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard (requiere login)
- **Perfil público**: http://localhost:3000/admin (ejemplo)

### 3. Credenciales de prueba

Ya existe un usuario de prueba creado con el seed:

```
Email: admin@linkbio.com
Password: admin123
```

## 📊 Base de Datos

La base de datos SQLite ya está inicializada con:
- 1 Usuario de prueba
- 1 Perfil completo
- 3 Enlaces sociales
- 2 Productos de ejemplo
- 3 Enlaces de contenido

### Ver la base de datos

Para explorar la base de datos con Prisma Studio:

```bash
npm run prisma:studio
```

Se abrirá una interfaz web en `http://localhost:5555`

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Build
npm run build            # Construye para producción
npm start               # Inicia servidor de producción

# Prisma
npm run prisma:generate  # Genera cliente de Prisma
npm run prisma:push     # Sincroniza esquema con BD
npm run prisma:studio   # Abre Prisma Studio
npm run prisma:seed     # Ejecuta seed de datos

# Otros
npm run lint            # Ejecuta ESLint
```

## 📂 Estructura del Proyecto

```
linkbio/
├── app/                      # App Router de Next.js
│   ├── [username]/          # Perfiles públicos (ruta dinámica)
│   ├── admin/               # Área de administración
│   │   ├── login/           # Página de login
│   │   └── dashboard/       # Dashboard protegido
│   └── api/                 # API Routes
│       ├── auth/            # NextAuth endpoints
│       └── analytics/       # Analytics tracking
├── lib/                     # Utilidades y configuración
│   ├── auth.ts             # Configuración de NextAuth
│   └── prisma.ts           # Cliente de Prisma
├── prisma/                  # Prisma ORM
│   ├── schema.prisma       # Esquema de base de datos
│   ├── seed.ts             # Datos de ejemplo
│   └── dev.db              # Base de datos SQLite
└── types/                   # Tipos de TypeScript
```

## 🎨 Características Implementadas

### ✅ Autenticación
- Sistema de login con NextAuth.js
- Protección de rutas con middleware
- Sesiones JWT

### ✅ Base de Datos
- Esquema completo con 8 modelos
- Relaciones entre tablas
- Índices para optimización
- Seed con datos de ejemplo

### ✅ Rutas Públicas
- Página de inicio
- Perfiles públicos personalizables
- Sistema de tracking de vistas

### ✅ Área de Administración
- Dashboard con estadísticas
- Login seguro
- Sesión persistente

### ✅ Analytics
- Tracking de vistas de página
- Registro de clics en elementos
- Búsquedas (preparado para implementar)

### ✅ Diseño
- Tailwind CSS configurado
- Tema personalizado
- Componentes responsivos
- Animaciones CSS

## 🔍 Próximos Pasos

Puedes extender la aplicación agregando:

1. **CRUD Completo**: Interfaces para crear/editar productos y enlaces
2. **Carga de Imágenes**: Integración con servicios como Cloudinary o AWS S3
3. **Temas**: Sistema de temas personalizables por usuario
4. **Analytics Dashboard**: Gráficos y estadísticas detalladas
5. **API Pública**: Endpoints para integración externa
6. **Multi-usuario**: Sistema de equipos o múltiples perfiles

## 🐛 Solución de Problemas

### Error: Puerto 3000 en uso
```bash
# Cambiar el puerto
PORT=3001 npm run dev
```

### Error: Base de datos bloqueada
```bash
# Cerrar Prisma Studio si está abierto
# Reiniciar el servidor de desarrollo
```

### Problemas con dependencias
```bash
# Limpiar e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

## 📚 Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de NextAuth.js](https://next-auth.js.org)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

## 💡 Tips

- Usa `npm run prisma:studio` para ver y editar datos fácilmente
- El archivo `.env` contiene las configuraciones importantes
- Los estilos globales están en `app/globals.css`
- La configuración de Tailwind está en `tailwind.config.ts`

¡Disfruta construyendo tu aplicación Link in Bio! 🎉
