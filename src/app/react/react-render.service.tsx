import { ElementRef, Injectable } from "@angular/core";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

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
