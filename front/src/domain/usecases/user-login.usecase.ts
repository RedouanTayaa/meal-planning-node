import { Observable } from 'rxjs';
import { UseCase } from '../base/use-case';
import { UserRepository } from '../repositories/user.repository';
import { LoginModel } from '../models/login.model';

export class UserLoginUseCase implements UseCase<{ username: string; password: string }, LoginModel> {
  constructor(private userRepository: UserRepository) { }
  execute(
    params: { username: string, password: string },
  ): Observable<LoginModel> {
    return this.userRepository.login(params);
  }
}
