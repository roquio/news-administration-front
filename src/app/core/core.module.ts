import {LOCALE_ID, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../shared/shared.module";
import {AuthInterceptor} from "./interceptors/auth.interceptor";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        BrowserModule,
        NgbModule,
        SharedModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: LOCALE_ID,
            useValue: "fr-FR"
        }
    ]
})
export class CoreModule {
}
