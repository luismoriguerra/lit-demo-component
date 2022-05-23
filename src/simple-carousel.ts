import {LitElement, html, css} from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import {
  AnimationTuple,
  ICON_LEFT,
  ICON_RIGHT,
  SLIDE_LEFT_IN,
  SLIDE_LEFT_OUT,
  SLIDE_RIGHT_IN,
  SLIDE_RIGHT_OUT,
} from './constants.js';
import {styleMap} from 'lit-html/directives/style-map.js';
import './slide-button.js';

@customElement('simple-carousel')
export class SimpleCarousel extends LitElement {
  static override styles = css`
    ::slotted(.slide-hidden) {
      display: none;
    }
    ::slotted(*) {
      position: absolute;
      padding: 1em;
    }
    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    #container {
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      margin: 0 18px;
      padding: 1em;
      overflow: hidden;
      position: relative;
      box-shadow: var(--shadow, gray) 0.3em 0.3em 0.4em,
        var(--hightlight, white) -0.1em -0.1em 0.3em;
    }
  `;

  @state() private containerHeight = 0;

  @property({type: Number}) slideIndex = 0;

  @queryAssignedElements()
  private readonly slideElements!: HTMLElement[];

  override firstUpdated() {
    this.containerHeight = getMaxHeight(this.slideElements);
    this.initializeSlide();
  }

  // override updated() {
  //   this.navigateSlide();
  // }

  private initializeSlide() {
    for (let i = 0; i < this.slideElements.length; i++) {
      if (i === this.slideIndex) {
        showSlide(this.slideElements[i]);
      } else {
        hideSlide(this.slideElements[i]);
      }
    }
  }

  private changeSlide(offset: number) {
    const slideCount = this.slideElements.length;
    this.slideIndex =
      (slideCount + ((this.slideIndex + offset) % slideCount)) % slideCount;
  }

  navigateToNextSlide = () =>
    this.navigateWithAnimation(1, SLIDE_LEFT_OUT, SLIDE_RIGHT_IN);

  navigateToPreSlide = () =>
    this.navigateWithAnimation(-1, SLIDE_RIGHT_OUT, SLIDE_LEFT_IN);

  private async navigateWithAnimation(
    nextSlideOffset: number,
    leavingAnimation: AnimationTuple,
    enteringAnimation: AnimationTuple
  ) {
    const elLeaving = this.slideElements[this.slideIndex];
    const leavingAnim = elLeaving.animate(
      leavingAnimation[0],
      leavingAnimation[1]
    );
    this.changeSlide(nextSlideOffset);

    const newSlideEl = this.slideElements[this.slideIndex];
    showSlide(newSlideEl);
    const enteringAnim = newSlideEl.animate(
      enteringAnimation[0],
      enteringAnimation[1]
    );

    await Promise.all([leavingAnim.finished, enteringAnim.finished]);
    hideSlide(elLeaving);
  }

  override render() {
    const containerStyles = {
      height: `${this.containerHeight}px`,
    };
    return html`
      <slide-button @click="${this.navigateToPreSlide}">
        ${ICON_LEFT}
      </slide-button>
      <div id="container" style="${styleMap(containerStyles)}">
        <slot></slot>
      </div>
      <slide-button @click="${this.navigateToNextSlide}">
        ${ICON_RIGHT}</slide-button
      >
    `;
  }
}

function hideSlide(el: HTMLElement) {
  el.classList.add('slide-hidden');
}

function showSlide(el: HTMLElement) {
  el.classList.remove('slide-hidden');
}

function getMaxHeight(els: HTMLElement[]): number {
  return Math.max(0, ...els.map((el) => el.getBoundingClientRect().height));
}

declare global {
  interface HTMLElementTagNameMap {
    'simple-carousel': SimpleCarousel;
  }
}
