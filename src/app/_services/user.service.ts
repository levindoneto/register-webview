import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../_models';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    // Register user in the otoneuro's contacts
    register(user: User) {
        console.log('user: ', user);
        user.customerId = environment.customerId;
        return this.http.post(`${environment.apiUrl}`, JSON.stringify(user), {
          headers: {
            'Token' : environment.token
          }
        });
    }
}
