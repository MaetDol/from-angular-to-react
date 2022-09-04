import { Component, ElementRef, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  switchMap,
} from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { ReactRenderService } from "../react/react-render.service";
import { HeroSearch } from "./hero-search.react-component";

@Component({
  selector: "app-hero-search",
  templateUrl: "./hero-search.component.html",
  styleUrls: ["./hero-search.component.css"],
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private heroService: HeroService,
    private router: Router,
    private reactRenderService: ReactRenderService,
    private hostElementRef: ElementRef
  ) {}

  ngAfterViewInit() {
    this.reactRenderService.render(this.hostElementRef, HeroSearch, {
      heroService: this.heroService,
      router: this.router,
    });
  }

  search(term: string) {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }
}
