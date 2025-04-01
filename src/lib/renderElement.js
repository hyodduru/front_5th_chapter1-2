import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalized = normalizeVNode(vNode);
  const isCreate = !container._prevVNode;

  if (isCreate) {
    const dom = createElement(normalized);
    container.replaceChildren(dom);
  } else {
    updateElement(
      container.firstChild,
      normalized.props,
      container._prevVNode.props,
    );
    container.replaceChild(createElement(normalized), container.firstChild);
  }

  container._prevVNode = normalized;

  setupEventListeners(container);
}
