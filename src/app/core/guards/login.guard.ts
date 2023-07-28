import {CanActivateFn} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";


export const loginGuard: CanActivateFn = (route, state) => {
    return inject(AuthService).canLoginActivate(route, state);
};
