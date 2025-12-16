import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { User, Product } from '@grpc-monorepo/protos';
import { firstValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

// Base de datos simulada - En producción esto sería una BD real
const usersDB: Map<string, User.UserData> = new Map([
  [
    '1',
    {
      id: '1',
      name: 'John Doe cea',
      email: 'john@example.com',
      age: 30,
      createdAt: new Date().toISOString(),
      favoriteIds: ['1', '2'], // Solo IDs de productos
    },
  ],
  [
    '2',
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      age: 25,
      createdAt: new Date().toISOString(),
      favoriteIds: ['2'], // Solo IDs de productos
    },
  ],
]);

@Injectable()
export class AppService implements OnModuleInit {
  private productService: Product.ProductServiceClient;

  constructor(@Inject('PRODUCT_PACKAGE') private client: ClientGrpc) { }

  onModuleInit() {
    this.productService =
      this.client.getService<Product.ProductServiceClient>('ProductService');
  }

  /**
   * Obtiene los datos completos de los productos favoritos
   * consultando al servicio de Product
   */
  private async getFavoriteProducts(
    favoriteIds: string[]
  ): Promise<Product.ProductResponse[]> {
    if (!favoriteIds || favoriteIds.length === 0) {
      return [];
    }


    try {
      // Consultar cada producto al servicio de Product
      const productPromises = favoriteIds.map((productId) =>
        firstValueFrom(
          this.productService.getProduct({ id: productId }, new Metadata())
        )
      );

      return await Promise.all(productPromises);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
      return [];
    }
  }

  async getUser(data: User.GetUserRequest): Promise<User.UserResponse> {
    const userData = usersDB.get(data.id);

    if (!userData) {
      throw new Error(`User with id ${data.id} not found`);
    }

    // Obtener los productos completos desde el servicio de Product
    const favorites = await this.getFavoriteProducts(userData.favoriteIds);

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      age: userData.age,
      createdAt: userData.createdAt,
      favorites, // Productos completos obtenidos del servicio Product
    };
  }

  async listUsers(data: User.ListUsersRequest): Promise<User.UsersListResponse> {
    const allUsers = Array.from(usersDB.values());
    const start = data.offset || 0;
    const end = start + (data.limit || 10);
    const paginatedUsers = allUsers.slice(start, end);

    // Obtener los productos favoritos para cada usuario
    const usersWithFavorites = await Promise.all(
      paginatedUsers.map(async (userData) => {
        const favorites = await this.getFavoriteProducts(userData.favoriteIds);
        return {
          id: userData.id,
          name: userData.name + ' casa',
          email: userData.email,
          age: userData.age,
          createdAt: userData.createdAt,
          favorites
        };
      })
    );

    return {
      users: usersWithFavorites,
      total: allUsers.length,
    };
  }

  async createUser(data: User.CreateUserRequest): Promise<User.UserResponse> {
    const newUser: User.UserData = {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      email: data.email,
      age: data.age,
      createdAt: new Date().toISOString(),
      favoriteIds: [], // Nuevo usuario sin favoritos
    };

    usersDB.set(newUser.id, newUser);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      age: newUser.age,
      createdAt: newUser.createdAt,
      favorites: [],
    };
  }

  async addFavorite(
    data: User.AddFavoriteRequest
  ): Promise<User.UserResponse> {
    const userData = usersDB.get(data.userId);

    if (!userData) {
      throw new Error(`User with id ${data.userId} not found`);
    }

    // Agregar el ID del producto si no existe ya
    if (!userData.favoriteIds.includes(data.productId)) {
      userData.favoriteIds.push(data.productId);
    }

    // Obtener los productos completos
    const favorites = await this.getFavoriteProducts(userData.favoriteIds);

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      age: userData.age,
      createdAt: userData.createdAt,
      favorites,
    };
  }

  async removeFavorite(
    data: User.RemoveFavoriteRequest
  ): Promise<User.UserResponse> {
    const userData = usersDB.get(data.userId);

    if (!userData) {
      throw new Error(`User with id ${data.userId} not found`);
    }

    // Remover el ID del producto
    userData.favoriteIds = userData.favoriteIds.filter(
      (id) => id !== data.productId
    );

    // Obtener los productos completos
    const favorites = await this.getFavoriteProducts(userData.favoriteIds);

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      age: userData.age,
      createdAt: userData.createdAt,
      favorites,
    };
  }
}
