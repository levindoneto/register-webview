import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../_models';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }
    
    // Register user in the otoneuro's contacts
    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users`, JSON.stringify(user));
    }
    
    // Modify user (by email) in the otoneuro's contacts
    update(user: User) {
        return this.http.put(`${environment.apiUrl}/users/` + user.email, user);
    }
}