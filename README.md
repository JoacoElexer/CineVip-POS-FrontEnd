# CineVIP POS

Sistema de punto de venta (POS) para un cine VIP. Permite gestionar ventas de boletos y dulcería, control de inventario, cartelera, perfiles de clientes VIP y reportes de cierre de caja.
## [Repositorio con el BackEnd del proyecto](https://github.com/JoacoElexer/CineVip-POS-BackEnd)
## Arquitectura general

```
Frontend (React + Vite)          Backend (Node.js + Express)
────────────────────────────────────────────────────
────────────────────────────────────────────────────
Render Static Site          →    Render Web Service
                                      ↓              ↓
                                 PostgreSQL       MongoDB Atlas
                                 (Render)         (M0 Free)
```

El frontend consume la API REST del backend. Las bases de datos viven en la nube — el backend nunca se conecta directamente desde el cliente.

---

## Stack tecnológico

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express 5 | Servidor HTTP y routing |
| `pg` (node-postgres) | Queries directas a PostgreSQL |
| Mongoose | ODM para MongoDB |
| bcryptjs | Hash de passwords |
| swagger-ui-express | Documentación interactiva en `/api/docs` |
| helmet, cors, morgan | Seguridad y logging |

### Frontend
| Tecnología | Uso |
|---|---|
| React 19 + Vite | UI y bundler |
| React Router v7 | Navegación SPA |
| Axios | Peticiones HTTP |
| react-icons | Iconografía |
| sessionStorage | Persistencia de sesión |
| localStorage | Caché de catálogos |

---

## Bases de datos

El proyecto usa **dos motores simultáneamente**, cada uno con su propósito:

### PostgreSQL — datos transaccionales (9 tablas)

| Tabla | Descripción |
|---|---|
| `empleados` | Cuentas del personal con password hasheado |
| `categorias` | Clasificación del menú (Dulcería, Bebidas, Combos) |
| `productos` | Catálogo con precio y stock integrado |
| `promociones` | Combos y precios especiales |
| `salas` | Salas físicas del cine |
| `asientos` | Butacas por sala con estado (Disponible / Ocupado / Mantenimiento) |
| `funciones` | Cartelera — vincula película de MongoDB con sala de Postgres |
| `ventas_totales` | Cabecera de cada transacción |
| `detalle_ventas` | Ítems individuales por venta (Boleto / Producto / Combo) |

> `funciones.pelicula_id` almacena el `ObjectId` de MongoDB como `VARCHAR(50)`. Es una referencia lógica entre motores, sin FK real.

### MongoDB Atlas — datos flexibles (3 colecciones)

| Colección | Descripción |
|---|---|
| `peliculas` | Catálogo con título, sinopsis, géneros, clasificación, duración. Soporta búsqueda full-text. |
| `perfiles_usuario` | Clientes VIP con puntos acumulados y nivel de membresía |
| `reportes_cierre` | Cierres de caja diarios con totales por método de pago |

---

## Estructura del proyecto

### Backend — `pos-cine-vip-back/`
```
index.js                  # Entry point
src/
  config/
    db.js                 # Pool de conexiones PostgreSQL
    mongo.js              # Conexión Mongoose
    swagger.js            # Definición OpenAPI
  models/
    postgres/             # Modelos con queries SQL directas
    mongo/                # Schemas de Mongoose
    schema.sql            # DDL completo de PostgreSQL
  controllers/            # Handlers HTTP (reciben req, llaman service)
  services/               # Lógica de negocio y validaciones
  routes/                 # Definición de endpoints + JSDoc Swagger
```

### Frontend — `pos-cine-vip-front/`
```
src/
  context/
    AuthContext.jsx       # Estado global de sesión
  components/
    auth/                 # ProtectedRoute con control de roles
    layout/               # Sidebar, Header, MainLayout
    common/               # Modal, ConfirmDialog, EmptyState
    dulceria/             # ProductCard, SaleSummaryModal, TipSelector
    boletera/             # SeatMap, CartPanel, SeatLegend
  hooks/                  # Lógica de datos por entidad (fetch + caché)
  pages/                  # Login, Register, Dulceria, Boletera, Inventario, Admin, Reportes, Cuenta
  services/               # Llamadas Axios organizadas por entidad
  styles/                 # CSS modular por página/componente
  models/                 # Shapes de datos del frontend
```

---

## Endpoints principales

La documentación interactiva completa está disponible en:
```
https://cinevip-pos-backend.onrender.com/api/docs
```

Resumen de recursos disponibles:

```
/api/empleados          CRUD + POST /login
/api/categorias         CRUD
/api/productos          CRUD + PATCH /:id/stock
/api/promociones        CRUD + GET /activas
/api/salas              CRUD
/api/asientos           CRUD + GET /sala/:salaId + PATCH /:id/estado
/api/funciones          CRUD + GET /sala/:id + /fecha/:fecha + /pelicula/:id
/api/ventas             CRUD + GET /empleado/:id + /fecha/:fecha
/api/detalle-ventas     CRUD + GET /venta/:ventaId
/api/peliculas          CRUD + GET /buscar?q=termino
/api/perfiles-usuario   CRUD + POST /:id/puntos
/api/reportes-cierre    CRUD + GET /fecha/:fecha
```

---

## Roles y permisos

| Rol | Acceso |
|---|---|
| `Administrador` | Todo el sistema |
| `Cajero` | Dulcería, Boletera, Reportes, Cuenta |
| `Almacenista` | Inventario, Cuenta |

El control de acceso se aplica en el frontend mediante `ProtectedRoute` con `allowedRoles`. El backend actualmente no implementa JWT — todos los endpoints son públicos.

---

## Variables de entorno

### Backend (`.env`)
```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@host/pos_cine_vip
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/pos_cine_vip
```
---

## Setup local

### Backend
```bash
# 1. Instalar dependencias
npm install

# 2. Crear .env con las variables de entorno

# 3. Aplicar schema en PostgreSQL
docker run --rm -it -v "${PWD}:/sql" postgres:16-alpine \
  psql "postgresql://..." -f /sql/src/models/schema.sql

# 4. Arrancar servidor
npm run dev
```

### Frontend
```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar en desarrollo
npm run dev
```

---

## Deploy

| Servicio | Plataforma | Tipo |
|---|---|---|
| Backend | Render | Web Service (Node) |
| PostgreSQL | Render | PostgreSQL (Free tier — expira 90 días) |
| MongoDB | MongoDB Atlas | M0 Free Cluster |
| Frontend | Render | Static Site |

El schema de PostgreSQL se aplica manualmente apuntando a la DB de Render. El backend y frontend se redesplazan automáticamente en cada push a `main`.

---

## Consideraciones conocidas

- El free tier de **Render PostgreSQL expira a los 90 días** y elimina la base de datos.
- El free tier de **Render Web Service** entra en sleep después de 15 minutos de inactividad — el primer request puede tardar ~30 segundos en despertar.
- No hay autenticación JWT implementada aún — los endpoints son públicos.
- Los endpoints `POST` aceptan un objeto a la vez, no arrays.
- La sesión del usuario se guarda en `sessionStorage` — se pierde al cerrar el navegador.
