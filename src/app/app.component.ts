import {Component, OnInit} from "@angular/core";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";


@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

    _navigationLoading$!: BehaviorSubject<boolean>;


    constructor(
        private router: Router,
    ) {
        this._navigationLoading$ = new BehaviorSubject<boolean>(false);
    }


    ngOnInit(): void {
        this.router.events.pipe(
            tap(event => {
                if (event instanceof NavigationStart) {
                    this._navigationLoading$.next(true);
                } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
                    this._navigationLoading$.next(false);
                }
            })
        ).subscribe();
    }


    get navigationLoading$(): Observable<boolean> {
        return this._navigationLoading$.asObservable();
    }

}
