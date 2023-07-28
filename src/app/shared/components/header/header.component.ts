import {Component, OnInit} from "@angular/core";
import {combineLatest, map, Observable} from "rxjs";
import {UserService} from "../../../core/services/user.service";
import {AuthService} from "../../../core/services/auth.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {

    navbarCollapsed!: boolean;

    loading$!: Observable<boolean>;
    username$!: Observable<string>;


    constructor(
        private authService: AuthService,
        private userService: UserService
    ) {
        this.navbarCollapsed = true;
    }


    ngOnInit(): void {
        this.loading$ = combineLatest([
            this.authService.loading$,
            this.userService.loading$
        ]).pipe(
            map(([authLoading, userLoading]) => (authLoading || userLoading))
        )
        this.username$ = this.userService.username$;
    }


    login(): void {
        this.authService.login();
    }


    logout(): void {
        this.authService.logout();
    }

}
