import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from '../_services';
import { ActivatedRoute } from '@angular/router';
import { User } from '../_models';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    id: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.id = params.id;
            });
        
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            cpf: ['', Validators.required],
            phoneNumber: ['', Validators.required]
        });
    }

    // Convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // Stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        let user: User = this.registerForm.value;
        user.phoneNumber = "55".concat(user.phoneNumber); // Add the Brazilian phone code as the default one
        user.facebookId = this.id; // Get the facebook id from URL
        console.log('user: ', user);
        this.userService.register(user)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Cadastro feito com sucesso', true);
                    this.router.navigate(['https://m.me/clinicaotoneuro']); // Go back to the otoneuro bot
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
