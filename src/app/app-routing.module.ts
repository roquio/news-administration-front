import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PageNotFoundComponent} from "./shared/components/page-not-found/page-not-found.component";
import {HomeComponent} from "./shared/components/home/home.component";
import {loginGuard} from "./core/guards/login.guard";


const routes: Routes = [
    {
        path: "accueil",
        component: HomeComponent,
        canActivate: [loginGuard]
    },
    {
        path: "actualites",
        loadChildren: () => import("./news/news.module").then(m => m.NewsModule)
    },
    {
        path: "",
        redirectTo: "accueil",
        pathMatch: "full"
    },
    {
        path: "**",
        component: PageNotFoundComponent
    }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
