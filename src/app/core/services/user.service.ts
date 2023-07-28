import {Injectable} from "@angular/core";
import {BehaviorSubject, filter, Observable, switchMap, take, tap} from "rxjs";
import {User} from "../models/user";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class UserService {

    private _loading$!: BehaviorSubject<boolean>;
    private _username$!: BehaviorSubject<string>;
    private _administrator$!: BehaviorSubject<boolean>;


    constructor(
        private httpClient: HttpClient
    ) {
        this._loading$ = new BehaviorSubject<boolean>(false);
        this._username$ = new BehaviorSubject<string>("");
        this._administrator$ = new BehaviorSubject<boolean>(false);
    }


    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }


    get username$(): Observable<string> {
        return this._username$.asObservable();
    }


    get administrator$(): Observable<boolean> {
        return this._administrator$.asObservable();
    }


    loadUser(): void {
        this._loading$.next(true);
        this.username$.pipe(
            filter(username => (username.length === 0)),
            switchMap(() => this.getUser()),
            take(1),
            tap(user => {
                this.registerUser(user);
                this._loading$.next(false);
            })
        ).subscribe();
    }


    private getUser(): Observable<User> {
        return this.httpClient.get<User>(`${environment.apiUrl}/api/auth/user-info`, {
            responseType: "json",
            withCredentials: true
        });
    }


    registerUser(user: User): void {
        const username: string = String(user.username);
        const administrator: boolean = Boolean(user.administrator);

        this._username$.next(username);
        this._administrator$.next(administrator);
    }


    unregisterUser(): void {
        this._username$.next("");
        this._administrator$.next(false);
    }

}
