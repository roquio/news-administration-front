import {NgModule} from "@angular/core";
import {NewsDashboardComponent} from "./components/news-dashboard/news-dashboard.component";
import {NewsRoutingModule} from "./news-routing.module";
import {SharedModule} from "../shared/shared.module";
import {NewsService} from "./services/news.service";
import {NewsHomeComponent} from './components/news-home/news-home.component';
import {NewsSourcesDashboardComponent} from './components/news-sources-dashboard/news-sources-dashboard.component';
import {NewsSourcePreviewComponent} from './components/news-source-preview/news-source-preview.component';
import {NoNewsSourceComponent} from './components/no-news-source/no-news-source.component';


@NgModule({
    declarations: [
        NewsDashboardComponent,
        NewsHomeComponent,
        NewsSourcesDashboardComponent,
        NewsSourcePreviewComponent,
        NoNewsSourceComponent
    ],
    imports: [
        SharedModule,
        NewsRoutingModule
    ],
    providers: [
        NewsService
    ]
})
export class NewsModule {
}
