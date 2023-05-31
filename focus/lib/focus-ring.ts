/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';

import {Attachable, AttachableController} from '../../internal/controller/attachable-controller.js';

/**
 * Events that the focus ring listens to.
 */
const EVENTS = ['focusin', 'focusout', 'pointerdown'];

/**
 * A focus ring component.
 */
export class FocusRing extends LitElement implements Attachable {
  /**
   * Makes the focus ring visible.
   */
  @property({type: Boolean, reflect: true}) visible = false;

  /**
   * Makes the focus ring animate inwards instead of outwards.
   */
  @property({type: Boolean, reflect: true}) inward = false;

  get htmlFor() {
    return this.attachableController.htmlFor;
  }

  set htmlFor(htmlFor: string|null) {
    this.attachableController.htmlFor = htmlFor;
  }

  get control() {
    return this.attachableController.control;
  }

  private readonly attachableController =
      new AttachableController(this, this.onControlChange.bind(this));

  attach(control: HTMLElement) {
    this.attachableController.attach(control);
  }

  detach() {
    this.attachableController.detach();
  }

  /** @private */
  handleEvent(event: FocusRingEvent) {
    if (event[HANDLED_BY_FOCUS_RING]) {
      // This ensures the focus ring does not activate when multiple focus rings
      // are used within a single component.
      return;
    }

    switch (event.type) {
      default:
        return;
      case 'focusin':
        this.visible = this.control?.matches(':focus-visible') ?? false;
        break;
      case 'focusout':
      case 'pointerdown':
        this.visible = false;
        break;
    }

    event[HANDLED_BY_FOCUS_RING] = true;
  }

  private onControlChange(prev: HTMLElement|null, next: HTMLElement|null) {
    for (const event of EVENTS) {
      prev?.removeEventListener(event, this);
      next?.addEventListener(event, this);
    }
  }
}

const HANDLED_BY_FOCUS_RING = Symbol('handledByFocusRing');

interface FocusRingEvent extends Event {
  [HANDLED_BY_FOCUS_RING]: true;
}
