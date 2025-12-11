import { Injectable } from '@nestjs/common';
import { User } from '@grpc-monorepo/protos';

@Injectable()
export class AppService {
  getUser(data: User.GetUserRequest): User.UserResponse {
    return {
      id: data.id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 30,
      createdAt: new Date().toISOString(),
    };
  }

  listUsers(data: User.ListUsersRequest): User.UsersListResponse {
    return {
      users: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          age: 25,
          createdAt: new Date().toISOString(),
        },
      ],
      total: 2,
    };
  }

  createUser(data: User.CreateUserRequest): User.UserResponse {
    return {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      email: data.email,
      age: data.age,
      createdAt: new Date().toISOString(),
    };
  }
}
