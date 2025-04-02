import { updateAttributes } from "../utils/updateAttributes";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((child) => fragment.appendChild(createElement(child)));
    return fragment;
  }

  if (typeof vNode?.type === "function") {
    throw new Error(
      "컴포넌트는 createElement에서 처리하면 안 됩니다. normalizeVNode를 먼저 거쳐야 합니다.",
    );
  }

  const $el = document.createElement(vNode.type);

  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }

  if (vNode.children) {
    const children = Array.isArray(vNode.children)
      ? vNode.children
      : [vNode.children];

    children.forEach((child) => {
      $el.appendChild(createElement(child));
    });
  }

  return $el;
}
