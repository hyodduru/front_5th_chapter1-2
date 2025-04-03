import { addEvent, removeEvent } from "../lib";

/**
 * updateAttributes:
 * - 실제 DOM 요소($el)의 속성 및 이벤트 핸들러를
 *   새로운 props(newProps) 기준으로 업데이트하는 함수
 *
 * $el: 업데이트 대상 DOM 요소
 * newProps: 새롭게 적용할 props
 * oldProps: 이전 렌더링 시점의 props
 */
export function updateAttributes($el, newProps = {}, oldProps = {}) {
  // 새로운 속성 추가 또는 값 변경
  for (const [key, value] of Object.entries(newProps)) {
    // 값이 이전과 동일하면 무시 (변경 없음)
    if (oldProps[key] === value) continue;

    // 이벤트 핸들러 처리
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();

      // 이전 핸들러가 있으면 제거 후 새 핸들러 등록
      if (oldProps[key]) {
        removeEvent($el, eventType, oldProps[key]);
      }
      addEvent($el, eventType, value);
    }
    // className → HTML에서는 class로 변환
    else if (key === "className") {
      $el.setAttribute("class", value);
    }
    // 일반 속성 (id, type, data-*, etc.)
    else {
      $el.setAttribute(key, value);
    }
  }

  // 이전에 있었지만 새 props에는 없는 속성 → 제거
  for (const key of Object.keys(oldProps)) {
    if (newProps[key] !== undefined) continue;

    // 이벤트 핸들러 제거
    if (key.startsWith("on") && typeof oldProps[key] === "function") {
      const eventType = key.slice(2).toLowerCase();
      removeEvent($el, eventType, oldProps[key]);
    }
    // 일반 속성 제거
    else {
      $el.removeAttribute(key);
    }
  }
}
