import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, map, Observable, of, take, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {PlatformLocation} from "@angular/common";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";


@Injectable({
    providedIn: "root"
})
export class AuthService {

    private _token$!: BehaviorSubject<string>;


    constructor(
        private platformLocation: PlatformLocation,
        private httpClient: HttpClient,
        private router: Router
    ) {
        this._token$ = new BehaviorSubject<string>("");
    }


    get token(): Observable<string> {
        return this._token$.asObservable();
    }


    login() {

    }


    logout() {
        this._token$.next("");
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const ticket = route.queryParamMap.get("ticket");

        let canActivate: Observable<boolean>;
        if (ticket) {
            canActivate = this.validateTicket(ticket, this.getServiceUrl(state)).pipe(
                take(1),
                map(token => {
                        if (token) {
                            this._token$.next(token);
                            return true;
                        } else {
                            return false;
                        }
                    }
                ),
                catchError(err => {
                    console.error(err);
                    return of(false);
                })
            );
        } else {
            canActivate = this.token.pipe(
                map(token => token.length > 0),
                tap(logged => {
                    if (!logged) {
                        window.location.href = `${environment.loginUrl}?service=${this.getServiceUrl(state)}`;
                    }
                })
            );
        }

        return canActivate;
    }


    private getServiceUrl(state: RouterStateSnapshot) {
        const protocol = this.platformLocation.protocol;
        const hostname = this.platformLocation.hostname;
        const port = this.platformLocation.port;
        const [path, search] = state.url.split("?");
        const params = new HttpParams({
            fromString: search
        }).delete("ticket").toString();

        let serviceUrl = `${protocol}//${hostname}:${port}${path}`
        if (params) {
            serviceUrl += `?${params}`;
        }
        return serviceUrl;
    }


    private validateTicket(ticket: string, serviceUrl: string): Observable<string> {
        const url = `${environment.apiUrl}/api/auth/validate`
        return this.httpClient.get(url, {
            responseType: "text",
            params: {
                ticket: ticket,
                service: serviceUrl
            }
        });
    }

}
