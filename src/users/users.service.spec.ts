import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { ErrorsModule } from "../errors/errors.module";
import { ApiKeyService } from "../api-key/api-key.service";
import { Model } from "mongoose";
import { User } from "./entities/user.entity";
import { getModelToken } from "@nestjs/mongoose";
import { HashingService } from "../providers/hashing/hashing.service";
import { BcryptService } from "../providers/hashing/bcrypt.service";
import { ApiKey } from "../api-key/entities/api-key.entity";

const mockUserService = {};

describe("userService", () => {
  let service: UsersService;
  let userModel: Model<User>;
  let apiKeyModel: Model<ApiKey>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ErrorsModule],
      providers: [
        UsersService,
        ApiKeyService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
        {
          provide: getModelToken(ApiKey.name),
          useValue: {},
        },
        {
          provide: HashingService,
          useClass: BcryptService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    apiKeyModel = module.get<Model<ApiKey>>(getModelToken(ApiKey.name));
  });

  it("Servicios de Usuario", () => {
    expect(service).toBeDefined();
  });
});
