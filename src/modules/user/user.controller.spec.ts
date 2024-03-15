import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PagedAndSortedRequest } from '../../core/models/list-request';
import { UserDto } from './dto/user.dto';
import { Roles } from '../../core/enums';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  const listResponse = {
    data: [],
    limit: 5,
    total: 10,
    offset: 2,
  };
  const removeResponse: Partial<UserDto> = {
    id: 123,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: Roles.Customer,
  };

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(listResponse),
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn().mockResolvedValue(removeResponse),
          },
        },
      ],
    }).compile();

    userService = testModule.get<UserService>(UserService);
    userController = testModule.get<UserController>(UserController);
  });

  describe('findAll()', () => {
    it('must return a paged response froma given paged and sorted request', async () => {
      const params: PagedAndSortedRequest = {
        limit: listResponse.limit,
        sort: [['id', 'asc']],
        offset: listResponse.offset,
      };

      jest.spyOn(userService, 'findAll');
      const result = await userController.findAll(params);
      expect(userService.findAll).toHaveBeenCalledTimes(1);
      expect(userService.findAll).toHaveBeenCalledWith(params);
      expect(result).toBe(listResponse);
    });
  });

  describe('findOne()', () => {
    it('must return the user with matching the id param', async () => {
      jest.spyOn(userService, 'findOne');
      const result = await userController.findOne(1);
      expect(userService.findOne).toHaveBeenCalledTimes(1);
      expect(userService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('update()', () => {
    it('must update an user', async () => {
      const body: UpdateUserDto = {
        username: 'testUser',
        email: 'test@user.com',
        password: 'password',
      };
      const response: Partial<UserDto> = {
        ...body,
        id: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: Roles.Customer,
      };
      jest.spyOn(userService, 'update').mockResolvedValue(response as UserDto);
      const result = await userController.update(123, body);
      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledWith(123, body);
      expect(result).toEqual(response);
    });
  });

  describe('remove()', () => {
    it('must delete an user', async () => {
      jest
        .spyOn(userService, 'remove')
        .mockResolvedValue(removeResponse as UserDto);
      const result = await userController.remove(123);
      expect(userService.remove).toHaveBeenCalledTimes(1);
      expect(userService.remove).toHaveBeenCalledWith(123);
      expect(result).toEqual(removeResponse);
    });
  });
});
