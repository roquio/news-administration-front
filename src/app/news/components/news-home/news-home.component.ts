import {Component, OnInit} from "@angular/core";
import {NewsService} from "../../services/news.service";
import {Observable} from "rxjs";
import {NewsContext} from "../../models/news-context";
import {Router} from "@angular/router";


@Component({
    selector: "app-news-home",
    templateUrl: "./news-home.component.html",
    styleUrls: ["./news-home.component.scss"]
})
export class NewsHomeComponent implements OnInit {

    loading$!: Observable<boolean>;
    context$!: Observable<NewsContext>;


    constructor(
        private router: Router,
        private newsService: NewsService
    ) {
    }


    ngOnInit(): void {
        this.loading$ = this.newsService.loading$;
        this.context$ = this.newsService.context$;
    }


    isDefault(index: number): boolean {
        return (index === 0) && (this.router.url.endsWith("/actualites"));
    }

}
