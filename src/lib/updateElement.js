import { createElement } from "./createElement.js";
import { updateAttributes } from "../utils/updateAttributes.js";

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentElement = parentElement.childNodes[index];

  // 삭제
  if (!newNode && oldNode) {
    return parentElement.removeChild(currentElement);
  }

  // 추가
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 텍스트 노드 처리
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    currentElement.textContent = newNode;
    return;
  }

  // 타입 다를 때 교체
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(createElement(newNode), currentElement);
  }

  // 속성 및 이벤트 업데이트
  updateAttributes(currentElement, newNode.props || {}, oldNode.props || {});

  // 자식 처리
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(currentElement, newChildren[i], oldChildren[i], i);
  }
}
