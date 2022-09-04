# Angular 프로젝트에서 React 로 마이그레이션 하기

해당 프로젝트는 어.. 우선.. Angular 의 Getting started 중 하나인 TourOfHeroes 를 베이스로 합니다 <br />
Ref : https://github.com/MaetDol/angular-tutorial/tree/master/angular-tour-of-heroes

---

## 시도 1. 컴포넌트 단위로 마이그레이션

앵귤러의 각 컴포넌트를 리액트 컴포넌트로 옮겨보는건 어떨까요 <br />
물론 서비스나 다른 상태는 앵귤러에 구현된걸 적극적으로 사용해볼 예정이에요

```tsx
// 레퍼런스 타입을 이용해 함수를 전달한다
export type PropInjector<T> = {
  inject: (prop: T) => void;
};

// 리액트 컴포넌트를 앵귤러에서 사용할때, 외부에서 프롭스를 전달해줄 수 있게
// 만들어주는 HOC
function withPropInjector<T>(
  Component: React.FunctionComponent<T>,
  initialProps: T
): [PropInjector<T>, React.FunctionComponent] {
  const injector: PropInjector<T> = {
    inject: () => {},
  };

  function HighOrderComponent() {
    const [injectedProps, setInjectedProps] = React.useState(initialProps);
    injector.inject = (prop) => setInjectedProps(prop);

    return <Component {...injectedProps} />;
  }

  return [injector, HighOrderComponent];
}

// 리액트 컴포넌트를 그려줄 앵귤러 서비스
// 각 컴포넌트를 리액트 root 로 렌더링한다
// 이미 프레임워크가 있는 상태에서 추가적인 상태관리를 할 경우 복잡성이 높아질 것 같아,
// 고려하지 않는 방향으로 진행.
// 만약 필요로 해진다면, Root 에 꽂아넣는 대신, createPortal 을 이용해볼 수 있지 않을까?
@Injectable({
  providedIn: "root",
})
export class ReactRenderService {
  private getRoot(elementRef: ElementRef) {
    const holder = elementRef.nativeElement;
    if (!holder) {
      throw new Error("Cannot access to element ref");
    }

    return ReactDOM.createRoot(holder);
  }

  public render<T>(
    elementRef: ElementRef,
    component: React.FunctionComponent<T>,
    initialProps: T
  ) {
    const root = this.getRoot(elementRef);

    const [injector, ComponentWithProps] = withPropInjector(
      component,
      initialProps
    );
    root.render(<ComponentWithProps />);

    return injector;
  }
}
```
중간 결과 : 따로 노는 느낌이 강하네요.. 스킬이 부족해서 그럴지도 모르겠네요 🤔 <br />

<img src="https://user-images.githubusercontent.com/20384262/188336724-1722a65c-2844-4b2a-9340-8b41b119b252.png" width="500" /> <img src="https://user-images.githubusercontent.com/20384262/188336728-0a621f04-f83f-4306-acf3-9d145a4cb6a7.png" width="500" />
