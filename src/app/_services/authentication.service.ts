import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(email: string, cpf: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { email: email, cpf: cpf })
            .pipe(map(user => {
                // Login has been successful if there's a jwt token in the response
                if (user && user.token) {
                    // Store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }

    logout() {
        // Remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}