import { addEvent, removeEvent } from "../lib";

// 이벤트 핸들러와 일반 속성을 구분하여 처리
export function updateAttributes($el, newProps = {}, oldProps = {}) {
  // 새로운 속성 추가/변경
  for (const [key, value] of Object.entries(newProps)) {
    if (oldProps[key] === value) continue;

    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      if (oldProps[key]) {
        removeEvent($el, eventType, oldProps[key]);
      }
      addEvent($el, eventType, value);
    } else if (key === "className") {
      $el.setAttribute("class", value);
    } else {
      $el.setAttribute(key, value);
    }
  }

  // 제거된 속성 삭제
  for (const key of Object.keys(oldProps)) {
    if (newProps[key] !== undefined) continue;

    if (key.startsWith("on") && typeof oldProps[key] === "function") {
      const eventType = key.slice(2).toLowerCase();
      removeEvent($el, eventType, oldProps[key]);
    } else {
      $el.removeAttribute(key);
    }
  }
}
