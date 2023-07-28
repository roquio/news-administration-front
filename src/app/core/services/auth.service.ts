import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, filter, map, Observable, of, switchMap, take, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {LocationStrategy, PlatformLocation} from "@angular/common";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {UserService} from "./user.service";


@Injectable({
    providedIn: "root"
})
export class AuthService {

    private _loading$!: BehaviorSubject<boolean>;
    private _token$!: BehaviorSubject<string>;


    constructor(
        private platformLocation: PlatformLocation,
        private httpClient: HttpClient,
        private router: Router,
        private locationStrategy: LocationStrategy,
        private userService: UserService
    ) {
        this._loading$ = new BehaviorSubject<boolean>(false);
        this._token$ = new BehaviorSubject<string>("");
    }


    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }


    get token$(): Observable<string> {
        return this._token$.asObservable();
    }


    get authenticated(): Observable<boolean> {
        return this.token$.pipe(
            map(token => token.length > 0)
        );
    }


    login() {
        this.authenticated.pipe(
            tap(authenticated => {
                if (!authenticated) {
                    window.location.href = `${environment.loginUrl}?service=${this.getServiceUrl(this.router.routerState.snapshot)}`;
                }
            })
        ).subscribe();
    }


    logout() {
        this.authenticated.pipe(
            filter(authenticated => authenticated),
            tap(() => {
                this._token$.next("");
                this.userService.unregisterUser();

                window.location.href = `${environment.logoutUrl}?service=${this.getServiceAbsoluteUrlPrefix()}${this.locationStrategy.getBaseHref()}`;
            })
        ).subscribe();
    }


    canLoginActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        const ticket = route.queryParamMap ? route.queryParamMap.get("ticket") : null;

        let canActivate: Observable<boolean>;
        if (ticket) {
            canActivate = this.intercept(ticket, state);
        } else if (state.url === "/accueil") {
            return this.authenticated.pipe(
                map(authenticated => {
                    if (authenticated) {
                        return this.router.createUrlTree(["actualites"]);
                    } else {
                        return true;
                    }
                })
            );
        } else {
            canActivate = of(true);
        }

        return canActivate;
    }


    canAuthActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const ticket = route.queryParamMap ? route.queryParamMap.get("ticket") : null;

        let canActivate: Observable<boolean>;
        if (ticket) {
            canActivate = this.intercept(ticket, state);
        } else {
            canActivate = this.authenticated.pipe(
                tap(authenticated => {
                    if (!authenticated) {
                        window.location.href = `${environment.loginUrl}?service=${this.getServiceUrl(state)}`;
                    }
                })
            );
        }

        return canActivate;
    }


    canAdminActivate(): Observable<boolean> {
        return this.userService.administrator$.pipe(
            tap(admin => {
                if (!admin && (this.router.url === "/")) {
                    // Navigate to parent (only if parent is unknown)
                    this.router.navigate([".."]);
                }
            }),
        );
    }


    private intercept(ticket: string, state: RouterStateSnapshot) {
        this._loading$.next(true);
        return this.authenticated.pipe(
            filter(authenticated => !authenticated),
            switchMap(() => this.validateTicket(ticket, this.getServiceUrl(state))),
            take(1),
            map(token => {
                if (token) {
                    this._token$.next(token);
                    return true;
                } else {
                    return false;
                }
            }),
            tap(authenticated => {
                this._loading$.next(false);
                if (authenticated) {
                    const [path, search] = state.url.split("?");
                    const params = new HttpParams({
                        fromString: search
                    }).delete("ticket");

                    let url = path;
                    if (params) {
                        url += `?${params}`;
                    }

                    this.userService.loadUser();

                    this.router.navigateByUrl(url);
                }
            }),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }


    private getServiceAbsoluteUrlPrefix() {
        const protocol = this.platformLocation.protocol;
        const hostname = this.platformLocation.hostname;
        const port = this.platformLocation.port;

        return `${protocol}//${hostname}:${port}`
    }


    private getServiceUrl(state: RouterStateSnapshot) {
        const [path, search] = state.url.split("?");
        const params = new HttpParams({
            fromString: search
        }).delete("ticket").toString();

        let serviceUrl = this.getServiceAbsoluteUrlPrefix() + path;
        if (params) {
            serviceUrl += `?${params}`;
        }
        return serviceUrl;
    }


    private validateTicket(ticket: string, serviceUrl: string): Observable<string> {
        return this.httpClient.put(`${environment.apiUrl}/api/auth/validate`, {}, {
            responseType: "text",
            params: {
                ticket: ticket,
                service: serviceUrl
            }
        });
    }

}
