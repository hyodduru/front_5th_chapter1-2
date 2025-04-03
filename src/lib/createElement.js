import { updateAttributes } from "../utils/updateAttributes";

/**
 * createElement: VNode를 실제 DOM 요소로 변환하는 함수
 * - 문자열, 숫자, 배열, 일반 태그 등 다양한 형태의 VNode를 처리함
 * - 함수형 컴포넌트는 허용하지 않고, normalizeVNode에서 미리 처리되어야 함
 */
export function createElement(vNode) {
  // null, undefined, boolean → 빈 텍스트 노드로 처리 (렌더링 무시)
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 문자열, 숫자 → 텍스트 노드로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // 배열일 경우: 각 항목을 createElement로 변환해 DocumentFragment에 추가
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((child) => fragment.appendChild(createElement(child)));
    return fragment;
  }

  // 함수형 컴포넌트가 남아있으면 예외 발생 (normalizeVNode로 미리 처리되어야 함)
  if (typeof vNode?.type === "function") {
    throw new Error(
      "컴포넌트는 createElement에서 처리하면 안 됩니다. normalizeVNode를 먼저 거쳐야 합니다.",
    );
  }

  // 일반 DOM 요소 생성 (예: div, button 등)
  const $el = document.createElement(vNode.type);

  // props가 있다면 속성/이벤트 핸들러 등록
  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }

  // children이 있다면 재귀적으로 자식 요소도 DOM으로 생성 후 추가
  if (vNode.children) {
    const children = Array.isArray(vNode.children)
      ? vNode.children
      : [vNode.children]; // 단일 자식도 배열로 변환

    children.forEach((child) => {
      $el.appendChild(createElement(child));
    });
  }

  // 완성된 DOM 요소 반환
  return $el;
}
