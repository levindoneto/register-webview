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

                // Alles gute
                return of(new HttpResponse({ status: 200 }));
            }

            // Pass through any requests not handled above
            return next.handle(request);
        }))

        // Call materialize and dematerialize to ensure delay even if an error is thrown
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