var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i7 = decorators.length - 1, decorator; i7 >= 0; i7--)
    if (decorator = decorators[i7])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// @lit-labs/ssr-dom-shim/lib/element-internals.js
var ElementInternalsShim = class ElementInternals {
  get shadowRoot() {
    return this.__host.__shadowRoot;
  }
  constructor(_host) {
    this.ariaActiveDescendantElement = null;
    this.ariaAtomic = "";
    this.ariaAutoComplete = "";
    this.ariaBrailleLabel = "";
    this.ariaBrailleRoleDescription = "";
    this.ariaBusy = "";
    this.ariaChecked = "";
    this.ariaColCount = "";
    this.ariaColIndex = "";
    this.ariaColIndexText = "";
    this.ariaColSpan = "";
    this.ariaControlsElements = null;
    this.ariaCurrent = "";
    this.ariaDescribedByElements = null;
    this.ariaDescription = "";
    this.ariaDetailsElements = null;
    this.ariaDisabled = "";
    this.ariaErrorMessageElements = null;
    this.ariaExpanded = "";
    this.ariaFlowToElements = null;
    this.ariaHasPopup = "";
    this.ariaHidden = "";
    this.ariaInvalid = "";
    this.ariaKeyShortcuts = "";
    this.ariaLabel = "";
    this.ariaLabelledByElements = null;
    this.ariaLevel = "";
    this.ariaLive = "";
    this.ariaModal = "";
    this.ariaMultiLine = "";
    this.ariaMultiSelectable = "";
    this.ariaOrientation = "";
    this.ariaOwnsElements = null;
    this.ariaPlaceholder = "";
    this.ariaPosInSet = "";
    this.ariaPressed = "";
    this.ariaReadOnly = "";
    this.ariaRelevant = "";
    this.ariaRequired = "";
    this.ariaRoleDescription = "";
    this.ariaRowCount = "";
    this.ariaRowIndex = "";
    this.ariaRowIndexText = "";
    this.ariaRowSpan = "";
    this.ariaSelected = "";
    this.ariaSetSize = "";
    this.ariaSort = "";
    this.ariaValueMax = "";
    this.ariaValueMin = "";
    this.ariaValueNow = "";
    this.ariaValueText = "";
    this.role = "";
    this.form = null;
    this.labels = [];
    this.states = /* @__PURE__ */ new Set();
    this.validationMessage = "";
    this.validity = {};
    this.willValidate = true;
    this.__host = _host;
  }
  checkValidity() {
    console.warn("`ElementInternals.checkValidity()` was called on the server.This method always returns true.");
    return true;
  }
  reportValidity() {
    return true;
  }
  setFormValue() {
  }
  setValidity() {
  }
};

// @lit-labs/ssr-dom-shim/lib/events.js
var __classPrivateFieldSet = function(receiver, state, value, kind, f3) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f3) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f3 : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f3.call(receiver, value) : f3 ? f3.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind, f3) {
  if (kind === "a" && !f3) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f3 : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f3 : kind === "a" ? f3.call(receiver) : f3 ? f3.value : state.get(receiver);
};
var _Event_cancelable;
var _Event_bubbles;
var _Event_composed;
var _Event_defaultPrevented;
var _Event_timestamp;
var _Event_propagationStopped;
var _Event_type;
var _Event_target;
var _Event_isBeingDispatched;
var _a;
var _CustomEvent_detail;
var _b;
var NONE = 0;
var CAPTURING_PHASE = 1;
var AT_TARGET = 2;
var BUBBLING_PHASE = 3;
var enumerableProperty = { __proto__: null };
enumerableProperty.enumerable = true;
Object.freeze(enumerableProperty);
var EventShim = (_a = class Event {
  constructor(type, options = {}) {
    _Event_cancelable.set(this, false);
    _Event_bubbles.set(this, false);
    _Event_composed.set(this, false);
    _Event_defaultPrevented.set(this, false);
    _Event_timestamp.set(this, Date.now());
    _Event_propagationStopped.set(this, false);
    _Event_type.set(this, void 0);
    _Event_target.set(this, void 0);
    _Event_isBeingDispatched.set(this, void 0);
    this.NONE = NONE;
    this.CAPTURING_PHASE = CAPTURING_PHASE;
    this.AT_TARGET = AT_TARGET;
    this.BUBBLING_PHASE = BUBBLING_PHASE;
    if (arguments.length === 0)
      throw new Error(`The type argument must be specified`);
    if (typeof options !== "object" || !options) {
      throw new Error(`The "options" argument must be an object`);
    }
    const { bubbles, cancelable, composed } = options;
    __classPrivateFieldSet(this, _Event_cancelable, !!cancelable, "f");
    __classPrivateFieldSet(this, _Event_bubbles, !!bubbles, "f");
    __classPrivateFieldSet(this, _Event_composed, !!composed, "f");
    __classPrivateFieldSet(this, _Event_type, `${type}`, "f");
    __classPrivateFieldSet(this, _Event_target, null, "f");
    __classPrivateFieldSet(this, _Event_isBeingDispatched, false, "f");
  }
  initEvent(_type, _bubbles, _cancelable) {
    throw new Error("Method not implemented.");
  }
  stopImmediatePropagation() {
    this.stopPropagation();
  }
  preventDefault() {
    __classPrivateFieldSet(this, _Event_defaultPrevented, true, "f");
  }
  get target() {
    return __classPrivateFieldGet(this, _Event_target, "f");
  }
  get currentTarget() {
    return __classPrivateFieldGet(this, _Event_target, "f");
  }
  get srcElement() {
    return __classPrivateFieldGet(this, _Event_target, "f");
  }
  get type() {
    return __classPrivateFieldGet(this, _Event_type, "f");
  }
  get cancelable() {
    return __classPrivateFieldGet(this, _Event_cancelable, "f");
  }
  get defaultPrevented() {
    return __classPrivateFieldGet(this, _Event_cancelable, "f") && __classPrivateFieldGet(this, _Event_defaultPrevented, "f");
  }
  get timeStamp() {
    return __classPrivateFieldGet(this, _Event_timestamp, "f");
  }
  composedPath() {
    return __classPrivateFieldGet(this, _Event_isBeingDispatched, "f") ? [__classPrivateFieldGet(this, _Event_target, "f")] : [];
  }
  get returnValue() {
    return !__classPrivateFieldGet(this, _Event_cancelable, "f") || !__classPrivateFieldGet(this, _Event_defaultPrevented, "f");
  }
  get bubbles() {
    return __classPrivateFieldGet(this, _Event_bubbles, "f");
  }
  get composed() {
    return __classPrivateFieldGet(this, _Event_composed, "f");
  }
  get eventPhase() {
    return __classPrivateFieldGet(this, _Event_isBeingDispatched, "f") ? _a.AT_TARGET : _a.NONE;
  }
  get cancelBubble() {
    return __classPrivateFieldGet(this, _Event_propagationStopped, "f");
  }
  set cancelBubble(value) {
    if (value) {
      __classPrivateFieldSet(this, _Event_propagationStopped, true, "f");
    }
  }
  stopPropagation() {
    __classPrivateFieldSet(this, _Event_propagationStopped, true, "f");
  }
  get isTrusted() {
    return false;
  }
}, _Event_cancelable = /* @__PURE__ */ new WeakMap(), _Event_bubbles = /* @__PURE__ */ new WeakMap(), _Event_composed = /* @__PURE__ */ new WeakMap(), _Event_defaultPrevented = /* @__PURE__ */ new WeakMap(), _Event_timestamp = /* @__PURE__ */ new WeakMap(), _Event_propagationStopped = /* @__PURE__ */ new WeakMap(), _Event_type = /* @__PURE__ */ new WeakMap(), _Event_target = /* @__PURE__ */ new WeakMap(), _Event_isBeingDispatched = /* @__PURE__ */ new WeakMap(), _a.NONE = NONE, _a.CAPTURING_PHASE = CAPTURING_PHASE, _a.AT_TARGET = AT_TARGET, _a.BUBBLING_PHASE = BUBBLING_PHASE, _a);
Object.defineProperties(EventShim.prototype, {
  initEvent: enumerableProperty,
  stopImmediatePropagation: enumerableProperty,
  preventDefault: enumerableProperty,
  target: enumerableProperty,
  currentTarget: enumerableProperty,
  srcElement: enumerableProperty,
  type: enumerableProperty,
  cancelable: enumerableProperty,
  defaultPrevented: enumerableProperty,
  timeStamp: enumerableProperty,
  composedPath: enumerableProperty,
  returnValue: enumerableProperty,
  bubbles: enumerableProperty,
  composed: enumerableProperty,
  eventPhase: enumerableProperty,
  cancelBubble: enumerableProperty,
  stopPropagation: enumerableProperty,
  isTrusted: enumerableProperty
});
var CustomEventShim = (_b = class CustomEvent2 extends EventShim {
  constructor(type, options = {}) {
    super(type, options);
    _CustomEvent_detail.set(this, void 0);
    __classPrivateFieldSet(this, _CustomEvent_detail, options?.detail ?? null, "f");
  }
  initCustomEvent(_type, _bubbles, _cancelable, _detail) {
    throw new Error("Method not implemented.");
  }
  get detail() {
    return __classPrivateFieldGet(this, _CustomEvent_detail, "f");
  }
}, _CustomEvent_detail = /* @__PURE__ */ new WeakMap(), _b);
Object.defineProperties(CustomEventShim.prototype, {
  detail: enumerableProperty
});
var EventShimWithRealType = EventShim;
var CustomEventShimWithRealType = CustomEventShim;

// @lit-labs/ssr-dom-shim/lib/css.js
var _a2;
var CSSRuleShim = (_a2 = class CSSRule {
  constructor() {
    this.STYLE_RULE = 1;
    this.CHARSET_RULE = 2;
    this.IMPORT_RULE = 3;
    this.MEDIA_RULE = 4;
    this.FONT_FACE_RULE = 5;
    this.PAGE_RULE = 6;
    this.NAMESPACE_RULE = 10;
    this.KEYFRAMES_RULE = 7;
    this.KEYFRAME_RULE = 8;
    this.SUPPORTS_RULE = 12;
    this.COUNTER_STYLE_RULE = 11;
    this.FONT_FEATURE_VALUES_RULE = 14;
    this.MARGIN_RULE = 9;
    this.__parentStyleSheet = null;
    this.cssText = "";
  }
  get parentRule() {
    return null;
  }
  get parentStyleSheet() {
    return this.__parentStyleSheet;
  }
  get type() {
    return 0;
  }
}, _a2.STYLE_RULE = 1, _a2.CHARSET_RULE = 2, _a2.IMPORT_RULE = 3, _a2.MEDIA_RULE = 4, _a2.FONT_FACE_RULE = 5, _a2.PAGE_RULE = 6, _a2.NAMESPACE_RULE = 10, _a2.KEYFRAMES_RULE = 7, _a2.KEYFRAME_RULE = 8, _a2.SUPPORTS_RULE = 12, _a2.COUNTER_STYLE_RULE = 11, _a2.FONT_FEATURE_VALUES_RULE = 14, _a2.MARGIN_RULE = 9, _a2);

// @lit-labs/ssr-dom-shim/index.js
globalThis.Event ??= EventShimWithRealType;
globalThis.CustomEvent ??= CustomEventShimWithRealType;
var constructionToken = Symbol();
var isCaptureEventListener = (options) => typeof options === "boolean" ? options : options?.capture ?? false;
var enumerableProperty2 = { __proto__: null };
enumerableProperty2.enumerable = true;
Object.freeze(enumerableProperty2);
var EventTarget = class {
  constructor() {
    this.__eventListeners = /* @__PURE__ */ new Map();
    this.__captureEventListeners = /* @__PURE__ */ new Map();
  }
  addEventListener(type, callback, options) {
    if (callback === void 0 || callback === null) {
      return;
    }
    const eventListenersMap = isCaptureEventListener(options) ? this.__captureEventListeners : this.__eventListeners;
    let eventListeners = eventListenersMap.get(type);
    if (eventListeners === void 0) {
      eventListeners = /* @__PURE__ */ new Map();
      eventListenersMap.set(type, eventListeners);
    } else if (eventListeners.has(callback)) {
      return;
    }
    const normalizedOptions = typeof options === "object" && options ? options : {};
    normalizedOptions.signal?.addEventListener("abort", () => this.removeEventListener(type, callback, options));
    eventListeners.set(callback, normalizedOptions ?? {});
  }
  removeEventListener(type, callback, options) {
    if (callback === void 0 || callback === null) {
      return;
    }
    const eventListenersMap = isCaptureEventListener(options) ? this.__captureEventListeners : this.__eventListeners;
    const eventListeners = eventListenersMap.get(type);
    if (eventListeners !== void 0) {
      eventListeners.delete(callback);
      if (!eventListeners.size) {
        eventListenersMap.delete(type);
      }
    }
  }
  dispatchEvent(event) {
    let composedPath = this.__resolveFullEventPath();
    if (!event.composed && this.__host) {
      composedPath = composedPath.slice(0, composedPath.indexOf(this.__host));
    }
    let stopPropagation = false;
    let stopImmediatePropagation = false;
    let eventPhase = EventShimWithRealType.NONE;
    let target = null;
    let tmpTarget = null;
    let currentTarget = null;
    const originalStopPropagation = event.stopPropagation;
    const originalStopImmediatePropagation = event.stopImmediatePropagation;
    Object.defineProperties(event, {
      target: {
        get() {
          return target ?? tmpTarget;
        },
        ...enumerableProperty2
      },
      srcElement: {
        get() {
          return event.target;
        },
        ...enumerableProperty2
      },
      currentTarget: {
        get() {
          return currentTarget;
        },
        ...enumerableProperty2
      },
      eventPhase: {
        get() {
          return eventPhase;
        },
        ...enumerableProperty2
      },
      composedPath: {
        value: () => composedPath,
        ...enumerableProperty2
      },
      stopPropagation: {
        value: () => {
          stopPropagation = true;
          originalStopPropagation.call(event);
        },
        ...enumerableProperty2
      },
      stopImmediatePropagation: {
        value: () => {
          stopImmediatePropagation = true;
          originalStopImmediatePropagation.call(event);
        },
        ...enumerableProperty2
      }
    });
    const invokeEventListener = (listener, options, eventListenerMap) => {
      if (typeof listener === "function") {
        listener(event);
      } else if (typeof listener?.handleEvent === "function") {
        listener.handleEvent(event);
      }
      if (options.once) {
        eventListenerMap.delete(listener);
      }
    };
    const finishDispatch = () => {
      currentTarget = null;
      eventPhase = EventShimWithRealType.NONE;
      return !event.defaultPrevented;
    };
    const captureEventPath = composedPath.slice().reverse();
    target = !this.__host || !event.composed ? this : null;
    const retarget = (eventTargets) => {
      tmpTarget = this;
      while (tmpTarget.__host && eventTargets.includes(tmpTarget.__host)) {
        tmpTarget = tmpTarget.__host;
      }
    };
    for (const eventTarget of captureEventPath) {
      if (!target && (!tmpTarget || tmpTarget === eventTarget.__host)) {
        retarget(captureEventPath.slice(captureEventPath.indexOf(eventTarget)));
      }
      currentTarget = eventTarget;
      eventPhase = eventTarget === event.target ? EventShimWithRealType.AT_TARGET : EventShimWithRealType.CAPTURING_PHASE;
      const captureEventListeners = eventTarget.__captureEventListeners.get(event.type);
      if (captureEventListeners) {
        for (const [listener, options] of captureEventListeners) {
          invokeEventListener(listener, options, captureEventListeners);
          if (stopImmediatePropagation) {
            return finishDispatch();
          }
        }
      }
      if (stopPropagation) {
        return finishDispatch();
      }
    }
    const bubbleEventPath = event.bubbles ? composedPath : [this];
    tmpTarget = null;
    for (const eventTarget of bubbleEventPath) {
      if (!target && (!tmpTarget || eventTarget === tmpTarget.__host)) {
        retarget(bubbleEventPath.slice(0, bubbleEventPath.indexOf(eventTarget) + 1));
      }
      currentTarget = eventTarget;
      eventPhase = eventTarget === event.target ? EventShimWithRealType.AT_TARGET : EventShimWithRealType.BUBBLING_PHASE;
      const eventListeners = eventTarget.__eventListeners.get(event.type);
      if (eventListeners) {
        for (const [listener, options] of eventListeners) {
          invokeEventListener(listener, options, eventListeners);
          if (stopImmediatePropagation) {
            return finishDispatch();
          }
        }
      }
      if (stopPropagation) {
        return finishDispatch();
      }
    }
    return finishDispatch();
  }
  __resolveFullEventPath() {
    if (this.__eventPathCache) {
      return this.__eventPathCache;
    } else if (!this.__eventTargetParent) {
      return this.__eventPathCache = [this, documentShim, windowShim];
    } else {
      return this.__eventPathCache = [
        this,
        ...this.__eventTargetParent.__resolveFullEventPath()
      ];
    }
  }
};
var attributes = /* @__PURE__ */ new WeakMap();
var attributesForElement = (element) => {
  let attrs = attributes.get(element);
  if (attrs === void 0) {
    attributes.set(element, attrs = /* @__PURE__ */ new Map());
  }
  return attrs;
};
var NodeShim = class Node2 extends EventTarget {
  getRootNode(options) {
    if (options?.composed) {
      return document2;
    }
    const host = this.__host;
    return host?.__shadowRoot ?? document2;
  }
};
var DocumentShim = class Document2 extends NodeShim {
  get adoptedStyleSheets() {
    return [];
  }
  createTreeWalker() {
    return {};
  }
  createTextNode() {
    return {};
  }
  createElement() {
    return {};
  }
};
var documentShim = new DocumentShim();
var document2 = documentShim;
var WindowShim = class Window extends NodeShim {
  constructor(token) {
    super();
    if (token !== constructionToken) {
      throw new TypeError("Illegal constructor");
    }
    Object.assign(this, globalThis, {
      CustomElementRegistry,
      customElements: customElements2,
      document: document2,
      Document: DocumentShim,
      Element: ElementShim,
      EventTarget,
      HTMLElement: HTMLElementShim,
      Node: NodeShim,
      ShadowRoot: ShadowRootShim,
      window: this,
      Window: WindowShim
    });
  }
};
var ElementShim = class Element extends NodeShim {
  constructor() {
    super(...arguments);
    this.__shadowRootMode = null;
    this.__shadowRoot = null;
    this.__internals = null;
  }
  get attributes() {
    return Array.from(attributesForElement(this)).map(([name, value]) => ({
      name,
      value
    }));
  }
  get shadowRoot() {
    if (this.__shadowRootMode === "closed") {
      return null;
    }
    return this.__shadowRoot;
  }
  get localName() {
    return this.constructor.__localName;
  }
  get tagName() {
    return this.localName?.toUpperCase();
  }
  setAttribute(name, value) {
    attributesForElement(this).set(name, String(value));
  }
  removeAttribute(name) {
    attributesForElement(this).delete(name);
  }
  toggleAttribute(name, force) {
    if (this.hasAttribute(name)) {
      if (force === void 0 || !force) {
        this.removeAttribute(name);
        return false;
      }
    } else {
      if (force === void 0 || force) {
        this.setAttribute(name, "");
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
  hasAttribute(name) {
    return attributesForElement(this).has(name);
  }
  attachShadow(init) {
    this.__shadowRootMode = init.mode;
    const shadowRoot = new ShadowRootShim(constructionToken, init);
    shadowRoot.__eventTargetParent = this;
    shadowRoot.__host = this;
    return this.__shadowRoot = shadowRoot;
  }
  attachInternals() {
    if (this.__internals !== null) {
      throw new Error(`Failed to execute 'attachInternals' on 'HTMLElement': ElementInternals for the specified element was already attached.`);
    }
    const internals = new ElementInternalsShim(this);
    this.__internals = internals;
    return internals;
  }
  getAttribute(name) {
    const value = attributesForElement(this).get(name);
    return value ?? null;
  }
};
var HTMLElementShim = class HTMLElement2 extends ElementShim {
};
var HTMLElementShimWithRealType = HTMLElementShim;
var ShadowRootShim = class ShadowRoot extends NodeShim {
  get host() {
    return this.__host;
  }
  constructor(constructionToken2, init) {
    super();
    if (constructionToken2 !== constructionToken2) {
      throw new TypeError("Illegal constructor");
    }
    this.mode = init.mode;
  }
};
globalThis.litServerRoot ??= Object.defineProperty(new HTMLElementShimWithRealType(), "localName", {
  // Patch localName (and tagName) to return a unique name.
  get() {
    return "lit-server-root";
  }
});
function promiseWithResolvers() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
var CustomElementRegistry = class {
  constructor() {
    this.__definitions = /* @__PURE__ */ new Map();
    this.__reverseDefinitions = /* @__PURE__ */ new Map();
    this.__pendingWhenDefineds = /* @__PURE__ */ new Map();
  }
  define(name, ctor) {
    if (this.__definitions.has(name)) {
      if (true) {
        console.warn(`'CustomElementRegistry' already has "${name}" defined. This may have been caused by live reload or hot module replacement in which case it can be safely ignored.
Make sure to test your application with a production build as repeat registrations will throw in production.`);
      } else {
        throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': the name "${name}" has already been used with this registry`);
      }
    }
    if (this.__reverseDefinitions.has(ctor)) {
      throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': the constructor has already been used with this registry for the tag name ${this.__reverseDefinitions.get(ctor)}`);
    }
    ctor.__localName = name;
    this.__definitions.set(name, {
      ctor,
      // Note it's important we read `observedAttributes` in case it is a getter
      // with side-effects, as is the case in Lit, where it triggers class
      // finalization.
      //
      // TODO(aomarks) To be spec compliant, we should also capture the
      // registration-time lifecycle methods like `connectedCallback`. For them
      // to be actually accessible to e.g. the Lit SSR element renderer, though,
      // we'd need to introduce a new API for accessing them (since `get` only
      // returns the constructor).
      observedAttributes: ctor.observedAttributes ?? []
    });
    this.__reverseDefinitions.set(ctor, name);
    this.__pendingWhenDefineds.get(name)?.resolve(ctor);
    this.__pendingWhenDefineds.delete(name);
  }
  get(name) {
    const definition = this.__definitions.get(name);
    return definition?.ctor;
  }
  getName(ctor) {
    return this.__reverseDefinitions.get(ctor) ?? null;
  }
  initialize(_root) {
    throw new Error(`customElements.initialize is not currently supported in SSR. Please file a bug if you need it.`);
  }
  upgrade(_element) {
    throw new Error(`customElements.upgrade is not currently supported in SSR. Please file a bug if you need it.`);
  }
  async whenDefined(name) {
    const definition = this.__definitions.get(name);
    if (definition) {
      return definition.ctor;
    }
    let withResolvers = this.__pendingWhenDefineds.get(name);
    if (!withResolvers) {
      withResolvers = promiseWithResolvers();
      this.__pendingWhenDefineds.set(name, withResolvers);
    }
    return withResolvers.promise;
  }
};
var CustomElementRegistryShimWithRealType = CustomElementRegistry;
var customElements2 = new CustomElementRegistryShimWithRealType();
var windowShim = new WindowShim(constructionToken);

// @lit/reactive-element/node/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t6, e5, o7) {
    if (this._$cssResult$ = true, o7 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t6, this.t = e5;
  }
  get styleSheet() {
    let t6 = this.o;
    const s5 = this.t;
    if (e && void 0 === t6) {
      const e5 = void 0 !== s5 && 1 === s5.length;
      e5 && (t6 = o.get(s5)), void 0 === t6 && ((this.o = t6 = new CSSStyleSheet()).replaceSync(this.cssText), e5 && o.set(s5, t6));
    }
    return t6;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t6) => new n("string" == typeof t6 ? t6 : t6 + "", void 0, s);
var i = (t6, ...e5) => {
  const o7 = 1 === t6.length ? t6[0] : e5.reduce((e6, s5, o8) => e6 + ((t7) => {
    if (true === t7._$cssResult$) return t7.cssText;
    if ("number" == typeof t7) return t7;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t7 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s5) + t6[o8 + 1], t6[0]);
  return new n(o7, t6, s);
};
var S = (s5, o7) => {
  if (e) s5.adoptedStyleSheets = o7.map((t6) => t6 instanceof CSSStyleSheet ? t6 : t6.styleSheet);
  else for (const e5 of o7) {
    const o8 = document.createElement("style"), n6 = t.litNonce;
    void 0 !== n6 && o8.setAttribute("nonce", n6), o8.textContent = e5.cssText, s5.appendChild(o8);
  }
};
var c = e || void 0 === t.CSSStyleSheet ? (t6) => t6 : (t6) => t6 instanceof CSSStyleSheet ? ((t7) => {
  let e5 = "";
  for (const s5 of t7.cssRules) e5 += s5.cssText;
  return r(e5);
})(t6) : t6;

// @lit/reactive-element/node/reactive-element.js
var { is: h, defineProperty: r2, getOwnPropertyDescriptor: o2, getOwnPropertyNames: n2, getOwnPropertySymbols: a, getPrototypeOf: c2 } = Object;
var l = globalThis;
l.customElements ??= customElements2;
var p = l.trustedTypes;
var d = p ? p.emptyScript : "";
var u = l.reactiveElementPolyfillSupport;
var f = (t6, s5) => t6;
var b = { toAttribute(t6, s5) {
  switch (s5) {
    case Boolean:
      t6 = t6 ? d : null;
      break;
    case Object:
    case Array:
      t6 = null == t6 ? t6 : JSON.stringify(t6);
  }
  return t6;
}, fromAttribute(t6, s5) {
  let i7 = t6;
  switch (s5) {
    case Boolean:
      i7 = null !== t6;
      break;
    case Number:
      i7 = null === t6 ? null : Number(t6);
      break;
    case Object:
    case Array:
      try {
        i7 = JSON.parse(t6);
      } catch (t7) {
        i7 = null;
      }
  }
  return i7;
} };
var m = (t6, s5) => !h(t6, s5);
var y = { attribute: true, type: String, converter: b, reflect: false, useDefault: false, hasChanged: m };
Symbol.metadata ??= Symbol("metadata"), l.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var g = class extends (globalThis.HTMLElement ?? HTMLElementShimWithRealType) {
  static addInitializer(t6) {
    this._$Ei(), (this.l ??= []).push(t6);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t6, s5 = y) {
    if (s5.state && (s5.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t6) && ((s5 = Object.create(s5)).wrapped = true), this.elementProperties.set(t6, s5), !s5.noAccessor) {
      const i7 = Symbol(), e5 = this.getPropertyDescriptor(t6, i7, s5);
      void 0 !== e5 && r2(this.prototype, t6, e5);
    }
  }
  static getPropertyDescriptor(t6, s5, i7) {
    const { get: e5, set: h4 } = o2(this.prototype, t6) ?? { get() {
      return this[s5];
    }, set(t7) {
      this[s5] = t7;
    } };
    return { get: e5, set(s6) {
      const r6 = e5?.call(this);
      h4?.call(this, s6), this.requestUpdate(t6, r6, i7);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t6) {
    return this.elementProperties.get(t6) ?? y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(f("elementProperties"))) return;
    const t6 = c2(this);
    t6.finalize(), void 0 !== t6.l && (this.l = [...t6.l]), this.elementProperties = new Map(t6.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(f("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(f("properties"))) {
      const t7 = this.properties, s5 = [...n2(t7), ...a(t7)];
      for (const i7 of s5) this.createProperty(i7, t7[i7]);
    }
    const t6 = this[Symbol.metadata];
    if (null !== t6) {
      const s5 = litPropertyMetadata.get(t6);
      if (void 0 !== s5) for (const [t7, i7] of s5) this.elementProperties.set(t7, i7);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t7, s5] of this.elementProperties) {
      const i7 = this._$Eu(t7, s5);
      void 0 !== i7 && this._$Eh.set(i7, t7);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t6) {
    const s5 = [];
    if (Array.isArray(t6)) {
      const e5 = new Set(t6.flat(1 / 0).reverse());
      for (const t7 of e5) s5.unshift(c(t7));
    } else void 0 !== t6 && s5.push(c(t6));
    return s5;
  }
  static _$Eu(t6, s5) {
    const i7 = s5.attribute;
    return false === i7 ? void 0 : "string" == typeof i7 ? i7 : "string" == typeof t6 ? t6.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t6) => this.enableUpdating = t6), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t6) => t6(this));
  }
  addController(t6) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t6), void 0 !== this.renderRoot && this.isConnected && t6.hostConnected?.();
  }
  removeController(t6) {
    this._$EO?.delete(t6);
  }
  _$E_() {
    const t6 = /* @__PURE__ */ new Map(), s5 = this.constructor.elementProperties;
    for (const i7 of s5.keys()) this.hasOwnProperty(i7) && (t6.set(i7, this[i7]), delete this[i7]);
    t6.size > 0 && (this._$Ep = t6);
  }
  createRenderRoot() {
    const t6 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t6, this.constructor.elementStyles), t6;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t6) => t6.hostConnected?.());
  }
  enableUpdating(t6) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t6) => t6.hostDisconnected?.());
  }
  attributeChangedCallback(t6, s5, i7) {
    this._$AK(t6, i7);
  }
  _$ET(t6, s5) {
    const i7 = this.constructor.elementProperties.get(t6), e5 = this.constructor._$Eu(t6, i7);
    if (void 0 !== e5 && true === i7.reflect) {
      const h4 = (void 0 !== i7.converter?.toAttribute ? i7.converter : b).toAttribute(s5, i7.type);
      this._$Em = t6, null == h4 ? this.removeAttribute(e5) : this.setAttribute(e5, h4), this._$Em = null;
    }
  }
  _$AK(t6, s5) {
    const i7 = this.constructor, e5 = i7._$Eh.get(t6);
    if (void 0 !== e5 && this._$Em !== e5) {
      const t7 = i7.getPropertyOptions(e5), h4 = "function" == typeof t7.converter ? { fromAttribute: t7.converter } : void 0 !== t7.converter?.fromAttribute ? t7.converter : b;
      this._$Em = e5;
      const r6 = h4.fromAttribute(s5, t7.type);
      this[e5] = r6 ?? this._$Ej?.get(e5) ?? r6, this._$Em = null;
    }
  }
  requestUpdate(t6, s5, i7, e5 = false, h4) {
    if (void 0 !== t6) {
      const r6 = this.constructor;
      if (false === e5 && (h4 = this[t6]), i7 ??= r6.getPropertyOptions(t6), !((i7.hasChanged ?? m)(h4, s5) || i7.useDefault && i7.reflect && h4 === this._$Ej?.get(t6) && !this.hasAttribute(r6._$Eu(t6, i7)))) return;
      this.C(t6, s5, i7);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t6, s5, { useDefault: i7, reflect: e5, wrapped: h4 }, r6) {
    i7 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t6) && (this._$Ej.set(t6, r6 ?? s5 ?? this[t6]), true !== h4 || void 0 !== r6) || (this._$AL.has(t6) || (this.hasUpdated || i7 || (s5 = void 0), this._$AL.set(t6, s5)), true === e5 && this._$Em !== t6 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t6));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t7) {
      Promise.reject(t7);
    }
    const t6 = this.scheduleUpdate();
    return null != t6 && await t6, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t8, s6] of this._$Ep) this[t8] = s6;
        this._$Ep = void 0;
      }
      const t7 = this.constructor.elementProperties;
      if (t7.size > 0) for (const [s6, i7] of t7) {
        const { wrapped: t8 } = i7, e5 = this[s6];
        true !== t8 || this._$AL.has(s6) || void 0 === e5 || this.C(s6, void 0, i7, e5);
      }
    }
    let t6 = false;
    const s5 = this._$AL;
    try {
      t6 = this.shouldUpdate(s5), t6 ? (this.willUpdate(s5), this._$EO?.forEach((t7) => t7.hostUpdate?.()), this.update(s5)) : this._$EM();
    } catch (s6) {
      throw t6 = false, this._$EM(), s6;
    }
    t6 && this._$AE(s5);
  }
  willUpdate(t6) {
  }
  _$AE(t6) {
    this._$EO?.forEach((t7) => t7.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t6)), this.updated(t6);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t6) {
    return true;
  }
  update(t6) {
    this._$Eq &&= this._$Eq.forEach((t7) => this._$ET(t7, this[t7])), this._$EM();
  }
  updated(t6) {
  }
  firstUpdated(t6) {
  }
};
g.elementStyles = [], g.shadowRootOptions = { mode: "open" }, g[f("elementProperties")] = /* @__PURE__ */ new Map(), g[f("finalized")] = /* @__PURE__ */ new Map(), u?.({ ReactiveElement: g }), (l.reactiveElementVersions ??= []).push("2.1.2");

// lit-html/lit-html.js
var t2 = globalThis;
var i2 = (t6) => t6;
var s2 = t2.trustedTypes;
var e2 = s2 ? s2.createPolicy("lit-html", { createHTML: (t6) => t6 }) : void 0;
var h2 = "$lit$";
var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n3 = "?" + o3;
var r3 = `<${n3}>`;
var l2 = document;
var c3 = () => l2.createComment("");
var a2 = (t6) => null === t6 || "object" != typeof t6 && "function" != typeof t6;
var u2 = Array.isArray;
var d2 = (t6) => u2(t6) || "function" == typeof t6?.[Symbol.iterator];
var f2 = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m2 = />/g;
var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g2 = /'/g;
var $ = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var x = (t6) => (i7, ...s5) => ({ _$litType$: t6, strings: i7, values: s5 });
var b2 = x(1);
var w = x(2);
var T = x(3);
var E = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l2.createTreeWalker(l2, 129);
function V(t6, i7) {
  if (!u2(t6) || !t6.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e2 ? e2.createHTML(i7) : i7;
}
var N = (t6, i7) => {
  const s5 = t6.length - 1, e5 = [];
  let n6, l3 = 2 === i7 ? "<svg>" : 3 === i7 ? "<math>" : "", c5 = v;
  for (let i8 = 0; i8 < s5; i8++) {
    const s6 = t6[i8];
    let a3, u5, d3 = -1, f3 = 0;
    for (; f3 < s6.length && (c5.lastIndex = f3, u5 = c5.exec(s6), null !== u5); ) f3 = c5.lastIndex, c5 === v ? "!--" === u5[1] ? c5 = _ : void 0 !== u5[1] ? c5 = m2 : void 0 !== u5[2] ? (y2.test(u5[2]) && (n6 = RegExp("</" + u5[2], "g")), c5 = p2) : void 0 !== u5[3] && (c5 = p2) : c5 === p2 ? ">" === u5[0] ? (c5 = n6 ?? v, d3 = -1) : void 0 === u5[1] ? d3 = -2 : (d3 = c5.lastIndex - u5[2].length, a3 = u5[1], c5 = void 0 === u5[3] ? p2 : '"' === u5[3] ? $ : g2) : c5 === $ || c5 === g2 ? c5 = p2 : c5 === _ || c5 === m2 ? c5 = v : (c5 = p2, n6 = void 0);
    const x2 = c5 === p2 && t6[i8 + 1].startsWith("/>") ? " " : "";
    l3 += c5 === v ? s6 + r3 : d3 >= 0 ? (e5.push(a3), s6.slice(0, d3) + h2 + s6.slice(d3) + o3 + x2) : s6 + o3 + (-2 === d3 ? i8 : x2);
  }
  return [V(t6, l3 + (t6[s5] || "<?>") + (2 === i7 ? "</svg>" : 3 === i7 ? "</math>" : "")), e5];
};
var S2 = class _S {
  constructor({ strings: t6, _$litType$: i7 }, e5) {
    let r6;
    this.parts = [];
    let l3 = 0, a3 = 0;
    const u5 = t6.length - 1, d3 = this.parts, [f3, v3] = N(t6, i7);
    if (this.el = _S.createElement(f3, e5), P.currentNode = this.el.content, 2 === i7 || 3 === i7) {
      const t7 = this.el.content.firstChild;
      t7.replaceWith(...t7.childNodes);
    }
    for (; null !== (r6 = P.nextNode()) && d3.length < u5; ) {
      if (1 === r6.nodeType) {
        if (r6.hasAttributes()) for (const t7 of r6.getAttributeNames()) if (t7.endsWith(h2)) {
          const i8 = v3[a3++], s5 = r6.getAttribute(t7).split(o3), e6 = /([.?@])?(.*)/.exec(i8);
          d3.push({ type: 1, index: l3, name: e6[2], strings: s5, ctor: "." === e6[1] ? I : "?" === e6[1] ? L : "@" === e6[1] ? z : H }), r6.removeAttribute(t7);
        } else t7.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r6.removeAttribute(t7));
        if (y2.test(r6.tagName)) {
          const t7 = r6.textContent.split(o3), i8 = t7.length - 1;
          if (i8 > 0) {
            r6.textContent = s2 ? s2.emptyScript : "";
            for (let s5 = 0; s5 < i8; s5++) r6.append(t7[s5], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
            r6.append(t7[i8], c3());
          }
        }
      } else if (8 === r6.nodeType) if (r6.data === n3) d3.push({ type: 2, index: l3 });
      else {
        let t7 = -1;
        for (; -1 !== (t7 = r6.data.indexOf(o3, t7 + 1)); ) d3.push({ type: 7, index: l3 }), t7 += o3.length - 1;
      }
      l3++;
    }
  }
  static createElement(t6, i7) {
    const s5 = l2.createElement("template");
    return s5.innerHTML = t6, s5;
  }
};
function M(t6, i7, s5 = t6, e5) {
  if (i7 === E) return i7;
  let h4 = void 0 !== e5 ? s5._$Co?.[e5] : s5._$Cl;
  const o7 = a2(i7) ? void 0 : i7._$litDirective$;
  return h4?.constructor !== o7 && (h4?._$AO?.(false), void 0 === o7 ? h4 = void 0 : (h4 = new o7(t6), h4._$AT(t6, s5, e5)), void 0 !== e5 ? (s5._$Co ??= [])[e5] = h4 : s5._$Cl = h4), void 0 !== h4 && (i7 = M(t6, h4._$AS(t6, i7.values), h4, e5)), i7;
}
var R = class {
  constructor(t6, i7) {
    this._$AV = [], this._$AN = void 0, this._$AD = t6, this._$AM = i7;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t6) {
    const { el: { content: i7 }, parts: s5 } = this._$AD, e5 = (t6?.creationScope ?? l2).importNode(i7, true);
    P.currentNode = e5;
    let h4 = P.nextNode(), o7 = 0, n6 = 0, r6 = s5[0];
    for (; void 0 !== r6; ) {
      if (o7 === r6.index) {
        let i8;
        2 === r6.type ? i8 = new k(h4, h4.nextSibling, this, t6) : 1 === r6.type ? i8 = new r6.ctor(h4, r6.name, r6.strings, this, t6) : 6 === r6.type && (i8 = new Z(h4, this, t6)), this._$AV.push(i8), r6 = s5[++n6];
      }
      o7 !== r6?.index && (h4 = P.nextNode(), o7++);
    }
    return P.currentNode = l2, e5;
  }
  p(t6) {
    let i7 = 0;
    for (const s5 of this._$AV) void 0 !== s5 && (void 0 !== s5.strings ? (s5._$AI(t6, s5, i7), i7 += s5.strings.length - 2) : s5._$AI(t6[i7])), i7++;
  }
};
var k = class _k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t6, i7, s5, e5) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t6, this._$AB = i7, this._$AM = s5, this.options = e5, this._$Cv = e5?.isConnected ?? true;
  }
  get parentNode() {
    let t6 = this._$AA.parentNode;
    const i7 = this._$AM;
    return void 0 !== i7 && 11 === t6?.nodeType && (t6 = i7.parentNode), t6;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t6, i7 = this) {
    t6 = M(this, t6, i7), a2(t6) ? t6 === A || null == t6 || "" === t6 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t6 !== this._$AH && t6 !== E && this._(t6) : void 0 !== t6._$litType$ ? this.$(t6) : void 0 !== t6.nodeType ? this.T(t6) : d2(t6) ? this.k(t6) : this._(t6);
  }
  O(t6) {
    return this._$AA.parentNode.insertBefore(t6, this._$AB);
  }
  T(t6) {
    this._$AH !== t6 && (this._$AR(), this._$AH = this.O(t6));
  }
  _(t6) {
    this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t6 : this.T(l2.createTextNode(t6)), this._$AH = t6;
  }
  $(t6) {
    const { values: i7, _$litType$: s5 } = t6, e5 = "number" == typeof s5 ? this._$AC(t6) : (void 0 === s5.el && (s5.el = S2.createElement(V(s5.h, s5.h[0]), this.options)), s5);
    if (this._$AH?._$AD === e5) this._$AH.p(i7);
    else {
      const t7 = new R(e5, this), s6 = t7.u(this.options);
      t7.p(i7), this.T(s6), this._$AH = t7;
    }
  }
  _$AC(t6) {
    let i7 = C.get(t6.strings);
    return void 0 === i7 && C.set(t6.strings, i7 = new S2(t6)), i7;
  }
  k(t6) {
    u2(this._$AH) || (this._$AH = [], this._$AR());
    const i7 = this._$AH;
    let s5, e5 = 0;
    for (const h4 of t6) e5 === i7.length ? i7.push(s5 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s5 = i7[e5], s5._$AI(h4), e5++;
    e5 < i7.length && (this._$AR(s5 && s5._$AB.nextSibling, e5), i7.length = e5);
  }
  _$AR(t6 = this._$AA.nextSibling, s5) {
    for (this._$AP?.(false, true, s5); t6 !== this._$AB; ) {
      const s6 = i2(t6).nextSibling;
      i2(t6).remove(), t6 = s6;
    }
  }
  setConnected(t6) {
    void 0 === this._$AM && (this._$Cv = t6, this._$AP?.(t6));
  }
};
var H = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t6, i7, s5, e5, h4) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t6, this.name = i7, this._$AM = e5, this.options = h4, s5.length > 2 || "" !== s5[0] || "" !== s5[1] ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = A;
  }
  _$AI(t6, i7 = this, s5, e5) {
    const h4 = this.strings;
    let o7 = false;
    if (void 0 === h4) t6 = M(this, t6, i7, 0), o7 = !a2(t6) || t6 !== this._$AH && t6 !== E, o7 && (this._$AH = t6);
    else {
      const e6 = t6;
      let n6, r6;
      for (t6 = h4[0], n6 = 0; n6 < h4.length - 1; n6++) r6 = M(this, e6[s5 + n6], i7, n6), r6 === E && (r6 = this._$AH[n6]), o7 ||= !a2(r6) || r6 !== this._$AH[n6], r6 === A ? t6 = A : t6 !== A && (t6 += (r6 ?? "") + h4[n6 + 1]), this._$AH[n6] = r6;
    }
    o7 && !e5 && this.j(t6);
  }
  j(t6) {
    t6 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t6 ?? "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t6) {
    this.element[this.name] = t6 === A ? void 0 : t6;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t6) {
    this.element.toggleAttribute(this.name, !!t6 && t6 !== A);
  }
};
var z = class extends H {
  constructor(t6, i7, s5, e5, h4) {
    super(t6, i7, s5, e5, h4), this.type = 5;
  }
  _$AI(t6, i7 = this) {
    if ((t6 = M(this, t6, i7, 0) ?? A) === E) return;
    const s5 = this._$AH, e5 = t6 === A && s5 !== A || t6.capture !== s5.capture || t6.once !== s5.once || t6.passive !== s5.passive, h4 = t6 !== A && (s5 === A || e5);
    e5 && this.element.removeEventListener(this.name, this, s5), h4 && this.element.addEventListener(this.name, this, t6), this._$AH = t6;
  }
  handleEvent(t6) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t6) : this._$AH.handleEvent(t6);
  }
};
var Z = class {
  constructor(t6, i7, s5) {
    this.element = t6, this.type = 6, this._$AN = void 0, this._$AM = i7, this.options = s5;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t6) {
    M(this, t6);
  }
};
var j = { M: h2, P: o3, A: n3, C: 1, L: N, R, D: d2, V: M, I: k, H, N: L, U: z, B: I, F: Z };
var B = t2.litHtmlPolyfillSupport;
B?.(S2, k), (t2.litHtmlVersions ??= []).push("3.3.3");
var D = (t6, i7, s5) => {
  const e5 = s5?.renderBefore ?? i7;
  let h4 = e5._$litPart$;
  if (void 0 === h4) {
    const t7 = s5?.renderBefore ?? null;
    e5._$litPart$ = h4 = new k(i7.insertBefore(c3(), t7), t7, void 0, s5 ?? {});
  }
  return h4._$AI(t6), h4;
};

// lit-element/lit-element.js
var s3 = globalThis;
var i3 = class extends g {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t6 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t6.firstChild, t6;
  }
  update(t6) {
    const r6 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t6), this._$Do = D(r6, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return E;
  }
};
i3._$litElement$ = true, i3["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i3 });
var o4 = s3.litElementPolyfillSupport;
o4?.({ LitElement: i3 });
(s3.litElementVersions ??= []).push("4.2.2");

// @lit/reactive-element/node/decorators/property.js
var o5 = { attribute: true, type: String, converter: b, reflect: false, hasChanged: m };
var r4 = (t6 = o5, e5, r6) => {
  const { kind: n6, metadata: i7 } = r6;
  let s5 = globalThis.litPropertyMetadata.get(i7);
  if (void 0 === s5 && globalThis.litPropertyMetadata.set(i7, s5 = /* @__PURE__ */ new Map()), "setter" === n6 && ((t6 = Object.create(t6)).wrapped = true), s5.set(r6.name, t6), "accessor" === n6) {
    const { name: o7 } = r6;
    return { set(r7) {
      const n7 = e5.get.call(this);
      e5.set.call(this, r7), this.requestUpdate(o7, n7, t6, true, r7);
    }, init(e6) {
      return void 0 !== e6 && this.C(o7, void 0, t6, e6), e6;
    } };
  }
  if ("setter" === n6) {
    const { name: o7 } = r6;
    return function(r7) {
      const n7 = this[o7];
      e5.call(this, r7), this.requestUpdate(o7, n7, t6, true, r7);
    };
  }
  throw Error("Unsupported decorator location: " + n6);
};
function n4(t6) {
  return (e5, o7) => "object" == typeof o7 ? r4(t6, e5, o7) : ((t7, e6, o8) => {
    const r6 = e6.hasOwnProperty(o8);
    return e6.constructor.createProperty(o8, t7), r6 ? Object.getOwnPropertyDescriptor(e6, o8) : void 0;
  })(t6, e5, o7);
}

// @lit/reactive-element/node/decorators/state.js
function r5(r6) {
  return n4({ ...r6, state: true, attribute: false });
}

// @erplora/outfitkit/dist/define.js
function define(tag, ctor) {
  if (typeof customElements !== "undefined" && !customElements.get(tag)) {
    customElements.define(tag, ctor);
  }
}

// lit-html/directive.js
var t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e4 = (t6) => (...e5) => ({ _$litDirective$: t6, values: e5 });
var i4 = class {
  constructor(t6) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t6, e5, i7) {
    this._$Ct = t6, this._$AM = e5, this._$Ci = i7;
  }
  _$AS(t6, e5) {
    return this.update(t6, e5);
  }
  update(t6, e5) {
    return this.render(...e5);
  }
};

// lit-html/directive-helpers.js
var { I: t4 } = j;
var i5 = (o7) => o7;
var s4 = () => document.createComment("");
var v2 = (o7, n6, e5) => {
  const l3 = o7._$AA.parentNode, d3 = void 0 === n6 ? o7._$AB : n6._$AA;
  if (void 0 === e5) {
    const i7 = l3.insertBefore(s4(), d3), n7 = l3.insertBefore(s4(), d3);
    e5 = new t4(i7, n7, o7, o7.options);
  } else {
    const t6 = e5._$AB.nextSibling, n7 = e5._$AM, c5 = n7 !== o7;
    if (c5) {
      let t7;
      e5._$AQ?.(o7), e5._$AM = o7, void 0 !== e5._$AP && (t7 = o7._$AU) !== n7._$AU && e5._$AP(t7);
    }
    if (t6 !== d3 || c5) {
      let o8 = e5._$AA;
      for (; o8 !== t6; ) {
        const t7 = i5(o8).nextSibling;
        i5(l3).insertBefore(o8, d3), o8 = t7;
      }
    }
  }
  return e5;
};
var u3 = (o7, t6, i7 = o7) => (o7._$AI(t6, i7), o7);
var m3 = {};
var p3 = (o7, t6 = m3) => o7._$AH = t6;
var M2 = (o7) => o7._$AH;
var h3 = (o7) => {
  o7._$AR(), o7._$AA.remove();
};

// lit-html/directives/repeat.js
var u4 = (e5, s5, t6) => {
  const r6 = /* @__PURE__ */ new Map();
  for (let l3 = s5; l3 <= t6; l3++) r6.set(e5[l3], l3);
  return r6;
};
var c4 = e4(class extends i4 {
  constructor(e5) {
    if (super(e5), e5.type !== t3.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e5, s5, t6) {
    let r6;
    void 0 === t6 ? t6 = s5 : void 0 !== s5 && (r6 = s5);
    const l3 = [], o7 = [];
    let i7 = 0;
    for (const s6 of e5) l3[i7] = r6 ? r6(s6, i7) : i7, o7[i7] = t6(s6, i7), i7++;
    return { values: o7, keys: l3 };
  }
  render(e5, s5, t6) {
    return this.dt(e5, s5, t6).values;
  }
  update(s5, [t6, r6, c5]) {
    const d3 = M2(s5), { values: p4, keys: a3 } = this.dt(t6, r6, c5);
    if (!Array.isArray(d3)) return this.ut = a3, p4;
    const h4 = this.ut ??= [], v3 = [];
    let m4, y3, x2 = 0, j2 = d3.length - 1, k2 = 0, w2 = p4.length - 1;
    for (; x2 <= j2 && k2 <= w2; ) if (null === d3[x2]) x2++;
    else if (null === d3[j2]) j2--;
    else if (h4[x2] === a3[k2]) v3[k2] = u3(d3[x2], p4[k2]), x2++, k2++;
    else if (h4[j2] === a3[w2]) v3[w2] = u3(d3[j2], p4[w2]), j2--, w2--;
    else if (h4[x2] === a3[w2]) v3[w2] = u3(d3[x2], p4[w2]), v2(s5, v3[w2 + 1], d3[x2]), x2++, w2--;
    else if (h4[j2] === a3[k2]) v3[k2] = u3(d3[j2], p4[k2]), v2(s5, d3[x2], d3[j2]), j2--, k2++;
    else if (void 0 === m4 && (m4 = u4(a3, k2, w2), y3 = u4(h4, x2, j2)), m4.has(h4[x2])) if (m4.has(h4[j2])) {
      const e5 = y3.get(a3[k2]), t7 = void 0 !== e5 ? d3[e5] : null;
      if (null === t7) {
        const e6 = v2(s5, d3[x2]);
        u3(e6, p4[k2]), v3[k2] = e6;
      } else v3[k2] = u3(t7, p4[k2]), v2(s5, d3[x2], t7), d3[e5] = null;
      k2++;
    } else h3(d3[j2]), j2--;
    else h3(d3[x2]), x2++;
    for (; k2 <= w2; ) {
      const e5 = v2(s5, v3[w2 + 1]);
      u3(e5, p4[k2]), v3[k2++] = e5;
    }
    for (; x2 <= j2; ) {
      const e5 = d3[x2++];
      null !== e5 && h3(e5);
    }
    return this.ut = a3, p3(s5, v3), E;
  }
});

// lit-html/directives/style-map.js
var n5 = "important";
var i6 = " !" + n5;
var o6 = e4(class extends i4 {
  constructor(t6) {
    if (super(t6), t6.type !== t3.ATTRIBUTE || "style" !== t6.name || t6.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t6) {
    return Object.keys(t6).reduce((e5, r6) => {
      const s5 = t6[r6];
      return null == s5 ? e5 : e5 + `${r6 = r6.includes("-") ? r6 : r6.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s5};`;
    }, "");
  }
  update(e5, [r6]) {
    const { style: s5 } = e5.element;
    if (void 0 === this.ft) return this.ft = new Set(Object.keys(r6)), this.render(r6);
    for (const t6 of this.ft) null == r6[t6] && (this.ft.delete(t6), t6.includes("-") ? s5.removeProperty(t6) : s5[t6] = null);
    for (const t6 in r6) {
      const e6 = r6[t6];
      if (null != e6) {
        this.ft.add(t6);
        const r7 = "string" == typeof e6 && e6.endsWith(i6);
        t6.includes("-") || r7 ? s5.setProperty(t6, r7 ? e6.slice(0, -11) : e6, r7 ? n5 : "") : s5[t6] = e6;
      }
    }
    return E;
  }
});

// @erplora/outfitkit/dist/shared/icons.js
var rawAdd = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288m144-144H112"/></svg>';
var rawAlertCircle = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="currentColor" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m0 319.91a20 20 0 1 1 20-20a20 20 0 0 1-20 20m21.72-201.15l-5.74 122a16 16 0 0 1-32 0l-5.74-121.94v-.05a21.74 21.74 0 1 1 43.44 0Z"/></svg>';
var rawAlertCircleOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M250.26 166.05L256 288l5.73-121.95a5.74 5.74 0 0 0-5.79-6h0a5.74 5.74 0 0 0-5.68 6"/><path fill="currentColor" d="M256 367.91a20 20 0 1 1 20-20a20 20 0 0 1-20 20"/></svg>';
var rawAppsOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><rect width="80" height="80" x="64" y="64" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" rx="40" ry="40"/><rect width="80" height="80" x="216" y="64" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" rx="40" ry="40"/><rect width="80" height="80" x="368" y="64" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" rx="40" ry="40"/><rect width="80" height="80" x="64" y="216" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" rx="40" ry="40"/><rect width="80" height="80" x="216" y="216" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" rx="40" ry="40"/><rect width="80" height="80" x="368" y="216" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" rx="40" ry="40"/><rect width="80" height="80" x="64" y="368" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" rx="40" ry="40"/><rect width="80" height="80" x="216" y="368" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" rx="40" ry="40"/><rect width="80" height="80" x="368" y="368" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" rx="40" ry="40"/></svg>';
var rawArchiveOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M80 152v256a40.12 40.12 0 0 0 40 40h272a40.12 40.12 0 0 0 40-40V152"/><rect width="416" height="80" x="48" y="64" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" rx="28" ry="28"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m320 304l-64 64l-64-64m64 41.89V224"/></svg>';
var rawArrowRedoOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M448 256L272 88v96C103.57 184 64 304.77 64 424c48.61-62.24 91.6-96 208-96v96Z"/></svg>';
var rawArrowUndoOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M240 424v-96c116.4 0 159.39 33.76 208 96c0-119.23-39.57-240-208-240V88L64 256Z"/></svg>';
var rawBackspaceOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M135.19 390.14a28.8 28.8 0 0 0 21.68 9.86h246.26A29 29 0 0 0 432 371.13V140.87A29 29 0 0 0 403.13 112H156.87a28.84 28.84 0 0 0-21.67 9.84L46.33 256l88.86 134.11Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M336.67 192.33L206.66 322.34m130.01 0L206.66 192.33m130.01 0L206.66 322.34m130.01 0L206.66 192.33"/></svg>';
var rawCalendarOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><rect width="416" height="384" x="48" y="80" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" rx="48"/><circle cx="296" cy="232" r="24" fill="currentColor"/><circle cx="376" cy="232" r="24" fill="currentColor"/><circle cx="296" cy="312" r="24" fill="currentColor"/><circle cx="376" cy="312" r="24" fill="currentColor"/><circle cx="136" cy="312" r="24" fill="currentColor"/><circle cx="216" cy="312" r="24" fill="currentColor"/><circle cx="136" cy="392" r="24" fill="currentColor"/><circle cx="216" cy="392" r="24" fill="currentColor"/><circle cx="296" cy="392" r="24" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M128 48v32m256-32v32"/><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M464 160H48"/></svg>';
var rawCheckmarkCircle = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="currentColor" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m108.25 138.29l-134.4 160a16 16 0 0 1-12 5.71h-.27a16 16 0 0 1-11.89-5.3l-57.6-64a16 16 0 1 1 23.78-21.4l45.29 50.32l122.59-145.91a16 16 0 0 1 24.5 20.58"/></svg>';
var rawCheckmarkOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 128L192 384l-96-96"/></svg>';
var rawChevronBack = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"/></svg>';
var rawChevronBackOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"/></svg>';
var rawChevronDownOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="m112 184l144 144l144-144"/></svg>';
var rawChevronForward = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="m184 112l144 144l-144 144"/></svg>';
var rawChevronForwardOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="m184 112l144 144l-144 144"/></svg>';
var rawChevronUpOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="m112 328l144-144l144 144"/></svg>';
var rawClose = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="currentColor" d="m289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34Z"/></svg>';
var rawCloseOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144m224 0L144 368"/></svg>';
var rawCloudUploadOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 367.79h76c55 0 100-29.21 100-83.6s-53-81.47-96-83.6c-8.89-85.06-71-136.8-144-136.8c-69 0-113.44 45.79-128 91.2c-60 5.7-112 43.88-112 106.4s54 106.4 120 106.4h56"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m320 255.79l-64-64l-64 64m64 192.42V207.79"/></svg>';
var rawCreateOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M384 224v184a40 40 0 0 1-40 40H104a40 40 0 0 1-40-40V168a40 40 0 0 1 40-40h167.48"/><path fill="currentColor" d="M459.94 53.25a16.06 16.06 0 0 0-23.22-.56L424.35 65a8 8 0 0 0 0 11.31l11.34 11.32a8 8 0 0 0 11.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38M399.34 90L218.82 270.2a9 9 0 0 0-2.31 3.93L208.16 299a3.91 3.91 0 0 0 4.86 4.86l24.85-8.35a9 9 0 0 0 3.93-2.31L422 112.66a9 9 0 0 0 0-12.66l-9.95-10a9 9 0 0 0-12.71 0"/></svg>';
var rawContractOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M304 416V304h112m-101.8 10.23L432 432M208 96v112H96m101.8-10.23L80 80m336 128H304V96m10.23 101.8L432 80M96 304h112v112m-10.23-101.8L80 432"/></svg>';
var rawDocumentAttachOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M208 64h66.75a32 32 0 0 1 22.62 9.37l141.26 141.26a32 32 0 0 1 9.37 22.62V432a48 48 0 0 1-48 48H192a48 48 0 0 1-48-48V304"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M288 72v120a32 32 0 0 0 32 32h120"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M160 80v152a23.69 23.69 0 0 1-24 24c-12 0-24-9.1-24-24V88c0-30.59 16.57-56 48-56s48 24.8 48 55.38v138.75c0 43-27.82 77.87-72 77.87s-72-34.86-72-77.87V144"/></svg>';
var rawDocumentOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M416 221.25V416a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V96a48 48 0 0 1 48-48h98.75a32 32 0 0 1 22.62 9.37l141.26 141.26a32 32 0 0 1 9.37 22.62Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 56v120a32 32 0 0 0 32 32h120"/></svg>';
var rawDocumentTextOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M416 221.25V416a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V96a48 48 0 0 1 48-48h98.75a32 32 0 0 1 22.62 9.37l141.26 141.26a32 32 0 0 1 9.37 22.62Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 56v120a32 32 0 0 0 32 32h120m-232 80h160m-160 80h160"/></svg>';
var rawDownloadOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M336 176h40a40 40 0 0 1 40 40v208a40 40 0 0 1-40 40H136a40 40 0 0 1-40-40V216a40 40 0 0 1 40-40h40"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m176 272l80 80l80-80M256 48v288"/></svg>';
var rawEllipsisVertical = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><circle cx="256" cy="256" r="48" fill="currentColor"/><circle cx="256" cy="416" r="48" fill="currentColor"/><circle cx="256" cy="96" r="48" fill="currentColor"/></svg>';
var rawExpandOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M432 320v112H320m101.8-10.23L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320m10.23 101.8L208 304"/></svg>';
var rawFileTrayOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M384 80H128c-26 0-43 14-48 40L48 272v112a48.14 48.14 0 0 0 48 48h320a48.14 48.14 0 0 0 48-48V272l-32-152c-5-27-23-40-48-40Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M48 272h144m128 0h144m-272 0a64 64 0 0 0 128 0"/></svg>';
var rawFolderOpenOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M64 192v-72a40 40 0 0 1 40-40h75.89a40 40 0 0 1 22.19 6.72l27.84 18.56a40 40 0 0 0 22.19 6.72H408a40 40 0 0 1 40 40v40"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M479.9 226.55L463.68 392a40 40 0 0 1-39.93 40H88.25a40 40 0 0 1-39.93-40L32.1 226.55A32 32 0 0 1 64 192h384.1a32 32 0 0 1 31.8 34.55"/></svg>';
var rawInformationCircle = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="currentColor" d="M256 56C145.72 56 56 145.72 56 256s89.72 200 200 200s200-89.72 200-200S366.28 56 256 56m0 82a26 26 0 1 1-26 26a26 26 0 0 1 26-26m48 226h-88a16 16 0 0 1 0-32h28v-88h-16a16 16 0 0 1 0-32h32a16 16 0 0 1 16 16v104h28a16 16 0 0 1 0 32"/></svg>';
var rawMenuOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 160h352M80 256h352M80 352h352"/></svg>';
var rawNotificationsOffOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M128.51 204.59q-.37 6.15-.37 12.76C128.14 304 110 320 84.33 351.43C73.69 364.45 83 384 101.62 384H320m94.5-48.7c-18.48-23.45-30.62-47.05-30.62-118c0-79.3-40.52-107.57-73.88-121.3c-4.43-1.82-8.6-6-9.95-10.55C294.21 65.54 277.82 48 256 48s-38.2 17.55-44 37.47c-1.35 4.6-5.52 8.71-10 10.53a150 150 0 0 0-18 8.79M320 384v16a64 64 0 0 1-128 0v-16"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M448 448L64 64"/></svg>';
var rawOpenOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M384 224v184a40 40 0 0 1-40 40H104a40 40 0 0 1-40-40V168a40 40 0 0 1 40-40h167.48M336 64h112v112M224 288L440 72"/></svg>';
var rawPlayOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M112 111v290c0 17.44 17 28.52 31 20.16l247.9-148.37c12.12-7.25 12.12-26.33 0-33.58L143 90.84c-14-8.36-31 2.72-31 20.16Z"/></svg>';
var rawRemove = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M400 256H112"/></svg>';
var rawSearchOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"/></svg>';
var rawSend = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="currentColor" d="m476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0 0 27.14 52A24.65 24.65 0 0 0 16 72.59v113.29a24 24 0 0 0 19.52 23.57l232.93 43.07a4 4 0 0 1 0 7.86L35.53 303.45A24 24 0 0 0 16 327v113.31A23.57 23.57 0 0 0 26.59 460a23.94 23.94 0 0 0 13.22 4a24.55 24.55 0 0 0 9.52-1.93L476.4 285.94l.19-.09a32 32 0 0 0 0-58.8"/></svg>';
var rawSwapVerticalOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M464 208L352 96L240 208m112-94.87V416M48 304l112 112l112-112m-112 94V96"/></svg>';
var rawTrashOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320"/><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40m-64 64v224m-72-224l8 224m136-224l-8 224"/></svg>';
var rawTrendingDown = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M352 368h112V256"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m48 144l121.37 121.37a32 32 0 0 0 45.26 0l50.74-50.74a32 32 0 0 1 45.26 0L448 352"/></svg>';
var rawTrendingUp = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M352 144h112v112"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m48 368l121.37-121.37a32 32 0 0 1 45.26 0l50.74 50.74a32 32 0 0 0 45.26 0L448 160"/></svg>';
var rawVolumeHighOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M126 192H56a8 8 0 0 0-8 8v112a8 8 0 0 0 8 8h69.65a15.93 15.93 0 0 1 10.14 3.54l91.47 74.89A8 8 0 0 0 240 392V120a8 8 0 0 0-12.74-6.43l-91.47 74.89A15 15 0 0 1 126 192m194 128c9.74-19.38 16-40.84 16-64c0-23.48-6-44.42-16-64m48 176c19.48-33.92 32-64.06 32-112s-12-77.74-32-112m48 272c30-46 48-91.43 48-160s-18-113-48-160"/></svg>';
var rawVolumeLowOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M189.65 192H120a8 8 0 0 0-8 8v112a8 8 0 0 0 8 8h69.65a16 16 0 0 1 10.14 3.63l91.47 75a8 8 0 0 0 12.74-6.46V119.83a8 8 0 0 0-12.74-6.44l-91.47 75a16 16 0 0 1-10.14 3.61M384 320c9.74-19.41 16-40.81 16-64c0-23.51-6-44.4-16-64"/></svg>';
var rawVolumeMuteOutline = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M416 432L64 80"/><path fill="currentColor" d="M224 136.92v33.8a4 4 0 0 0 1.17 2.82l24 24a4 4 0 0 0 6.83-2.82v-74.15a24.53 24.53 0 0 0-12.67-21.72a23.91 23.91 0 0 0-25.55 1.83a8 8 0 0 0-.66.51l-31.94 26.15a4 4 0 0 0-.29 5.92l17.05 17.06a4 4 0 0 0 5.37.26Zm0 238.16l-78.07-63.92a32 32 0 0 0-20.28-7.16H64v-96h50.72a4 4 0 0 0 2.82-6.83l-24-24a4 4 0 0 0-2.82-1.17H56a24 24 0 0 0-24 24v112a24 24 0 0 0 24 24h69.76l91.36 74.8a8 8 0 0 0 .66.51a23.93 23.93 0 0 0 25.85 1.69A24.49 24.49 0 0 0 256 391.45v-50.17a4 4 0 0 0-1.17-2.82l-24-24a4 4 0 0 0-6.83 2.82ZM352 256c0-24.56-5.81-47.88-17.75-71.27a16 16 0 0 0-28.5 14.54C315.34 218.06 320 236.62 320 256q0 4-.31 8.13a8 8 0 0 0 2.32 6.25l19.66 19.67a4 4 0 0 0 6.75-2A147 147 0 0 0 352 256m64 0c0-51.19-13.08-83.89-34.18-120.06a16 16 0 0 0-27.64 16.12C373.07 184.44 384 211.83 384 256c0 23.83-3.29 42.88-9.37 60.65a8 8 0 0 0 1.9 8.26l16.77 16.76a4 4 0 0 0 6.52-1.27C410.09 315.88 416 289.91 416 256"/><path fill="currentColor" d="M480 256c0-74.26-20.19-121.11-50.51-168.61a16 16 0 1 0-27 17.22C429.82 147.38 448 189.5 448 256c0 47.45-8.9 82.12-23.59 113a4 4 0 0 0 .77 4.55L443 391.39a4 4 0 0 0 6.4-1C470.88 348.22 480 307 480 256"/></svg>';
var rawWarning = '<svg viewBox="0 0 512 512" width="1.2em" height="1.2em" ><path fill="currentColor" d="M449.07 399.08L278.64 82.58c-12.08-22.44-44.26-22.44-56.35 0L51.87 399.08A32 32 0 0 0 80 446.25h340.89a32 32 0 0 0 28.18-47.17m-198.6-1.83a20 20 0 1 1 20-20a20 20 0 0 1-20 20m21.72-201.15l-5.74 122a16 16 0 0 1-32 0l-5.74-121.95a21.73 21.73 0 0 1 21.5-22.69h.21a21.74 21.74 0 0 1 21.73 22.7Z"/></svg>';
function bake(svg) {
  return `data:image/svg+xml;utf8,${svg}`;
}
var iconAdd = bake(rawAdd);
var iconAlertCircle = bake(rawAlertCircle);
var iconAlertCircleOutline = bake(rawAlertCircleOutline);
var iconAppsOutline = bake(rawAppsOutline);
var iconArchiveOutline = bake(rawArchiveOutline);
var iconArrowRedoOutline = bake(rawArrowRedoOutline);
var iconArrowUndoOutline = bake(rawArrowUndoOutline);
var iconBackspaceOutline = bake(rawBackspaceOutline);
var iconCalendarOutline = bake(rawCalendarOutline);
var iconCheckmarkCircle = bake(rawCheckmarkCircle);
var iconCheckmarkOutline = bake(rawCheckmarkOutline);
var iconChevronBack = bake(rawChevronBack);
var iconChevronBackOutline = bake(rawChevronBackOutline);
var iconChevronDownOutline = bake(rawChevronDownOutline);
var iconChevronForward = bake(rawChevronForward);
var iconChevronForwardOutline = bake(rawChevronForwardOutline);
var iconChevronUpOutline = bake(rawChevronUpOutline);
var iconClose = bake(rawClose);
var iconCloseOutline = bake(rawCloseOutline);
var iconCloudUploadOutline = bake(rawCloudUploadOutline);
var iconCreateOutline = bake(rawCreateOutline);
var iconDocumentAttachOutline = bake(rawDocumentAttachOutline);
var iconContractOutline = bake(rawContractOutline);
var iconDocumentOutline = bake(rawDocumentOutline);
var iconDocumentTextOutline = bake(rawDocumentTextOutline);
var iconDownloadOutline = bake(rawDownloadOutline);
var iconEllipsisVertical = bake(rawEllipsisVertical);
var iconExpandOutline = bake(rawExpandOutline);
var iconFileTrayOutline = bake(rawFileTrayOutline);
var iconFolderOpenOutline = bake(rawFolderOpenOutline);
var iconInformationCircle = bake(rawInformationCircle);
var iconMenuOutline = bake(rawMenuOutline);
var iconNotificationsOffOutline = bake(rawNotificationsOffOutline);
var iconOpenOutline = bake(rawOpenOutline);
var iconPlayOutline = bake(rawPlayOutline);
var iconRemove = bake(rawRemove);
var iconSearchOutline = bake(rawSearchOutline);
var iconSend = bake(rawSend);
var iconSwapVerticalOutline = bake(rawSwapVerticalOutline);
var iconTrashOutline = bake(rawTrashOutline);
var iconTrendingDown = bake(rawTrendingDown);
var iconTrendingUp = bake(rawTrendingUp);
var iconVolumeHighOutline = bake(rawVolumeHighOutline);
var iconVolumeLowOutline = bake(rawVolumeLowOutline);
var iconVolumeMuteOutline = bake(rawVolumeMuteOutline);
var iconWarning = bake(rawWarning);
var BY_NAME = {
  "add": iconAdd,
  "alert-circle": iconAlertCircle,
  "alert-circle-outline": iconAlertCircleOutline,
  "apps-outline": iconAppsOutline,
  "archive-outline": iconArchiveOutline,
  "arrow-redo-outline": iconArrowRedoOutline,
  "arrow-undo-outline": iconArrowUndoOutline,
  "backspace-outline": iconBackspaceOutline,
  "calendar-outline": iconCalendarOutline,
  "checkmark-circle": iconCheckmarkCircle,
  "checkmark-outline": iconCheckmarkOutline,
  "chevron-back": iconChevronBack,
  "chevron-back-outline": iconChevronBackOutline,
  "chevron-down-outline": iconChevronDownOutline,
  "chevron-forward": iconChevronForward,
  "chevron-forward-outline": iconChevronForwardOutline,
  "chevron-up-outline": iconChevronUpOutline,
  "close": iconClose,
  "close-outline": iconCloseOutline,
  "cloud-upload-outline": iconCloudUploadOutline,
  "create-outline": iconCreateOutline,
  "document-attach-outline": iconDocumentAttachOutline,
  "contract-outline": iconContractOutline,
  "document-outline": iconDocumentOutline,
  "document-text-outline": iconDocumentTextOutline,
  "download-outline": iconDownloadOutline,
  "ellipsis-vertical": iconEllipsisVertical,
  "expand-outline": iconExpandOutline,
  "file-tray-outline": iconFileTrayOutline,
  "folder-open-outline": iconFolderOpenOutline,
  "information-circle": iconInformationCircle,
  "menu-outline": iconMenuOutline,
  "notifications-off-outline": iconNotificationsOffOutline,
  "open-outline": iconOpenOutline,
  "play-outline": iconPlayOutline,
  "remove": iconRemove,
  "search-outline": iconSearchOutline,
  "send": iconSend,
  "swap-vertical-outline": iconSwapVerticalOutline,
  "trash-outline": iconTrashOutline,
  "trending-down": iconTrendingDown,
  "trending-up": iconTrendingUp,
  "volume-high-outline": iconVolumeHighOutline,
  "volume-low-outline": iconVolumeLowOutline,
  "volume-mute-outline": iconVolumeMuteOutline,
  "warning": iconWarning
};
function okIcon(value) {
  if (!value) return void 0;
  const trimmed = value.trimStart();
  if (trimmed.startsWith("<svg")) return bake(trimmed);
  return BY_NAME[value] ?? value;
}

// @erplora/outfitkit/dist/ok-data-table.js
var CSV_BOM = "\uFEFF";
var WINDOWS_1252_C1 = [
  8364,
  129,
  8218,
  402,
  8222,
  8230,
  8224,
  8225,
  710,
  8240,
  352,
  8249,
  338,
  141,
  381,
  143,
  144,
  8216,
  8217,
  8220,
  8221,
  8226,
  8211,
  8212,
  732,
  8482,
  353,
  8250,
  339,
  157,
  382,
  376
];
function decodeWindows1252(bytes) {
  let text = "";
  for (const byte of bytes) {
    text += String.fromCharCode(byte >= 128 && byte <= 159 ? WINDOWS_1252_C1[byte - 128] : byte);
  }
  return text;
}
function decodeCsvBuffer(buf) {
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(buf);
  } catch {
    text = decodeWindows1252(new Uint8Array(buf));
  }
  return text.charCodeAt(0) === 65279 ? text.slice(1) : text;
}
var __defProp2 = Object.defineProperty;
var __decorateClass2 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i7 = decorators.length - 1, decorator; i7 >= 0; i7--)
    if (decorator = decorators[i7])
      result = decorator(target, key, result) || result;
  if (result) __defProp2(target, key, result);
  return result;
};
function decideRowActionsFit(input) {
  const { containerWidth, contentWidth, collapsed, decidedAtWidth } = input;
  if (!(containerWidth > 0)) return { collapsed, decidedAtWidth };
  if (containerWidth !== decidedAtWidth) {
    if (collapsed) return { collapsed: false, decidedAtWidth: containerWidth };
    return { collapsed: contentWidth > containerWidth, decidedAtWidth: containerWidth };
  }
  if (!collapsed && contentWidth > containerWidth) return { collapsed: true, decidedAtWidth };
  return { collapsed, decidedAtWidth };
}
var DEFAULT_LABELS = {
  search: "Search\u2026",
  empty: "No results",
  filters: "Filters",
  clear: "Clear",
  apply: "Apply",
  selected: "{n} selected",
  importCsv: "Import CSV",
  exportCsv: "Export CSV",
  add: "Add",
  moreActions: "More actions",
  rowsPerPage: "Rows per page",
  perPageShort: "{n} / page",
  viewList: "View as list",
  viewCards: "View as cards",
  columnsVisible: "Visible columns",
  columns: "Columns",
  actions: "Actions",
  close: "Close",
  newRecord: "New",
  form: "Form",
  filterPlaceholder: "Filter\u2026",
  from: "From",
  to: "To",
  fromOf: "{label} from",
  toOf: "{label} to",
  gte: "\u2265",
  lte: "\u2264",
  noValues: "No values",
  selectAll: "Select all",
  selectRow: "Select row",
  select: "Select",
  showing: "Showing {from}\u2013{to} of",
  recordSingular: "record",
  recordPlural: "records",
  loadMore: "Load more"
};
var ES_LABELS = {
  search: "Buscar\u2026",
  empty: "Sin resultados",
  filters: "Filtros",
  clear: "Limpiar",
  apply: "Aplicar",
  selected: "{n} seleccionados",
  importCsv: "Importar CSV",
  exportCsv: "Exportar CSV",
  add: "A\xF1adir",
  moreActions: "M\xE1s acciones",
  rowsPerPage: "Filas por p\xE1gina",
  perPageShort: "{n} / p\xE1g.",
  viewList: "Vista lista",
  viewCards: "Vista tarjetas",
  columnsVisible: "Columnas visibles",
  columns: "Columnas",
  actions: "Acciones",
  close: "Cerrar",
  newRecord: "Nuevo",
  form: "Formulario",
  filterPlaceholder: "Filtrar\u2026",
  from: "Desde",
  to: "Hasta",
  fromOf: "{label} desde",
  toOf: "{label} hasta",
  gte: "\u2265",
  lte: "\u2264",
  noValues: "Sin valores",
  selectAll: "Seleccionar todo",
  selectRow: "Seleccionar fila",
  select: "Seleccionar",
  showing: "Mostrando {from}\u2013{to} de",
  recordSingular: "registro",
  recordPlural: "registros",
  loadMore: "Cargar m\xE1s"
};
var _OkDataTable = class _OkDataTable2 extends i3 {
  constructor() {
    super(...arguments);
    this.columns = [];
    this.rows = [];
    this.searchKeys = [];
    this.rowKeyField = "id";
    this.pageSize = 10;
    this.labels = {};
    this.actions = [];
    this.addable = false;
    this.pageSizeOptions = [10, 25, 50, 100];
    this.fill = false;
    this.columnPicker = true;
    this.csv = false;
    this.csvName = "export.csv";
    this.serverSide = false;
    this.total = 0;
    this.page = 0;
    this.searchable = false;
    this.sortDir = "asc";
    this.filterValues = {};
    this.title = "";
    this.views = false;
    this.exportable = false;
    this.importable = false;
    this.columnSelector = false;
    this.rowClickable = false;
    this.selectable = false;
    this.inlineFilters = false;
    this.menuActions = [];
    this.q = "";
    this.clientPage = 0;
    this.clientPageSize = 0;
    this.mobileShown = 0;
    this.clientSort = "";
    this.clientSortDir = "asc";
    this.clientFilters = {};
    this.filterDraft = {};
    this.serverFilters = {};
    this.panel = "none";
    this.viewMode = "table";
    this.viewChosenByUser = false;
    this.isMobile = false;
    this.xOverflow = false;
    this.actionsTrackPx = 0;
    this.rowActionsCollapsed = false;
    this.fitDecidedAtWidth = -1;
    this.rowMenuOpen = false;
    this.hiddenKeys = /* @__PURE__ */ new Set();
    this.internalSelection = /* @__PURE__ */ new Set();
    this.menuOpen = false;
    this.onLocaleChanged = () => this.requestUpdate();
    this.onWindowResize = () => {
      this.measureXOverflow();
      this.measureRowActionsFit();
    };
    this.onSearch = (ev) => {
      const value = ev.target.value ?? "";
      if (this.serverSide) {
        this.q = value;
        this.emit("searchChange", value);
      } else {
        this.q = value;
        this.clientPage = 0;
        this.mobileShown = 0;
      }
    };
  }
  static {
    this.styles = i`
    :host {
      /* Vars overridable (estilo Ionic), default = cadena --ok-* → --ion-* → hex */
      --background: var(--ok-surface, var(--ion-card-background, var(--ion-background-color, #ffffff)));
      --color: var(--ok-text, var(--ion-text-color, #1c1b17));
      --color-muted: var(--ok-muted, var(--ion-color-medium, rgba(var(--ion-text-color-rgb, 24, 24, 27), 0.55)));
      --border-color: var(--ok-border, var(--ion-color-step-150, rgba(var(--ion-text-color-rgb, 24, 24, 27), 0.12)));
      --border-color-soft: var(--ok-border-soft, var(--ion-color-step-100, rgba(var(--ion-text-color-rgb, 24, 24, 27), 0.07)));
      /* Borde más marcado para los controles de la toolbar (selects/pastilla de fechas), para que se
       * distingan como controles en claro y oscuro aunque el lienzo y la superficie casi no contrasten. */
      --control-border: color-mix(in srgb, var(--color) 22%, transparent);
      /* Relieve de cabecera/pie: step-100 (definido en claro y oscuro) → contraste con el lienzo. */
      --header-background: var(--ok-surface-2, var(--ion-color-step-100, rgba(var(--ion-text-color-rgb, 24, 24, 27), 0.04)));
      --row-hover: var(--ok-row-hover, var(--ion-color-step-50, rgba(var(--ion-text-color-rgb, 24, 24, 27), 0.03)));
      --primary: var(--ok-primary, var(--ion-color-primary, #3880ff));
      --primary-contrast: var(--ok-primary-contrast, var(--ion-color-primary-contrast, #ffffff));
      --border-radius: var(--ok-radius, 16px);
      --font: var(--ok-font, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);

      display: block;
      color: var(--color);
      font-family: var(--font);
    }
    * { box-sizing: border-box; }
    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      /* Flat: sin borde ni elevación (directiva 2026-06-09). */
      border: 0;
      border-radius: var(--border-radius);
      overflow: hidden;
      background: var(--background);
      box-shadow: none;
    }

    /* Panel lateral derecho (drawer) DENTRO de la tabla: filtros / alta-edición. Base (sin media):
       overlay absoluto — es lo que había hasta #75 y lo que ve un navegador sin media queries. */
    .tk-scrim { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.18); z-index: 19; }
    .drawer { position: absolute; top: 0; right: 0; height: 100%; width: 340px; max-width: 88%;
      background: var(--background); border-left: 1px solid var(--border-color);
      display: flex; flex-direction: column; z-index: 20;
      animation: tk-slide-in 0.18s ease; }
    @keyframes tk-slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
    /* #75 — El panel EMPUJA en escritorio y es HOJA COMPLETA en móvil; nunca tapa a medias.
       Medido en el hub (Servicios/Citas): a 1440 el overlay de 340px se pintaba ENCIMA de
       «Duración», «Acciones» y el selector de columnas, con el 90% de la tabla vacío a la
       izquierda; a 390 dejaba una tira de 45px de tabla (media lupa, medio «Co…») que hacía
       parecer el formulario un pop-up mal puesto. Square Dashboard reduce la tabla con un panel
       fijo; Fresha/Shopify/Odoo abren una hoja a pantalla completa en móvil.
       ≥ 834px: mientras hay panel, .card pasa a rejilla de DOS columnas (tabla | panel 360px):
       la tabla se estrecha (ya sabe hacer scroll-x, #67) y nada queda tapado. */
    @media (min-width: 834px) {
      .card.has-panel { display: grid; grid-template-columns: minmax(0, 1fr) 360px; grid-template-rows: auto minmax(0, 1fr) auto; }
      .card.has-panel > .bar { grid-column: 1; grid-row: 1; }
      .card.has-panel > .scroll, .card.has-panel > .cards-grid, .card.has-panel > .empty { grid-column: 1; grid-row: 2; min-height: 0; overflow: auto; }
      .card.has-panel > .pager { grid-column: 1; grid-row: 3; }
      .card.has-panel > .drawer { position: static; grid-column: 2; grid-row: 1 / -1; width: auto; max-width: none; height: auto; min-height: 0; animation: none; }
      .card.has-panel > .tk-scrim { display: none; }
    }
    /* < 834px: hoja a pantalla completa con su cabecera (título + Cerrar); sin tira residual.
       position:fixed dentro de ion-content se ancla al área de contenido (contain), que es justo el hueco
       bajo la cabecera de la app: el usuario conserva el título de la página. */
    @media (max-width: 833.98px) {
      .drawer { position: fixed; inset: 0; top: var(--ok-sheet-top, 0px); width: 100%; max-width: none; height: auto; border-left: 0; z-index: 1000; }
      .tk-scrim { display: none; }
    }
    .drawer .dh { flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between;
      padding: 0.6rem 0.5rem 0.6rem 1rem; border-bottom: 1px solid var(--border-color); font-size: 1rem; }
    .drawer .db { flex: 1 1 auto; min-height: 0; overflow: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.85rem; }
    .fblock { display: flex; flex-direction: column; gap: 0.45rem; }
    .flabel { font-size: 13px; font-weight: 500; color: var(--color); }
    .frange { display: flex; gap: 0.5rem; }
    /* Filtros cliente: multi-select con ion-select (ventana flotante de Ionic) + rango de fechas. */
    .daterange { display: flex; gap: 0.6rem; }
    .daterange ion-input { flex: 1; }
    /* Pie del drawer de filtros: Limpiar / Aplicar. */
    .df { flex: 0 0 auto; display: flex; align-items: center; justify-content: flex-end; gap: 0.4rem; padding: 0.6rem 0.85rem; border-top: 1px solid var(--border-color); }
    .df .df-clear { margin-right: auto; }

    /* Modo fill: la tabla ocupa el alto del contenedor; filas con scroll interno; pager fijo. */
    :host([fill]) { display: flex; flex-direction: column; height: 100%; min-height: 0; }
    :host([fill]) .card { flex: 1 1 auto; min-height: 0; }
    :host([fill]) .bar, :host([fill]) .panel, :host([fill]) .pager { flex: 0 0 auto; }
    :host([fill]) .scroll, :host([fill]) .cards-grid { flex: 1 1 auto; min-height: 0; overflow: auto; }
    /* Sin filas, renderTable/renderCards devuelven SOLO el bloque .empty (sin .scroll). En modo
       fill hay que estirarlo para que ocupe el hueco entre toolbar y pager y centre su contenido
       (icono + mensaje) en vertical; si no, queda pegado arriba con el pager a media altura. */
    :host([fill]) .empty { flex: 1 1 auto; min-height: 0; }

    /* ── Topbar / cabecera (relieve) ─────────────────────────────────────────────────────── */
    .bar { display: flex; flex-direction: column; gap: 0.6rem; padding: 0.65rem 1rem; border-bottom: 1px solid var(--border-color); background: var(--header-background); }
    /* Toolbar CONSOLIDADA: TODOS los controles son hijos directos de UNA sola fila flex que
     * envuelve ELEMENTO A ELEMENTO (no por bloques): caben en una línea → una línea; los que no
     * caben bajan a la(s) línea(s) que hagan falta. El cluster derecho se empuja al borde con
     * .tk-spacer (hueco flexible) solo cuando todo cabe en una línea; al envolver, el spacer se
     * oculta y todo se apila a la izquierda.
     * ORDEN CANÓNICO (2026-06-22, izquierda→derecha): [buscador] · [filtros en línea] · ‹spacer› ·
     * [SELECTORES: columnas → filas/página] · [BOTONES: vistas → filtros(funnel) → import → export →
     * alta → ⋮ → acción primaria]. Es decir: buscador al inicio, filtros en medio, y al final los
     * selectores (columnas, luego «N por página») seguidos de los botones de acción. */
    .bar-main { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
    .bar-main > ion-button { --padding-start: 0.5rem; --padding-end: 0.5rem; margin: 0; }
    /* Spacer que absorbe el hueco libre en pantallas anchas (empuja el cluster derecho al borde).
     * Se oculta por debajo de 1024px para que, al envolver, los controles se apilen a la izquierda. */
    .tk-spacer { flex: 1 1 0; min-width: 0; align-self: stretch; }
    @media (max-width: 1024px) { .tk-spacer { display: none; } }
    /* Buscador a ancho completo (línea propia) en móvil; el resto envuelve debajo. */
    @media (max-width: 640px) { .search { flex-basis: 100%; max-width: none; } }
    .title-wrap { display: flex; align-items: baseline; gap: 0.5rem; }
    .title { font-size: 15px; font-weight: 600; line-height: 1; margin: 0; }
    .title-count { font-size: 12px; font-weight: 500; color: var(--color-muted); }

    /* Botón de herramienta cuadrado (filtros/import/export), look del Hub: 36×36, badge contador. */
    .toolbtn { position: relative; --padding-start: 0; --padding-end: 0; --border-radius: 10px; width: 36px; height: 36px; margin: 0; }
    .toolbtn .badge { position: absolute; top: -5px; right: -5px; min-width: 16px; height: 16px; padding: 0 3px; border-radius: 999px; background: var(--primary); color: var(--primary-contrast); font-size: 10px; font-weight: 700; line-height: 16px; text-align: center; pointer-events: none; }

    /* Buscador (caja con icono + limpiar), look del Hub. No crece (el spacer se queda el hueco);
     * puede encoger hasta min-width y, por debajo, envuelve. */
    .search { flex: 0 1 22rem; min-width: 12rem; max-width: 24rem; }
    ion-searchbar { --background: var(--background); --border-radius: 10px; padding: 0; min-height: 36px; }
    /* Flat: el buscador quita borde y elevación vía la clase específica de Ionic 'ion-no-border'.
     * (La regla global de Ionic para .ion-no-border no cruza el Shadow DOM, así que la
     * reimplementamos aquí dentro: --box-shadow controla la elevación; ::part(native) el borde.) */
    ion-searchbar.ion-no-border { --box-shadow: none; }
    ion-searchbar.ion-no-border::part(native) { border: none; box-shadow: none; }

    /* Toggle de vista lista/tarjetas (segmento) */
    .viewseg { display: inline-flex; align-items: center; gap: 2px; padding: 2px; border: 1px solid var(--border-color); border-radius: 10px; background: var(--background); }
    .viewseg ion-button { --border-radius: 7px; }

    /* Botón primario (primaryAction) */
    .primary-btn { --background: var(--primary); --color: var(--primary-contrast); }
    /* #76 — El alta en MÓVIL: botón primario CON etiqueta y área táctil de 44px, en vez del «+»
       icónico de 36px al final de la barra. Fresha/Square/Shopify POS ponen la acción primaria
       de la lista como botón visible con texto (o FAB), nunca como icono anónimo.
       #113 — Y en ESCRITORIO igual: Odoo («New»), Business Central, Shopify («Add product»),
       WooCommerce, Lightspeed y Fresha rotulan y rellenan la acción principal de un listado; NN/g
       reserva el botón sin rótulo para lo universal (buscar, cerrar). Aquí solo cambia la ALTURA:
       36px para alinear con .toolbtn y el buscador, y los 44px táctiles vuelven abajo con el
       resto de objetivos de puntero grueso. */
    .add-btn { min-height: 36px; --border-radius: 10px; --padding-start: 0.9rem; --padding-end: 1rem; margin: 0; font-weight: 600; }
    .add-btn ion-icon { margin-inline-end: 0.35rem; }

    /* Selects de la toolbar: fondo + borde visibles (como el buscador y la pastilla de fechas) para
     * que se distingan como controles en claro y oscuro (sin fondo eran invisibles en dark). */
    .tk-cols { min-width: 6.5rem; max-width: 9rem; min-height: 38px; font-size: 13px; background: var(--background); color: var(--color); border: 1px solid var(--control-border); border-radius: 10px; --padding-start: 0.6rem; --padding-end: 0.4rem; --padding-top: 0.3rem; --padding-bottom: 0.3rem; }
    .vsep { width: 1px; align-self: stretch; background: var(--border-color); margin: 0.3rem 0.25rem; }

    /* Selector de filas/página en la toolbar (consolidado) */
    /* max-width: ion-select es display:block (sin core.css el host estira a la
     * línea entera cuando .bar-end hace wrap) — se capa como .tk-cols. */
    .tk-psize { min-width: 4.25rem; max-width: 5.5rem; min-height: 38px; font-size: 13px; background: var(--background); color: var(--color); border: 1px solid var(--control-border); border-radius: 10px; --padding-start: 0.6rem; --padding-end: 0.4rem; --padding-top: 0.35rem; --padding-bottom: 0.35rem; }

    /* Filtros EN LÍNEA en la toolbar (select / rango de fechas) */
    .tk-filter { min-width: 8.5rem; max-width: 13rem; min-height: 38px; font-size: 13px; background: var(--background); color: var(--color); border: 1px solid var(--control-border); border-radius: 10px; --padding-start: 0.7rem; --padding-end: 0.5rem; --padding-top: 0.35rem; --padding-bottom: 0.35rem; }
    .tk-daterange { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.6rem; min-height: 38px; border: 1px solid var(--control-border); border-radius: 10px; background: var(--background); color: var(--color-muted); font-size: 13px; }
    .tk-daterange ion-icon { font-size: 15px; flex: 0 0 auto; }
    .tk-daterange ion-input { --background: transparent; --padding-start: 0; --padding-end: 0; --padding-top: 2px; --padding-bottom: 2px; --color: var(--color); min-height: 26px; width: 6.8rem; font-size: 13px; }
    .tk-daterange .arr { color: var(--color-muted); }

    /* Barra contextual de selección */
    .selbar { display: flex; align-items: center; gap: 0.6rem; padding: 0.4rem 0.7rem; border-radius: 10px;
      font-size: 13px; color: var(--primary);
      background: color-mix(in srgb, var(--primary) 12%, transparent); }
    .selbar .sel-clear { margin-left: auto; display: inline-flex; align-items: center; gap: 0.25rem; cursor: pointer; font-weight: 500; color: inherit; background: none; border: 0; font: inherit; }
    .selbar .sel-clear:hover { text-decoration: underline; }

    /* Acordeones (alta / filtros en modo tarjetas) */
    .panel { padding: 0.85rem 1rem; border-bottom: 1px solid var(--border-color); background: var(--header-background); }
    .filters-panel { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.6rem; }

    /* ── Vista lista en CSS GRID (no <table>): permite ancho por columna ──────────────────── */
    /* #67 — La barra horizontal es PERMANENTE cuando hay desbordamiento: la overlay de macOS se
       esconde a los pocos ms y deja la tabla sin ninguna pista de que sigue a la derecha. Al
       declarar ::-webkit-scrollbar el navegador pinta la clásica, que ocupa sitio y se ve. */
    .scroll { overflow-x: auto; }
    .scroll::-webkit-scrollbar { height: 10px; }
    .scroll::-webkit-scrollbar-track { background: transparent; }
    .scroll::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--color) 25%, transparent); border-radius: 6px; }
    .scroll::-webkit-scrollbar-thumb:hover { background: color-mix(in srgb, var(--color) 40%, transparent); }
    /* #120 - The grid floor is the SUM OF THE COLUMN MINIMUMS (min-content), not its maximum
       size. With max-content the grid sizes itself to what the widest column asks for and, in
       doing so, every 1fr track ends up as wide AS THAT ONE: at 834px each column measured
       148.86px for content asking between 10px (a "4") and 100px ("Familia Perez"). The table
       always overflowed and the pinned actions column sat on top of Pax and Estado. With
       min-content the grid fits its container as long as the minimums fit, and 1fr shares out the
       leftover space; horizontal scroll shows up only when not even the minimums fit. */
    .grid { min-width: min-content; font-size: 14px; }
    .grow { display: grid; align-items: center; gap: 0.5rem; padding: 0 1rem; }
    .ghead { position: sticky; top: 0; z-index: 2; border-bottom: 1px solid var(--border-color);
      background: var(--header-background); padding-top: 0.55rem; padding-bottom: 0.55rem; }
    .gcell { display: flex; align-items: center; min-width: 0; }
    .gcell > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .gcell.right { justify-content: flex-end; text-align: right; }
    .gcell.center { justify-content: center; text-align: center; }
    /* #67 - PINNED ACTIONS COLUMN. When the grid overflows (since #120 only when not even the
       column minimums fit; before that it happened with six columns and room to spare) the button
       that opens the record went off screen: at 1440px it sat 335px past the edge with nothing to
       give it away. It stays stuck to the right edge, like Zendesk/Freshdesk/Shopify. With
       background:inherit it takes the row background (which is opaque for this very reason), so it
       keeps hover and selection without anything showing through. */
    .gcell.actions-col { position: sticky; right: 0; z-index: 1; background: inherit;
      margin-right: -1rem; padding-right: 1rem; }
    /* La sombra solo aparece cuando de verdad hay algo escondido a la izquierda (clase x-overflow);
       si la tabla cabe entera no se pinta nada. */
    .scroll.x-overflow .gcell.actions-col { box-shadow: -10px 0 10px -10px color-mix(in srgb, var(--color) 45%, transparent); }
    /* #120 - The pinned header has to be OPAQUE. background:inherit took --header-background,
       which is a 4% alpha TINT (measured rgba(24,24,27,0.04)): when the grid overflows the
       "Acciones" header went see-through and "PAX" and "ESTADO" could be read through it - the
       "PAXCIONESTAD" of the issue. It now sits on the opaque table background with the tint laid
       back on top, the same way .grow-data:hover does. */
    .ghead .gcell.actions-col { z-index: 3;
      background: linear-gradient(var(--header-background), var(--header-background)), var(--background); }
    .gh { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-muted); }
    .gh.sortable { cursor: pointer; user-select: none; white-space: nowrap; transition: background-color var(--ok-transition, 150ms ease), color var(--ok-transition, 150ms ease), box-shadow var(--ok-transition, 150ms ease), transform 120ms ease; }
    @media (hover: hover) {
      .gh.sortable:hover { color: var(--color); }
    }
    /* Caret de orden (3 estados, icono Ionic): neutral atenuado / activo en color primario. */
    .caret { display: inline-flex; align-items: center; margin-left: 0.25rem; flex: 0 0 auto; font-size: 13px; opacity: 0.3; }
    .caret.on { opacity: 1; color: var(--primary); }
    .grow-data { background: var(--background); border-bottom: 1px solid var(--border-color-soft); padding-top: 0.6rem; padding-bottom: 0.6rem; transition: background-color var(--ok-transition, 150ms ease), color var(--ok-transition, 150ms ease), box-shadow var(--ok-transition, 150ms ease), transform 120ms ease; }
    .grow-data:last-child { border-bottom: 0; }
    @media (hover: hover) {
      .grow-data:hover { background: linear-gradient(var(--row-hover), var(--row-hover)), var(--background); }
    }
    .grow-data:active { transform: scale(0.995); }
    .grow-data.selected { background: linear-gradient(color-mix(in srgb, var(--primary) 10%, transparent), color-mix(in srgb, var(--primary) 10%, transparent)), var(--background); }
    /* #67 — Fila clicable (opt-in row-clickable): es lo primero que intenta el usuario y lo que
       hacen Odoo, Jira SM, Shopify o Square en sus listados. */
    .grow-data.clickable { cursor: pointer; }
    .grow-data.clickable:focus-visible { outline: 2px solid var(--primary); outline-offset: -2px; }
    .selcb { display: flex; align-items: center; justify-content: center; }
    .filters-grow { padding-top: 0.4rem; padding-bottom: 0.6rem; }
    .filters-grow input, .filters-grow select { width: 100%; box-sizing: border-box; font: inherit; font-size: 13px; padding: 0.3rem 0.4rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--background); color: var(--color); }
    .range { display: flex; gap: 0.25rem; }

    /* ── Vista tarjetas ──────────────────────────────────────────────────────────────────── */
    /* Cada tarjeta mide SU contenido (no se estira al alto de la fila ni del contenedor):
       - grid-auto-rows: max-content → cada fila implícita = alto de su contenido. CLAVE: sin esto,
         en modo fill (grid de alto fijo + align-content:start) cuando las tarjetas no caben el
         navegador encoge los tracks de fila y las tarjetas se solapan.
       - align-content: start → empaqueta las filas arriba (no reparte el hueco sobrante estirando).
       - align-items: start → en una fila multi-columna cada tarjeta mide su propio contenido.
       En modo fill el grid es flex-child con overflow:auto → cuando las tarjetas no caben aparece el
       scroll DENTRO de la tabla (no crece hacia fuera). */
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 0.75rem; padding: 1rem; grid-auto-rows: max-content; align-content: start; align-items: start; }
    /* Tarjeta = ion-card NATIVO de Ionic: su fondo, radio, elevación y padding son los de Ionic y NO
       se sobrescriben. Aquí solo se ajusta lo que el contexto de rejilla exige (margin) y los huecos
       que Ionic no trae (cabecera en fila, filas clave-valor, barra de acciones, resalte de selección). */
    ion-card.rcard { margin: 0; } /* la rejilla aporta el gap → sin esto el margin por defecto de ion-card lo duplica */
    ion-card.rcard.selected { outline: 2px solid var(--primary); outline-offset: -2px; }
    /* #74 — Tarjeta clicable (opt-in row-clickable): la mitad de #67 que faltaba. La vista de
       tarjetas es la que la tabla elige SOLA en móvil, así que sin esto el registro no se podía
       abrir desde un teléfono (medido con combos 0.1.4: 0 rowClick a 390px). */
    ion-card.rcard.clickable { cursor: pointer; }
    ion-card.rcard.clickable:focus-visible { outline: 2px solid var(--primary); outline-offset: -2px; }
    @media (prefers-reduced-motion: reduce) {
      .gh.sortable:hover, .gh.sortable:active,
      .grow-data:hover, .grow-data:active { transform: none; }
    }
    /* Header: ion-card-header as a single row (icon + title + checkbox), keeping Ionic's padding.
       #79 — flex-direction/flex-wrap are SPELLED OUT on purpose: in ios mode (the mode the Hub
       shell pins, ADR-0143) Ionic's own host CSS gives ion-card-header a column direction, so a
       rule that only sets display:flex inherits it and the three children stack on three lines.
       Under md the same rule looked right, which is why it shipped. */
    ion-card-header.rcard-head { display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; gap: 0.5rem; }
    .rcard-head .rc-icon { display: inline-flex; color: var(--primary); }
    .rcard-head .rc-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
    /* Cuerpo: ion-card-content (padding Ionic por defecto) con las filas clave-valor apiladas. */
    ion-card-content.rcard-body { display: flex; flex-direction: column; gap: 0.4rem; }
    .rrow { display: flex; justify-content: space-between; gap: 0.5rem; font-size: 13px; }
    .rrow .rk { color: var(--color-muted); }
    .rrow .rv { font-weight: 500; text-align: right; color: var(--color); }
    /* Barra de acciones (Ionic no trae "card actions"): pie alineado a la derecha, fondo transparente. */
    .ractions { display: flex; justify-content: flex-end; gap: 0.25rem; padding: 0 0.5rem 0.5rem; }
    /* ERPlora/appointments#154 - a card's action row must NEVER clip.
       The assumption was that they always fit across the card. With the eight actions an
       appointment carries they do not: on a 411dp phone the card leaves 363px and the buttons ask
       for 380px (8 x 44px of tap floor + 7 gaps of 4px). Without wrapping, justify-content:
       flex-end takes that difference off the START side, so the FIRST button - Cobrar - hung off
       the left edge of the card, clipped, with no scrollbar and nothing to say it was there.
       The wrap is scoped to the card on purpose: the LIST view's row is measured by its
       scrollWidth to pin the column track (#121), and a row that wraps changes width with the
       track it is measured against, which is the loop that measure avoids. */
    .ractions .actions { flex-wrap: wrap; }

    /* ── Estado vacío ────────────────────────────────────────────────────────────────────── */
    .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 3.5rem 1rem; text-align: center; color: var(--color-muted); }
    .empty .empty-ic { display: grid; place-items: center; width: 3.25rem; height: 3.25rem; border-radius: 999px; background: var(--header-background); font-size: 26px; }

    .actions { display: flex; gap: 0.25rem; justify-content: flex-end; }
    /* #121 - The buttons NEVER shrink. Their track is pinned to the width measured here
       (the scrollWidth of .actions); if they could shrink, a narrow track would shrink the
       measurement, which would shrink the track again. flex: 0 0 auto is what makes the
       measurement a property of the CONTENT instead of a property of the current layout. */
    .actions ion-button { flex: 0 0 auto; }
    /* #122 - Header of the actions column while the buttons are folded into the menu. "ACCIONES"
       measures 62.83px and the folded track is 44px: painted, it spills out of its own cell and
       over "Estado" - the very thing the issue is about. The column keeps its name for assistive
       tech and paints nothing. */
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden;
      clip-path: inset(50%); white-space: nowrap; border: 0; }
    /* Las acciones de fila son icon-only y de tamaño small en escritorio. En tablet/móvil se
     * amplía el host completo (no solo el icono) para que el área táctil alcance 44×44 px. */
    @media (pointer: coarse), (max-width: 834px) {
      .actions ion-button { min-width: 44px; min-height: 44px; margin: 0; }
      .toolbtn { width: 44px; height: 44px; }
      .add-btn { min-height: 44px; }
      .pager .nav ion-button { min-width: 44px; min-height: 44px; margin: 0; }
    }
    /* Spinner de acción en curso (loading): contenido dentro del ion-button small (Ionic lo fija
     * a 28px en el :host, por eso width/height y no font-size). Cubre tabla y tarjetas: los
     * botones de fila siempre van dentro de .actions. */
    .actions ion-spinner { width: 18px; height: 18px; }

    /* ── Pie: contador + paginación ──────────────────────────────────────────────────────── */
    .pager { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.55rem 1rem; border-top: 1px solid var(--border-color); background: var(--header-background); font-size: 12.5px; color: var(--color-muted); }
    .pager .left { display: flex; align-items: center; gap: 0.6rem; }
    .pager .strong { font-weight: 600; color: var(--color); }
    .psize { font: inherit; font-size: 12.5px; padding: 0.2rem 0.35rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--background); color: var(--color); }
    .pager .nav { display: flex; align-items: center; gap: 0.2rem; }
    /* #78 — Pie en MÓVIL: un solo control «Cargar más» en lugar del pager numerado (Shopify
       IndexTable, Fresha, Square y Material hacen lo mismo: nadie pinta botones de página en un
       teléfono). Sin atributo fill: el sólido por defecto de Ionic es el único que pinta caja en
       modo ios (outfitkit#82 / ADR-0143). Los 44px son el área táctil mínima. */
    .pager .load-more { min-height: 44px; margin: 0; --padding-start: 1rem; --padding-end: 1rem; font-size: 13px; }
    .pager .nav .pp { font-weight: 600; color: var(--color); padding: 0 0.25rem; }
    /* Pager numerado: botón por página + «…» en los saltos (look del Hub). */
    /* #92 — min-width/height at 44px so a numbered page button matches the prev/next ion-button's
       own 44px tap target (line above): before this they were visibly smaller than their neighbors. */
    .pnum { min-width: var(--ok-tap-min, 44px); height: var(--ok-tap-min, 44px); padding: 0 0.4rem; border: 1px solid transparent; border-radius: 8px; background: none; font: inherit; font-size: 12.5px; font-weight: 600; color: var(--color); cursor: pointer; transition: background 0.12s, border-color 0.12s; }
    .pnum:hover { background: var(--row-hover); }
    .pnum.on { background: color-mix(in srgb, var(--primary) 14%, transparent); color: var(--primary); border-color: color-mix(in srgb, var(--primary) 40%, transparent); }
    .pgap { padding: 0 0.15rem; color: var(--color-muted); }
    ion-button { --box-shadow: none; }
  `;
  }
  static {
    this.MOBILE_BREAKPOINT = 640;
  }
  connectedCallback() {
    super.connectedCallback();
    if (typeof window !== "undefined") {
      window.addEventListener("erplora:locale-changed", this.onLocaleChanged);
      window.addEventListener("resize", this.onWindowResize);
    }
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      this.mq = window.matchMedia(`(max-width: ${_OkDataTable2.MOBILE_BREAKPOINT}px)`);
      this.isMobile = this.mq.matches;
      const handler = (e5) => {
        const matches = "matches" in e5 ? e5.matches : this.mq?.matches ?? false;
        if (this.isMobile === matches) return;
        this.isMobile = matches;
        if (matches && this.cardViewEnabled) this.viewMode = "cards";
        else if (!matches && this.viewMode === "cards") this.viewMode = "table";
      };
      this.mq.addEventListener("change", handler);
      this._mqHandler = handler;
    }
  }
  /** #67 — Recalcula si la vista lista desborda a lo ancho (`scrollWidth > clientWidth`).
   *
   * Se mide después de renderizar, que es cuando el navegador ya conoce los anchos, y solo se
   * escribe el estado si CAMBIA: asignarlo siempre reprogramaría un render en bucle. */
  measureXOverflow() {
    const scroll = this.renderRoot?.querySelector?.(".scroll");
    const overflow = !!scroll && scroll.scrollWidth > scroll.clientWidth;
    if (this.xOverflow !== overflow) this.xOverflow = overflow;
  }
  /** #121 — Ancho natural de los botones de acción de una fila, para clavar su pista en px.
   *
   * Se lee del `scrollWidth` de `.actions`, que es el ancho de SU CONTENIDO: como los botones
   * llevan `flex: 0 0 auto` nunca se encogen, así que la medida no depende de lo ancha que sea la
   * pista en ese momento. Eso es lo que la hace estable: clavar la pista al ancho natural no
   * cambia el ancho natural, así que la siguiente medida sale igual y no hay bucle. */
  measureActionsTrack() {
    if (!this.actions.length) {
      if (this.actionsTrackPx !== 0) this.actionsTrackPx = 0;
      return;
    }
    const el = this.renderRoot?.querySelector?.(".grow-data .gcell.actions-col .actions");
    const width = el ? Math.ceil(el.scrollWidth) : 0;
    if (width > 0 && width !== this.actionsTrackPx) this.actionsTrackPx = width;
  }
  /** #122 — Decide si los botones de acción de la fila caben o se pliegan en el menú «⋮».
   *  El criterio y la garantía de que no oscila viven en `decideRowActionsFit`. */
  measureRowActionsFit() {
    const scroll = this.renderRoot?.querySelector?.(".scroll");
    if (!scroll) return;
    const next = decideRowActionsFit({
      containerWidth: scroll.clientWidth,
      contentWidth: scroll.scrollWidth,
      collapsed: this.rowActionsCollapsed,
      decidedAtWidth: this.fitDecidedAtWidth
    });
    this.fitDecidedAtWidth = next.decidedAtWidth;
    if (this.rowActionsCollapsed !== next.collapsed) this.rowActionsCollapsed = next.collapsed;
  }
  /** Engancha el observador al contenedor de scroll del render actual (cambia entre vistas). */
  observeXOverflow() {
    if (typeof ResizeObserver === "undefined") return;
    const scroll = this.renderRoot?.querySelector?.(".scroll");
    if (!scroll) return;
    this.xObserver ??= new ResizeObserver(() => {
      this.measureXOverflow();
      this.measureActionsTrack();
      this.measureRowActionsFit();
    });
    this.xObserver.disconnect();
    this.xObserver.observe(scroll);
    const grid = scroll.querySelector(".grid");
    if (grid) this.xObserver.observe(grid);
  }
  updated(changed) {
    this.observeXOverflow();
    this.measureXOverflow();
    if (changed.has("columns") || changed.has("actions") || changed.has("hiddenKeys") || changed.has("selectable")) {
      this.fitDecidedAtWidth = -1;
    }
    this.measureActionsTrack();
    this.measureRowActionsFit();
    if (changed.has("panel")) this.syncSheetTop();
  }
  /** #75 — Where the mobile sheet starts. `position: fixed; inset: 0` painted it from y=0 and the
   *  app's `ion-header` (its own stacking context, above the content) covered the sheet's title and
   *  its only Close button — measured at 390×844 in the Appointments parity page. CSS inside a
   *  shadow root cannot know where the content area begins, so on open the table measures the
   *  closest `ion-content` (walking through shadow hosts) and hands the offset over as a custom
   *  property; on close it is removed. Without an `ion-content` around, the sheet keeps y=0. */
  syncSheetTop() {
    if (this.panel === "none") {
      this.style.removeProperty("--ok-sheet-top");
      return;
    }
    let node = this;
    let content = null;
    while (node && !content) {
      const parent = node.parentNode ?? node.getRootNode?.()?.host ?? null;
      if (parent && parent.nodeType === Node.ELEMENT_NODE && parent.tagName === "ION-CONTENT") content = parent;
      node = parent === node ? null : parent;
    }
    const top = content ? Math.max(0, Math.round(content.getBoundingClientRect().top)) : 0;
    this.style.setProperty("--ok-sheet-top", `${top}px`);
  }
  disconnectedCallback() {
    if (typeof window !== "undefined") {
      window.removeEventListener("erplora:locale-changed", this.onLocaleChanged);
      window.removeEventListener("resize", this.onWindowResize);
    }
    this.xObserver?.disconnect();
    this.xObserver = void 0;
    if (this.mq) {
      const handler = this._mqHandler;
      if (handler) this.mq.removeEventListener("change", handler);
      this.mq = void 0;
    }
    super.disconnectedCallback();
  }
  // ── i18n: idioma del documento ← overrides explícitos de `.labels` ─────────────────────────
  get t() {
    const lang = typeof document === "undefined" ? "en" : document.documentElement.lang.toLowerCase();
    return { ...lang.startsWith("es") ? ES_LABELS : DEFAULT_LABELS, ...this.labels };
  }
  /** Placeholder efectivo del buscador (prop explícita → label i18n → default inglés). */
  get effSearchPlaceholder() {
    return this.searchPlaceholder ?? this.t.search;
  }
  /** Mensaje efectivo de estado vacío (prop explícita → label i18n → default inglés). */
  get effEmptyMessage() {
    return this.emptyMessage ?? this.t.empty;
  }
  // ── Resolución de alias (compat + documentados) ──────────────────────────────────────────
  get effPageSizes() {
    return this.pageSizes ?? this.pageSizeOptions;
  }
  get effColumnPicker() {
    return this.columnPicker || this.columnSelector;
  }
  get effExport() {
    return this.csv || this.exportable;
  }
  get effImport() {
    return this.csv || this.importable;
  }
  /** ¿Está habilitado el conmutador de vista lista/tarjetas? */
  get viewToggle() {
    if (Array.isArray(this.views)) return this.views.length > 1;
    return this.views === true;
  }
  /** ¿Está disponible la vista tarjetas? (presente en `views` o `views === true`). */
  get cardViewEnabled() {
    if (Array.isArray(this.views)) return this.views.some((v3) => v3 === "cards" || v3 === "card");
    return this.views === true;
  }
  /** Columnas actualmente visibles (respeta el column chooser). */
  get visibleColumns() {
    return this.hiddenKeys.size ? this.columns.filter((c5) => !this.hiddenKeys.has(c5.key)) : this.columns;
  }
  setVisibleColumns(keys) {
    const visible = new Set(keys);
    this.hiddenKeys = new Set(this.columns.map((c5) => c5.key).filter((k2) => !visible.has(k2)));
    this.emit("columnsChange", { visible: keys });
  }
  // ── Selección ─────────────────────────────────────────────────────────────────────────────
  keyOf(row) {
    if (typeof this.rowKey === "function") return String(this.rowKey(row) ?? "");
    if (typeof this.rowKey === "string") return String(row[this.rowKey] ?? "");
    return String(row[this.rowKeyField] ?? "");
  }
  /** #143 — `<prefix>-<suffix>`, or `nothing` (= the attribute is not painted) when the host gave
   *  no prefix. A blank prefix counts as absent: `" "` would leave dangling `-add` hooks, identical
   *  on every table of the screen, which is exactly what the prefix prevents. */
  tid(suffix) {
    const prefix = this.testid?.trim();
    return prefix ? `${prefix}-${suffix}` : A;
  }
  get selection() {
    return this.selectedKeys ?? this.internalSelection;
  }
  setSelection(next) {
    if (!this.selectedKeys) this.internalSelection = next;
    this.emit("selectionChange", { keys: [...next] });
    this.requestUpdate();
  }
  toggleRow(key) {
    const next = new Set(this.selection);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this.setSelection(next);
  }
  toggleAll(visible) {
    const keys = visible.map((r6) => this.keyOf(r6));
    const allOn = keys.length > 0 && keys.every((k2) => this.selection.has(k2));
    const next = new Set(this.selection);
    if (allOn) keys.forEach((k2) => next.delete(k2));
    else keys.forEach((k2) => next.add(k2));
    this.setSelection(next);
  }
  // ── CSV ─────────────────────────────────────────────────────────────────────────────────────
  csvEscape(v3) {
    const s5 = v3 === null || v3 === void 0 ? "" : String(v3);
    return /[",\n\r]/.test(s5) ? `"${s5.replace(/"/g, '""')}"` : s5;
  }
  /** Exporta las filas a CSV (cabeceras = column.key). Si no hay filas, exporta solo la estructura. */
  exportCsv() {
    const cols = this.columns;
    const head = cols.map((c5) => this.csvEscape(c5.key)).join(",");
    const lines = this.rows.map((r6) => cols.map((c5) => this.csvEscape(r6[c5.key])).join(","));
    const csv = [head, ...lines].join("\r\n");
    const blob = new Blob([CSV_BOM + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a3 = document.createElement("a");
    a3.href = url;
    a3.download = this.csvName;
    a3.click();
    URL.revokeObjectURL(url);
    this.emit("csvExport", { rows: this.rows.length });
    this.emit("export", { rows: this.rows.length });
  }
  parseCsv(text) {
    const out = [];
    let row = [];
    let field = "";
    let q = false;
    for (let i7 = 0; i7 < text.length; i7++) {
      const c5 = text[i7];
      if (q) {
        if (c5 === '"') {
          if (text[i7 + 1] === '"') {
            field += '"';
            i7++;
          } else q = false;
        } else field += c5;
      } else if (c5 === '"') q = true;
      else if (c5 === ",") {
        row.push(field);
        field = "";
      } else if (c5 === "\n" || c5 === "\r") {
        if (c5 === "\r" && text[i7 + 1] === "\n") i7++;
        row.push(field);
        field = "";
        if (row.length > 1 || row[0] !== "") out.push(row);
        row = [];
      } else field += c5;
    }
    if (field !== "" || row.length) {
      row.push(field);
      out.push(row);
    }
    const headers = out.shift() ?? [];
    const rows = out.map((r6) => Object.fromEntries(headers.map((h4, i7) => [h4, r6[i7] ?? ""])));
    return { headers, rows };
  }
  async onImportFile(ev) {
    const input = ev.target;
    const file = input.files?.[0];
    if (!file) return;
    const text = decodeCsvBuffer(await file.arrayBuffer());
    const { headers, rows } = this.parseCsv(text);
    this.emit("csvImport", { headers, rows });
    this.emit("import", { headers, rows });
    input.value = "";
  }
  toggle(p4) {
    if (p4 === "filters" && this.panel !== "filters") {
      this.filterDraft = this.cloneFilters(this.clientFilters);
    }
    this.panel = this.panel === p4 ? "none" : p4;
  }
  // ── Filtros en memoria (modo cliente): borrador → aplicar. ───────────────────────────────────
  cloneFilters(src) {
    const out = {};
    for (const [k2, f3] of Object.entries(src)) {
      out[k2] = { values: f3.values ? new Set(f3.values) : void 0, from: f3.from, to: f3.to };
    }
    return out;
  }
  // Fija el conjunto de valores seleccionados de una columna (multi-select del drawer = ion-select).
  setFilterValues(key, values) {
    const next = this.cloneFilters(this.filterDraft);
    const clean = (values ?? []).filter((v3) => v3 != null && v3 !== "");
    if (clean.length) next[key] = { ...next[key], values: new Set(clean) };
    else next[key] = { ...next[key], values: void 0 };
    this.filterDraft = next;
  }
  setFilterRange(key, edge, value) {
    const next = this.cloneFilters(this.filterDraft);
    next[key] = { ...next[key], [edge]: value };
    this.filterDraft = next;
  }
  applyFilters() {
    const clean = {};
    for (const [k2, f3] of Object.entries(this.filterDraft)) {
      if (f3.values && f3.values.size > 0 || f3.from || f3.to) clean[k2] = f3;
    }
    this.clientFilters = clean;
    this.clientPage = 0;
    this.mobileShown = 0;
    this.panel = "none";
    this.emit("filterChange", { filters: this.serializeFilters(clean) });
  }
  clearFilters() {
    this.filterDraft = {};
  }
  serializeFilters(src) {
    const out = {};
    for (const [k2, f3] of Object.entries(src)) {
      if (f3.values && f3.values.size > 0) out[k2] = [...f3.values];
      else if (f3.from || f3.to) out[k2] = { from: f3.from ?? "", to: f3.to ?? "" };
    }
    return out;
  }
  /** Abre el panel lateral (API pública para el módulo, p.ej. "editar" abre el form pre-rellenado). */
  open(panel = "create") {
    this.panel = panel;
  }
  /** Cierra el panel lateral. */
  close() {
    this.panel = "none";
  }
  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  }
  get hasSearch() {
    return this.searchable || this.searchKeys.length > 0;
  }
  /** Columnas filtrables (con control en el panel de filtros). En cliente y en servidor. */
  get filterColumns() {
    return this.columns.filter((c5) => c5.filterable);
  }
  /** ¿Hay que mostrar el botón de Filtros? (cualquier columna filtrable). */
  get hasFilterRow() {
    return this.filterColumns.length > 0;
  }
  /** Nº de filtros activos → badge del botón Filtros. En servidor cuenta `filterValues` (#106): sin
   *  esto el embudo no daba NINGUNA señal de que la lista venía acotada. */
  get activeFilterCount() {
    if (this.serverSide) {
      return Object.keys(this.serverFilters).filter((k2) => this.serverFilterState(k2) !== void 0).length;
    }
    return Object.values(this.clientFilters).filter(
      (f3) => f3.values && f3.values.size > 0 || f3.from || f3.to
    ).length;
  }
  // ── Estado de filtro VISIBLE (#106) ──────────────────────────────────────────────────────────
  /** Traduce un valor de `filterValues` (la forma que emite `filterChange`) a la forma interna que
   *  usan los `render*Filter`. `undefined` = ese filtro no está puesto. */
  serverFilterState(key) {
    const raw = this.serverFilters[key];
    if (raw === void 0 || raw === null || raw === "") return void 0;
    if (Array.isArray(raw)) {
      const values = raw.filter((v3) => v3 !== null && v3 !== void 0 && v3 !== "").map((v3) => String(v3));
      return values.length ? { values: new Set(values) } : void 0;
    }
    if (typeof raw === "object") {
      const range = raw;
      const from = range.from === null || range.from === void 0 || range.from === "" ? void 0 : String(range.from);
      const to = range.to === null || range.to === void 0 || range.to === "" ? void 0 : String(range.to);
      return from !== void 0 || to !== void 0 ? { from, to } : void 0;
    }
    return { values: /* @__PURE__ */ new Set([String(raw)]) };
  }
  /** Estado de filtro efectivo de una columna: servidor → `filterValues`/espejo; cliente → memoria. */
  filterStateOf(key) {
    return this.serverSide ? this.serverFilterState(key) : this.clientFilters[key];
  }
  /** Fija (o borra) el valor visible de un filtro en el espejo de servidor. */
  setServerFilter(key, value) {
    const next = { ...this.serverFilters };
    const empty = value === void 0 || value === null || value === "" || Array.isArray(value) && value.length === 0;
    if (empty) delete next[key];
    else next[key] = value;
    this.serverFilters = next;
  }
  /** Fija UN extremo de un rango en el espejo. Los dos extremos viajan en eventos SEPARADOS
   *  (`{from}` y luego `{to}`), así que aquí se MEZCLA: reemplazar borraría el otro extremo. */
  setServerRangeEdge(key, edge, value) {
    const prev = this.serverFilters[key];
    const base = prev && typeof prev === "object" && !Array.isArray(prev) ? { ...prev } : {};
    base[edge] = value;
    const alive = (v3) => v3 !== void 0 && v3 !== null && v3 !== "";
    this.setServerFilter(key, alive(base.from) || alive(base.to) ? base : void 0);
  }
  /** Valor crudo de una columna para ordenar/filtrar (usa format si lo hay, si no row[key]). */
  rawValue(col, row) {
    if (col.format) return col.format(row);
    return row[col.key];
  }
  /** Valores distintos de una columna (para los chips del filtro multi-select). */
  distinctValues(col) {
    const set = /* @__PURE__ */ new Set();
    for (const row of this.rows) {
      const v3 = this.rawValue(col, row);
      if (v3 != null && v3 !== "") set.add(String(v3));
    }
    return [...set].sort((a3, b3) => a3.localeCompare(b3));
  }
  /** Filas tras buscar + filtrar + ordenar EN MEMORIA (solo modo cliente). */
  get clientFiltered() {
    let result = this.rows;
    const needle = this.q.trim().toLowerCase();
    if (needle && this.searchKeys.length) {
      result = result.filter(
        (r6) => this.searchKeys.some((k2) => String(r6[k2] ?? "").toLowerCase().includes(needle))
      );
    }
    const fkeys = Object.keys(this.clientFilters);
    if (fkeys.length) {
      result = result.filter(
        (row) => fkeys.every((key) => {
          const f3 = this.clientFilters[key];
          const col = this.columns.find((c5) => c5.key === key);
          if (!col) return true;
          if (f3.values && f3.values.size > 0) {
            return f3.values.has(String(this.rawValue(col, row) ?? ""));
          }
          if (f3.from || f3.to) {
            const raw = this.rawValue(col, row);
            const t6 = raw == null ? NaN : new Date(raw).getTime();
            const from = f3.from ? new Date(f3.from).getTime() : -Infinity;
            const to = f3.to ? new Date(f3.to).getTime() + 864e5 - 1 : Infinity;
            return !Number.isNaN(t6) && t6 >= from && t6 <= to;
          }
          return true;
        })
      );
    }
    if (this.clientSort) {
      const col = this.columns.find((c5) => c5.key === this.clientSort);
      if (col) {
        const dir = this.clientSortDir === "asc" ? 1 : -1;
        result = [...result].sort((a3, b3) => {
          const va = this.rawValue(col, a3);
          const vb = this.rawValue(col, b3);
          if (va == null) return 1;
          if (vb == null) return -1;
          if (va < vb) return -1 * dir;
          if (va > vb) return 1 * dir;
          return 0;
        });
      }
    }
    return result;
  }
  cell(col, row) {
    if (col.format) return col.format(row);
    const v3 = row[col.key];
    return v3 === null || v3 === void 0 ? "" : String(v3);
  }
  /** ¿Es ordenable la columna? Servidor: opt-in (`sortable`). Cliente: por defecto SÍ (como el Hub),
   *  salvo `sortable: false` explícito. */
  isSortable(col) {
    return this.serverSide ? !!col.sortable : col.sortable !== false;
  }
  onHeaderClick(col) {
    if (!this.isSortable(col)) return;
    if (this.serverSide) {
      const dir = this.sort === col.key && this.sortDir === "asc" ? "desc" : "asc";
      this.emit("sortChange", { sort: col.key, dir });
      return;
    }
    this.mobileShown = 0;
    if (this.clientSort === col.key) {
      this.clientSortDir = this.clientSortDir === "asc" ? "desc" : "asc";
    } else {
      this.clientSort = col.key;
      this.clientSortDir = "asc";
    }
  }
  onFilterInput(col, ev) {
    const value = ev.target.value ?? "";
    this.setServerFilter(col.key, value);
    this.emit("filterChange", { col: col.key, value });
  }
  onRangeInput(col, edge, ev) {
    const raw = ev.target.value ?? "";
    const v3 = raw === "" ? "" : Number(raw);
    this.setServerRangeEdge(col.key, edge, v3);
    this.emit("filterChange", { col: col.key, value: { [edge]: v3 } });
  }
  onDateRangeInput(col, edge, ev) {
    const v3 = ev.target.value ?? "";
    this.setServerRangeEdge(col.key, edge, v3);
    this.emit("filterChange", { col: col.key, value: { [edge]: v3 } });
  }
  // ── Filtros EN LÍNEA (toolbar) ────────────────────────────────────────────────────────────
  // En modo cliente escriben directamente `clientFilters` (filtran en memoria); en servidor solo
  // emiten `filterChange`. Reutilizan la misma forma de filtro que el drawer (values / from / to).
  setClientFilter(key, patch) {
    const next = { ...this.clientFilters };
    const merged = { ...next[key], ...patch };
    const empty = (!merged.values || merged.values.size === 0) && !merged.from && !merged.to;
    if (empty) delete next[key];
    else next[key] = merged;
    this.clientFilters = next;
    this.clientPage = 0;
    this.mobileShown = 0;
  }
  // ion-select (select/multiselect) del panel de filtros (renderFilterControl). En servidor emite
  // `filterChange`; en cliente escribe `clientFilters` (multiselect ⇒ filtra por inclusión).
  onFilterSelect(col, value, multi) {
    if (this.serverSide) {
      const next = value ?? (multi ? [] : "");
      this.setServerFilter(col.key, next);
      this.emit("filterChange", { col: col.key, value: next });
      return;
    }
    if (multi) {
      const arr = Array.isArray(value) ? value.map((v3) => String(v3)) : value != null && value !== "" ? [String(value)] : [];
      this.setClientFilter(col.key, { values: arr.length ? new Set(arr) : void 0 });
    } else {
      const v3 = String(value ?? "");
      this.setClientFilter(col.key, { values: v3 ? /* @__PURE__ */ new Set([v3]) : void 0 });
    }
  }
  onInlineRange(col, edge, ev) {
    const v3 = ev.target.value ?? "";
    if (this.serverSide) {
      this.setServerRangeEdge(col.key, edge, v3);
      this.emit("filterChange", { col: col.key, value: { [edge]: v3 } });
      return;
    }
    this.setClientFilter(col.key, { [edge]: v3 || void 0 });
  }
  // Menú overflow: ancla el popover al botón vía el evento de click (compatible con Shadow DOM).
  openMenu(ev) {
    this.menuEv = ev;
    this.menuOpen = true;
  }
  /** #122 — Abre el menú «⋮» de UNA fila. Un solo popover para toda la tabla (uno por fila serían
   *  tantos como filas), anclado por evento porque `trigger` no resuelve dentro de Shadow DOM. */
  openRowMenu(ev, row) {
    ev.stopPropagation();
    this.rowMenuEv = ev;
    this.rowMenuRow = row;
    this.rowMenuOpen = true;
  }
  /** #122 — Las mismas acciones de la fila, como lista. Respeta `disabled`/`loading` por fila: una
   *  acción que no se puede pulsar en su botón tampoco se puede pulsar aquí. */
  renderRowMenu() {
    const row = this.rowMenuRow;
    if (!this.actions.length || !row) return A;
    const key = this.keyOf(row);
    return b2`
      <ion-popover
        class="row-menu"
        .isOpen=${this.rowMenuOpen}
        .event=${this.rowMenuEv}
        dismiss-on-select="true"
        @didDismiss=${() => this.rowMenuOpen = false}
      >
        <ion-content>
          <ion-list lines="none">
            ${this.actions.map((a3) => {
      const disabled = a3.loading?.(row) === true || a3.disabled?.(row) === true;
      const label = typeof a3.label === "function" ? a3.label(row) : a3.label;
      return b2`
                <!-- #143 — The action is named the SAME collapsed or not, so one spec works at any
                     width. It carries the hook only while the direct buttons are NOT there: the
                     popover survives its dismissal («rowMenuRow» is not cleared), and if the table
                     widened again there would be TWO elements with the hook and «getByTestId»
                     would pick one at random. -->
                <ion-item
                  button
                  data-testid=${this.rowActionsCollapsed ? this.tid(`row-${key}-${a3.id}`) : A}
                  ?disabled=${disabled}
                  aria-disabled=${disabled ? "true" : A}
                  .detail=${false}
                  @click=${() => {
        if (disabled) return;
        this.rowMenuOpen = false;
        this.emit("rowAction", { actionId: a3.id, row });
      }}
                >
                  ${a3.icon ? b2`<ion-icon slot="start" .icon=${okIcon(a3.icon)} color=${a3.color ?? A}></ion-icon>` : A}
                  <ion-label color=${a3.color ?? A}>${label}</ion-label>
                </ion-item>
              `;
    })}
          </ion-list>
        </ion-content>
      </ion-popover>
    `;
  }
  // Aplica la vista inicial declarada (`default-view`) una sola vez, tras el primer render. Es la
  // forma robusta de arrancar en tarjetas sin depender de fijar `viewMode` por referencia (que
  // falla si la tabla monta detrás de un `v-if`/loading y el ref aún es null).
  firstUpdated() {
    this.applyInitialView();
  }
  /** Re-evalúa la vista inicial cada render mientras el usuario no haya elegido a mano.
   *
   * `firstUpdated` NO basta: decide una sola vez, y los consumidores que asignan las props por JS
   * DESPUÉS de insertar el elemento —lo normal en páginas renderizadas por el servidor— llegan
   * tarde. En ese momento `cardViewEnabled` aún era `false`, así que no se conmutaba; y el
   * listener de `matchMedia` solo dispara al CAMBIAR el viewport, cosa que en un móvil no pasa
   * nunca. La tabla se quedaba con scroll lateral para siempre.
   *
   * Medido en Android contra producción el 2026-08-02 con el bundle ya actualizado:
   *   `views` antes de insertar  → tarjetas
   *   `views` después de insertar → tabla   ← lo que hace la página
   */
  willUpdate(changed) {
    this.applyInitialView();
    if (changed.has("filterValues")) this.serverFilters = { ...this.filterValues ?? {} };
    if (changed.has("search") && this.search !== void 0) {
      this.q = this.search;
      if (!this.serverSide) {
        this.clientPage = 0;
        this.mobileShown = 0;
      }
    }
    if (!this.serverSide && changed.has("rows") && this.mobileShown !== 0) this.mobileShown = 0;
  }
  applyInitialView() {
    if (this.viewChosenByUser) return;
    if (this.isMobile && this.cardViewEnabled) {
      this.viewMode = "cards";
    } else if (this.defaultView === "cards" && this.cardViewEnabled) {
      this.viewMode = "cards";
    } else if (this.defaultView === "table") {
      this.viewMode = "table";
    }
  }
  setViewMode(mode) {
    this.viewChosenByUser = true;
    if (this.viewMode === mode) return;
    this.viewMode = mode;
    this.emit("viewChange", mode);
  }
  // Control de filtro de una columna, con componentes Ionic (mismos inputs que el form de alta).
  renderFilterControl(col) {
    if (!col.filterable) return A;
    const type = col.filterType ?? "text";
    const f3 = this.filterStateOf(col.key);
    if (type === "select" || type === "multiselect") {
      const multi = type === "multiselect";
      const opts = col.options ?? this.distinctValues(col).map((v3) => ({ value: v3, label: v3 }));
      const current = this.selectValue(f3, multi);
      return b2`
        <ion-select
          label=${col.header}
          label-placement="stacked"
          fill="outline" mode="md"
          ?multiple=${multi}
          interface="modal"
          .interfaceOptions=${{ cssClass: "ok-overlay" }}
          placeholder=${this.t.select}
          .value=${current}
          @ionChange=${(e5) => this.onFilterSelect(col, e5.detail.value, multi)}
        >
          ${multi ? A : b2`<ion-select-option value="">${this.t.select}</ion-select-option>`}
          ${opts.map((o7) => b2`<ion-select-option value=${o7.value}>${o7.label}</ion-select-option>`)}
        </ion-select>
      `;
    }
    if (type === "range" || type === "daterange") {
      const t6 = type === "daterange" ? "date" : "number";
      const onEdge = type === "daterange" ? this.onDateRangeInput.bind(this) : this.onRangeInput.bind(this);
      return b2`
        <div class="fblock">
          <span class="flabel">${col.header}</span>
          <div class="frange">
            <ion-input type=${t6} fill="outline" mode="md" placeholder=${type === "daterange" ? this.t.from : this.t.gte}
              .value=${f3?.from ?? ""}
              @ionInput=${(e5) => onEdge(col, "from", e5)}></ion-input>
            <ion-input type=${t6} fill="outline" mode="md" placeholder=${type === "daterange" ? this.t.to : this.t.lte}
              .value=${f3?.to ?? ""}
              @ionInput=${(e5) => onEdge(col, "to", e5)}></ion-input>
          </div>
        </div>
      `;
    }
    const inputType = type === "number" ? "number" : type === "date" ? "date" : "text";
    return b2`
      <ion-input
        type=${inputType}
        fill="outline" mode="md"
        label=${col.header}
        label-placement="stacked"
        placeholder=${this.t.filterPlaceholder}
        .value=${this.selectValue(f3, false)}
        @ionInput=${(e5) => this.onFilterInput(col, e5)}
      ></ion-input>
    `;
  }
  /** Valor para un control de un solo valor (`ion-select`/`ion-input`) o multi (`ion-select
   *  multiple`) a partir del estado de filtro interno. '' / [] = sin filtro. */
  selectValue(f3, multi) {
    const values = [...f3?.values ?? /* @__PURE__ */ new Set()];
    if (multi) return values;
    return values.length ? values[0] : "";
  }
  // Controles de filtro COMPACTOS para la toolbar (modo `inlineFilters`). Solo select y rango de
  // fechas (los del screenshot); el resto de tipos siguen disponibles vía el drawer si no se activa
  // `inlineFilters`. Look: «Todos los Estados» (placeholder) / «01/10/25 → 18/10/25».
  renderInlineFilters() {
    const cols = this.filterColumns.filter((c5) => {
      const t6 = c5.filterType ?? "text";
      return t6 === "select" || t6 === "multiselect" || t6 === "date" || t6 === "daterange";
    });
    if (!cols.length) return A;
    return b2`${cols.map((c5) => this.renderInlineFilter(c5))}`;
  }
  renderInlineFilter(col) {
    const type = col.filterType ?? "text";
    const f3 = this.filterStateOf(col.key);
    if (type === "select" || type === "multiselect") {
      const multi = type === "multiselect";
      const opts = col.options ?? this.distinctValues(col).map((v3) => ({ value: v3, label: v3 }));
      const current = this.selectValue(f3, multi);
      return b2`
        <ion-select
          class="tk-filter"
          ?multiple=${multi}
          interface="modal"
          .interfaceOptions=${{ cssClass: "ok-overlay" }}
          aria-label=${col.header}
          placeholder=${col.header}
          .value=${current}
          @ionChange=${(e5) => this.onFilterSelect(col, e5.detail.value, multi)}
        >
          ${multi ? A : b2`<ion-select-option value="">${col.header}</ion-select-option>`}
          ${opts.map((o7) => b2`<ion-select-option value=${o7.value}>${o7.label}</ion-select-option>`)}
        </ion-select>
      `;
    }
    return b2`
      <span class="tk-daterange" role="group" aria-label=${col.header}>
        <ion-icon .icon=${iconCalendarOutline}></ion-icon>
        <ion-input type="date" aria-label=${this.t.fromOf.replace("{label}", col.header)} .value=${f3?.from ?? ""} @ionChange=${(e5) => this.onInlineRange(col, "from", e5)}></ion-input>
        <span class="arr">→</span>
        <ion-input type="date" aria-label=${this.t.toOf.replace("{label}", col.header)} .value=${f3?.to ?? ""} @ionChange=${(e5) => this.onInlineRange(col, "to", e5)}></ion-input>
      </span>
    `;
  }
  // Menú overflow («⋮») con ion-popover anclado por evento (Shadow-DOM-safe).
  renderOverflowMenu() {
    if (!this.menuActions.length) return A;
    return b2`
      <ion-button class="toolbtn" fill="clear" aria-label=${this.t.moreActions} @click=${(e5) => this.openMenu(e5)}>
        <ion-icon slot="icon-only" .icon=${iconEllipsisVertical}></ion-icon>
      </ion-button>
      <ion-popover
        .isOpen=${this.menuOpen}
        .event=${this.menuEv}
        dismiss-on-select="true"
        @didDismiss=${() => this.menuOpen = false}
      >
        <ion-content>
          <ion-list lines="none">
            ${this.menuActions.map(
      (a3) => b2`
                <ion-item button .detail=${false} @click=${() => {
        this.menuOpen = false;
        this.emit("menuAction", { actionId: a3.id });
      }}>
                  ${a3.icon ? b2`<ion-icon slot="start" .icon=${okIcon(a3.icon)} color=${a3.color ?? A}></ion-icon>` : A}
                  <ion-label color=${a3.color ?? A}>${a3.label}</ion-label>
                </ion-item>
              `
    )}
          </ion-list>
        </ion-content>
      </ion-popover>
    `;
  }
  // Row action buttons, shared by the table and the card views.
  //
  // `collapsible` = the LIST view, the only one that folds its buttons into a "⋮" menu when the
  // columns leave it no width (#122). The CARD view does not fold; it WRAPS instead, see
  // `.ractions .actions` in the stylesheet.
  //
  // This comment used to claim that a card's actions "always fit across the card". They do not,
  // and nobody had measured it (#132 / ERPlora/appointments#154): with the eight actions an
  // appointment carries, the row asks for 380px and the card gives 379px at 411dp, 237px at 768px
  // and 272px at 1440px — so the first button hung off the card at ALL THREE widths, not just on
  // a phone. If you add a view that lays these buttons out, MEASURE it.
  actionButtons(row, collapsible = false) {
    if (!this.actions.length) return A;
    const key = this.keyOf(row);
    if (collapsible && this.rowActionsCollapsed) {
      return b2`
        <div class="actions">
          <ion-button
            size="small"
            fill="clear"
            color="medium"
            data-testid=${this.tid(`row-${key}-menu`)}
            aria-label=${this.t.moreActions}
            title=${this.t.moreActions}
            aria-haspopup="menu"
            @click=${(e5) => this.openRowMenu(e5, row)}
          >
            <ion-icon slot="icon-only" .icon=${okIcon(iconEllipsisVertical)}></ion-icon>
          </ion-button>
        </div>
      `;
    }
    return b2`
      <div class="actions">
        ${this.actions.map(
      (a3) => {
        const loading = a3.loading?.(row) === true;
        const disabled = loading || a3.disabled?.(row) === true;
        const label = typeof a3.label === "function" ? a3.label(row) : a3.label;
        return b2`
            <ion-button
              size="small"
              fill="clear"
              color=${a3.color ?? "medium"}
              data-testid=${this.tid(`row-${key}-${a3.id}`)}
              ?disabled=${disabled}
              aria-disabled=${disabled ? "true" : A}
              aria-label=${label}
              title=${label}
              @click=${() => this.emit("rowAction", { actionId: a3.id, row })}
            >
              ${loading ? b2`<ion-spinner slot="icon-only" name="dots"></ion-spinner>` : a3.icon ? b2`<ion-icon slot="icon-only" .icon=${okIcon(a3.icon)}></ion-icon>` : label}
            </ion-button>
          `;
      }
    )}
      </div>
    `;
  }
  // Botón de barra icon-only (filtros / alta / conmutador de vista). `on` = estado activo.
  // `badge` opcional → contador (p.ej. nº de filtros activos), look del Hub.
  toolButton(icon, on, onClick, label, badge, testid = A) {
    return b2`
      <ion-button class="toolbtn" size="small" fill=${on ? "solid" : "outline"} data-testid=${testid} title=${label} aria-label=${label} @click=${onClick}>
        <ion-icon slot="icon-only" .icon=${okIcon(icon)}></ion-icon>
        ${badge && badge > 0 ? b2`<span class="badge">${badge}</span>` : A}
      </ion-button>
    `;
  }
  /** Plantilla de columnas del grid de la vista lista: [checkbox] [columnas…] [acciones]. */
  gridTemplate() {
    return [
      this.selectable ? "2.75rem" : null,
      // #120 - 5.5rem (88px) is the narrowest a data column can be and stay readable: ~11
      // characters at 14px, plus the ellipsis `.gcell > span` already applies. With the previous
      // floor (8rem = 128px) the six columns of a bookings list did not fit the counter tablet
      // (128x6 + 188 for actions + gaps = 1036px against 834) and the pinned column ended up on
      // top of the data. With 5.5rem they fit (796px) and `1fr` stretches them to 94px each.
      ...this.visibleColumns.map((c5) => c5.width ?? "minmax(5.5rem,1fr)"),
      // #121 - a LENGTH, not `max-content`. The header and every row are separate grids that
      // share this string, and a content-sized track is not a length: each grid resolves it
      // against ITS OWN content - the word "ACCIONES" (62.83px) in the header, four buttons
      // (188px) in the row. The leftover the `1fr` columns share then differed between the two,
      // and the header slid right, up to 125px by the last column (measured at 834px).
      // `actionsTrackPx` is the width of the buttons MEASURED on screen, so it also keeps #120's
      // contract: the track never shrinks under its content (an `auto` track collapsed to 16px
      // and the buttons spilled over the neighbouring column). Until the first measurement lands
      // - one frame - `max-content` reserves the same room it always did.
      this.actions.length ? this.actionsTrackPx > 0 ? `${this.actionsTrackPx}px` : "max-content" : null
    ].filter(Boolean).join(" ");
  }
  /** Lista de páginas a mostrar en el pager numerado (1-based): primera, última, vecinas de la
   *  actual y «…» donde haya saltos. P.ej. en página 1 de 52 → [1,2,3,'…',52]. */
  pageList(cur1, total) {
    if (total <= 7) return Array.from({ length: total }, (_2, i7) => i7 + 1);
    const want = /* @__PURE__ */ new Set([1, total, cur1, cur1 - 1, cur1 + 1]);
    if (cur1 <= 3) [2, 3].forEach((p4) => want.add(p4));
    if (cur1 >= total - 2) [total - 1, total - 2].forEach((p4) => want.add(p4));
    const sorted = [...want].filter((p4) => p4 >= 1 && p4 <= total).sort((a3, b3) => a3 - b3);
    const out = [];
    let prev = 0;
    for (const p4 of sorted) {
      if (p4 - prev > 1) out.push("\u2026");
      out.push(p4);
      prev = p4;
    }
    return out;
  }
  render() {
    const ps = this.serverSide ? this.pageSize : this.clientPageSize || this.pageSize;
    let visible;
    let pages;
    let current;
    let count;
    if (this.serverSide) {
      visible = this.rows;
      count = this.total;
      pages = Math.max(1, Math.ceil(this.total / ps));
      current = Math.min(this.page, pages - 1);
    } else {
      const filtered = this.clientFiltered;
      count = filtered.length;
      pages = Math.max(1, Math.ceil(filtered.length / ps));
      current = Math.min(this.clientPage, pages - 1);
      visible = this.isMobile ? filtered.slice(0, Math.min(this.mobileShown || ps, count)) : filtered.slice(current * ps, current * ps + ps);
    }
    const served = this.serverSide ? (current + 1) * ps : Math.min(this.mobileShown || ps, count);
    const canLoadMore = this.isMobile && served < count;
    const loadMore = () => {
      if (this.serverSide) this.emit("pageChange", current + 1);
      else this.mobileShown = Math.min((this.mobileShown || ps) + ps, count);
    };
    const goTo = (p4) => {
      if (this.serverSide) this.emit("pageChange", p4);
      else this.clientPage = p4;
    };
    const setPageSize = (n6) => {
      if (this.serverSide) this.emit("pageSizeChange", n6);
      else {
        this.clientPageSize = n6;
        this.clientPage = 0;
        this.mobileShown = 0;
      }
    };
    const searchbar = b2`<ion-searchbar class="ion-no-border" data-testid=${this.tid("search")} .value=${this.q} placeholder=${this.effSearchPlaceholder} debounce="250" @ionInput=${this.onSearch}></ion-searchbar>`;
    const selCount = this.selection.size;
    const showTopbar = !!this.title || this.hasSearch || this.viewToggle || this.effColumnPicker || this.effExport || this.effImport || this.hasFilterRow || this.addable || !!this.primaryAction;
    return b2`
      <div class=${`card${this.panel !== "none" ? " has-panel" : ""}`}>
        ${showTopbar ? b2`
              <div class="bar">
                <div class="bar-main">
                  ${this.title ? b2`<div class="title-wrap"><h2 class="title">${this.title}</h2><span class="title-count">${count}</span></div>` : A}
                  ${this.hasSearch ? b2`<div class="search">${searchbar}</div>` : A}
                  ${this.inlineFilters ? this.renderInlineFilters() : A}
                  <span class="tk-spacer"></span>
                    ${this.effColumnPicker && !this.isMobile ? b2`
                          <ion-select
                            class="tk-cols"
                            multiple
                            interface="popover"
                            aria-label=${this.t.columnsVisible}
                            .value=${this.visibleColumns.map((c5) => c5.key)}
                            .selectedText=${this.t.columns}
                            @ionChange=${(e5) => this.setVisibleColumns(e5.detail.value)}
                          >
                            ${this.columns.map((c5) => b2`<ion-select-option value=${c5.key}>${c5.header}</ion-select-option>`)}
                          </ion-select>
                        ` : A}
                    ${this.effPageSizes.length && !this.isMobile ? b2`
                          <ion-select
                            class="tk-psize"
                            interface="popover"
                            aria-label=${this.t.rowsPerPage}
                            .value=${ps}
                            @ionChange=${(e5) => setPageSize(Number(e5.detail.value))}
                          >
                            ${this.effPageSizes.map((n6) => b2`<ion-select-option .value=${n6}>${n6}</ion-select-option>`)}
                          </ion-select>
                        ` : A}
                    ${this.viewToggle ? b2`
                          <span class="viewseg">
                            ${this.toolButton("list-outline", this.viewMode === "table", () => this.setViewMode("table"), this.t.viewList)}
                            ${this.toolButton("grid-outline", this.viewMode === "cards", () => this.setViewMode("cards"), this.t.viewCards)}
                          </span>
                        ` : A}
                    ${this.hasFilterRow && !this.inlineFilters ? this.toolButton("funnel-outline", this.panel === "filters" || this.activeFilterCount > 0, () => this.toggle("filters"), this.t.filters, this.activeFilterCount) : A}
                    ${this.effImport ? b2`
                          ${this.toolButton("cloud-upload-outline", false, () => this.renderRoot.querySelector(".tk-file")?.click(), this.t.importCsv)}
                          <!-- #143 — The import hook goes on the INPUT, not on the button that
                               triggers it: what a spec drives is «setInputFiles», and nobody opens
                               the button's native dialog from a test. Same criterion as
                               «GrantFilePicker.vue» in the Hub (the hook goes on the control, not
                               on its disguise). -->
                          <input class="tk-file" data-testid=${this.tid("csv-import")} type="file" accept=".csv,text/csv" hidden @change=${(e5) => this.onImportFile(e5)} />
                        ` : A}
                    ${this.effExport ? this.toolButton("download-outline", false, () => this.exportCsv(), this.t.exportCsv, void 0, this.tid("csv-export")) : A}
                    <!-- #113 — Mismo botón en los dos viewports: la acción principal de la pantalla
                         se lee, no se adivina. En escritorio era un «+» de 36px idéntico a los
                         iconos de vista/filtrar/exportar, y era el último de cuatro. -->
                    ${this.addable ? b2`
                          <ion-button class="primary-btn add-btn" data-testid=${this.tid("add")} size="small" @click=${() => this.toggle("create")}>
                            <ion-icon slot="start" .icon=${okIcon("add")}></ion-icon>${this.t.add}
                          </ion-button>
                        ` : A}
                    ${this.renderOverflowMenu()}
                    ${this.primaryAction ? b2`
                          <!-- #143 — Its own hook and NOT «-add»: «addable» and «primaryAction» are
                               two different buttons that may coexist, and both are really used
                               («addable» in the modules, «primaryAction» in the SaaS screens).
                               Sharing the name would give two elements with the same hook as soon
                               as a screen declared both. -->
                          <ion-button class="primary-btn add-btn" data-testid=${this.tid("primary-action")} size="small" @click=${() => this.emit("primaryAction", {})}>
                            <ion-icon slot="start" .icon=${okIcon(this.primaryAction.icon ?? "add")}></ion-icon>${this.primaryAction.label}
                          </ion-button>
                        ` : A}
                    <!-- El módulo proyecta aquí acciones globales adicionales. -->
                    <slot name="toolbar"></slot>
                </div>
                ${this.selectable && selCount > 0 ? b2`
                      <div class="selbar">
                        <strong>${this.t.selected.replace("{n}", String(selCount))}</strong>
                        <button class="sel-clear" @click=${() => this.setSelection(/* @__PURE__ */ new Set())}>
                          <ion-icon .icon=${iconClose} style="font-size:14px"></ion-icon> ${this.t.clear}
                        </button>
                      </div>
                    ` : A}
              </div>
            ` : A}

        ${this.viewMode === "cards" && this.cardViewEnabled ? this.renderCards(visible) : this.renderTable(visible)}

        ${pages > 1 || this.effPageSizes.length ? b2`
              <div class="pager">
                <div class="left">
                  <span>
                    ${pages > 1 ? b2`${this.t.showing.replace("{from}", String(this.isMobile && !this.serverSide ? 1 : current * ps + 1)).replace("{to}", String(Math.min(served, count)))} ` : A}
                    <span class="strong">${count}</span> ${count === 1 ? this.t.recordSingular : this.t.recordPlural}
                  </span>
                  ${!showTopbar && this.effPageSizes.length ? b2`
                        <select class="psize" @change=${(e5) => setPageSize(Number(e5.target.value))}>
                          ${this.effPageSizes.map((n6) => b2`<option value=${n6} ?selected=${n6 === ps}>${this.t.perPageShort.replace("{n}", String(n6))}</option>`)}
                        </select>
                      ` : A}
                </div>
                ${this.isMobile ? canLoadMore ? b2`<ion-button class="load-more" data-testid=${this.tid("load-more")} size="small" @click=${loadMore}>${this.t.loadMore}</ion-button>` : A : pages > 1 ? b2`
                      <div class="nav">
                        <ion-button size="small" fill="clear" data-testid=${this.tid("page-prev")} ?disabled=${current === 0} @click=${() => goTo(current - 1)}><ion-icon slot="icon-only" .icon=${iconChevronBack}></ion-icon></ion-button>
                        ${this.pageList(current + 1, pages).map(
      (p4) => p4 === "\u2026" ? b2`<span class="pgap">…</span>` : b2`<button class=${`pnum${p4 === current + 1 ? " on" : ""}`} @click=${() => goTo(p4 - 1)}>${p4}</button>`
    )}
                        <ion-button size="small" fill="clear" data-testid=${this.tid("page-next")} ?disabled=${current >= pages - 1} @click=${() => goTo(current + 1)}><ion-icon slot="icon-only" .icon=${iconChevronForward}></ion-icon></ion-button>
                      </div>
                    ` : A}
              </div>
            ` : A}

        ${this.panel !== "none" ? this.renderDrawer() : A}
      </div>
    `;
  }
  // Panel lateral derecho DENTRO de la tabla (no empuja contenido; igual en lista y tarjetas).
  renderDrawer() {
    const isFilters = this.panel === "filters";
    const clientFilters = isFilters && !this.serverSide;
    return b2`
      <div class="tk-scrim" @click=${() => this.close()}></div>
      <aside class="drawer" role="dialog" aria-label=${isFilters ? this.t.filters : this.t.form}>
        <header class="dh">
          <strong>${isFilters ? this.t.filters : this.t.newRecord}</strong>
          <ion-button fill="clear" size="small" aria-label=${this.t.close} @click=${() => this.close()}><ion-icon slot="icon-only" .icon=${iconClose}></ion-icon></ion-button>
        </header>
        <div class="db">
          ${isFilters ? clientFilters ? this.filterColumns.map((c5) => this.renderClientFilter(c5)) : this.filterColumns.map((c5) => b2`<div class="fblock">${this.renderFilterControl(c5)}</div>`) : b2`<slot name="create"></slot>`}
        </div>
        ${clientFilters ? b2`
              <footer class="df">
                <button class="sel-clear df-clear" ?disabled=${Object.keys(this.filterDraft).length === 0} @click=${() => this.clearFilters()}>${this.t.clear}</button>
                <ion-button class="primary-btn" size="small" @click=${() => this.applyFilters()}>${this.t.apply}</ion-button>
              </footer>
            ` : A}
      </aside>
    `;
  }
  // Control de filtro CLIENTE de una columna: chips multi-select (select) o rango de fechas.
  renderClientFilter(col) {
    const label = col.header;
    if (col.filterType === "daterange" || col.filterType === "date") {
      const f3 = this.filterDraft[col.key] ?? {};
      return b2`
        <div class="fblock">
          <span class="flabel">${label}</span>
          <div class="daterange">
            <ion-input type="date" label=${this.t.from} label-placement="stacked" fill="outline" mode="md" .value=${f3.from ?? ""} @ionChange=${(e5) => this.setFilterRange(col.key, "from", e5.detail.value ?? "")}></ion-input>
            <ion-input type="date" label=${this.t.to} label-placement="stacked" fill="outline" mode="md" .value=${f3.to ?? ""} @ionChange=${(e5) => this.setFilterRange(col.key, "to", e5.detail.value ?? "")}></ion-input>
          </div>
        </div>
      `;
    }
    const opts = col.options ?? this.distinctValues(col).map((v3) => ({ value: v3, label: v3 }));
    const selected = [...this.filterDraft[col.key]?.values ?? /* @__PURE__ */ new Set()];
    return b2`
      <div class="fblock">
        <ion-select
          label=${label}
          label-placement="stacked"
          fill="outline" mode="md"
          multiple
          interface="modal"
          .interfaceOptions=${{ cssClass: "ok-overlay" }}
          placeholder=${this.t.select}
          .value=${selected}
          @ionChange=${(e5) => this.setFilterValues(col.key, e5.detail.value ?? [])}
        >
          ${opts.length === 0 ? b2`<ion-select-option .disabled=${true} value="">${this.t.noValues}</ion-select-option>` : opts.map((o7) => b2`<ion-select-option value=${o7.value}>${o7.label}</ion-select-option>`)}
        </ion-select>
      </div>
    `;
  }
  /** #67 — Enter/Espacio activan la fila clicable (y, desde #74, la tarjeta): si se llega con el
   *  tabulador, el ratón no puede ser el único camino. Espacio además NO debe desplazar la página. */
  onRowKeydown(e5, row) {
    if (e5.key !== "Enter" && e5.key !== " " && e5.key !== "Spacebar") return;
    e5.preventDefault();
    this.emit("rowClick", { row });
  }
  emptyState() {
    return b2`
      <div class="empty">
        <span class="empty-ic"><ion-icon .icon=${iconFileTrayOutline}></ion-icon></span>
        <span>${this.effEmptyMessage}</span>
      </div>
    `;
  }
  // Vista LISTA en CSS GRID (no <table>): permite ancho por columna y cabecera sticky.
  renderTable(visible) {
    if (visible.length === 0) return this.emptyState();
    const cols = this.visibleColumns;
    const tpl = { gridTemplateColumns: this.gridTemplate() };
    const allOn = this.selectable && visible.length > 0 && visible.every((r6) => this.selection.has(this.keyOf(r6)));
    const alignCls = (a3) => a3 === "right" ? "right" : a3 === "center" ? "center" : "left";
    return b2`
      <div class=${`scroll${this.xOverflow ? " x-overflow" : ""}`}>
        <div class="grid" role="table">
          <!-- Cabecera -->
          <div class="grow ghead" role="row" style=${o6(tpl)}>
            ${this.selectable ? b2`<span class="selcb"><ion-checkbox .checked=${allOn} aria-label=${this.t.selectAll} @ionChange=${() => this.toggleAll(visible)}></ion-checkbox></span>` : A}
            ${cols.map((c5) => {
      const sortable = this.isSortable(c5);
      const active = sortable && (this.serverSide ? this.sort === c5.key : this.clientSort === c5.key);
      const dir = this.serverSide ? this.sortDir : this.clientSortDir;
      const caretIcon = !active ? iconSwapVerticalOutline : dir === "asc" ? iconChevronUpOutline : iconChevronDownOutline;
      return b2`
                <div
                  class=${`gcell gh ${alignCls(c5.align)}${sortable ? " sortable" : ""}${c5.pinned === "end" ? " actions-col" : ""}`}
                  role="columnheader"
                  @click=${() => this.onHeaderClick(c5)}
                >
                  <span>${c5.header}</span>
                  ${sortable ? b2`<span class=${`caret${active ? " on" : ""}`}><ion-icon .icon=${okIcon(caretIcon)}></ion-icon></span>` : A}
                </div>
              `;
    })}
            ${this.actions.length ? b2`<div class="gcell gh right actions-col" role="columnheader">
                  ${this.rowActionsCollapsed ? b2`<span class="sr-only">${this.t.actions}</span>` : b2`<span>${this.t.actions}</span>`}
                </div>` : A}
          </div>

          <!-- Filas -->
          ${c4(
      visible,
      (row) => this.keyOf(row),
      (row) => {
        const key = this.keyOf(row);
        const selected = this.selectable && this.selection.has(key);
        return b2`
                <div
                  class=${`grow grow-data${selected ? " selected" : ""}${this.rowClickable ? " clickable" : ""}`}
                  role="row"
                  data-testid=${this.tid(`row-${key}`)}
                  style=${o6(tpl)}
                  tabindex=${this.rowClickable ? "0" : A}
                  @click=${this.rowClickable ? () => this.emit("rowClick", { row }) : A}
                  @keydown=${this.rowClickable ? (e5) => this.onRowKeydown(e5, row) : A}
                >
                  ${this.selectable ? b2`<span class="selcb" @click=${(e5) => e5.stopPropagation()}><ion-checkbox .checked=${selected} aria-label=${this.t.selectRow} @ionChange=${() => this.toggleRow(key)}></ion-checkbox></span>` : A}
                  ${cols.map(
          (c5) => b2`<div class=${`gcell ${alignCls(c5.align)}${c5.pinned === "end" ? " actions-col" : ""}`} role="cell">${c5.render ? c5.render(row) : b2`<span>${this.cell(c5, row)}</span>`}</div>`
        )}
                  ${this.actions.length ? b2`<div class="gcell right actions-col" role="cell" @click=${(e5) => e5.stopPropagation()}>${this.actionButtons(row, true)}</div>` : A}
                </div>
              `;
      }
    )}
        </div>
      </div>
      ${this.renderRowMenu()}
    `;
  }
  renderCards(visible) {
    if (visible.length === 0) return this.emptyState();
    const hasHead = !!this.cardTitle || !!this.cardIcon || this.selectable;
    return b2`
      <div class="cards-grid">
        ${c4(
      visible,
      (row) => this.keyOf(row),
      (row) => {
        const key = this.keyOf(row);
        const selected = this.selectable && this.selection.has(key);
        const icon = this.cardIcon?.(row);
        return b2`
              <ion-card
                class=${`rcard${selected ? " selected" : ""}${this.rowClickable ? " clickable" : ""}`}
                data-testid=${this.tid(`row-${key}`)}
                role=${this.rowClickable ? "button" : A}
                tabindex=${this.rowClickable ? "0" : A}
                @click=${this.rowClickable ? () => this.emit("rowClick", { row }) : A}
                @keydown=${this.rowClickable ? (e5) => this.onRowKeydown(e5, row) : A}
              >
                ${hasHead ? b2`
                      <ion-card-header class="rcard-head">
                        ${icon != null && icon !== "" ? b2`<span class="rc-icon">${typeof icon === "string" ? b2`<ion-icon .icon=${okIcon(icon)}></ion-icon>` : icon}</span>` : A}
                        <span class="rc-title">${this.cardTitle ? this.cardTitle(row) : A}</span>
                        ${this.selectable ? b2`<ion-checkbox .checked=${selected} aria-label=${this.t.select} @click=${(e5) => e5.stopPropagation()} @ionChange=${() => this.toggleRow(key)}></ion-checkbox>` : A}
                      </ion-card-header>
                    ` : A}
                <ion-card-content class="rcard-body">
                  ${this.renderCard ? this.renderCard(row) : this.visibleColumns.map(
          (c5) => b2`<div class="rrow"><span class="rk">${c5.header}</span><span class="rv">${c5.render ? c5.render(row) : this.cell(c5, row)}</span></div>`
        )}
                </ion-card-content>
                ${this.actions.length ? b2`<div class="ractions" @click=${(e5) => e5.stopPropagation()}>${this.actionButtons(row)}</div>` : A}
              </ion-card>
            `;
      }
    )}
      </div>
    `;
  }
};
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "columns");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "rows");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "searchKeys");
__decorateClass2([
  n4({ attribute: "row-key-field" })
], _OkDataTable.prototype, "rowKeyField");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "rowKey");
__decorateClass2([
  n4({ type: Number, attribute: "page-size" })
], _OkDataTable.prototype, "pageSize");
__decorateClass2([
  n4({ attribute: "empty-message" })
], _OkDataTable.prototype, "emptyMessage");
__decorateClass2([
  n4({ attribute: "search-placeholder" })
], _OkDataTable.prototype, "searchPlaceholder");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "labels");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "actions");
__decorateClass2([
  n4({ type: Boolean })
], _OkDataTable.prototype, "addable");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "pageSizeOptions");
__decorateClass2([
  n4({ type: Boolean, reflect: true })
], _OkDataTable.prototype, "fill");
__decorateClass2([
  n4({ type: Boolean, attribute: "column-picker" })
], _OkDataTable.prototype, "columnPicker");
__decorateClass2([
  n4({ type: Boolean })
], _OkDataTable.prototype, "csv");
__decorateClass2([
  n4({ attribute: "csv-name" })
], _OkDataTable.prototype, "csvName");
__decorateClass2([
  n4({ type: Boolean, attribute: "server-side" })
], _OkDataTable.prototype, "serverSide");
__decorateClass2([
  n4({ type: Number })
], _OkDataTable.prototype, "total");
__decorateClass2([
  n4({ type: Number })
], _OkDataTable.prototype, "page");
__decorateClass2([
  n4({ type: Boolean })
], _OkDataTable.prototype, "searchable");
__decorateClass2([
  n4({ type: String })
], _OkDataTable.prototype, "search");
__decorateClass2([
  n4({ type: String })
], _OkDataTable.prototype, "sort");
__decorateClass2([
  n4({ attribute: "sort-dir" })
], _OkDataTable.prototype, "sortDir");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "filterValues");
__decorateClass2([
  n4()
], _OkDataTable.prototype, "title");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "views");
__decorateClass2([
  n4({ attribute: "default-view" })
], _OkDataTable.prototype, "defaultView");
__decorateClass2([
  n4({ type: Boolean })
], _OkDataTable.prototype, "exportable");
__decorateClass2([
  n4({ type: Boolean })
], _OkDataTable.prototype, "importable");
__decorateClass2([
  n4({ type: Boolean, attribute: "column-selector" })
], _OkDataTable.prototype, "columnSelector");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "pageSizes");
__decorateClass2([
  n4({ type: Boolean, attribute: "row-clickable" })
], _OkDataTable.prototype, "rowClickable");
__decorateClass2([
  n4({ type: Boolean })
], _OkDataTable.prototype, "selectable");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "selectedKeys");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "primaryAction");
__decorateClass2([
  n4({ type: Boolean })
], _OkDataTable.prototype, "inlineFilters");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "menuActions");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "cardTitle");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "cardIcon");
__decorateClass2([
  n4({ attribute: false })
], _OkDataTable.prototype, "renderCard");
__decorateClass2([
  n4({ type: String })
], _OkDataTable.prototype, "testid");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "q");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "clientPage");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "clientPageSize");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "mobileShown");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "clientSort");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "clientSortDir");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "clientFilters");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "filterDraft");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "serverFilters");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "panel");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "viewMode");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "isMobile");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "xOverflow");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "actionsTrackPx");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "rowActionsCollapsed");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "rowMenuOpen");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "hiddenKeys");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "internalSelection");
__decorateClass2([
  r5()
], _OkDataTable.prototype, "menuOpen");
var OkDataTable = _OkDataTable;
define("ok-data-table", OkDataTable);

// @erplora/outfitkit/dist/ok-inline-feedback.js
var __defProp3 = Object.defineProperty;
var __decorateClass3 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i7 = decorators.length - 1, decorator; i7 >= 0; i7--)
    if (decorator = decorators[i7])
      result = decorator(target, key, result) || result;
  if (result) __defProp3(target, key, result);
  return result;
};
var DEFAULT_LABELS2 = {
  dismiss: "Dismiss"
};
var OkInlineFeedback = class extends i3 {
  constructor() {
    super(...arguments);
    this.tone = "info";
    this.dismissible = false;
    this.hidden = false;
    this.labels = {};
    this.hasActions = false;
    this.onActionsSlotChange = (e5) => {
      const slot = e5.target;
      this.hasActions = slot.assignedNodes({ flatten: true }).length > 0;
    };
  }
  static {
    this.styles = i`
    :host {
      /* Vars overridable (estilo Ionic), default = cadena --ok-* → --ion-* → hex.
         --tone-color y --tone-icon se reasignan por tone abajo. */
      --tone-color: var(--ok-primary, var(--ion-color-primary, #3880ff));
      --background-opacity: 0.1;
      --color: var(--ok-text, var(--ion-text-color, #1c1b17));
      --border-radius: var(--ok-radius, var(--ion-border-radius, 8px));
      --padding: var(--ok-spacing, var(--ion-padding, 16px));
      --accent-width: 4px;
      --font: var(--ok-font, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);

      /* Responsive: el banner ocupa el ancho del contenedor. */
      display: block;
      width: 100%;
      font-family: var(--font);
      box-sizing: border-box;
    }
    :host([hidden]) { display: none; }

    /* Mapa de tonos → color Ionic + icono por defecto. */
    :host([tone='success']) { --tone-color: var(--ok-success, var(--ion-color-success, #2dd55b)); }
    :host([tone='warning']) { --tone-color: var(--ok-warning, var(--ion-color-warning, #ffc409)); }
    :host([tone='danger'])  { --tone-color: var(--ok-danger, var(--ion-color-danger, #c5000f)); }
    :host([tone='neutral']) { --tone-color: var(--ok-medium, var(--ion-color-medium, #5f5f5f)); }
    /* info / sin tono → primary (default ya aplicado en :host). */

    .box {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: var(--padding);
      border-radius: var(--border-radius);
      border-inline-start: var(--accent-width) solid var(--tone-color);
      /* Fondo tonal: el color del tono con baja opacidad (color-mix con fallback al borde fino). */
      background: color-mix(in srgb, var(--tone-color) calc(var(--background-opacity) * 100%), transparent);
      color: var(--color);
    }

    .icon {
      flex: 0 0 auto;
      font-size: 1.4rem;
      line-height: 1;
      color: var(--tone-color);
      margin-top: 0.05rem;
    }

    .content {
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .row {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }
    .text {
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .heading {
      font-weight: 700;
      font-size: 0.98rem;
      line-height: 1.3;
    }
    .body {
      font-size: 0.92rem;
      line-height: 1.45;
    }
    .actions {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    /* Si no hay actions, el slot queda vacío y no ocupa espacio. */
    .actions.empty { display: none; }

    .close {
      flex: 0 0 auto;
      background: none;
      border: 0;
      cursor: pointer;
      padding: 0.15rem;
      margin: -0.15rem -0.15rem 0 0;
      color: inherit;
      opacity: 0.6;
      font-size: 1.2rem;
      line-height: 1;
      border-radius: 4px;
      transition: background-color var(--ok-transition, 150ms ease), color var(--ok-transition, 150ms ease),
        border-color var(--ok-transition, 150ms ease), box-shadow var(--ok-transition, 150ms ease),
        opacity 0.15s ease, transform 120ms ease;
    }
    @media (hover: hover) {
      .close:hover { opacity: 1; background: rgba(var(--ion-text-color-rgb, 24, 24, 27), 0.07); }
    }
    .close:active { transform: scale(var(--ok-press-scale, 0.97)); }

    /* Móvil: las actions bajan bajo el texto (apiladas a ancho completo). */
    @media (max-width: 640px) {
      .row { flex-direction: column; align-items: stretch; }
      .actions { width: 100%; }
    }
    @media (prefers-reduced-motion: reduce) {
      .close:hover,
      .close:active { transform: none; }
    }
  `;
  }
  // Textos efectivos: defaults en inglés + overrides del consumidor.
  get t() {
    return { ...DEFAULT_LABELS2, ...this.labels };
  }
  // Icono por defecto según el tono (overridable por la prop `icon`).
  defaultIcon() {
    switch (this.tone) {
      case "success":
        return iconCheckmarkCircle;
      case "warning":
        return iconWarning;
      case "danger":
        return iconAlertCircle;
      case "neutral":
        return iconInformationCircle;
      case "info":
      default:
        return iconInformationCircle;
    }
  }
  // Oculta el banner y avisa al consumidor; éste puede revertir restaurando `hidden=false`.
  dismiss() {
    this.hidden = true;
    this.dispatchEvent(new CustomEvent("ok-dismiss", { bubbles: true, composed: true }));
  }
  render() {
    const iconName = this.icon ?? this.defaultIcon();
    return b2`
      <div class="box" role="status">
        <ion-icon class="icon" .icon=${okIcon(iconName)} aria-hidden="true"></ion-icon>
        <div class="content">
          <div class="row">
            <div class="text">
              ${this.heading ? b2`<div class="heading">${this.heading}</div>` : null}
              <div class="body"><slot></slot></div>
            </div>
            <div class="actions ${this.hasActions ? "" : "empty"}">
              <slot name="actions" @slotchange=${this.onActionsSlotChange}></slot>
            </div>
          </div>
        </div>
        ${this.dismissible ? b2`
              <button class="close" aria-label=${this.t.dismiss} @click=${this.dismiss}>
                <ion-icon .icon=${iconClose} aria-hidden="true"></ion-icon>
              </button>
            ` : null}
      </div>
    `;
  }
};
__decorateClass3([
  n4({ type: String, reflect: true })
], OkInlineFeedback.prototype, "tone");
__decorateClass3([
  n4({ type: String })
], OkInlineFeedback.prototype, "heading");
__decorateClass3([
  n4({ type: String })
], OkInlineFeedback.prototype, "icon");
__decorateClass3([
  n4({ type: Boolean, reflect: true })
], OkInlineFeedback.prototype, "dismissible");
__decorateClass3([
  n4({ type: Boolean, reflect: true })
], OkInlineFeedback.prototype, "hidden");
__decorateClass3([
  n4({ attribute: false })
], OkInlineFeedback.prototype, "labels");
__decorateClass3([
  r5()
], OkInlineFeedback.prototype, "hasActions");
define("ok-inline-feedback", OkInlineFeedback);

// @erplora/outfitkit/dist/ok-combo.js
var __defProp4 = Object.defineProperty;
var __decorateClass4 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i7 = decorators.length - 1, decorator; i7 >= 0; i7--)
    if (decorator = decorators[i7])
      result = decorator(target, key, result) || result;
  if (result) __defProp4(target, key, result);
  return result;
};
var DEFAULT_LABELS3 = {
  placeholder: "Search\u2026",
  empty: "No results"
};
var OkCombo = class extends i3 {
  constructor() {
    super(...arguments);
    this.options = [];
    this.value = "";
    this.placeholder = "";
    this.labels = {};
    this.query = "";
    this.open = false;
    this.activeIndex = -1;
    this.onDocClick = (e5) => {
      if (!this.open) return;
      if (!e5.composedPath().includes(this)) this.close();
    };
  }
  static {
    this.styles = i`
    :host {
      /* Vars overridable (estilo Ionic), default = cadena --ok-* → --ion-* → hex */
      --color: var(--ok-text, var(--ion-text-color, #1c1b17));
      --color-muted: var(--ok-text-muted, rgba(var(--ion-text-color-rgb, 28, 27, 23), 0.55));
      --primary-color: var(--ok-primary, var(--ion-color-primary, #3880ff));
      --primary-contrast: var(--ok-primary-contrast, var(--ion-color-primary-contrast, #ffffff));
      --background: var(--ok-surface, var(--ion-background-color, #ffffff));
      --hover-bg: var(--ok-hover, rgba(var(--ion-text-color-rgb, 28, 27, 23), 0.06));
      --border-color: var(--ok-border, rgba(var(--ion-text-color-rgb, 28, 27, 23), 0.18));
      --border-radius: var(--ok-radius, 8px);
      --font: var(--ok-font, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
      --shadow: var(--ok-shadow, 0 6px 24px rgba(0, 0, 0, 0.14));

      /* Por defecto ocupa el ancho del contenedor y es responsive. */
      display: block;
      width: 100%;
      max-width: 100%;
      position: relative;
      color: var(--color);
      font-family: var(--font);
      font-size: 0.95rem;
    }
    .field {
      position: relative;
      width: 100%;
    }
    /* El ion-input se estiliza vía sus propias vars (estilo Ionic). */
    ion-input {
      --background: var(--background);
      --color: var(--color);
      --placeholder-color: var(--color-muted);
      --border-radius: var(--border-radius);
      width: 100%;
    }
    /* Chevron decorativo a la derecha del campo. */
    .chevron {
      position: absolute;
      right: 0.6rem;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      color: var(--color-muted);
      pointer-events: none;
      transition: transform 0.18s ease;
    }
    :host([data-open]) .chevron {
      transform: translateY(-50%) rotate(180deg);
    }
    /* Dropdown de resultados: posicionado bajo el campo, ancho del contenedor. */
    .dropdown {
      position: absolute;
      left: 0;
      right: 0;
      top: calc(100% + 4px);
      z-index: 50;
      max-height: 16rem;
      overflow-y: auto;
      margin: 0;
      padding: 0.25rem;
      list-style: none;
      background: var(--background);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      box-sizing: border-box;
    }
    .option {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem 0.6rem;
      border-radius: calc(var(--border-radius) - 2px);
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: background-color var(--ok-transition, 150ms ease),
        color var(--ok-transition, 150ms ease),
        border-color var(--ok-transition, 150ms ease),
        box-shadow var(--ok-transition, 150ms ease), transform 120ms ease;
    }
    @media (hover: hover) {
      .option:hover {
        background: var(--hover-bg);
      }
    }
    .option:active {
      transform: scale(var(--ok-press-scale, 0.97));
    }
    .option.active {
      background: var(--primary-color);
      color: var(--primary-contrast);
    }
    @media (prefers-reduced-motion: reduce) {
      .option:hover,
      .option:active {
        transform: none;
      }
    }
    .empty {
      padding: 0.6rem;
      color: var(--color-muted);
      text-align: center;
    }
  `;
  }
  // Textos efectivos: defaults inglés sobreescritos por los pasados desde fuera.
  get t() {
    return { ...DEFAULT_LABELS3, ...this.labels };
  }
  // Placeholder efectivo: prop explícita si se pasó, si no el de los labels.
  get effectivePlaceholder() {
    return this.placeholder || this.t.placeholder;
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.onDocClick, true);
  }
  disconnectedCallback() {
    document.removeEventListener("click", this.onDocClick, true);
    super.disconnectedCallback();
  }
  // Texto a mostrar en el input: si está escribiendo usa la query, si no, el label del value.
  get displayText() {
    if (this.open) return this.query;
    const current = this.options.find((o7) => o7.value === this.value);
    return current ? current.label : this.query;
  }
  // Opciones que casan con la query (case-insensitive, substring).
  get filtered() {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.options;
    return this.options.filter((o7) => o7.label.toLowerCase().includes(q));
  }
  close() {
    this.open = false;
    this.activeIndex = -1;
  }
  // Maneja la escritura en el ion-input: actualiza query, abre dropdown y emite `ok-input`.
  handleInput(e5) {
    const detail = e5.detail;
    const value = detail?.value ?? "";
    this.query = value;
    this.open = true;
    this.activeIndex = -1;
    this.dispatchEvent(
      new CustomEvent("ok-input", {
        detail: { query: value },
        bubbles: true,
        composed: true
      })
    );
  }
  // Elige una opción: fija value, rellena input, cierra y emite `ok-change`.
  choose(option) {
    this.value = option.value;
    this.query = option.label;
    this.close();
    this.dispatchEvent(
      new CustomEvent("ok-change", {
        detail: { value: option.value, label: option.label },
        bubbles: true,
        composed: true
      })
    );
  }
  // Navegación por teclado sobre la lista filtrada.
  handleKeydown(e5) {
    const items = this.filtered;
    switch (e5.key) {
      case "ArrowDown":
        e5.preventDefault();
        if (!this.open) this.open = true;
        if (items.length) this.activeIndex = (this.activeIndex + 1) % items.length;
        break;
      case "ArrowUp":
        e5.preventDefault();
        if (!this.open) this.open = true;
        if (items.length)
          this.activeIndex = (this.activeIndex - 1 + items.length) % items.length;
        break;
      case "Enter":
        if (this.open && this.activeIndex >= 0 && items[this.activeIndex]) {
          e5.preventDefault();
          this.choose(items[this.activeIndex]);
        }
        break;
      case "Escape":
        if (this.open) {
          e5.preventDefault();
          this.close();
        }
        break;
    }
  }
  render() {
    const items = this.filtered;
    this.toggleAttribute("data-open", this.open);
    return b2`<div class="field">
      <ion-input
        .label=${this.label ?? ""}
        label-placement=${this.label ? "stacked" : "start"}
        fill="outline" mode="md"
        .value=${this.displayText}
        placeholder=${this.effectivePlaceholder}
        @ionInput=${(e5) => this.handleInput(e5)}
        @ionFocus=${() => {
      this.open = true;
    }}
        @keydown=${(e5) => this.handleKeydown(e5)}
      ></ion-input>
      <span class="chevron">
        <ion-icon .icon=${iconChevronDownOutline}></ion-icon>
      </span>
      ${this.open ? b2`<ul class="dropdown" role="listbox">
            ${items.length ? items.map(
      (option, i7) => b2`<li
                    role="option"
                    class=${`option ${i7 === this.activeIndex ? "active" : ""}`.trim()}
                    aria-selected=${option.value === this.value ? "true" : "false"}
                    @mouseenter=${() => {
        this.activeIndex = i7;
      }}
                    @click=${() => this.choose(option)}
                  >
                    ${option.label}
                  </li>`
    ) : b2`<li class="empty">${this.t.empty}</li>`}
          </ul>` : ""}
    </div>`;
  }
};
__decorateClass4([
  n4({ attribute: false })
], OkCombo.prototype, "options");
__decorateClass4([
  n4()
], OkCombo.prototype, "value");
__decorateClass4([
  n4()
], OkCombo.prototype, "placeholder");
__decorateClass4([
  n4()
], OkCombo.prototype, "label");
__decorateClass4([
  n4({ attribute: false })
], OkCombo.prototype, "labels");
__decorateClass4([
  r5()
], OkCombo.prototype, "query");
__decorateClass4([
  r5()
], OkCombo.prototype, "open");
__decorateClass4([
  r5()
], OkCombo.prototype, "activeIndex");
define("ok-combo", OkCombo);

// @erplora/module-sdk/src/quantity.ts
var QUANTITY_SCALE = 1e6;
function toMicro(quantity) {
  return Math.round(quantity * QUANTITY_SCALE);
}

// @erplora/module-sdk/src/index.ts
var DATA_TABLE_LABELS_ES = {
  search: "Buscar\u2026",
  empty: "Sin resultados",
  filters: "Filtros",
  clear: "Limpiar",
  apply: "Aplicar",
  selected: "{n} seleccionados",
  importCsv: "Importar CSV",
  exportCsv: "Exportar CSV",
  add: "A\xF1adir",
  moreActions: "M\xE1s acciones",
  rowsPerPage: "Filas por p\xE1gina",
  perPageShort: "{n} / p\xE1g.",
  viewList: "Vista lista",
  viewCards: "Vista tarjetas",
  columnsVisible: "Columnas visibles",
  columns: "Columnas",
  actions: "Acciones",
  close: "Cerrar",
  newRecord: "Nuevo",
  form: "Formulario",
  filterPlaceholder: "Filtrar\u2026",
  from: "Desde",
  to: "Hasta",
  fromOf: "{label} desde",
  toOf: "{label} hasta",
  gte: "\u2265",
  lte: "\u2264",
  noValues: "Sin valores",
  selectAll: "Seleccionar todo",
  selectRow: "Seleccionar fila",
  select: "Seleccionar",
  showing: "Mostrando {from}\u2013{to} de",
  recordSingular: "registro",
  recordPlural: "registros"
};
var DATA_TABLE_LABELS_EN = {
  search: "Search\u2026",
  empty: "No results",
  filters: "Filters",
  clear: "Clear",
  apply: "Apply",
  selected: "{n} selected",
  importCsv: "Import CSV",
  exportCsv: "Export CSV",
  add: "Add",
  moreActions: "More actions",
  rowsPerPage: "Rows per page",
  perPageShort: "{n} / page",
  viewList: "List view",
  viewCards: "Card view",
  columnsVisible: "Visible columns",
  columns: "Columns",
  actions: "Actions",
  close: "Close",
  newRecord: "New",
  form: "Form",
  filterPlaceholder: "Filter\u2026",
  from: "From",
  to: "To",
  fromOf: "{label} from",
  toOf: "{label} to",
  gte: "\u2265",
  lte: "\u2264",
  noValues: "No values",
  selectAll: "Select all",
  selectRow: "Select row",
  select: "Select",
  showing: "Showing {from}\u2013{to} of",
  recordSingular: "record",
  recordPlural: "records"
};
function dataTableLabels(locale = "es") {
  return locale.toLowerCase().startsWith("en") ? DATA_TABLE_LABELS_EN : DATA_TABLE_LABELS_ES;
}
function isEmpty(v3) {
  return v3 === null || v3 === void 0 || v3 === "";
}
var ListController = class {
  constructor(client, queryName, onChange = () => {
  }, opts = {}) {
    this.client = client;
    this.queryName = queryName;
    this.onChange = onChange;
    this.rows = [];
    this.total = 0;
    this.loading = false;
    this.error = "";
    /** Descarta respuestas obsoletas si llegan fuera de orden (race de cargas concurrentes). */
    this.seq = 0;
    this.state = {
      page: 0,
      pageSize: opts.pageSize ?? 50,
      search: "",
      sort: opts.sort,
      dir: opts.dir ?? "asc",
      filters: { ...opts.filters ?? {} },
      context: { ...opts.context ?? {} }
    };
    this.moneyFilters = new Set(opts.moneyFilters ?? []);
    this.quantityFilters = new Set(opts.quantityFilters ?? []);
    if (this.moneyFilters.size > 0 && typeof client.currencyDecimals !== "number") {
      throw new ErploraError(
        "list_money_filters_need_currency_decimals",
        "moneyFilters needs a list client that exposes currencyDecimals"
      );
    }
  }
  /**
   * The filters as the runtime compares them: money and quantity columns scaled from what the
   * person typed to the stored integer. `state.filters` stays as typed, so a table that echoes it
   * back keeps showing «12», not «1200».
   */
  wireFilters() {
    if (this.moneyFilters.size === 0 && this.quantityFilters.size === 0) return this.state.filters;
    const decimals2 = this.client.currencyDecimals ?? 0;
    const out = {};
    for (const [col, value] of Object.entries(this.state.filters)) {
      const scale = this.moneyFilters.has(col) ? (n6) => majorToMinor(n6, decimals2) : this.quantityFilters.has(col) ? toMicro : null;
      out[col] = scale ? scaleFilterValue(value, scale) : value;
    }
    return out;
  }
  /** Nº de páginas según el total del servidor (mínimo 1). */
  get pageCount() {
    return Math.max(1, Math.ceil(this.total / this.state.pageSize));
  }
  /** (Re)carga la página actual desde el servidor. */
  async load() {
    const s5 = this.state;
    const mySeq = ++this.seq;
    this.loading = true;
    this.error = "";
    this.onChange();
    try {
      const page = await this.client.queryPage(this.queryName, {
        limit: s5.pageSize,
        offset: s5.page * s5.pageSize,
        search: s5.search,
        sort: s5.sort,
        dir: s5.dir,
        filters: this.wireFilters(),
        params: s5.context
      });
      if (mySeq !== this.seq) return;
      this.rows = page.rows ?? [];
      this.total = page.total ?? this.rows.length;
    } catch (e5) {
      if (mySeq !== this.seq) return;
      this.rows = [];
      this.total = 0;
      this.error = e5 instanceof Error ? e5.message : "Error cargando datos";
    } finally {
      if (mySeq === this.seq) {
        this.loading = false;
        this.onChange();
      }
    }
  }
  setPage(page) {
    this.state.page = Math.max(0, page);
    void this.load();
  }
  setSort(sort, dir) {
    this.state.sort = sort;
    this.state.dir = dir;
    this.state.page = 0;
    void this.load();
  }
  setSearch(search) {
    this.state.search = search;
    this.state.page = 0;
    void this.load();
  }
  /** Cambia el nº de filas por página y recarga desde la página 0. */
  setPageSize(pageSize) {
    this.state.pageSize = Math.max(1, pageSize);
    this.state.page = 0;
    void this.load();
  }
  /** Aplica/quita un filtro de columna; valores vacíos lo eliminan. Vuelve a la página 0. */
  setFilter(col, value) {
    if (isEmpty(value)) {
      delete this.state.filters[col];
    } else if (typeof value === "object" && value !== null) {
      const prev = this.state.filters[col] ?? {};
      const merged = { ...prev, ...value };
      const cleaned = Object.fromEntries(Object.entries(merged).filter(([, v3]) => !isEmpty(v3)));
      if (Object.keys(cleaned).length === 0) delete this.state.filters[col];
      else this.state.filters[col] = cleaned;
    } else {
      this.state.filters[col] = value;
    }
    this.state.page = 0;
    void this.load();
  }
  /** Fija/actualiza los params de contexto obligatorios (p.ej. al seleccionar el padre).
   *  Vuelve a la página 0 y recarga. Pasa `{}` o keys con valor vacío para limpiar. */
  setContext(context) {
    this.state.context = { ...context };
    this.state.page = 0;
    void this.load();
  }
  reset() {
    this.state.page = 0;
    this.state.search = "";
    this.state.filters = {};
    void this.load();
  }
};
function scaleFilterEdge(edge, scale) {
  const text = typeof edge === "string" ? edge.trim().replace(",", ".") : edge;
  if (text === "" || text === null || text === void 0) return "";
  const n6 = Number(text);
  return Number.isFinite(n6) ? scale(n6) : "";
}
function scaleFilterValue(value, scale) {
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([edge, v3]) => [edge, scaleFilterEdge(v3, scale)])
    );
  }
  return scaleFilterEdge(value, scale);
}
function createListController(client, queryName, onChange = () => {
}, opts = {}) {
  return new ListController(client, queryName, onChange, opts);
}
var ErploraError = class extends Error {
  constructor(code, message, permission, fields) {
    super(message);
    this.code = code;
    this.permission = permission;
    this.fields = fields;
    this.name = "ErploraError";
  }
};
function majorToMinor(amount, decimals2) {
  const n6 = Number(amount);
  return Number.isFinite(n6) ? Math.round(n6 * 10 ** decimals2) : 0;
}

// @erplora/module-toolkit/src/money-input.mjs
var SPACING = "\\s'\\u2019\\u02bc";
var GROUP_SEP = new RegExp(`[.,${SPACING}]`);
var MINUS = /[-\u2212]/;
var SIGN = /[-+\u2212]/;
var SIGNS = /[-+\u2212]/g;
var BRACKET = /[()]/;
var CURRENCY_SIGNS = /\p{Sc}/gu;
var AFFIX_FILLER = new RegExp(`^[${SPACING}\\p{Cf}.,+\\-\\u2212]*$`, "u");
var NOT_AN_AMOUNT = Object.freeze({ ok: false, code: "not_an_amount" });
function checkDecimals(decimals2) {
  if (!Number.isInteger(decimals2) || decimals2 < 0 || decimals2 > 4) {
    throw new RangeError(`money_input_decimals_invalid: ${String(decimals2)}`);
  }
}
function currencyWords(currency, locale) {
  if (currency === void 0) return [];
  if (typeof currency !== "string" || !/^[A-Za-z]{3}$/.test(currency)) {
    throw new RangeError(`money_input_currency_invalid: ${String(currency)}`);
  }
  const words = /* @__PURE__ */ new Set([currency.toLowerCase()]);
  for (const lang of [locale || "en", "en"]) {
    for (const currencyDisplay of ["symbol", "narrowSymbol"]) {
      const part = new Intl.NumberFormat(lang, { style: "currency", currency, currencyDisplay }).formatToParts(1).find((p4) => p4.type === "currency");
      if (part) words.add(part.value.toLowerCase());
    }
  }
  return [...words].sort((a3, b3) => b3.length - a3.length);
}
function isCurrencyOnly(affixes, words) {
  let rest = affixes.toLowerCase();
  if (!words.length) rest = rest.replace(CURRENCY_SIGNS, " ");
  for (const word of words) rest = rest.split(word).join(" ");
  return AFFIX_FILLER.test(rest);
}
function isGrouping(intPart) {
  const groups = intPart.split(GROUP_SEP);
  if (groups.length < 2) return false;
  const [first, ...rest] = groups;
  const last = rest.pop();
  return /^[1-9]\d{0,2}$/.test(first) && rest.every((g3) => /^\d{2,3}$/.test(g3)) && /^\d{3}$/.test(last);
}
function digitsToMinor(intDigits2, fracDigits, decimals2) {
  const padded = fracDigits.padEnd(decimals2 + 1, "0");
  const kept = (intDigits2 || "0") + padded.slice(0, decimals2);
  let minor = Number(kept);
  if (Number(padded[decimals2]) >= 5) minor += 1;
  return Number.isSafeInteger(minor) ? minor : null;
}
function signed(minor, negative) {
  return negative && minor !== 0 ? -minor : minor;
}
function splitCore(core, decimals2) {
  const dots = (core.match(/\./g) ?? []).length;
  const commas = (core.match(/,/g) ?? []).length;
  if (dots && commas) {
    const dec = core.lastIndexOf(".") > core.lastIndexOf(",") ? "." : ",";
    if ((dec === "." ? dots : commas) !== 1) return null;
    const at2 = core.lastIndexOf(dec);
    return { intPart: core.slice(0, at2), frac: core.slice(at2 + 1) };
  }
  if (dots + commas !== 1) return { intPart: core, frac: "" };
  const at = Math.max(core.lastIndexOf("."), core.lastIndexOf(","));
  const intPart = core.slice(0, at);
  const tail = core.slice(at + 1);
  if (tail.length === 3 && isGrouping(core)) {
    if (decimals2 === 0) return { intPart: core, frac: "" };
    if (decimals2 !== 3) return { ambiguous: { intPart, tail } };
  }
  return { intPart, frac: tail };
}
function intDigits(intPart) {
  if (!GROUP_SEP.test(intPart)) return /^\d*$/.test(intPart) ? intPart : null;
  return isGrouping(intPart) ? intPart.replace(/\D/g, "") : null;
}
function parseMoneyInput(typed, decimals2, options = {}) {
  checkDecimals(decimals2);
  const words = currencyWords(options.currency, options.locale);
  if (typeof typed === "number") return parseNumber(typed, decimals2);
  const raw = String(typed ?? "").trim();
  if (!raw) return { ok: true, minor: null };
  const firstDigit = raw.search(/\d/);
  if (firstDigit < 0) return NOT_AN_AMOUNT;
  const start = firstDigit > 0 && /[.,]/.test(raw[firstDigit - 1]) ? firstDigit - 1 : firstDigit;
  const end = raw.search(/\d\D*$/) + 1;
  const prefix = raw.slice(0, start);
  const suffix = raw.slice(end);
  const core = raw.slice(start, end);
  const signs = prefix.match(SIGNS) ?? [];
  if (signs.length > 1 || SIGN.test(suffix) || BRACKET.test(prefix + suffix)) return NOT_AN_AMOUNT;
  if (!isCurrencyOnly(`${prefix} ${suffix}`, words)) return NOT_AN_AMOUNT;
  const negative = signs.length === 1 && MINUS.test(signs[0]);
  const split = splitCore(core, decimals2);
  if (!split) return NOT_AN_AMOUNT;
  if ("ambiguous" in split) {
    const { intPart, tail } = split.ambiguous;
    const digits = intPart.replace(/\D/g, "");
    const grouped = digitsToMinor(digits + tail, "", decimals2);
    const decimal = digitsToMinor(digits, tail, decimals2);
    if (grouped === null || decimal === null) return NOT_AN_AMOUNT;
    return {
      ok: false,
      code: "ambiguous_amount",
      readings: { grouped: signed(grouped, negative), decimal: signed(decimal, negative) }
    };
  }
  const whole = intDigits(split.intPart);
  if (whole === null || split.frac && !/^\d+$/.test(split.frac)) return NOT_AN_AMOUNT;
  const minor = digitsToMinor(whole, split.frac, decimals2);
  return minor === null ? NOT_AN_AMOUNT : { ok: true, minor: signed(minor, negative) };
}
function parseNumber(n6, decimals2) {
  const m4 = /^(\d+)(?:\.(\d+))?$/.exec(String(Math.abs(n6)));
  if (!m4) return NOT_AN_AMOUNT;
  const minor = digitsToMinor(m4[1], m4[2] ?? "", decimals2);
  return minor === null ? NOT_AN_AMOUNT : { ok: true, minor: signed(minor, n6 < 0) };
}
function formatMoneyInput(minor, decimals2, locale) {
  checkDecimals(decimals2);
  if (minor == null) return "";
  return new Intl.NumberFormat(locale || "en", {
    minimumFractionDigits: decimals2,
    maximumFractionDigits: decimals2,
    useGrouping: false,
    numberingSystem: "latn"
  }).format(minor / 10 ** decimals2);
}
function normaliseMoneyInput(typed, decimals2, locale, currency) {
  const parsed = parseMoneyInput(typed, decimals2, { currency, locale });
  return parsed.ok && parsed.minor !== null ? formatMoneyInput(parsed.minor, decimals2, locale) : typed;
}

// locales/es.json
var es_default = {
  name: "Men\xFAs y combos",
  description: "Men\xFAs, packs y combos que se venden a precio cerrado, con grupos de elecci\xF3n ordenados.",
  navigation: {
    menus: {
      label: "Men\xFAs"
    }
  },
  ui: {
    colName: "Nombre",
    colKitchen: "Nombre de cocina",
    colPrice: "Precio cerrado",
    colSupply: "C\xF3mo se vende",
    colActive: "A la venta",
    colOrder: "Orden",
    yes: "S\xED",
    no: "No",
    searchMenu: "Buscar un men\xFA\u2026",
    loading: "Cargando\u2026",
    emptyMenus: "A\xFAn no hay men\xFAs. Crea el primero con el bot\xF3n +.",
    actionEdit: "Editar datos",
    actionDelete: "Retirar",
    actionAdd: "A\xF1adir",
    save: "Guardar",
    saving: "Guardando\u2026",
    cancel: "Cancelar",
    delete: "Retirar",
    deleting: "Retirando\u2026",
    back: "Todos los men\xFAs",
    newMenuTitle: "Men\xFA nuevo",
    editMenuTitle: "Men\xFA \xB7 {name}",
    fieldName: "Nombre",
    fieldKitchenName: "Nombre de cocina",
    fieldKitchenNameHelp: "D\xE9jalo vac\xEDo y la comanda usa el nombre comercial.",
    fieldPrice: "Precio cerrado",
    fieldPriceHelp: "Lo que paga el cliente por el men\xFA entero, elija lo que elija.",
    fieldTaxCategory: "Tipo de IVA",
    fieldTaxCategoryHelp: "El tipo al que se factura el men\xFA entero.",
    fieldActive: "A la venta",
    fieldOrder: "Orden en la lista de men\xFAs",
    supplyLabel: "\xBFC\xF3mo se vende?",
    supplyService: "Se consume en el local (servicio de restauraci\xF3n)",
    supplyServiceHelp: "UNA l\xEDnea al tipo del propio men\xFA, bebida incluida. Es el men\xFA del d\xEDa espa\xF1ol.",
    supplyGoods: "Se vende como producto / para llevar",
    supplyServiceShort: "En el local",
    supplyGoodsShort: "Para llevar",
    supplyGoodsHelp: "El precio cerrado se REPARTE en UNA L\xCDNEA POR COMPONENTE, cada una a su tipo.",
    supplyGoodsWarning: "Este men\xFA se factura como entrega de bienes: su precio se repartir\xE1 entre los componentes que a\xF1adas, una l\xEDnea por cada uno.",
    supplyServiceWarning: "Este men\xFA se factura como un \xFAnico servicio: una sola l\xEDnea a su tipo de IVA, tributen como tributen sus componentes.",
    coursesTitle: "Platos",
    coursesHelp: "Un plato es un paso de ESTE men\xFA: Primero, Segundo, Postre, Bebida. Su orden es el orden en que se pregunta.",
    coursesEmpty: "A\xFAn no hay platos. A\xF1ade el primero: un men\xFA sin platos no tiene nada que elegir.",
    coursesLoading: "Cargando los platos\u2026",
    newCourse: "A\xF1adir un plato",
    editCourse: "Plato \xB7 {name}",
    fieldCourseName: "Nombre del plato",
    fieldMin: "Elecciones m\xEDnimas",
    fieldMinHelp: "1 o m\xE1s hace el plato obligatorio. 0 lo hace opcional. No hay ninguna casilla aparte.",
    fieldMax: "Elecciones m\xE1ximas",
    fieldMaxHelp: "0 significa sin l\xEDmite.",
    fieldRepeat: "Se puede elegir la misma opci\xF3n m\xE1s de una vez",
    courseRequired: "Obligatorio \xB7 elige {min}",
    courseRequiredRange: "Obligatorio \xB7 elige al menos {min}",
    courseOptional: "Opcional",
    courseMax: "hasta {max}",
    courseNoCeiling: "sin l\xEDmite",
    courseRepeat: "se puede repetir",
    courseNoRepeat: "sin repetir",
    optionsTitle: "Elecciones",
    optionsEmpty: "A\xFAn no hay elecciones: nadie puede resolver este plato.",
    optionPicker: "Art\xEDculo del cat\xE1logo",
    optionPickerPlaceholder: "Busca un producto o un servicio\u2026",
    optionDelta: "Suplemento",
    optionDeltaHelp: "Lo que la sustituci\xF3n suma al precio CERRADO. Puede ser negativo.",
    optionAdd: "A\xF1adir elecci\xF3n",
    optionEdit: "Editar esta elecci\xF3n",
    optionDelete: "Quitar esta elecci\xF3n",
    editingChoice: "Editando \xAB{article}\xBB. Conserva su posici\xF3n en el plato.",
    bulkAdd: "A\xF1adir varios",
    bulkTitle: "A\xF1adir art\xEDculos a este plato",
    bulkAddCount: "A\xF1adir {n} seleccionados",
    bulkAlready: "Ya est\xE1 en este plato",
    sourceProduct: "Producto",
    sourceService: "Servicio",
    catalogueMissing: "{module} no est\xE1 instalado, as\xED que sus art\xEDculos no se pueden elegir aqu\xED. Inst\xE1lalo desde el marketplace.",
    moduleInventory: "Inventario",
    moduleServices: "Servicios",
    catalogueEmpty: "A\xFAn no hay art\xEDculos en el cat\xE1logo.",
    unknownArticle: "Art\xEDculo {ref} (ya no est\xE1 en el cat\xE1logo)",
    deleteMenuTitle: "\xBFRetirar este men\xFA?",
    deleteMenuConfirm: "\xAB{name}\xBB deja de estar a la venta, junto con sus platos y sus elecciones. Los tiques ya emitidos se siguen leyendo.",
    deleteCourseConfirm: "\xBFQuitar el plato \xAB{name}\xBB y sus elecciones?",
    errNoTaxCategory: "Un men\xFA que se consume en el local necesita su propio tipo de IVA: sin \xE9l no se puede facturar.",
    errNoName: "El men\xFA necesita un nombre.",
    errCeilingBelowFloor: "El m\xE1ximo ({max}) queda por debajo del m\xEDnimo ({min}): nadie podr\xEDa satisfacer nunca este plato.",
    errNoArticle: "Elige antes un art\xEDculo del cat\xE1logo.",
    errDuplicateArticle: "Este plato ya ofrece ese art\xEDculo. Para que se pueda elegir dos veces, activa \xABse puede elegir la misma opci\xF3n m\xE1s de una vez\xBB.",
    errAmbiguousAmount: "Este importe se puede leer de dos maneras: \xAB{typed}\xBB tanto puede ser {grouped} como {decimal}. Escribe los decimales para que no haya duda.",
    errNotAnAmount: "Esto no es un importe. Escribe una cifra, por ejemplo 12,50.",
    errNegativePrice: "El precio de un men\xFA no puede ser negativo. Para abaratar una opci\xF3n, ponle un suplemento negativo.",
    errSaveMenu: "No se ha podido guardar el men\xFA.",
    errSaveCourse: "No se ha podido guardar el plato.",
    errSaveOption: "No se ha podido guardar la elecci\xF3n.",
    errLoadCourses: "No se han podido cargar los platos de este men\xFA.",
    errDeleteMenu: "No se ha podido retirar el men\xFA.",
    errDeleteCourse: "No se ha podido quitar el plato.",
    errDeleteOption: "No se ha podido quitar la elecci\xF3n.",
    moveUp: "Subir",
    moveDown: "Bajar",
    errNoneSelected: "Marca al menos un art\xEDculo.",
    errLoadCatalogue: "No se ha podido cargar el cat\xE1logo de art\xEDculos, as\xED que esta lista puede estar incompleta.",
    errLoadTaxCategories: "No se han podido cargar las categor\xEDas de IVA.",
    dragToReorder: "Arrastra para reordenar"
  },
  errors: {
    "combos.combo_in_use": "Este men\xFA se est\xE1 usando y no se puede retirar: {message}"
  }
};

// locales/en.json
var en_default = {
  name: "Combos",
  description: "Menus, packs and combos sold at a closed price, with ordered choice groups.",
  navigation: {
    menus: {
      label: "Menus"
    }
  },
  ui: {
    colName: "Name",
    colKitchen: "Kitchen name",
    colPrice: "Closed price",
    colSupply: "How it is sold",
    colActive: "On sale",
    colOrder: "Order",
    yes: "Yes",
    no: "No",
    searchMenu: "Search a menu\u2026",
    loading: "Loading\u2026",
    emptyMenus: "No menus yet. Create the first one with the + button.",
    actionEdit: "Edit details",
    actionDelete: "Withdraw",
    actionAdd: "Add",
    save: "Save",
    saving: "Saving\u2026",
    cancel: "Cancel",
    delete: "Withdraw",
    deleting: "Withdrawing\u2026",
    back: "All menus",
    newMenuTitle: "New menu",
    editMenuTitle: "Menu \xB7 {name}",
    fieldName: "Name",
    fieldKitchenName: "Kitchen name",
    fieldKitchenNameHelp: "Leave it empty and the kitchen ticket uses the commercial name.",
    fieldPrice: "Closed price",
    fieldPriceHelp: "What the customer pays for the whole menu, whatever they pick.",
    fieldTaxCategory: "VAT category",
    fieldTaxCategoryHelp: "The rate the whole menu is billed at.",
    fieldActive: "On sale",
    fieldOrder: "Order on the menu list",
    supplyLabel: "How is it sold?",
    supplyService: "Eaten in (hospitality service)",
    supplyServiceHelp: "ONE line at the menu's own rate, drinks included. This is the Spanish menu del d\xEDa.",
    supplyGoods: "Sold as a product / to take away",
    supplyServiceShort: "Eat in",
    supplyGoodsShort: "Take away",
    supplyGoodsHelp: "The closed price is SPLIT into ONE LINE PER COMPONENT, each at its own rate.",
    supplyGoodsWarning: "This menu is billed as goods: its price will be split across the components you add, one line each.",
    supplyServiceWarning: "This menu is billed as a single service: one line at its VAT category, whatever the components are taxed at.",
    coursesTitle: "Courses",
    coursesHelp: "A course is a step of THIS menu \u2014 Starter, Main, Dessert, Drink. Its order is the order it is asked for.",
    coursesEmpty: "No courses yet. Add the first one \u2014 a menu with no course has nothing to pick.",
    coursesLoading: "Loading courses\u2026",
    newCourse: "Add a course",
    editCourse: "Course \xB7 {name}",
    fieldCourseName: "Course name",
    fieldMin: "Minimum picks",
    fieldMinHelp: "1 or more makes the course compulsory. 0 makes it optional. There is no separate switch.",
    fieldMax: "Maximum picks",
    fieldMaxHelp: "0 means no limit.",
    fieldRepeat: "The same option may be picked more than once",
    courseRequired: "Compulsory \xB7 pick {min}",
    courseRequiredRange: "Compulsory \xB7 pick at least {min}",
    courseOptional: "Optional",
    courseMax: "up to {max}",
    courseNoCeiling: "no limit",
    courseRepeat: "may repeat",
    courseNoRepeat: "no repeats",
    optionsTitle: "Choices",
    optionsEmpty: "No choices yet: nobody can resolve this course.",
    optionPicker: "Catalogue article",
    optionPickerPlaceholder: "Search a product or a service\u2026",
    optionDelta: "Supplement",
    optionDeltaHelp: "What substituting adds to the CLOSED price. It may be negative.",
    optionAdd: "Add choice",
    optionEdit: "Edit this choice",
    optionDelete: "Remove this choice",
    editingChoice: "Editing \xAB{article}\xBB. It keeps its position in the course.",
    bulkAdd: "Add several",
    bulkTitle: "Add articles to this course",
    bulkAddCount: "Add {n} selected",
    bulkAlready: "Already in this course",
    sourceProduct: "Product",
    sourceService: "Service",
    catalogueMissing: "{module} is not installed, so its articles cannot be picked here. Install it from the marketplace.",
    moduleInventory: "Inventory",
    moduleServices: "Services",
    catalogueEmpty: "No articles in the catalogue yet.",
    unknownArticle: "Article {ref} (no longer in the catalogue)",
    deleteMenuTitle: "Withdraw this menu?",
    deleteMenuConfirm: "\xAB{name}\xBB stops being on sale, together with its courses and choices. Tickets already issued keep reading it.",
    deleteCourseConfirm: "Remove the course \xAB{name}\xBB and its choices?",
    errNoTaxCategory: "A menu eaten in needs its own VAT category: without it, it cannot be billed at all.",
    errNoName: "The menu needs a name.",
    errCeilingBelowFloor: "The maximum ({max}) is below the minimum ({min}): nobody could ever satisfy this course.",
    errNoArticle: "Pick a catalogue article first.",
    errDuplicateArticle: "This course already offers that article. To let it be picked twice, switch on \xABthe same option may be picked more than once\xBB.",
    errAmbiguousAmount: "This amount can be read in two ways: \xAB{typed}\xBB could be {grouped} or {decimal}. Write the decimals so there is no doubt.",
    errNotAnAmount: "This is not an amount. Type a figure, for example 12.50.",
    errNegativePrice: "A menu price cannot be below zero. To make a choice cheaper, give it a negative supplement instead.",
    errSaveMenu: "The menu could not be saved.",
    errSaveCourse: "The course could not be saved.",
    errSaveOption: "The choice could not be saved.",
    errLoadCourses: "The courses of this menu could not be loaded.",
    errDeleteMenu: "The menu could not be withdrawn.",
    errDeleteCourse: "The course could not be removed.",
    errDeleteOption: "The choice could not be removed.",
    moveUp: "Move up",
    moveDown: "Move down",
    errNoneSelected: "Tick at least one article first.",
    errLoadCatalogue: "The article catalogue could not be loaded, so this list may be incomplete.",
    errLoadTaxCategories: "The VAT categories could not be loaded.",
    dragToReorder: "Drag to reorder"
  },
  errors: {
    "combos.combo_in_use": "This menu is being used and cannot be withdrawn: {message}"
  }
};

// ui/components/erp-combos-menus/erp-combos-menus.ts
var CATALOG = { es: es_default, en: en_default };
function erplora() {
  const c5 = globalThis.erplora;
  if (!c5) throw new Error("erplora SDK not initialised by the shell");
  return c5;
}
var can = (permission) => erplora().hasPermission?.(permission) ?? true;
var t5 = (key, params) => erplora().t(CATALOG, key, params);
var decimals = () => erplora().currencyDecimals ?? 2;
function readAmount(typed, field) {
  const c5 = erplora();
  const d3 = decimals();
  const raw = String(typed ?? "");
  const read = parseMoneyInput(raw, d3, { currency: c5.currency || void 0, locale: c5.locale });
  if (read.ok) {
    const minor = read.minor ?? 0;
    if (minor < 0 && field === "price") return { ok: false, key: "ui.errNegativePrice" };
    return { ok: true, minor };
  }
  if (read.code === "ambiguous_amount") {
    return {
      ok: false,
      key: "ui.errAmbiguousAmount",
      params: {
        typed: raw.trim(),
        grouped: formatMoneyInput(read.readings.grouped, d3, c5.locale),
        decimal: formatMoneyInput(read.readings.decimal, d3, c5.locale)
      }
    };
  }
  return { ok: false, key: "ui.errNotAnAmount" };
}
function amountToMinor(typed, field) {
  const read = readAmount(typed, field);
  return read.ok ? read.minor : 0;
}
function amountBlockedKey(typed, field) {
  const read = readAmount(typed, field);
  return read.ok ? "" : read.key;
}
function amountReadings(typed, field) {
  const read = readAmount(typed, field);
  return read.ok ? {} : read.params ?? {};
}
var minorToInput = (minor) => formatMoneyInput(minor, decimals(), erplora().locale);
function normaliseOnBlur(typed) {
  const c5 = erplora();
  return normaliseMoneyInput(typed, decimals(), c5.locale, c5.currency || void 0);
}
var CATALOGUES = [
  { source: "product", query: "inventory.products.list", moduleKey: "ui.moduleInventory" },
  { source: "service", query: "services.services.list", moduleKey: "ui.moduleServices" }
];
function moved(list, from, to) {
  const out = [...list];
  const [row] = out.splice(from, 1);
  out.splice(to, 0, row);
  return out;
}
function dropIndexAt(y3, slots, from) {
  if (slots.length === 0) return from;
  for (let i7 = 0; i7 < slots.length; i7 += 1) {
    if (y3 <= slots[i7].top + slots[i7].height / 2) return i7;
  }
  return slots.length - 1;
}
function domainErrorText(e5, fallbackKey) {
  const code = e5?.code;
  const message = e5 instanceof Error ? e5.message : "";
  if (typeof code === "string" && code.startsWith("combos.")) {
    const key = `errors.${code}`;
    const text = t5(key, { message });
    if (text !== key) return text;
  }
  return message || t5(fallbackKey);
}
var ErpCombosMenus = class extends i3 {
  constructor() {
    super(...arguments);
    this.openCombo = null;
    this.editing = null;
    this.editTitleInHeader = false;
    this.fName = "";
    this.fKitchenName = "";
    this.fPrice = "";
    this.fTaxCategory = "";
    this.fSupplyKind = "service";
    this.fActive = true;
    this.fSortOrder = "0";
    this.comboReason = "";
    this.comboError = "";
    this.courses = [];
    this.coursesLoading = false;
    this.coursesError = "";
    this.choices = {};
    this.editingCourse = null;
    this.cName = "";
    this.cMin = "1";
    this.cMax = "1";
    this.cRepeat = false;
    this.courseReason = "";
    this.courseError = "";
    this.optionDraft = {};
    this.editingChoice = null;
    this.optionScope = "";
    this.optionReason = "";
    this.optionError = "";
    this.bulkFor = "";
    this.bulkQuery = "";
    this.bulkPicked = [];
    this.bulkReason = "";
    this.articles = [];
    this.missingCatalogues = [];
    this.catalogueError = "";
    this.taxCategories = [];
    this.taxCategoriesError = "";
    this.saving = false;
    /**
     * The drag in flight, or null. `at` is where the row currently sits on screen (the list is
     * reordered live, so the finger carries something), `from` is where it started, and `original`
     * is what the screen has to go back to if the gesture is cancelled.
     */
    this.drag = null;
    this.onLocaleChange = () => this.requestUpdate();
    /** Carries the row with the finger: the list is reordered on screen, nothing is written yet. */
    this.onDragMove = (e5) => {
      const drag = this.drag;
      if (!drag) return;
      const to = dropIndexAt(e5.clientY, drag.slots, drag.from);
      if (to === drag.at) return;
      if (drag.kind === "course") this.courses = moved(this.courses, drag.at, to);
      else this.choices = { ...this.choices, [drag.groupId]: moved(this.choices[drag.groupId] ?? [], drag.at, to) };
      drag.at = to;
    };
    /** Drops the row. Only a drop that actually moved something writes. */
    this.onDragEnd = () => {
      const drag = this.drag;
      this.endDrag();
      if (!drag || drag.at === drag.from) return;
      const lo = Math.min(drag.from, drag.at);
      const hi = Math.max(drag.from, drag.at);
      if (drag.kind === "course") void this.persistCourseOrder(lo, hi);
      else void this.persistChoiceOrder(drag.groupId, lo, hi);
    };
    /** The gesture was taken away (a call, a system sheet): the screen goes back to what it was. */
    this.onDragCancel = () => {
      const drag = this.drag;
      this.endDrag();
      if (!drag) return;
      if (drag.kind === "course") this.courses = drag.original;
      else this.choices = { ...this.choices, [drag.groupId]: drag.original };
    };
  }
  static {
    this.styles = i`
    :host { display:flex; flex-direction:column; height:100%; min-height:0; font-family: system-ui, sans-serif; color: var(--ion-text-color, #1c1b18); }
    .page { display:flex; flex-direction:column; min-height:0; flex:1 1 auto; }
    .page > ok-data-table { flex:1 1 auto; min-height:0; }

    /* The builder scrolls on its own so the menu header stays put on a phone. */
    .builder { display:flex; flex-direction:column; min-height:0; flex:1 1 auto; gap:.75rem; }
    .builder-body { overflow-y:auto; min-height:0; flex:1 1 auto; display:flex; flex-direction:column; gap:.75rem; padding-bottom:1rem; }

    .menu-head { display:flex; flex-wrap:wrap; align-items:center; gap:.5rem .75rem; flex:0 0 auto; }
    .menu-head .name { font-size:1.05rem; font-weight:600; }
    .menu-head .price { font-variant-numeric: tabular-nums; font-weight:600; }

    .card { border:1px solid var(--ion-border-color, #e7e2d6); border-radius: var(--ok-radius-sm, 10px); padding:.75rem 1rem; background: var(--ok-surface-2, var(--ion-color-step-50, rgba(var(--ion-text-color-rgb, 24,24,27), .04))); }
    .card-head { display:flex; flex-wrap:wrap; gap:.5rem; align-items:baseline; }
    .card-head .title { font-weight:600; flex:1 1 auto; }

    /* The rule the till will apply, stated where the course is built. */
    .rule { font-size:.85rem; opacity:.8; }
    [data-required='true'] .badge { background: color-mix(in srgb, var(--ion-color-warning, #ffc409) 22%, transparent); }
    .badge { display:inline-block; border-radius:999px; padding:.1rem .55rem; font-size:.78rem; background: color-mix(in srgb, var(--ion-text-color, #1c1b18) 8%, transparent); }

    .choices { list-style:none; margin:.6rem 0 0; padding:0; display:flex; flex-direction:column; gap:.3rem; }
    /* Wraps on purpose. Four 44 px targets are 64 px wider per row than four 28 px ones, and
       measured at 390x844 a long article name plus a supplement pushed Retirar PAST the right
       edge of its own row -- cut off, with the page not even scrolling sideways to reveal it.
       Growing a touch target until it leaves the card is not a fix, so on a narrow screen the
       actions drop to their own line at full size. */
    .choices li { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; font-size:.92rem; }
    .choices .name { flex:1 1 8rem; min-width:0; overflow-wrap:anywhere; }
    .choices .delta { margin-left:auto; font-variant-numeric: tabular-nums; }
    /* Pushed to the end of the row, and to the same place whether or not there is a supplement.
       The flex:0 0 auto is load-bearing: a 44 px target that is allowed to shrink is not a 44 px
       target any more, it just fails more quietly.
       (No backticks in this comment -- it lives inside the css tagged template and one would
       CLOSE it, which is exactly how this edit broke the whole component once.) */
    .choices .row-actions { flex:0 0 auto; margin-left:auto; display:flex; align-items:center; gap:.1rem; }
    .choices .delta + .row-actions { margin-left:.5rem; }

    .form { display:flex; flex-direction:column; gap:.7rem; }
    /* Wide enough to breathe on a tablet, single column on a phone. */
    .row { display:flex; flex-wrap:wrap; gap:.6rem; align-items:flex-end; }
    .row > * { flex:1 1 12rem; min-width:0; }
    .help { font-size:.82rem; opacity:.75; margin:0; }
    .help[data-active='false'] { opacity:.5; }
    .help[data-active='true'] { opacity:1; font-weight:500; }

    /*
     * A BLOCKED BUTTON IS NOT NATIVELY DISABLED. Ionic implements the native disabled state as
     * pointer-events:none, so it swallows the tap and leaves the reason in a title attribute
     * nobody reads on a tablet. The button here stays tappable, is announced with aria-disabled,
     * and the tap ANSWERS with the reason in words.
     *
     * The styling hook is data-blocked, NOT an [aria-disabled] selector: Ionic relocates aria-*
     * onto its inner button element, so a selector on the host would never match and this rule
     * would silently do nothing.
     *
     * (No backticks anywhere in this comment, on purpose: it lives inside the css tagged
     * template, so a backtick here would CLOSE that template and break the whole component at
     * parse time. Same trap applies to the HTML comments inside the render templates.)
     */
    [data-blocked='true'] { opacity:.55; }

    /*
     * THE COLOUR OF A BUTTON COMES FROM THESE VARS, NEVER FROM ion-button's color ATTRIBUTE.
     * Measured in Chromium on the real bundle: inside this shadow root a color attribute leaves
     * the background at rgba(0,0,0,0) and the text at rgb(255,255,255) -- white on white, which
     * swallowed Guardar and Anadir eleccion. Ionic paints that attribute through .ion-color-*
     * classes defined in the HOST document, and those never cross a shadow boundary. Custom
     * properties do, so the tone is applied here and hooked on data-tone.
     */
    ion-button[data-tone='primary'] {
      --background: var(--ion-color-primary, #0054e9);
      --color: var(--ion-color-primary-contrast, #fff);
    }
    ion-button[data-tone='danger'] {
      --background: var(--ion-color-danger, #c5000f);
      --color: var(--ion-color-danger-contrast, #fff);
    }
    /*
     * ONE TOUCH TARGET SIZE FOR THE WHOLE BUILDER, NOT ONE PER ROW (combos#4).
     * Measured on the built bundle in Chromium with Ionic in ios (the mode the shell pins,
     * ADR-0143), at 390x844, 820x1180 and 1440x900: an icon-only ion-button size=small came out
     * 28,1 x 28,1 px in all three, with 5,6 px between neighbours -- centres 33,7 px apart, four
     * of them in a row, and the last one is Retirar. A mis-tap there withdraws the choice next to
     * the one that was aimed at.
     *
     * 44 is the floor Apple HIG and WCAG 2.1 SC 2.5.5 (AAA) both put it at, and it is what the
     * rest of ERPlora already settled on with tests behind it: ok-data-table pins 44 for the row
     * actions of the list half of THIS screen, and invoice, cash_register, kitchen, customers,
     * appointments and reservations pin the same 44.
     *
     * Pinned for every ion-button of the component, not only the icon-only ones: the arrows of a
     * course share a card head with its Editar and Retirar, so sizing one and not the other is
     * how a card ends up with two heights -- worse than the small size it replaced.
     *
     * --min-height as well as min-height on purpose: min-height on the host reserves the box, but
     * what the finger actually lands on is the .button-native Ionic paints inside, and that one
     * follows the custom property.
     */
    ion-button { min-height:44px; --min-height:44px; }
    /* No label to widen them, so these are the ones that collapse. Square, and padding-free so
       the icon keeps the middle. */
    .icon-btn { min-width:44px; min-height:44px; --min-height:44px; --padding-start:0; --padding-end:0; }

    /*
     * THE DRAG HANDLE, AND THE ONE LINE THAT MAKES THE GESTURE POSSIBLE (combos#6).
     *
     * A drag on a touch screen competes with the browser's own scroll, and the ONLY thing that
     * settles it is touch-action. preventDefault() on pointerdown does not: by the time it runs the
     * browser has already decided the gesture is a scroll.
     *
     * It is pinned on the HANDLE and nowhere else, in both places it has to be pinned:
     *
     *  * on the host, and
     *  * on ::part(native) -- touch-action is NOT inherited, and what the finger actually lands on
     *    is the button Ionic paints inside its own shadow root. Pinning only the host leaves the
     *    page scrolling under a handle that looks draggable and is not.
     *
     * And nowhere else ON PURPOSE. touch-action:none on the row, the card or the scrolling body
     * would kill the page scroll on a tablet, which is a far worse defect than the one this fixes.
     * The rest of the row keeps its normal behaviour, so the list still scrolls under a finger that
     * does not start on the handle.
     */
    .drag-handle { touch-action:none; cursor:grab; }
    .drag-handle::part(native) { touch-action:none; }
    /* The row that is being carried, so the finger can see what it picked up. */
    [data-dragging='true'] { opacity:.6; }
    [data-dragging='true'] .drag-handle { cursor:grabbing; }

    .reason { color: var(--ion-color-danger, #d9480f); font-size:.85rem; margin:.2rem 0 0; }
    .muted { opacity:.75; font-size:.9rem; }
  `;
  }
  async connectedCallback() {
    super.connectedCallback();
    window.addEventListener("erplora:locale-changed", this.onLocaleChange);
    this.ctrl = createListController(erplora(), "combos.combos.list", () => this.requestUpdate(), {
      pageSize: 50,
      sort: "sort_order",
      dir: "asc"
    });
    await Promise.all([this.ctrl.load(), this.loadCatalogues(), this.loadTaxCategories()]);
  }
  disconnectedCallback() {
    window.removeEventListener("erplora:locale-changed", this.onLocaleChange);
    this.endDrag();
    super.disconnectedCallback();
  }
  /** Wired natively on the shadow root, not with a Lit `@click` on the tag: `<ok-data-table>`
   *  carries `testid`, not `data-testid` (outfitkit#143), and it is re-created each time the user
   *  comes back from a menu builder, which a listener on the first table would not survive. */
  firstUpdated() {
    this.renderRoot.addEventListener("click", (e5) => this.onTableClick(e5));
  }
  /** pm#450: the table's «Add» emits no event and keeps our form state; after an edit it would
   *  show the edited menu under a «New» header, and the submit would UPDATE it. */
  onTableClick(e5) {
    if (!this.editing) return;
    const addId = "combos-table-add";
    if (e5.composedPath().some((n6) => n6 instanceof HTMLElement && n6.dataset.testid === addId)) this.resetComboForm();
  }
  // ── Reordering by dragging, which never replaces the arrows (combos#6) ──────────────────────
  //
  // WCAG 2.2 SC 2.5.7 is literal: every function that uses a dragging movement has to be reachable
  // without dragging, and reordering by drag alone is failure F108 by name — with technique G219
  // blessing step-wise arrows as the answer. Its note is the one that matters here: «this
  // requirement is separate from keyboard accessibility because people using a touchscreen device
  // may not use a physical keyboard». Our users are on a tablet, so the keyboard is no defence.
  //
  // The handle is what every verified product ships as the affordance — Lightspeed K-Series (equal
  // sign), Square, Toast (six dots), Odoo (`widget="handle"`), and Shopify sends both. So: handle
  // AND arrows, and both end in exactly the same write.
  //
  // Ionic's own `ion-reorder-group` was the first thing looked at, and it is NOT usable from here:
  // the shell registers a fixed list of `ion-*` custom elements (`hub/apps/web/src/lib/ionic-wc.ts`)
  // and reorder is not in it, so the element would render as an inert unknown tag — no error, no
  // behaviour. That is the hub#1129 trap, and a module cannot fix it in its own repository.
  /** The rows a drag of `kind` can land between, in the order they are painted. */
  dragRows(kind, groupId) {
    const selector = kind === "course" ? 'section[data-testid^="combos-course-row-"]' : `[data-testid="combos-course-row-${groupId}"] li[data-testid^="combos-choice-row-"]`;
    return [...this.renderRoot.querySelectorAll(selector)];
  }
  /** Picks a row up. `id` is the `group_id` of a course or the `option_id` of a choice. */
  beginDrag(e5, kind, groupId, id) {
    if (!can("combos.manage_combo") || this.drag) return;
    const list = kind === "course" ? this.courses : this.choices[groupId] ?? [];
    const from = kind === "course" ? this.courses.findIndex((c5) => c5.group_id === id) : (this.choices[groupId] ?? []).findIndex((o7) => o7.option_id === id);
    if (from < 0 || list.length < 2) return;
    const slots = this.dragRows(kind, groupId).map((row) => {
      const box = row.getBoundingClientRect();
      return { top: box.top, height: box.height };
    });
    e5.preventDefault();
    e5.currentTarget.setPointerCapture?.(e5.pointerId);
    this.drag = kind === "course" ? { kind, from, at: from, slots, original: this.courses } : { kind, groupId, from, at: from, slots, original: this.choices[groupId] ?? [] };
    window.addEventListener("pointermove", this.onDragMove);
    window.addEventListener("pointerup", this.onDragEnd);
    window.addEventListener("pointercancel", this.onDragCancel);
    this.requestUpdate();
  }
  endDrag() {
    window.removeEventListener("pointermove", this.onDragMove);
    window.removeEventListener("pointerup", this.onDragEnd);
    window.removeEventListener("pointercancel", this.onDragCancel);
    this.drag = null;
    this.requestUpdate();
  }
  /** True while `id` is the row being carried, so the row can show it. */
  isDragging(kind, index) {
    return this.drag?.kind === kind && this.drag.at === index;
  }
  // ── Foreign reads ──────────────────────────────────────────────────────────────────────────
  /**
   * Both catalogues, through the OPTIONAL door. `queryOptional` answers `undefined` ONLY when the
   * owner module is absent (`module_not_installed` / `module_inactive`); a renamed query or a
   * denied permission still explodes, because those are broken contracts, not absences.
   *
   * `search` is passed straight through so the picker asks the SERVER on every keystroke instead
   * of filtering a first page of 50 in the browser: both catalogues paginate at 50, and a shop
   * with 200 articles would silently be unable to reach 150 of them (the hub#650 hole).
   */
  async loadCatalogues(search = "") {
    const found = [];
    const missing = [];
    try {
      for (const cat of CATALOGUES) {
        const params = search ? { search, limit: 50 } : { limit: 50 };
        const rows = cat.source === "product" ? await erplora().queryOptional("inventory.products.list", params) : await erplora().queryOptional("services.services.list", params);
        if (rows === void 0) {
          missing.push(cat.moduleKey);
          continue;
        }
        for (const r6 of rows ?? []) {
          found.push({ value: `${cat.source}:${String(r6.id)}`, label: String(r6.name ?? r6.id) });
        }
      }
    } catch (e5) {
      this.catalogueError = domainErrorText(e5, "ui.errLoadCatalogue");
      return;
    }
    this.catalogueError = "";
    this.articles = found;
    this.missingCatalogues = missing;
  }
  /** The fiscal categories of the hub. `taxes` owns them, and it may not be installed either. */
  async loadTaxCategories() {
    try {
      const rows = await erplora().queryOptional("taxes.categories.list", { limit: 100 });
      this.taxCategories = rows ?? [];
      this.taxCategoriesError = "";
    } catch (e5) {
      this.taxCategoriesError = domainErrorText(e5, "ui.errLoadTaxCategories");
      this.taxCategories = [];
    }
  }
  // ── The menu list ──────────────────────────────────────────────────────────────────────────
  get columns() {
    return [
      { key: "name", header: t5("ui.colName"), sortable: true, filterable: true, filterType: "text" },
      { key: "price", header: t5("ui.colPrice"), align: "right", sortable: true, format: (r6) => erplora().formatMoney(Number(r6.price ?? 0)) },
      {
        key: "supply_kind",
        header: t5("ui.colSupply"),
        sortable: true,
        filterable: true,
        // Closed domain the server filters by `eq`: it is chosen, never typed.
        filterType: "select",
        // The list READS the kind row after row, so it gets the short value ("Eat in" / "Take
        // away"); the long sentence that explains the consequence stays in the form (combos#25).
        options: [
          { value: "service", label: t5("ui.supplyServiceShort") },
          { value: "goods", label: t5("ui.supplyGoodsShort") }
        ],
        format: (r6) => r6.supply_kind === "goods" ? t5("ui.supplyGoodsShort") : t5("ui.supplyServiceShort")
      },
      {
        key: "is_active",
        header: t5("ui.colActive"),
        sortable: true,
        filterable: true,
        filterType: "select",
        options: [{ value: "1", label: t5("ui.yes") }, { value: "0", label: t5("ui.no") }],
        format: (r6) => r6.is_active ? t5("ui.yes") : t5("ui.no")
      },
      { key: "sort_order", header: t5("ui.colOrder"), align: "right", sortable: true }
    ];
  }
  get rowActions() {
    if (!can("combos.manage_combo")) return [];
    return [
      { id: "edit", label: t5("ui.actionEdit"), icon: "create-outline" },
      { id: "delete", label: t5("ui.actionDelete"), icon: "trash-outline", color: "danger" }
    ];
  }
  dataTable() {
    return this.renderRoot.querySelector("ok-data-table");
  }
  // ── Opening a menu ─────────────────────────────────────────────────────────────────────────
  async openBuilder(combo) {
    this.openCombo = combo;
    this.coursesLoading = true;
    this.coursesError = "";
    this.courses = [];
    this.choices = {};
    this.resetChoiceForm();
    this.resetCourseForm();
    await this.loadCourses();
  }
  async loadCourses() {
    const combo = this.openCombo;
    if (!combo) return;
    this.coursesLoading = true;
    this.coursesError = "";
    try {
      const rows = await erplora().query("combos.groups.list", { combo_id: combo.id });
      this.courses = [...rows ?? []].sort((a3, b3) => (a3.sort_order ?? 0) - (b3.sort_order ?? 0));
      const perCourse = await Promise.all(
        this.courses.map((c5) => erplora().query("combos.options.list", { group_id: c5.group_id }))
      );
      const map = {};
      this.courses.forEach((c5, i7) => {
        map[c5.group_id] = [...perCourse[i7] ?? []].sort((a3, b3) => (a3.sort_order ?? 0) - (b3.sort_order ?? 0));
      });
      this.choices = map;
    } catch (e5) {
      this.coursesError = domainErrorText(e5, "ui.errLoadCourses");
      this.courses = [];
    } finally {
      this.coursesLoading = false;
    }
  }
  backToList() {
    this.openCombo = null;
    this.courses = [];
    this.choices = {};
    this.coursesError = "";
    this.closeBulk();
  }
  // ── Combo form ─────────────────────────────────────────────────────────────────────────────
  resetComboForm() {
    this.editing = null;
    this.fName = "";
    this.fKitchenName = "";
    this.fPrice = "";
    this.fTaxCategory = "";
    this.fSupplyKind = "service";
    this.fActive = true;
    this.fSortOrder = "0";
    this.comboReason = "";
    this.comboError = "";
  }
  /**
   * pm#450: Cancel from an edit whose header carried the title. The header stays labelled for
   * the edit that is being abandoned, so re-opening the panel as `create` puts it back to «New»
   * — header and clean form agree again.
   */
  cancelComboEdit() {
    this.resetComboForm();
    this.dataTable()?.open("create");
  }
  async startEditCombo(combo) {
    if (!can("combos.manage_combo")) return;
    this.editing = combo;
    this.fName = combo.name;
    this.fKitchenName = combo.kitchen_name ?? "";
    this.fPrice = minorToInput(Number(combo.price ?? 0));
    this.fTaxCategory = combo.tax_category_key ?? "";
    this.fSupplyKind = combo.supply_kind || "service";
    this.fActive = Boolean(combo.is_active);
    this.fSortOrder = String(combo.sort_order ?? 0);
    this.comboReason = "";
    this.comboError = "";
    const title = t5("ui.editMenuTitle", { name: combo.name });
    const table = this.dataTable();
    table?.open("edit", { title });
    await table?.updateComplete;
    this.editTitleInHeader = table?.shadowRoot?.querySelector('[role="dialog"]')?.getAttribute("aria-label") === title;
  }
  /**
   * Why the combo cannot be saved yet, as an i18n key — or '' when it can.
   *
   * `ck_combos_combo_single_supply_has_a_rate` refuses a `service` combo with no rate of its own,
   * because it could not be billed at all. Reaching Postgres with it means showing the merchant a
   * constraint violation instead of a sentence.
   */
  get comboBlockedKey() {
    if (!this.fName.trim()) return "ui.errNoName";
    if (this.fSupplyKind === "service" && !this.fTaxCategory.trim()) return "ui.errNoTaxCategory";
    const price = amountBlockedKey(this.fPrice, "price");
    if (price) return price;
    return "";
  }
  async saveCombo() {
    if (!can("combos.manage_combo")) return;
    const blocked = this.comboBlockedKey;
    if (blocked) {
      this.comboReason = t5(blocked, amountReadings(this.fPrice, "price"));
      return;
    }
    this.saving = true;
    this.comboError = "";
    this.comboReason = "";
    const payload = {
      name: this.fName.trim(),
      kitchen_name: this.fKitchenName.trim(),
      price: amountToMinor(this.fPrice, "price"),
      tax_category_key: this.fTaxCategory.trim(),
      supply_kind: this.fSupplyKind,
      is_active: this.fActive ? 1 : 0,
      sort_order: Number(this.fSortOrder) || 0
    };
    try {
      if (this.editing) await erplora().command("combos.combos.update", { combo_id: this.editing.id, ...payload });
      else await erplora().command("combos.combos.create", payload);
      this.resetComboForm();
      this.dataTable()?.close();
      await this.ctrl.load();
    } catch (e5) {
      this.comboError = domainErrorText(e5, "ui.errSaveMenu");
    } finally {
      this.saving = false;
    }
  }
  async deleteCombo(combo) {
    if (!can("combos.manage_combo")) return;
    this.saving = true;
    this.comboError = "";
    try {
      await erplora().command("combos.combos.delete", { combo_id: combo.id });
      if (this.openCombo?.id === combo.id) this.backToList();
      await this.ctrl.load();
    } catch (e5) {
      this.comboError = domainErrorText(e5, "ui.errDeleteMenu");
    } finally {
      this.saving = false;
    }
  }
  // ── Course form ────────────────────────────────────────────────────────────────────────────
  resetCourseForm() {
    this.editingCourse = null;
    this.cName = "";
    this.cMin = "1";
    this.cMax = "1";
    this.cRepeat = false;
    this.courseReason = "";
    this.courseError = "";
  }
  startEditCourse(course) {
    if (!can("combos.manage_combo")) return;
    this.editingCourse = course;
    this.cName = course.name;
    this.cMin = String(course.min_choices ?? 0);
    this.cMax = String(course.max_choices ?? 0);
    this.cRepeat = Boolean(course.allow_repeat);
    this.courseReason = "";
    this.courseError = "";
  }
  /**
   * Why the course cannot be saved — or '' when it can.
   *
   * `ck_combos_choice_group_ceiling` allows `max_choices = 0` (NO ceiling) and otherwise demands
   * `max >= min`. Confusing "no ceiling" with "a ceiling of zero" would refuse the most ordinary
   * course there is (pick one drink, as many as you like).
   */
  get courseBlockedKey() {
    if (!this.cName.trim()) return "ui.errNoName";
    const min = Number(this.cMin) || 0;
    const max = Number(this.cMax) || 0;
    if (max !== 0 && max < min) return "ui.errCeilingBelowFloor";
    return "";
  }
  async saveCourse() {
    if (!can("combos.manage_combo") || !this.openCombo) return;
    const blocked = this.courseBlockedKey;
    if (blocked) {
      this.courseReason = t5(blocked, { min: Number(this.cMin) || 0, max: Number(this.cMax) || 0 });
      return;
    }
    this.saving = true;
    this.courseError = "";
    this.courseReason = "";
    const payload = {
      name: this.cName.trim(),
      min_choices: Number(this.cMin) || 0,
      max_choices: Number(this.cMax) || 0,
      allow_repeat: this.cRepeat ? 1 : 0
    };
    try {
      if (this.editingCourse) {
        await erplora().command("combos.groups.update", { group_id: this.editingCourse.group_id, ...payload });
      } else {
        await erplora().command("combos.groups.create", {
          combo_id: this.openCombo.id,
          // The new course goes LAST: its order is the order it will be asked in, and appending is
          // the only placement that cannot silently reshuffle the courses already agreed.
          sort_order: this.courses.length,
          ...payload
        });
      }
      this.resetCourseForm();
      await this.loadCourses();
    } catch (e5) {
      this.courseError = domainErrorText(e5, "ui.errSaveCourse");
    } finally {
      this.saving = false;
    }
  }
  async deleteCourse(course) {
    if (!can("combos.manage_combo")) return;
    this.saving = true;
    this.courseError = "";
    try {
      await erplora().command("combos.groups.delete", { group_id: course.group_id });
      await this.loadCourses();
    } catch (e5) {
      this.courseError = domainErrorText(e5, "ui.errDeleteCourse");
    } finally {
      this.saving = false;
    }
  }
  /** Moves a course one step, then persists the new order of every course it displaced. */
  async moveCourse(course, delta) {
    if (!can("combos.manage_combo")) return;
    const from = this.courses.findIndex((c5) => c5.group_id === course.group_id);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= this.courses.length) return;
    this.courses = moved(this.courses, from, to);
    await this.persistCourseOrder(Math.min(from, to), Math.max(from, to));
  }
  /**
   * Writes the position of every course between `lo` and `hi`, which is what BOTH ways of
   * reordering end in — one step with an arrow (two rows) or a drop several slots away (as many
   * rows as it displaced). Only the range that actually moved is written: rewriting the whole
   * course list on every nudge would multiply the round trips for nothing.
   */
  async persistCourseOrder(lo, hi) {
    this.saving = true;
    this.courseError = "";
    try {
      for (let index = lo; index <= hi; index += 1) {
        const c5 = this.courses[index];
        await erplora().command("combos.groups.update", {
          group_id: c5.group_id,
          name: c5.name,
          min_choices: c5.min_choices,
          max_choices: c5.max_choices,
          allow_repeat: c5.allow_repeat,
          sort_order: index
        });
      }
      await this.loadCourses();
    } catch (e5) {
      this.courseError = domainErrorText(e5, "ui.errSaveCourse");
      await this.loadCourses();
    } finally {
      this.saving = false;
    }
  }
  // ── Choices ────────────────────────────────────────────────────────────────────────────────
  draft(groupId) {
    return this.optionDraft[groupId] ?? { ref: "", delta: "" };
  }
  patchDraft(groupId, patch) {
    this.optionDraft = { ...this.optionDraft, [groupId]: { ...this.draft(groupId), ...patch } };
  }
  /** The choice the form of `groupId` is editing, or null when it is adding a new one. */
  editingIn(groupId) {
    return this.editingChoice?.group_id === groupId ? this.editingChoice : null;
  }
  /**
   * Opens an existing choice in the form of its own course.
   *
   * This is the whole point of combos#1: withdrawing a choice and adding it back is NOT the same
   * operation. It loses the position (the re-added row lands last, so correcting one cent
   * reorders the printed menu) and it is not atomic — `ux_combos_choice_option` only looks at live
   * rows, so the withdrawal has to land first, and a failure in between leaves the operator
   * without the choice they only meant to retouch.
   */
  startEditChoice(choice) {
    if (!can("combos.manage_combo")) return;
    this.editingChoice = choice;
    this.optionScope = choice.group_id;
    this.optionReason = "";
    this.optionError = "";
    this.optionDraft = {
      ...this.optionDraft,
      [choice.group_id]: {
        ref: `${choice.source}:${choice.source_ref}`,
        delta: choice.price_delta ? minorToInput(choice.price_delta) : ""
      }
    };
  }
  cancelEditChoice() {
    const groupId = this.editingChoice?.group_id;
    this.editingChoice = null;
    this.optionScope = "";
    this.optionReason = "";
    this.optionError = "";
    if (groupId) this.optionDraft = { ...this.optionDraft, [groupId]: { ref: "", delta: "" } };
  }
  /**
   * Everything the choice form holds, back to zero — on OPENING a menu, next to the
   * `resetCourseForm` that was already there, and only there: the list is the only door into a
   * builder, so every entry passes through here.
   *
   * A refusal, and a half-typed draft, belong to the attempt that caused them; leaving the menu
   * ends that attempt. The four fields are cleared together on purpose — clearing three of them
   * is exactly how a red sentence comes back to a menu where nothing was refused.
   */
  resetChoiceForm() {
    this.editingChoice = null;
    this.optionDraft = {};
    this.optionScope = "";
    this.optionReason = "";
    this.optionError = "";
  }
  /**
   * Why the choice of this course cannot be saved yet, as an i18n key — or '' when it can.
   *
   * `ux_combos_choice_option (hub_id, group_id, source, source_ref) WHERE is_deleted = 0` refuses
   * the same article twice in the same course. Same rule as the two CHECKs of the combo and the
   * course: what the database refuses, the screen explains FIRST, because reaching Postgres with
   * it means showing the merchant a unique-violation instead of a sentence. Editing a choice into
   * itself is not a duplicate, so the row being edited is excluded from the comparison.
   */
  optionBlockedKey(groupId) {
    const draft = this.draft(groupId);
    if (!draft.ref) return "ui.errNoArticle";
    const delta = amountBlockedKey(draft.delta, "supplement");
    if (delta) return delta;
    const editing = this.editingIn(groupId);
    const clash = (this.choices[groupId] ?? []).some(
      (o7) => `${o7.source}:${o7.source_ref}` === draft.ref && o7.option_id !== editing?.option_id
    );
    return clash ? "ui.errDuplicateArticle" : "";
  }
  async saveChoice(groupId) {
    if (!can("combos.manage_combo")) return;
    const blocked = this.optionBlockedKey(groupId);
    if (blocked) {
      this.optionScope = groupId;
      this.optionReason = t5(blocked, amountReadings(this.draft(groupId).delta, "supplement"));
      return;
    }
    const draft = this.draft(groupId);
    const [source, ...rest] = draft.ref.split(":");
    const editing = this.editingIn(groupId);
    this.saving = true;
    this.optionScope = groupId;
    this.optionError = "";
    this.optionReason = "";
    try {
      const article = { source, source_ref: rest.join(":"), price_delta: amountToMinor(draft.delta, "supplement") };
      if (editing) {
        await erplora().command("combos.options.update", {
          option_id: editing.option_id,
          ...article,
          // The position it ALREADY holds. `option_update.sql` runs COALESCE(:sort_order, 0), so
          // omitting the field is not "leave it as it is": it sends the choice to the top of the
          // course on every single edit.
          sort_order: editing.sort_order ?? 0
        });
        this.editingChoice = null;
      } else {
        await erplora().command("combos.options.create", {
          group_id: groupId,
          ...article,
          // A new choice goes LAST, the only placement that cannot reshuffle what is agreed.
          sort_order: (this.choices[groupId] ?? []).length
        });
      }
      this.optionDraft = { ...this.optionDraft, [groupId]: { ref: "", delta: "" } };
      await this.loadCourses();
    } catch (e5) {
      this.optionError = domainErrorText(e5, "ui.errSaveOption");
    } finally {
      this.saving = false;
    }
  }
  /** Moves a choice one step inside its course, then persists the two positions that swapped. */
  async moveChoice(choice, delta) {
    if (!can("combos.manage_combo")) return;
    const list = this.choices[choice.group_id] ?? [];
    const from = list.findIndex((o7) => o7.option_id === choice.option_id);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= list.length) return;
    this.choices = { ...this.choices, [choice.group_id]: moved(list, from, to) };
    await this.persistChoiceOrder(choice.group_id, Math.min(from, to), Math.max(from, to));
  }
  /** The same write for both ways of reordering a course's choices: the arrows and the handle. */
  async persistChoiceOrder(groupId, lo, hi) {
    this.saving = true;
    this.optionScope = groupId;
    this.optionError = "";
    try {
      const list = this.choices[groupId] ?? [];
      for (let index = lo; index <= hi; index += 1) {
        const o7 = list[index];
        await erplora().command("combos.options.update", {
          option_id: o7.option_id,
          source: o7.source,
          source_ref: o7.source_ref,
          price_delta: o7.price_delta,
          sort_order: index
        });
      }
      await this.loadCourses();
    } catch (e5) {
      this.optionError = domainErrorText(e5, "ui.errSaveOption");
      await this.loadCourses();
    } finally {
      this.saving = false;
    }
  }
  // ── Adding several articles at once (combos#6) ──────────────────────────────────────────────
  //
  // The frontier the market barrido found is not catalogue size, it is TPV vs ERP: every verified
  // hospitality TPV ships bulk add and the ones that ship one line at a time are the ones
  // generating the complaints (Odoo's «keying it in 1 line at a time is going to take too long»,
  // Square's «VERY inconvenient to have to select each modifier inside each item»). Copied from
  // Lightspeed K-Series, the closest product: a pop-up with a filter, a checkbox per row and a
  // primary button whose LABEL CARRIES THE COUNT.
  //
  // The supplement is NOT asked here, on purpose. It is the exception, not the rule, and asking for
  // it once per row would turn a bulk add back into the one-at-a-time form it replaces. It is set
  // afterwards by editing the row, which combos#1 made possible without losing the position.
  openBulk(groupId) {
    if (!can("combos.manage_combo")) return;
    this.bulkFor = groupId;
    this.bulkPicked = [];
    this.bulkQuery = "";
    this.bulkReason = "";
    void this.loadCatalogues();
  }
  closeBulk() {
    this.bulkFor = "";
    this.bulkPicked = [];
    this.bulkQuery = "";
    this.bulkReason = "";
  }
  /** Searches on the SERVER: both catalogues paginate at 50 (the hub#650 hole). */
  searchBulk(query) {
    this.bulkQuery = query;
    void this.loadCatalogues(query);
  }
  tickBulk(ref, owned, checked) {
    if (owned) return;
    this.bulkPicked = checked ? [...this.bulkPicked.filter((r6) => r6 !== ref), ref] : this.bulkPicked.filter((r6) => r6 !== ref);
  }
  async confirmBulk() {
    if (!can("combos.manage_combo")) return;
    const groupId = this.bulkFor;
    if (!groupId) return;
    const picked = this.bulkPicked;
    if (picked.length === 0) {
      this.bulkReason = t5("ui.errNoneSelected");
      return;
    }
    this.saving = true;
    this.optionScope = groupId;
    this.optionError = "";
    this.optionReason = "";
    const base = (this.choices[groupId] ?? []).length;
    try {
      for (const [i7, ref] of picked.entries()) {
        const [source, ...rest] = ref.split(":");
        await erplora().command("combos.options.create", {
          group_id: groupId,
          source,
          source_ref: rest.join(":"),
          price_delta: 0,
          sort_order: base + i7
        });
      }
      this.closeBulk();
      await this.loadCourses();
    } catch (e5) {
      this.optionError = domainErrorText(e5, "ui.errSaveOption");
      this.closeBulk();
      await this.loadCourses();
    } finally {
      this.saving = false;
    }
  }
  async deleteChoice(choice) {
    if (!can("combos.manage_combo")) return;
    this.saving = true;
    this.optionScope = choice.group_id;
    this.optionError = "";
    try {
      await erplora().command("combos.options.delete", { option_id: choice.option_id });
      if (this.editingChoice?.option_id === choice.option_id) this.cancelEditChoice();
      await this.loadCourses();
    } catch (e5) {
      this.optionError = domainErrorText(e5, "ui.errDeleteOption");
    } finally {
      this.saving = false;
    }
  }
  /** The label of an opaque reference, or a sentence saying it is gone from the catalogue. */
  articleLabel(choice) {
    const found = this.articles.find((a3) => a3.value === `${choice.source}:${choice.source_ref}`);
    return found ? found.label : t5("ui.unknownArticle", { ref: choice.source_ref });
  }
  // ── Rendering ──────────────────────────────────────────────────────────────────────────────
  /**
   * A button that is blocked but still ANSWERS. Never `disabled`: Ionic implements it as
   * `pointer-events:none`, so the tap dies and the reason lives in a `title` no tablet shows.
   */
  blockingButton(opts) {
    return b2`<ion-button
      size="small"
      data-testid=${opts.testid}
      data-tone=${opts.tone ?? "primary"}
      data-blocked=${String(opts.blocked)}
      aria-disabled=${String(opts.blocked)}
      @click=${opts.onClick}
    >${opts.label}</ion-button>`;
  }
  /** The sentence that states the rule the till will apply for this course. */
  courseRule(course) {
    const min = Number(course.min_choices ?? 0);
    const max = Number(course.max_choices ?? 0);
    const parts = [];
    if (min >= 1) {
      parts.push(max === min ? t5("ui.courseRequired", { min }) : t5("ui.courseRequiredRange", { min }));
    } else {
      parts.push(t5("ui.courseOptional"));
    }
    parts.push(max === 0 ? t5("ui.courseNoCeiling") : t5("ui.courseMax", { max }));
    parts.push(course.allow_repeat ? t5("ui.courseRepeat") : t5("ui.courseNoRepeat"));
    return parts.join(" \xB7 ");
  }
  renderComboForm() {
    const editing = this.editing;
    const blockedKey = this.comboBlockedKey;
    return b2`<form slot="create" class="form" data-testid="combos-form" @submit=${(e5) => {
      e5.preventDefault();
      this.saveCombo();
    }}>
      <!-- pm#450: when the header already carries the editing title, repeating it in the form
           body is the duplicate this issue exists to remove. -->
      ${editing && this.editTitleInHeader ? A : b2`<h3>${editing ? t5("ui.editMenuTitle", { name: editing.name }) : t5("ui.newMenuTitle")}</h3>`}

      <ion-input mode="md" fill="outline" data-testid="combos-name" label=${t5("ui.fieldName")} label-placement="floating"
        .value=${this.fName}
        @ionInput=${(e5) => this.fName = String(e5.target.value ?? "")}></ion-input>

      <ion-input mode="md" fill="outline" data-testid="combos-kitchen-name" label=${t5("ui.fieldKitchenName")} label-placement="floating"
        .value=${this.fKitchenName}
        @ionInput=${(e5) => this.fKitchenName = String(e5.target.value ?? "")}></ion-input>
      <p class="help">${t5("ui.fieldKitchenNameHelp")}</p>

      <ion-input mode="md" fill="outline" data-testid="combos-price" type="text" inputmode="decimal"
        label=${t5("ui.fieldPrice")} label-placement="floating" .value=${this.fPrice}
        @ionInput=${(e5) => this.fPrice = String(e5.target.value ?? "")}
        @ionBlur=${() => this.fPrice = normaliseOnBlur(this.fPrice)}></ion-input>
      <p class="help">${t5("ui.fieldPriceHelp")}</p>

      <!-- supply_kind is asked by what it MEANS: whoever fills it is a restaurateur, not an adviser. -->
      <ion-select mode="md" fill="outline" data-testid="combos-supply-kind" label=${t5("ui.supplyLabel")} label-placement="floating"
        .value=${this.fSupplyKind}
        @ionChange=${(e5) => this.fSupplyKind = String(e5.target.value ?? "service")}>
        <ion-select-option value="service">${t5("ui.supplyService")}</ion-select-option>
        <ion-select-option value="goods">${t5("ui.supplyGoods")}</ion-select-option>
      </ion-select>
      <!--
        BOTH consequences are shown, with the active one emphasised - not only the selected
        one. Rendering just the current value would mean the merchant has to SELECT goods to
        find out what goods does, which is the "discover it on the invoice" failure this screen
        exists to prevent. The choice is between two fiscal outcomes, so both are on the table.
      -->
      <p class="help" data-testid="combos-supply-help-service" data-active=${String(this.fSupplyKind === "service")}>
        ${t5("ui.supplyService")}: ${t5("ui.supplyServiceHelp")}
      </p>
      <p class="help" data-testid="combos-supply-help-goods" data-active=${String(this.fSupplyKind === "goods")}>
        ${t5("ui.supplyGoods")}: ${t5("ui.supplyGoodsHelp")}
      </p>

      <!-- Only a single supply needs a rate of its own: with goods each component brings one. -->
      ${this.fSupplyKind === "service" ? b2`<ion-select mode="md" fill="outline" data-testid="combos-tax-category" label=${t5("ui.fieldTaxCategory")} label-placement="floating"
            .value=${this.fTaxCategory}
            @ionChange=${(e5) => this.fTaxCategory = String(e5.target.value ?? "")}>
            ${this.taxCategories.map((c5) => b2`<ion-select-option value=${c5.key}>${c5.display_name}</ion-select-option>`)}
          </ion-select>
          <p class="help">${t5("ui.fieldTaxCategoryHelp")}</p>` : A}

      <ion-input mode="md" fill="outline" data-testid="combos-order" type="number" min="0"
        label=${t5("ui.fieldOrder")} label-placement="floating" .value=${this.fSortOrder}
        @ionInput=${(e5) => this.fSortOrder = String(e5.target.value ?? "0")}></ion-input>

      <ion-checkbox data-testid="combos-active" .checked=${this.fActive}
        @ionChange=${(e5) => this.fActive = Boolean(e5.target.checked)}>${t5("ui.fieldActive")}</ion-checkbox>

      ${this.blockingButton({
      testid: "combos-save",
      blocked: Boolean(blockedKey),
      label: this.saving ? t5("ui.saving") : t5("ui.save"),
      onClick: () => this.saveCombo()
    })}
      ${this.comboReason ? b2`<p class="reason" data-testid="combos-blocked-reason">${this.comboReason}</p>` : A}
      ${this.comboError ? b2`<ok-inline-feedback data-testid="combos-form-error" tone="danger" icon="alert-circle-outline">${this.comboError}</ok-inline-feedback>` : A}
      ${editing ? b2`<ion-button size="small" data-testid="combos-cancel" @click=${() => this.cancelComboEdit()}>${t5("ui.cancel")}</ion-button>` : A}
    </form>`;
  }
  renderChoices(course) {
    const rows = this.choices[course.group_id] ?? [];
    const manage = can("combos.manage_combo");
    const draft = this.draft(course.group_id);
    const editing = this.editingIn(course.group_id);
    return b2`
      <div class="rule">${t5("ui.optionsTitle")}</div>
      ${rows.length === 0 ? b2`<p class="muted" data-testid=${`combos-course-row-${course.group_id}-choices-empty`}>${t5("ui.optionsEmpty")}</p>` : b2`<ul class="choices">
            ${rows.map((o7, i7) => b2`<li data-testid=${`combos-choice-row-${o7.option_id}`} data-option-id=${o7.option_id}
              data-editing=${String(this.editingChoice?.option_id === o7.option_id)}
              data-dragging=${String(this.drag?.kind === "choice" && this.drag.groupId === course.group_id && this.drag.at === i7)}>
              <span class="name">${this.articleLabel(o7)}</span>
              ${o7.price_delta ? b2`<span class="delta">${erplora().formatMoney(o7.price_delta)}</span>` : A}
              ${manage ? b2`<span class="row-actions">
                    <ion-button size="small" class="icon-btn drag-handle" data-testid=${`combos-choice-row-${o7.option_id}-drag`}
                      aria-label=${t5("ui.dragToReorder")}
                      @pointerdown=${(e5) => this.beginDrag(e5, "choice", course.group_id, o7.option_id)}>
                      <ion-icon name="reorder-three-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button size="small" class="icon-btn" data-testid=${`combos-choice-row-${o7.option_id}-up`} aria-label=${t5("ui.moveUp")}
                      data-blocked=${String(i7 === 0)} aria-disabled=${String(i7 === 0)}
                      @click=${() => this.moveChoice(o7, -1)}>
                      <ion-icon name="arrow-up-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button size="small" class="icon-btn" data-testid=${`combos-choice-row-${o7.option_id}-down`} aria-label=${t5("ui.moveDown")}
                      data-blocked=${String(i7 === rows.length - 1)} aria-disabled=${String(i7 === rows.length - 1)}
                      @click=${() => this.moveChoice(o7, 1)}>
                      <ion-icon name="arrow-down-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button size="small" class="icon-btn" data-testid=${`combos-choice-row-${o7.option_id}-edit`} aria-label=${t5("ui.optionEdit")}
                      @click=${() => this.startEditChoice(o7)}>
                      <ion-icon name="create-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button size="small" class="icon-btn" data-testid=${`combos-choice-row-${o7.option_id}-delete`} aria-label=${t5("ui.optionDelete")}
                      @click=${() => this.deleteChoice(o7)}>
                      <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                  </span>` : A}
            </li>`)}
          </ul>`}

      ${manage ? b2`${editing ? b2`<p class="help" data-testid=${`combos-course-row-${course.group_id}-editing-choice`} data-active="true">
                ${t5("ui.editingChoice", { article: this.articleLabel(editing) })}
              </p>` : A}
          <div class="row">
            <!-- Typeahead over BOTH catalogues. The server searches, so a 500-article shop is
                 reachable; a first page of 50 filtered in the browser would hide the rest. -->
            <ok-combo
              data-testid=${`combos-course-row-${course.group_id}-option-picker`}
              .options=${this.articles}
              .value=${draft.ref}
              .labels=${{ placeholder: t5("ui.optionPickerPlaceholder"), empty: t5("ui.catalogueEmpty") }}
              @ok-input=${(e5) => this.loadCatalogues(e5.detail?.query ?? "")}
              @ok-change=${(e5) => this.patchDraft(course.group_id, { ref: e5.detail?.value ?? "" })}
            ></ok-combo>
            <ion-input mode="md" fill="outline" data-testid=${`combos-course-row-${course.group_id}-option-delta`} type="text" inputmode="decimal"
              label=${t5("ui.optionDelta")} label-placement="floating" .value=${draft.delta}
              @ionInput=${(e5) => this.patchDraft(course.group_id, { delta: String(e5.target.value ?? "") })}
              @ionBlur=${() => this.patchDraft(course.group_id, { delta: normaliseOnBlur(this.draft(course.group_id).delta) })}></ion-input>
            ${this.blockingButton({
      testid: `combos-course-row-${course.group_id}-option-save`,
      blocked: Boolean(this.optionBlockedKey(course.group_id)),
      label: editing ? this.saving ? t5("ui.saving") : t5("ui.save") : t5("ui.optionAdd"),
      onClick: () => this.saveChoice(course.group_id)
    })}
            ${editing ? b2`<ion-button size="small" data-testid=${`combos-course-row-${course.group_id}-option-cancel`} @click=${() => this.cancelEditChoice()}>
                  ${t5("ui.cancel")}
                </ion-button>` : b2`<!-- The other door in, and the one a real catalogue uses: several at once. -->
                <ion-button size="small" data-testid=${`combos-course-row-${course.group_id}-bulk-add`} @click=${() => this.openBulk(course.group_id)}>
                  <ion-icon name="add-outline" slot="start"></ion-icon>${t5("ui.bulkAdd")}
                </ion-button>`}
          </div>
          <p class="help">${t5("ui.optionDeltaHelp")}</p>` : A}

      ${this.optionScope === course.group_id && this.optionReason ? b2`<p class="reason" data-testid=${`combos-course-row-${course.group_id}-option-blocked-reason`}>${this.optionReason}</p>` : A}
      ${this.optionScope === course.group_id && this.optionError ? b2`<ok-inline-feedback data-testid=${`combos-course-row-${course.group_id}-option-error`} tone="danger" icon="alert-circle-outline">${this.optionError}</ok-inline-feedback>` : A}
    `;
  }
  renderCourse(course, index) {
    const manage = can("combos.manage_combo");
    const required = Number(course.min_choices ?? 0) >= 1;
    return b2`<section class="card" data-testid=${`combos-course-row-${course.group_id}`} data-group-id=${course.group_id} data-required=${String(required)}
      data-dragging=${String(this.isDragging("course", index))}>
      <div class="card-head">
        <span class="title">${course.name}</span>
        <span class="badge" data-testid=${`combos-course-row-${course.group_id}-rule`}>${this.courseRule(course)}</span>
        ${manage ? b2`
            <ion-button size="small" class="icon-btn drag-handle" data-testid=${`combos-course-row-${course.group_id}-drag`}
              aria-label=${t5("ui.dragToReorder")}
              @pointerdown=${(e5) => this.beginDrag(e5, "course", "", course.group_id)}>
              <ion-icon name="reorder-three-outline" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button size="small" class="icon-btn" data-testid=${`combos-course-row-${course.group_id}-up`} aria-label=${t5("ui.moveUp")}
              data-blocked=${String(index === 0)} aria-disabled=${String(index === 0)}
              @click=${() => this.moveCourse(course, -1)}>
              <ion-icon name="arrow-up-outline" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button size="small" class="icon-btn" data-testid=${`combos-course-row-${course.group_id}-down`} aria-label=${t5("ui.moveDown")}
              data-blocked=${String(index === this.courses.length - 1)} aria-disabled=${String(index === this.courses.length - 1)}
              @click=${() => this.moveCourse(course, 1)}>
              <ion-icon name="arrow-down-outline" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button size="small" data-testid=${`combos-course-row-${course.group_id}-edit`} @click=${() => this.startEditCourse(course)}>${t5("ui.actionEdit")}</ion-button>
            <ion-button size="small" data-tone="danger" data-testid=${`combos-course-row-${course.group_id}-delete`} @click=${() => this.deleteCourse(course)}>${t5("ui.actionDelete")}</ion-button>` : A}
      </div>
      ${this.renderChoices(course)}
    </section>`;
  }
  /**
   * The bulk picker, as Lightspeed K-Series ships it: a pop-up with its own SERVER-side filter, a
   * checkbox per row, and a primary button that says how many articles are going in.
   *
   * TWO THINGS ABOUT `ion-modal` THAT ARE NOT OPTIONAL, both measured in Chromium on the built
   * bundle, because neither is visible from the source:
   *
   *  1. IT IS REPARENTED TO `<body>` when it presents, so this component's stylesheet does NOT
   *     reach anything inside it. Everything in here is an Ionic primitive or carries its own
   *     inline style — the same rule `services`' own modals already follow.
   *  2. THE ELEMENT AND ITS WHOLE BODY STAY IN THE TEMPLATE, ALWAYS. Only `isOpen` moves.
   *     Rendering the modal only while open left it FROZEN ON SCREEN after a confirmed bulk add —
   *     still saying «Guardando…», with the course already updated behind it: once Ionic has moved
   *     the element out, taking it out of the Lit template takes out nothing, and nothing dismisses
   *     it. Swapping only the BODY for `nothing` was not enough either: the old rows were left
   *     orphaned in `<body>` and the next open painted a SECOND catalogue beside them (14 rows for
   *     7 articles, three flagged as already-added inside a course with no choices). Lit updates
   *     the row list happily while the modal is presented — 7 to 1 to 7 across a search, measured;
   *     what it does not survive is the subtree appearing and disappearing under Ionic's feet.
   *     It is rendered from `render()` and not from the builder for the same reason: leaving the
   *     menu would remove it mid-animation.
   */
  renderBulkPicker() {
    const groupId = this.bulkFor;
    const already = new Set((this.choices[groupId] ?? []).map((o7) => `${o7.source}:${o7.source_ref}`));
    const picked = new Set(this.bulkPicked);
    const n6 = this.bulkPicked.length;
    return b2`<ion-modal data-testid="combos-bulk-picker" .isOpen=${Boolean(groupId)}
      @ionModalDidDismiss=${() => this.closeBulk()}>
      <ion-header class="ion-no-border">
        <ion-toolbar>
          <ion-title>${t5("ui.bulkTitle")}</ion-title>
          <ion-buttons slot="end">
            <ion-button data-testid="combos-bulk-cancel" @click=${() => this.closeBulk()}>${t5("ui.cancel")}</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-searchbar data-testid="combos-bulk-search" .value=${this.bulkQuery}
          placeholder=${t5("ui.optionPickerPlaceholder")}
          @ionInput=${(e5) => this.searchBulk(String(e5.target.value ?? ""))}></ion-searchbar>

        ${this.catalogueError ? b2`<ok-inline-feedback data-testid="combos-bulk-catalogue-error" tone="danger" icon="alert-circle-outline">${this.catalogueError}</ok-inline-feedback>` : this.articles.length === 0 ? b2`<p data-testid="combos-bulk-empty">${this.missingCatalogues.length ? this.missingCatalogues.map((k2) => t5("ui.catalogueMissing", { module: t5(k2) })).join(" ") : t5("ui.catalogueEmpty")}</p>` : b2`<ion-list lines="full">
                ${this.articles.map((a3) => {
      const owned = already.has(a3.value);
      return b2`<ion-item data-testid=${`combos-bulk-row-${a3.value}`} data-ref=${a3.value} data-already=${String(owned)}
                    style=${owned ? "opacity:.55" : ""}>
                    <ion-checkbox data-testid=${`combos-bulk-row-${a3.value}-pick`}
                      .checked=${owned || picked.has(a3.value)}
                      aria-disabled=${String(owned)}
                      @ionChange=${(e5) => this.tickBulk(a3.value, owned, Boolean(e5.target.checked))}
                    >${a3.label}</ion-checkbox>
                    <!-- Two catalogues in one list: which one a row comes from has to be readable,
                         or a product and a service with the same name are the same row. -->
                    <span slot="end">${owned ? t5("ui.bulkAlready") : t5(a3.value.startsWith("service:") ? "ui.sourceService" : "ui.sourceProduct")}</span>
                  </ion-item>`;
    })}
              </ion-list>`}

        <!-- Blocked, never natively disabled: Ionic implements disabled as pointer-events:none, so
             the tap dies and the reason with it. (No backticks in an HTML comment inside an html
             tagged template: one would CLOSE the template and break the whole component.) -->
        <ion-button class="ion-margin-top" expand="block" data-testid="combos-bulk-confirm"
          data-blocked=${String(n6 === 0)} aria-disabled=${String(n6 === 0)}
          style=${n6 === 0 ? "opacity:.55" : ""}
          @click=${() => this.confirmBulk()}
        >${this.saving ? t5("ui.saving") : t5("ui.bulkAddCount", { n: n6 })}</ion-button>
        ${this.bulkReason ? b2`<p data-testid="combos-bulk-blocked-reason" style="color:var(--ion-color-danger,#c5000f);font-size:.85rem;">${this.bulkReason}</p>` : A}
      </ion-content>
    </ion-modal>`;
  }
  renderCourseForm() {
    if (!can("combos.manage_combo")) return A;
    const blockedKey = this.courseBlockedKey;
    return b2`<section class="card">
      <div class="form">
        <span class="title">${this.editingCourse ? t5("ui.editCourse", { name: this.editingCourse.name }) : t5("ui.newCourse")}</span>
        <div class="row">
          <ion-input mode="md" fill="outline" data-testid="combos-course-name" label=${t5("ui.fieldCourseName")} label-placement="floating"
            .value=${this.cName}
            @ionInput=${(e5) => this.cName = String(e5.target.value ?? "")}></ion-input>
          <ion-input mode="md" fill="outline" data-testid="combos-course-min" type="number" min="0"
            label=${t5("ui.fieldMin")} label-placement="floating" .value=${this.cMin}
            @ionInput=${(e5) => this.cMin = String(e5.target.value ?? "0")}></ion-input>
          <ion-input mode="md" fill="outline" data-testid="combos-course-max" type="number" min="0"
            label=${t5("ui.fieldMax")} label-placement="floating" .value=${this.cMax}
            @ionInput=${(e5) => this.cMax = String(e5.target.value ?? "0")}></ion-input>
        </div>
        <p class="help">${t5("ui.fieldMinHelp")}</p>
        <p class="help">${t5("ui.fieldMaxHelp")}</p>
        <ion-checkbox data-testid="combos-course-repeat" .checked=${this.cRepeat}
          @ionChange=${(e5) => this.cRepeat = Boolean(e5.target.checked)}>${t5("ui.fieldRepeat")}</ion-checkbox>
        <div class="row">
          ${this.blockingButton({
      testid: "combos-course-save",
      blocked: Boolean(blockedKey),
      label: this.saving ? t5("ui.saving") : t5("ui.save"),
      onClick: () => this.saveCourse()
    })}
          ${this.editingCourse ? b2`<ion-button size="small" data-testid="combos-course-cancel" @click=${() => this.resetCourseForm()}>${t5("ui.cancel")}</ion-button>` : A}
        </div>
        ${this.courseReason ? b2`<p class="reason" data-testid="combos-course-blocked-reason">${this.courseReason}</p>` : A}
        ${this.courseError ? b2`<ok-inline-feedback data-testid="combos-course-error" tone="danger" icon="alert-circle-outline">${this.courseError}</ok-inline-feedback>` : A}
      </div>
    </section>`;
  }
  renderBuilder(combo) {
    const goods = combo.supply_kind === "goods";
    return b2`<div class="builder">
      <div class="menu-head">
        <ion-button size="small" data-testid="combos-back" @click=${() => this.backToList()}>
          <ion-icon name="arrow-back-outline" slot="start"></ion-icon>${t5("ui.back")}
        </ion-button>
        <span class="name">${combo.name}</span>
        <span class="price">${erplora().formatMoney(Number(combo.price ?? 0))}</span>
      </div>

      <!-- What this menu will DO on the receipt, said before anybody discovers it on an invoice. -->
      <ok-inline-feedback data-testid="combos-supply-consequence" tone=${goods ? "warning" : "info"} icon="receipt-outline">
        ${goods ? t5("ui.supplyGoodsWarning") : t5("ui.supplyServiceWarning")}
      </ok-inline-feedback>

      ${this.missingCatalogues.length ? b2`<ok-inline-feedback data-testid="combos-catalogue-missing" tone="warning" icon="alert-circle-outline">
            ${this.missingCatalogues.map((k2) => t5("ui.catalogueMissing", { module: t5(k2) })).join(" ")}
          </ok-inline-feedback>` : A}

      <!-- A catalogue that FAILED, said out loud. Swallowed it looks exactly like an empty one. -->
      ${this.catalogueError ? b2`<ok-inline-feedback data-testid="combos-catalogue-error" tone="danger" icon="alert-circle-outline">
            ${this.catalogueError}
          </ok-inline-feedback>` : A}
      ${this.taxCategoriesError ? b2`<ok-inline-feedback data-testid="combos-tax-categories-error" tone="danger" icon="alert-circle-outline">
            ${this.taxCategoriesError}
          </ok-inline-feedback>` : A}

      <div class="builder-body">
        <div>
          <div class="card-head"><span class="title">${t5("ui.coursesTitle")}</span></div>
          <p class="help">${t5("ui.coursesHelp")}</p>
        </div>

        ${this.coursesLoading ? b2`<p class="muted" data-testid="combos-courses-loading">${t5("ui.coursesLoading")}</p>` : this.coursesError ? b2`<ok-inline-feedback data-testid="combos-courses-error" tone="danger" icon="alert-circle-outline">${this.coursesError}</ok-inline-feedback>` : this.courses.length === 0 ? b2`<p class="muted" data-testid="combos-courses-empty">${t5("ui.coursesEmpty")}</p>` : this.courses.map((c5, i7) => this.renderCourse(c5, i7))}

        ${this.coursesLoading ? A : this.renderCourseForm()}
      </div>
    </div>`;
  }
  render() {
    if (this.openCombo) {
      return b2`<div class="page">${this.renderBuilder(this.openCombo)}</div>${this.renderBulkPicker()}`;
    }
    return b2`<div class="page">
      ${this.comboError ? b2`<ok-inline-feedback data-testid="combos-error" tone="danger" icon="alert-circle-outline">${this.comboError}</ok-inline-feedback>` : A}
      ${this.ctrl?.error ? b2`<ok-inline-feedback data-testid="combos-list-error" tone="danger" icon="alert-circle-outline">${this.ctrl.error}</ok-inline-feedback>` : A}
      <ok-data-table testid="combos-table"
        .serverSide=${true}
        .fill=${true}
        .labels=${dataTableLabels(erplora().locale)}
        .views=${true}
        .cardTitle=${(r6) => String(r6.name ?? "\u2014")}
        .cardIcon=${() => "restaurant-outline"}
        .addable=${can("combos.manage_combo")}
        .columns=${this.columns}
        .rows=${this.ctrl?.rows ?? []}
        .total=${this.ctrl?.total ?? 0}
        .page=${this.ctrl?.state.page ?? 0}
        .pageSize=${this.ctrl?.state.pageSize ?? 50}
        .sort=${this.ctrl?.state.sort}
        .sortDir=${this.ctrl?.state.dir ?? "asc"}
        .searchable=${true}
        .searchPlaceholder=${t5("ui.searchMenu")}
        .actions=${this.rowActions}
        .rowClickable=${true}
        .emptyMessage=${this.ctrl?.loading ? t5("ui.loading") : t5("ui.emptyMenus")}
        @rowAction=${(e5) => {
      const combo = e5.detail.row;
      if (e5.detail.actionId === "edit") this.startEditCombo(combo);
      if (e5.detail.actionId === "delete") this.deleteCombo(combo);
    }}
        @rowClick=${(e5) => this.openBuilder(e5.detail.row)}
        @pageChange=${(e5) => this.ctrl.setPage(e5.detail)}
        @pageSizeChange=${(e5) => this.ctrl.setPageSize(e5.detail)}
        @sortChange=${(e5) => this.ctrl.setSort(e5.detail.sort, e5.detail.dir)}
        @searchChange=${(e5) => this.ctrl.setSearch(e5.detail)}
        @filterChange=${(e5) => this.ctrl.setFilter(e5.detail.col, e5.detail.value)}
      >
        ${this.renderComboForm()}
      </ok-data-table>
    </div>${this.renderBulkPicker()}`;
  }
};
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "openCombo", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "editing", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "editTitleInHeader", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "fName", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "fKitchenName", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "fPrice", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "fTaxCategory", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "fSupplyKind", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "fActive", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "fSortOrder", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "comboReason", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "comboError", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "courses", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "coursesLoading", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "coursesError", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "choices", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "editingCourse", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "cName", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "cMin", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "cMax", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "cRepeat", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "courseReason", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "courseError", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "optionDraft", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "editingChoice", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "optionScope", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "optionReason", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "optionError", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "bulkFor", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "bulkQuery", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "bulkPicked", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "bulkReason", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "articles", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "missingCatalogues", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "catalogueError", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "taxCategories", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "taxCategoriesError", 2);
__decorateClass([
  r5()
], ErpCombosMenus.prototype, "saving", 2);
define("erp-combos-menus", ErpCombosMenus);
export {
  ErpCombosMenus,
  dropIndexAt
};
