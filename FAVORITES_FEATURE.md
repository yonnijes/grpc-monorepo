# Feature: User Favorites

## Descripción

Esta funcionalidad permite a los usuarios tener una lista de productos favoritos. La implementación sigue un patrón de microservicios donde:

- **User Service** almacena solo los IDs de productos favoritos
- **Product Service** mantiene los datos completos de los productos
- Cuando se consulta un usuario, el User Service llama al Product Service vía gRPC para obtener los datos completos de los productos favoritos

## Arquitectura

### Modelo de Datos

#### User (almacenado internamente)
```typescript
{
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: string;
  favoriteIds: string[];  // Solo IDs de productos
}
```

#### UserResponse (respuesta al cliente)
```typescript
{
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: string;
  favorites: ProductResponse[];  // Productos completos
}
```

### Flujo de Comunicación

```
Cliente → BFF (REST) → User Service (gRPC) → Product Service (gRPC)
```

1. El cliente hace una petición REST al BFF
2. El BFF llama al User Service vía gRPC
3. El User Service obtiene el usuario con sus `favoriteIds`
4. El User Service llama al Product Service para cada `productId` en `favoriteIds`
5. El User Service retorna el usuario con los productos completos

## API Endpoints (BFF)

### Obtener Usuario
```http
GET /users/:id
```
Retorna el usuario con sus productos favoritos completos.

**Ejemplo de respuesta:**
```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "createdAt": "2025-12-11T20:00:00.000Z",
  "favorites": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High performance laptop",
      "price": 1500,
      "stock": 50,
      "createdAt": "2025-12-11T20:00:00.000Z"
    },
    {
      "id": "2",
      "name": "Mouse",
      "description": "Wireless mouse",
      "price": 50,
      "stock": 200,
      "createdAt": "2025-12-11T20:00:00.000Z"
    }
  ]
}
```

### Listar Usuarios
```http
GET /users
```
Retorna todos los usuarios con sus productos favoritos.

### Agregar Producto Favorito
```http
POST /users/:userId/favorites
Content-Type: application/json

{
  "productId": "1"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/users/1/favorites \
  -H "Content-Type: application/json" \
  -d '{"productId": "1"}'
```

### Remover Producto Favorito
```http
DELETE /users/:userId/favorites/:productId
```

**Ejemplo:**
```bash
curl -X DELETE http://localhost:3000/users/1/favorites/1
```

## gRPC Services

### UserService

```protobuf
service UserService {
  rpc GetUser (GetUserRequest) returns (UserResponse);
  rpc ListUsers (ListUsersRequest) returns (UsersListResponse);
  rpc CreateUser (CreateUserRequest) returns (UserResponse);
  rpc AddFavorite (AddFavoriteRequest) returns (UserResponse);
  rpc RemoveFavorite (RemoveFavoriteRequest) returns (UserResponse);
}
```

### ProductService

```protobuf
service ProductService {
  rpc GetProduct (GetProductRequest) returns (ProductResponse);
  rpc ListProducts (ListProductsRequest) returns (ProductsListResponse);
  rpc CreateProduct (CreateProductRequest) returns (ProductResponse);
}
```

## Ventajas de esta Arquitectura

1. **Separación de Responsabilidades**: Cada servicio maneja su propio dominio
2. **Consistencia de Datos**: Los datos de productos siempre vienen de la fuente única (Product Service)
3. **Escalabilidad**: Los servicios pueden escalar independientemente
4. **Mantenibilidad**: Los cambios en productos no requieren actualizar datos en User Service
5. **Flexibilidad**: Fácil agregar más relaciones entre servicios

## Consideraciones de Rendimiento

- **N+1 Queries**: Actualmente se hace una llamada por cada producto favorito. En producción, considera:
  - Implementar un método `GetProductsByIds` en Product Service para obtener múltiples productos en una sola llamada
  - Implementar caché para productos frecuentemente consultados
  - Usar DataLoader pattern para batch requests

## Pruebas

### 1. Iniciar los servicios
```bash
# Terminal 1 - Product Service
nx serve product

# Terminal 2 - User Service  
nx serve user

# Terminal 3 - BFF
nx serve bff
```

### 2. Probar la funcionalidad

```bash
# Obtener usuario con favoritos
curl http://localhost:3000/users/1

# Agregar favorito
curl -X POST http://localhost:3000/users/1/favorites \
  -H "Content-Type: application/json" \
  -d '{"productId": "3"}'

# Remover favorito
curl -X DELETE http://localhost:3000/users/1/favorites/2

# Verificar cambios
curl http://localhost:3000/users/1
```

## Próximos Pasos

- [ ] Implementar `GetProductsByIds` para optimizar queries
- [ ] Agregar validación de que el producto existe antes de agregarlo a favoritos
- [ ] Implementar caché de productos
- [ ] Agregar manejo de errores más robusto
- [ ] Implementar paginación para favoritos
- [ ] Agregar tests unitarios e integración
