import { Injectable } from '@nestjs/common';
import { Product } from '@grpc-monorepo/protos';

@Injectable()
export class AppService {
  getProduct(data: Product.GetProductRequest): Product.ProductResponse {
    return {
      id: data.id,
      name: 'Laptop',
      description: 'High performance laptop',
      price: 1500,
      stock: 50,
      createdAt: new Date().toISOString(),
    };
  }

  listProducts(
    data: Product.ListProductsRequest
  ): Product.ProductsListResponse {
    return {
      products: [
        {
          id: '1',
          name: 'Laptop',
          description: 'High performance laptop',
          price: 1500,
          stock: 50,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Mouse',
          description: 'Wireless mouse',
          price: 50,
          stock: 200,
          createdAt: new Date().toISOString(),
        },
      ],
      total: 2,
    };
  }

  createProduct(data: Product.CreateProductRequest): Product.ProductResponse {
    return {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      createdAt: new Date().toISOString(),
    };
  }
}
