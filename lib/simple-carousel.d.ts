import { LitElement } from 'lit';
import './slide-button.js';
export declare class SimpleCarousel extends LitElement {
    static styles: import("lit").CSSResult;
    private containerHeight;
    slideIndex: number;
    private readonly slideElements;
    firstUpdated(): void;
    private initializeSlide;
    private changeSlide;
    navigateToNextSlide: () => Promise<void>;
    navigateToPreSlide: () => Promise<void>;
    private navigateWithAnimation;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'simple-carousel': SimpleCarousel;
    }
}
//# sourceMappingURL=simple-carousel.d.ts.map