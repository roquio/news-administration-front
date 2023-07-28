import {Pipe, PipeTransform} from "@angular/core";
import {map, Observable} from "rxjs";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";

@Pipe({
    name: "secure"
})
export class SecurePipe implements PipeTransform {

    constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer
    ) {
    }


    transform(url: string): Observable<SafeUrl> {
        return this.http.get(url, {
            responseType: "blob"
        }).pipe(
            map(value => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(value)))
        );
    }

}
