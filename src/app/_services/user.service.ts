import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../_models';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    // Register user in the otoneuro's contacts
    register(user: User) {
        user.customerId = environment.customerId;
        return this.http.post(`${environment.apiUrl}`, JSON.stringify(user), {
          headers: {
            'Content-type' : 'application/json',
            'Token' : environment.token
          }
        });
    }
}
