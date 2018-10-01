import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register';

const appRoutes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: '/register' } // Redirect to home
];

export const routing = RouterModule.forRoot(appRoutes, {useHash: true});