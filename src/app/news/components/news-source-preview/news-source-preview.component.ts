import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {NewsSource} from "../../models/news-source";
import {NewsService} from "../../services/news.service";
import {ActivatedRoute} from "@angular/router";


@Component({
    selector: "app-news-source-preview",
    templateUrl: "./news-source-preview.component.html",
    styleUrls: ["./news-source-preview.component.scss"]
})
export class NewsSourcePreviewComponent implements OnInit {

    source?: NewsSource;

    loading$!: Observable<boolean>;


    constructor(
        private route: ActivatedRoute,
        private newsService: NewsService
    ) {
    }


    ngOnInit(): void {
        this.route.data.subscribe(data => {
            const source = data["source"];
            if (source) {
                this.source = source;
            }
        });

        this.loading$ = this.newsService.loading$;
    }

}
