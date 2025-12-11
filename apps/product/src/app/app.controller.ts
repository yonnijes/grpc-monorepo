import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Product } from '@grpc-monorepo/protos';
import { Observable } from 'rxjs';

@Controller()
@Product.ProductServiceControllerMethods()
export class AppController implements Product.ProductServiceController {
  constructor(private readonly appService: AppService) {}

  getProduct(
    request: Product.GetProductRequest
  ):
    | Product.ProductResponse
    | Promise<Product.ProductResponse>
    | Observable<Product.ProductResponse> {
    return this.appService.getProduct(request);
  }

  listProducts(
    request: Product.ListProductsRequest
  ):
    | Product.ProductsListResponse
    | Promise<Product.ProductsListResponse>
    | Observable<Product.ProductsListResponse> {
    return this.appService.listProducts(request);
  }

  createProduct(
    request: Product.CreateProductRequest
  ):
    | Product.ProductResponse
    | Promise<Product.ProductResponse>
    | Observable<Product.ProductResponse> {
    return this.appService.createProduct(request);
  }
}
