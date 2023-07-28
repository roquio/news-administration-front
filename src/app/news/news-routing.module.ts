import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {authGuard} from "../core/guards/auth.guard";
import {NewsHomeComponent} from "./components/news-home/news-home.component";
import {NewsSourcesDashboardComponent} from "./components/news-sources-dashboard/news-sources-dashboard.component";
import {adminGuard} from "../core/guards/admin.guard";
import {NewsSourcePreviewComponent} from "./components/news-source-preview/news-source-preview.component";
import {selectedSourceResolver} from "./resolvers/selected-source.resolver";
import {PageNotFoundComponent} from "../shared/components/page-not-found/page-not-found.component";
import {NoNewsSourceComponent} from "./components/no-news-source/no-news-source.component";


const routes: Routes = [
    {
        path: "",
        canActivate: [authGuard],
        children: [
            {
                path: "",
                component: NewsHomeComponent,
                canActivateChild: [authGuard],
                children: [
                    {
                        path: "aucun-partenaire",
                        component: NoNewsSourceComponent
                    },
                    {
                        path: ":id",
                        component: NewsSourcePreviewComponent,
                        resolve: {
                            source: selectedSourceResolver
                        }
                    },
                    {
                        path: "",
                        pathMatch: "full",
                        component: NewsSourcePreviewComponent,
                        resolve: {
                            source: selectedSourceResolver
                        }
                    },
                    {
                        path: "**",
                        component: PageNotFoundComponent
                    }
                ]
            },

            {
                path: "partenaires",
                component: NewsSourcesDashboardComponent,
                canActivate: [adminGuard]
            }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewsRoutingModule {
}
