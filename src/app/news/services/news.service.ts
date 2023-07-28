import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, EMPTY, map, mergeMap, Observable, of, ReplaySubject, switchMap, tap} from "rxjs";
import {NewsContext} from "../models/news-context";
import {NewsSource} from "../models/news-source";
import {ActivatedRouteSnapshot, Router} from "@angular/router";


@Injectable()
export class NewsService {

    private _loading$!: BehaviorSubject<boolean>;
    private _context$!: ReplaySubject<NewsContext>;
    private _selectedSourceId$!: ReplaySubject<string>;

    private lastLoad!: number;


    constructor(
        private httpClient: HttpClient,
        private router: Router
    ) {
        this.lastLoad = 0;
        this._loading$ = new BehaviorSubject<boolean>(false);
        this._context$ = new ReplaySubject<NewsContext>();
        this._selectedSourceId$ = new ReplaySubject<string>();
    }


    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }


    get context$(): Observable<NewsContext> {
        return this._context$.asObservable();
    }


    get selectedSourceId$(): Observable<string> {
        return this._selectedSourceId$.asObservable();
    }


    loadContext() {
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


    getSourceById(id: string): Observable<NewsSource | null> {
        if (!this.lastLoad) {
            this.loadContext();
        }

        return this.context$.pipe(
            map(context => {
                if (context.editableSources) {
                    const sources = context.editableSources.filter(source => (id === source.id));
                    if (sources && (sources.length === 1)) {
                        return sources[0];
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }),
        );
    }


    getSelectedSourceId(route: ActivatedRouteSnapshot): Observable<string | undefined> {
        const routeId = route.paramMap.get("id")!;

        if (routeId) {
            return of(routeId);
        } else {
            if (!this.lastLoad) {
                this.loadContext();
            }

            return this.context$.pipe(
                map(context => {
                    if (context.editableSources && (context.editableSources.length > 0)) {
                        return context.editableSources[0].id;
                    } else {
                        return undefined;
                    }
                })
            );
        }
    }


    resolveSelectedSource(route: ActivatedRouteSnapshot): Observable<any> {
        return this.getSelectedSourceId(route).pipe(
            tap(id => this._selectedSourceId$.next(id!)),
            switchMap(id => this.getSourceById(id!)),
            mergeMap(source => {
                if (source) {
                    return of(source);
                } else {
                    this.router.navigate(["/actualites/aucun-partenaire"]);
                    return EMPTY;
                }
            })
        );
    }

}
