import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {map, Observable, of, switchMap, take, tap} from "rxjs";
import {AuthService} from "../services/auth.service";
import {environment} from "../../../environments/environment";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService
    ) {
    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let response: Observable<HttpEvent<any>>;
        if (request.url.startsWith(environment.apiUrl)) {
            response = of(request).pipe(
                switchMap(() => this.authService.token.pipe()),
                take(1),
                map(token => {
                    if (token) {
                        const headers = new HttpHeaders().append("Authorization", `Bearer ${token}`);
                        return request.clone({
                            headers
                        });
                    } else {
                        return request;
                    }
                }),
                switchMap((request) => next.handle(request))
            );
        } else {
            response = next.handle(request)
        }

        return response;
    }

}
