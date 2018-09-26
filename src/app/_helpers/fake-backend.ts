import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // List that stays in local storage with the registered users
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

        // Wrap up delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // Authentication
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                // Find if any user matches login credentials
                let filteredUsers = users.filter(user => {
                    return user.email === request.body.email && user.cpf === request.body.cpf;
                });

                if (filteredUsers.length) {
                    // If login details are valid return 200 OK with user details and fake jwt token
                    let user = filteredUsers[0];
                    let body = {
                        name: user.name,
                        email: user.email,
                        cpf: user.cpf,
                        cellphone: user.cellphone,
                        token: 'fake-jwt-token'
                    };

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    return throwError({ error: { message: 'email or cpf is incorrect' } });
                }
            }

            // Get users
            if (request.url.endsWith('/users') && request.method === 'GET') {
                // Check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: users }));
                } else {
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // Get user by email
            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                // Check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // Find user by email in users array
                    let urlParts = request.url.split('/');
                    let email = urlParts[urlParts.length - 1];
                    let matchedUsers = users.filter(user => { return user.email === email; });
                    let user = matchedUsers.length ? matchedUsers[0] : null;

                    return of(new HttpResponse({ status: 200, body: user }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // Register user
            if (request.url.endsWith('/users/register') && request.method === 'POST') {
                // get new user object from post body
                let newUser = request.body;

                // Validation
                let duplicateUser = users.filter(user => { return user.email === newUser.email; }).length;
                if (duplicateUser) {
                    return throwError({ error: { message: 'email "' + newUser.email + '" is already taken' } });
                }

                // Save new user
                newUser.email = users.length + 1;
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // Respond 200 OK
                return of(new HttpResponse({ status: 200 }));
            }

            // Delete user
            if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
                // Check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // Find user by email in users array
                    let urlParts = request.url.split('/');
                    let email = urlParts[urlParts.length - 1];
                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.email === email) {
                            // Delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    // Respond 200 OK
                    return of(new HttpResponse({ status: 200 }));
                } else {
                    // Return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // Pass through any requests not handled above
            return next.handle(request);
            
        }))

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    // Use fake backend instead of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};