import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, EMPTY, map, mergeMap, Observable, of, ReplaySubject, tap} from "rxjs";
import {NewsContext} from "../models/news-context";
import {NewsSource} from "../models/news-source";
import {ParamMap} from "@angular/router";


@Injectable()
export class NewsService {

    private lastLoad!: number;

    private _loading$!: BehaviorSubject<boolean>;
    private _context$!: ReplaySubject<NewsContext>;


    constructor(
        private httpClient: HttpClient,
    ) {
        this.lastLoad = 0;
        this._loading$ = new BehaviorSubject<boolean>(true);
        this._context$ = new ReplaySubject<NewsContext>();
    }


    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    get context$(): Observable<NewsContext> {
        return this._context$.asObservable();
    }


    getSelectedSource(params: ParamMap): Observable<NewsSource | undefined> {
        const routeId = params.get("id");

        let response: Observable<NewsSource | undefined>;
        if (routeId) {
            response = this.getSourceById(+routeId);
        } else {
            if (!this.lastLoad) {
                this.loadContext();
            }

            response = this.context$.pipe(
                map(context => {
                    if (context.editableSources && (context.editableSources.length > 0)) {
                        return context.editableSources[0];
                    } else {
                        return null;
                    }
                }),
                mergeMap(source => {
                    if (source) {
                        return of(source);
                    } else {
                        return EMPTY;
                    }
                })
            );
        }

        return response;
    }


    private loadContext() {
        const now = Date.now();

        if (now - this.lastLoad > 600000) {
            this._loading$.next(true);
            this.httpClient.get<NewsContext>(`${environment.apiUrl}/api/actualites/administration/context`, {
                responseType: "json",
                withCredentials: true
            }).pipe(
                tap(context => {
                    this.lastLoad = now;
                    this._context$.next(context);
                    this._loading$.next(false);
                })
            ).subscribe();
        }
    }


    private getSourceById(id: number): Observable<NewsSource | undefined> {
        if (!this.lastLoad) {
            this.loadContext();
        }

        return this.context$.pipe(
            map(context => {
                if (context.editableSources && (context.editableSources.length > id)) {
                    return context.editableSources[id];
                } else {
                    return null;
                }
            }),
            mergeMap(source => {
                if (source) {
                    return of(source);
                } else {
                    return EMPTY;
                }
            })
        );
    }

}
