import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";

import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {FormsModule} from "@angular/forms";
import {HomeComponent} from './components/home/home.component';
import {
    NgbCollapse,
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";
import {SecurePipe} from "./pipes/secure.pipe";


@NgModule({
    declarations: [
        PageNotFoundComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        SecurePipe
    ],
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        NgbCollapse,
        NgbDropdown,
        NgbDropdownToggle,
        NgbDropdownMenu,
        NgbDropdownItem
    ],
    exports: [
        PageNotFoundComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        SecurePipe,
        CommonModule,
        RouterLink,
        FormsModule
    ]
})

export class SharedModule {
}
