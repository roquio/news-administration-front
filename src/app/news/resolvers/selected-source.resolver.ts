import {ResolveFn} from "@angular/router";
import {inject} from "@angular/core";
import {NewsService} from "../services/news.service";
import {NewsSource} from "../models/news-source";
import {Observable} from "rxjs";


export const selectedSourceResolver: ResolveFn<NewsSource> = (route): Observable<any> => {
    return inject(NewsService).resolveSelectedSource(route);
};
