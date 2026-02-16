import { Injectable } from '@nestjs/common';
import { Product } from '@grpc-monorepo/protos';

@Injectable()
export class AppService {
  private products: Product.ProductResponse[] = [
    {
      id: '1',
      name: 'Laptop x',
      description: 'High performance laptop',
      price: 1500,
      stock: 50,
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Mouse',
      description: 'Wireless mouse',
      price: 50,
      stock: 200,
      createdAt: '2023-01-02T00:00:00Z',
    },
  ];

  getProduct(data: Product.GetProductRequest): Product.ProductResponse {
    const product = this.products.find((p) => p.id === data.id);
    if (product) {
      return product;
    }
    // Retornar mock si no encuentra (comportamiento anterior) o error
    return {
      id: data.id,
      name: 'Unknown Product',
      description: 'Description placeholder',
      price: 0,
      stock: 0,
      createdAt: new Date().toISOString(),
    };
  }

  getProductsByIds(
    data: Product.GetProductsByIdsRequest
  ): Product.ProductsListResponse {
    const foundProducts = this.products.filter((p) => data.ids.includes(p.id));
    return {
      products: foundProducts,
      total: foundProducts.length,
    };
  }

  listProducts(
    data: Product.ListProductsRequest
  ): Product.ProductsListResponse {
    return {
      products: this.products,
      total: this.products.length,
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
