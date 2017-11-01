import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';
import { UserService } from '../../../../default/_services/user.service';


@Component({
    selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
    templateUrl: "./changePassword.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ChangePasswordComponent implements OnInit {
    changePasswordForm: FormGroup;
    loading = false;
    constructor(
        private formBuilder: FormBuilder,
        private globalErrorHandler: GlobalErrorHandler,
        private router: Router,
        private userService: UserService,
        private messageService: MessageService) {
    }

    ngOnInit() {
        this.changePasswordForm = this.formBuilder.group({
            oldPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required]],
        });
    }

    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        this.loading = true;
        this.userService.changePassword(value)
            .subscribe(
            results => {
                this.loading = false;
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Password Updated Successfully' });
                this.router.navigate(['/']);
            },
            error => {
                this.loading = false;
                this.globalErrorHandler.handleError(error);
            });
    }
    onCancel() {
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
}
