import { CanActivateFn } from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";


export const adminGuard: CanActivateFn = () => {
  return inject(AuthService).canAdminActivate();
};
