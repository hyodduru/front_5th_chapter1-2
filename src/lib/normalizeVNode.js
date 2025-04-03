/**
 * 다양한 형태의 vNode 값을 HTML로 렌더링 가능한 형태로 정리(normalize)하는 함수
 * - 문자열/숫자/배열/함수형 컴포넌트/object 형태를 모두 처리
 */
export function normalizeVNode(vNode) {
  // null, undefined, boolean 값은 렌더링하지 않으므로 빈 문자열로 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 문자열과 숫자는 그대로 문자열로 변환 (텍스트 노드)
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 배열일 경우: 각각의 항목을 재귀적으로 normalize하고 평탄화 + 불필요한 값 제거
  if (Array.isArray(vNode)) {
    return vNode
      .map((item) => normalizeVNode(item)) // 재귀 정규화
      .flat() // 중첩 배열 펼치기
      .filter(
        (child) =>
          child !== null && child !== undefined && typeof child !== "boolean", // 불필요한 값 제거
      );
  }

  // 함수형 컴포넌트일 경우: props를 전달해서 결과 vNode를 받아 normalize 처리
  if (typeof vNode.type === "function") {
    const props = { children: vNode.children, ...(vNode.props ?? {}) };
    const renderedVNode = vNode.type(props); // 컴포넌트 실행
    return normalizeVNode(renderedVNode); // 재귀 처리
  }

  // 일반 VNode 객체일 경우: children 속성도 normalize 처리
  if (typeof vNode === "object" && "children" in vNode) {
    return {
      ...vNode,
      children: normalizeVNode(vNode.children), // 재귀 정리
    };
  }

  // 위 조건에 모두 해당하지 않으면 그대로 반환
  return vNode;
}
