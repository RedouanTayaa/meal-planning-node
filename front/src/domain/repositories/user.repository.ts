import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import { LoginModel } from '../models/login.model';

export abstract class UserRepository {
  abstract login(params: {username: string, password: string}): Observable<LoginModel>;
  abstract register(params: {username: string, password: string}): Observable<UserModel>;
  abstract getUserProfile(): Observable<UserModel>;
}
