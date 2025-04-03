/**
 * createVNode: JSX에서 호출되는 핵심 함수로, VNode 객체를 생성함
 * - type: 태그 이름 또는 컴포넌트 함수
 * - props: 엘리먼트의 속성 (attributes, 이벤트 핸들러 등)
 * - children: 자식 노드들 (JSX 내부 요소들)
 */
export function createVNode(type, props, ...children) {
  // children은 중첩 배열일 수 있으므로 평탄화 (ex. 조건부 렌더링, map 등)
  const flatChildren = children
    .flat(Infinity) // 깊은 중첩 배열까지 모두 펼치기
    .filter(
      (child) =>
        child !== null && child !== undefined && typeof child !== "boolean", // 렌더링 불필요한 값 제거
    );

  // VNode 객체 반환
  return { type, props, children: flatChildren };
}
