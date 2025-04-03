import { createElement } from "./createElement.js";
import { updateAttributes } from "../utils/updateAttributes.js";

/**
 * updateElement:
 * - 이전 VNode(oldNode)와 새로운 VNode(newNode)를 비교하여
 *   DOM을 최소한으로 수정(diff & patch)하는 함수
 * - DOM 조작은 parentElement를 기준으로 수행됨
 *
 * - parentElement: DOM 상의 부모 노드
 * - newNode: 새로운 VNode (렌더링 결과)
 * - oldNode: 이전 VNode (이전 상태 저장된 것)
 * - index: 현재 비교 중인 자식의 인덱스
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentElement = parentElement.childNodes[index];

  // 노드 삭제: 새로운 노드가 없고 이전 노드는 존재 → 삭제
  if (!newNode && oldNode) {
    return parentElement.removeChild(currentElement);
  }

  // 노드 추가: 이전 노드는 없고 새로운 노드만 존재 → 추가
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 텍스트 노드 변경
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return; // 값이 같으면 변경 없음
    currentElement.textContent = newNode; // 값이 다르면 텍스트 교체
    return;
  }

  // 타입이 다르면 → 완전히 새로 교체
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(createElement(newNode), currentElement);
  }

  // 속성과 이벤트 핸들러 비교 → 필요한 것만 업데이트
  updateAttributes(currentElement, newNode.props || {}, oldNode.props || {});

  // 자식 노드들 비교 (재귀적으로 호출)
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(currentElement, newChildren[i], oldChildren[i], i);
  }
}
