import {Component, OnInit} from "@angular/core";
import {filter, map, Observable, tap} from "rxjs";
import {NewsSource} from "../../models/news-source";
import {NewsService} from "../../services/news.service";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
    selector: "app-news-source-preview",
    templateUrl: "./news-source-preview.component.html",
    styleUrls: ["./news-source-preview.component.scss"]
})
export class NewsSourcePreviewComponent implements OnInit {

    loading$!: Observable<boolean>;
    source$!: Observable<NewsSource>;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private newsService: NewsService
    ) {
    }


    ngOnInit(): void {
        this.loading$ = this.newsService.loading$;

        this.route.paramMap.subscribe(params => {
            this.source$ = this.newsService.getSelectedSource(params).pipe(
                map(source => source!)
            );

            this.source$.pipe(
                tap(source => {
                    console.log(`source = ${source?.id}`);
                    if (!source) {
                        console.log(`redirection`);
                        this.router.navigate(["./aucun-partenaire"]);
                    }
                }),
                filter(source => !!source),
                map(source => source!)
            ).subscribe();
        });
    }

}
