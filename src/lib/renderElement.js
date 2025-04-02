import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalized = normalizeVNode(vNode);

  if (!container._prevVNode) {
    const dom = createElement(normalized);
    container.replaceChildren(dom);
  } else {
    updateElement(container, normalized, container._prevVNode);
  }

  container._prevVNode = normalized;
  setupEventListeners(container);
}
