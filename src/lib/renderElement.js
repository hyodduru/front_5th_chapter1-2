import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

/**
 * renderElement: VNode를 실제 DOM container에 렌더링하는 핵심 함수
 * - 최초 렌더: DOM을 새로 생성해서 교체
 * - 이후 렌더: 기존 VNode와 비교해서 변경된 부분만 업데이트
 * - 이벤트 위임도 container 기준으로 등록
 */
export function renderElement(vNode, container) {
  // VNode를 정규화 (함수형 컴포넌트 실행, 배열 정리, 불필요한 값 제거 등)
  const normalized = normalizeVNode(vNode);

  // 최초 렌더인 경우 (기존 VNode가 없으면)
  if (!container._prevVNode) {
    const dom = createElement(normalized); // VNode → 실제 DOM 변환
    container.replaceChildren(dom); // 기존 DOM 제거 후 새로 교체
  } else {
    // 두 번째 이상 렌더인 경우 → diff & patch
    updateElement(container, normalized, container._prevVNode);
  }

  // 현재 VNode를 다음 렌더링 비교용으로 저장
  container._prevVNode = normalized;

  // container 기준으로 이벤트 위임 등록 (중복 방지됨)
  setupEventListeners(container);
}
