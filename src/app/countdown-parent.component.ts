import { AfterViewInit, ViewChild } from '@angular/core';
import { Component }                from '@angular/core';
//@ViewChild()에서 쓰려면 컴포넌트도 import!
import { CountdownTimerComponent }  from './countdown-timer.component';


//// Local variable, #timer, version
//이 템플릿 지역 변수(#timer)는 자식 컴포넌트 자체를 가리킴
//자식템플릿 참조 변수(#timer)를 선언하면 
//자식 컴포넌트의 프로퍼티나 메소드에 자유롭게 접근할 수 있습니다.
//하지만 이 방식은 제한이 있습니다. 
//부모 컴포넌트의 템플릿에서만 자식 컴포넌트에 접근할 수 있기 때문 
//부모 컴포넌트의 클래스에서는 자식 컴포넌트에 접근할 수 없기 때문입니다.
//->@ViewChild()쓰면 부모클래스도 접근 가능!
@Component({
  selector: 'app-countdown-parent-lv',
  template: `
  <h3>Countdown to Liftoff (via local variable)</h3>
  <button (click)="timer.start()">Start</button>
  <button (click)="timer.stop()">Stop</button>
  <div class="seconds">{{timer.seconds}}</div>
  <app-countdown-timer #timer></app-countdown-timer>
  `,
  styleUrls: ['../assets/demo.css']
})
export class CountdownLocalVarParentComponent { }

//// View Child version
//부모 컴포넌트의 클래스에서 자식 컴포넌트에 접근하려면 
//자식 컴포넌트에 ViewChild를 사용해서 부모 컴포넌트로 주입 해야 합니다.
@Component({
  selector: 'app-countdown-parent-vc',
  template: `
  <h3>Countdown to Liftoff (via ViewChild)</h3>
  <button (click)="start()">Start</button>
  <button (click)="stop()">Stop</button>
  <div class="seconds">{{ seconds() }}</div>
  <app-countdown-timer></app-countdown-timer>
  `,
  styleUrls: ['../assets/demo.css']
})
export class CountdownViewChildParentComponent implements AfterViewInit {

  @ViewChild(CountdownTimerComponent, {static: false})
  private timerComponent: CountdownTimerComponent;

  seconds() { return 0; }

  //자식 컴포넌트인 타이머 컴포넌트는 
  //Angular가 부모 컴포넌트의 뷰를 화면에 표시한 이후에야 사용할 수 있습니다. 
  //그래서 뷰가 완전히 준비되기 전까지는 0을 표시합니다.
  
  //부모 컴포넌트의 뷰가 준비되면 
  //자식 컴포넌트에서 시간을 가져오기 위해 ngAfterViewInit 라이프싸이클 후킹 함수를 실행하는데, 
  //Angular는 단방향 데이터 흐름을 권장하기 때문에 부모 컴포넌트의 뷰를 같은 JavaScript 실행 싸이클에 업데이트하는 것을 금지합니다.
  //그래서 ngAfterViewInit()에서 자식 컴포넌트의 시간을 가져와서 
  //부모 컴포넌트 프로퍼티에 할당하는 것은 setTimeout() 으로 한 싸이클 늦췄습니다.
  ngAfterViewInit() {
    // `seconds()` 메소드는 `CountdownTimerComponent.seconds`에서 다시 구현합니다.
    // 이 때 개발 모드에서 출력하는 단방향 바인딩 검사 에러를 방지하기 위해
    // 한 싸이클 기다려야 합니다.
    setTimeout(() => this.seconds = () => this.timerComponent.seconds, 0);
  }

  //@ViewChild로 자식 컨포넌트 주입받음!
  //클라스 단위에서도 자식메소드를 자유롭게 사용!
  start() { this.timerComponent.start(); }
  stop() { this.timerComponent.stop(); }
}

