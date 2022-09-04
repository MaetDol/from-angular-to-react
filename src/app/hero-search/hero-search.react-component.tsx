import { Router } from "@angular/router";
import { useEffect, useRef, useState } from "react";
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { StyledDiv } from "./hero-search.styles";

export interface Props {
  heroService: HeroService;
  router: Router;
}

export function HeroSearch({ heroService, router }: Props) {
  const searchTerms = useRef(new Subject<string>());
  const [heros, setHeros] = useState<Hero[]>([]);
  useEffect(() => {
    searchTerms.current
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => heroService.searchHeroes(term))
      )
      .subscribe(setHeros);
  }, []);

  const [searchBox, setSearchBox] = useState("");
  useEffect(() => {
    searchTerms.current.next(searchBox);
  }, [searchBox]);

  return (
    <StyledDiv>
      <label htmlFor="search-box">Hero Search</label>
      <input
        id="search-box"
        onChange={(e) => setSearchBox(e.target.value)}
        value={searchBox}
      />

      <ul className="search-result">
        {heros.map((hero) => (
          <li key={hero.id}>
            <a onClick={() => router.navigateByUrl(`/detail/${hero.id}`)}>
              {hero.name}
            </a>
          </li>
        ))}
      </ul>
    </StyledDiv>
  );
}
