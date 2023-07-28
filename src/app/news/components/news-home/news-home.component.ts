import {Component, OnInit} from "@angular/core";
import {NewsService} from "../../services/news.service";
import {Observable} from "rxjs";
import {NewsContext} from "../../models/news-context";


@Component({
    selector: "app-news-home",
    templateUrl: "./news-home.component.html",
    styleUrls: ["./news-home.component.scss"]
})
export class NewsHomeComponent implements OnInit {

    loading$!: Observable<boolean>;
    context$!: Observable<NewsContext>;
    selectedSourceId$!: Observable<string>


    constructor(
        private newsService: NewsService
    ) {
    }


    ngOnInit(): void {
        this.loading$ = this.newsService.loading$;

        this.newsService.loadContext();
        this.context$ = this.newsService.context$;

        this.selectedSourceId$ = this.newsService.selectedSourceId$;
    }

}
