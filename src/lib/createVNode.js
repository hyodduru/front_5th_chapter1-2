/**
 * createVNode: JSX에서 호출되는 핵심 함수로, VNode 객체를 생성함
 * - type: 태그 이름 또는 컴포넌트 함수
 * - props: 엘리먼트의 속성 (attributes, 이벤트 핸들러 등)
 * - children: 자식 노드들 (JSX 내부 요소들)
 */
export function createVNode(type, props, ...children) {
  const flatChildren = children
    .flat(Infinity)
    .filter(
      (child) =>
        child !== null && child !== undefined && typeof child !== "boolean",
    );

  return { type, props, children: flatChildren };
}
