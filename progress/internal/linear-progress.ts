/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';
import {property} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

import {Progress} from './progress.js';

/**
 * A linear progress component.
 */
export class LinearProgress extends Progress {
  /**
   * Buffer amount to display, a fraction between 0 and `max`.
   * If negative, the buffer is not displayed.
   */
  @property({type: Number}) buffer = -1;

  // Note, the indeterminate animation is rendered with transform %'s
  // Previously, this was optimized to use px calculated with the resizeObserver
  // due to a now fixed Chrome bug: crbug.com/389359.
  protected override renderIndicator() {
    const progressStyles = {
      transform: `scaleX(${
        (this.indeterminate ? 1 : this.value / this.max) * 100
      }%)`,
    };
    const dotStyles = {
      transform: `scaleX(${
        // == null is used to check for both null and undefined when buffer attribute is removed
        (this.indeterminate || this.buffer == null || this.buffer < 0 ? 1 : this.buffer / this.max) * 100
      }%)`,
    };

    // Only display dots when visible - this prevents invisible infinite
    // animation.
    const hideDots =
      this.indeterminate || this.buffer == null || this.buffer < 0 || this.buffer >= this.max || this.value >= this.max;
    return html`
      <div class="dots" ?hidden=${hideDots}></div>
      <div class="inactive-track" style=${styleMap(dotStyles)}></div>
      <div class="bar primary-bar" style=${styleMap(progressStyles)}>
        <div class="bar-inner"></div>
      </div>
      <div class="bar secondary-bar">
        <div class="bar-inner"></div>
      </div>
    `;
  }
}
