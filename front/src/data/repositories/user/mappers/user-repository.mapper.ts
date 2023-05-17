import { Mapper } from 'src/base/utils/mapper';
import { UserModel } from 'src/domain/models/user.model';
import { UserEntity } from '../entities/user-entity';
export class UserImplementationRepositoryMapper extends Mapper<UserEntity, UserModel> {
  mapFrom(param: UserEntity): UserModel {
    return {
      id: param.id,
      username: param.username,
      email: param.email,
    };
  }

  mapTo(param: UserModel): UserEntity {
    return {
      id: param.id,
      username: param.username,
      email: param.email
    }
  }
}
