import {Component, Input, OnInit} from "@angular/core";


@Component({
    selector: "app-news-dashboard",
    templateUrl: "./news-dashboard.component.html",
    styleUrls: ["./news-dashboard.component.scss"]
})
export class NewsDashboardComponent implements OnInit {

    @Input() sourceId!: string;


    constructor(
    ) {
    }


    ngOnInit(): void {

    }

}
