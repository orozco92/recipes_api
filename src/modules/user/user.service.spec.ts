import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../core/entities';
import { Repository } from 'typeorm';
import { Roles } from '../../core/enums';
import { ListResponseDto } from '../../core/models/list-response';
import { ListUserDto } from './dto/list-user.dto';
import * as dummy from 'dummy-json';
import { BadRequestException } from '@nestjs/common';

const dummyjson: any = dummy;

const helpers = {
  role() {
    return dummyjson.utils.randomArrayItem(Object.values(Roles));
  },
};

describe('UserService', () => {
  let userService: UserService;
  let userRepo: Repository<User>;
  const userList: ListUserDto[] = JSON.parse(
    dummyjson.parse(
      `[
          {{#repeat 6}}
          {
            "id": {{@index}},
            "username": "{{lowercase (firstName)}}",
            "role": "{{roles}}",
            "email": "{{email}}",
            "createdAt": "{{date '2023-01-01' '2024-03-01'}}",
            "updatedAt": "{{date '2023-01-01' '2024-03-01'}}"
          }
          {{/repeat}}
      ]`,
      { helpers },
    ),
  );
  const listCustomResolvedValue: ListResponseDto<ListUserDto> = {
    data: userList,
    limit: 3,
    offset: 1,
    total: 6,
  };
  const listDefaultResolvedValue: ListResponseDto<ListUserDto> = {
    data: userList,
    limit: 20,
    offset: 0,
    total: 6,
  };

  const resolvedUser: User = JSON.parse(
    dummyjson.parse(
      `{
        "id": {{int 1 10}},
        "username": "{{lowercase (firstName)}}",
        "role": "{{roles}}",
        "email": "{{email}}",
        "password": "{{country}}",
        "createdAt": "{{date '2023-01-01' '2024-03-01'}}",
        "updatedAt": "{{date '2023-01-01' '2024-03-01'}}"
      }`,
      { helpers },
    ),
  );
  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            count: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();
    userService = testModule.get<UserService>(UserService);
    userRepo = testModule.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('must return all users with default pagination data', async () => {
      const skip = 0;
      const take = 20;
      const order = undefined;
      const select = ['id', 'email', 'username', 'role'];

      jest
        .spyOn(userRepo, 'find')
        .mockReset()
        .mockResolvedValue(listDefaultResolvedValue.data as User[]);
      jest.spyOn(userRepo, 'count').mockReset().mockResolvedValue(6);

      const result = await userService.findAll({});

      expect(userRepo.find).toHaveBeenCalledTimes(1);
      expect(userRepo.find).toHaveBeenCalledWith({ skip, take, order, select });
      expect(userRepo.count).toHaveBeenCalledTimes(1);
      expect(userRepo.count).toHaveBeenCalledWith({
        skip,
        take,
        order,
        select,
      });
      expect(result).toEqual(listDefaultResolvedValue);
    });

    it('must return all users with custom pagination data', async () => {
      const skip = 1;
      const take = 3;
      const order = {
        email: 'asc',
        role: 'desc',
      };
      const select = ['id', 'email', 'username', 'role'];
      jest
        .spyOn(userRepo, 'find')
        .mockReset()
        .mockResolvedValue(listCustomResolvedValue.data as User[]);
      jest.spyOn(userRepo, 'count').mockReset().mockResolvedValue(6);

      const result = await userService.findAll({
        limit: take,
        offset: skip,
        sort: [
          ['email', 'asc'],
          ['role', 'desc'],
        ],
      });
      expect(userRepo.find).toHaveBeenCalledTimes(1);
      expect(userRepo.find).toHaveBeenCalledWith({ skip, take, order, select });
      expect(userRepo.count).toHaveBeenCalledTimes(1);
      expect(userRepo.count).toHaveBeenLastCalledWith({
        skip,
        take,
        order,
        select,
      });
      expect(result).toEqual(listCustomResolvedValue);
    });
  });

  describe('findOne', () => {
    it('must find an user with a given id', async () => {
      const resolvedValue = { ...resolvedUser };
      delete resolvedValue.password;
      jest
        .spyOn(userRepo, 'findOneBy')
        .mockReset()
        .mockResolvedValue(resolvedValue);
      const result = await userService.findOne(2);
      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ id: 2 });
      expect(result).toEqual(resolvedValue);
    });

    it('must throw a 404 error when an user is not found', async () => {
      await testNotFound('findOne');
    });
  });

  describe('update', () => {
    it('must update an user with a given id', async () => {
      const body: User = JSON.parse(
        dummyjson.parse(
          `{
            "username": "{{lowercase (firstName)}}",
            "email": "{{email}}",
            "password": "{{country}}",
            "updatedAt": "{{date '2023-01-01' '2024-03-01'}}"
          }`,
        ),
      );
      const updatedValue = { ...resolvedUser, ...body };

      jest
        .spyOn(userRepo, 'findOneBy')
        .mockReset()
        .mockResolvedValue(resolvedUser);
      jest.spyOn(userRepo, 'merge').mockReset();
      jest.spyOn(userRepo, 'save').mockReset().mockResolvedValue(updatedValue);

      const result = await userService.update(2, body);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ id: 2 });

      expect(userRepo.merge).toHaveBeenCalledTimes(1);
      expect(userRepo.merge).toHaveBeenCalledWith(resolvedUser, body);

      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith(resolvedUser);

      expect(result).toEqual(updatedValue);
    });

    it('must throw a 404 error when an user is not found', async () => {
      await testNotFound('update');
    });
  });

  describe('remove', () => {
    it('must delete an user with a given id', async () => {
      jest
        .spyOn(userRepo, 'findOneBy')
        .mockReset()
        .mockResolvedValue(resolvedUser);
      jest.spyOn(userRepo, 'delete').mockReset();

      const result = await userService.remove(2);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ id: 2 });

      expect(userRepo.delete).toHaveBeenCalledTimes(1);
      expect(userRepo.delete).toHaveBeenCalledWith(2);

      expect(result).toEqual(resolvedUser);
    });

    it('must throw a 404 error when an user is not found', async () => {
      await testNotFound('remove');
    });
  });

  const testNotFound = async (method: string) => {
    jest.spyOn(userRepo, 'findOneBy').mockReset().mockResolvedValue(null);
    const id = dummyjson.utils.randomInt(1, 10);
    await expect(userService[method](id)).rejects.toEqual(
      new BadRequestException(`User not found for id=${id}`),
    );
    expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
    expect(userRepo.findOneBy).toHaveBeenCalledWith({ id });
  };
});
