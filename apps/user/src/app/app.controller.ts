import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from '@grpc-monorepo/protos';
import { Observable } from 'rxjs';

@Controller()
@User.UserServiceControllerMethods()
export class AppController implements User.UserServiceController {
  constructor(private readonly appService: AppService) {}

  getUser(
    request: User.GetUserRequest
  ):
    | User.UserResponse
    | Promise<User.UserResponse>
    | Observable<User.UserResponse> {
    return this.appService.getUser(request);
  }

  listUsers(
    request: User.ListUsersRequest
  ):
    | User.UsersListResponse
    | Promise<User.UsersListResponse>
    | Observable<User.UsersListResponse> {
    return this.appService.listUsers(request);
  }

  createUser(
    request: User.CreateUserRequest
  ):
    | User.UserResponse
    | Promise<User.UserResponse>
    | Observable<User.UserResponse> {
    return this.appService.createUser(request);
  }
}
