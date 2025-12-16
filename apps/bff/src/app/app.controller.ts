import { Controller, Get, Post, Delete, Inject, OnModuleInit, Param, Body } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AppService } from './app.service';
import { User, Product } from '@grpc-monorepo/protos';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

@Controller()
export class AppController implements OnModuleInit {
  private userService: User.UserServiceClient;
  private productService: Product.ProductServiceClient;

  constructor(
    private readonly appService: AppService,
    @Inject('USER_SERVICE') private clientUser: ClientGrpc,
    @Inject('PRODUCT_SERVICE') private clientProduct: ClientGrpc
  ) { }

  onModuleInit() {
    this.userService = this.clientUser.getService<User.UserServiceClient>('UserService');
    this.productService = this.clientProduct.getService<Product.ProductServiceClient>('ProductService');
  }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser({ id }, new Metadata());
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    return this.productService.getProduct({ id }, new Metadata());
  }

  @Get('products')
  listProducts() {
    return this.productService.listProducts({ limit: 10, offset: 0 }, new Metadata());
  }

  @Get('users')
  listUsers() {
    return this.userService.listUsers({ limit: 10, offset: 0 }, new Metadata());
  }

  @Post('users/:userId/favorites')
  addFavorite(
    @Param('userId') userId: string,
    @Body('productId') productId: string
  ) {
    return this.userService.addFavorite({ userId, productId }, new Metadata());
  }

  @Delete('users/:userId/favorites/:productId')
  removeFavorite(
    @Param('userId') userId: string,
    @Param('productId') productId: string
  ) {
    return this.userService.removeFavorite({ userId, productId }, new Metadata());
  }
}
