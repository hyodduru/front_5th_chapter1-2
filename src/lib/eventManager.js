// 이벤트 위임을 위한 root 등록 추적용 (중복 방지)
const registeredRoots = new WeakSet();

// 전체 이벤트 타입 → element → handler Set 구조로 저장
const eventsMap = new Map();

// 각 root마다 어떤 eventType이 등록되었는지 추적
const rootEventMap = new WeakMap();
/**
 * 특정 root에 특정 eventType 리스너를 등록 (위임 방식)
 */
export function setupEventListeners(root, eventType) {
  // 처음 등록되는 root라면 초기화
  if (!registeredRoots.has(root)) {
    registeredRoots.add(root);
    rootEventMap.set(root, new Set());
  }

  const registeredEvents = rootEventMap.get(root);

  // 이미 등록된 이벤트라면 중복 등록 방지
  if (registeredEvents.has(eventType)) return;

  // 이벤트 최초 등록
  registeredEvents.add(eventType);

  // 실제 이벤트 위임 리스너 등록
  root.addEventListener(eventType, (e) => {
    const path = e.composedPath?.();

    // 이벤트 버블링 경로를 순회하며, 일치하는 엘리먼트가 있으면 핸들러 호출
    for (const el of path) {
      if (el === root) break; // 루트까지 올라왔으면 종료
      if (!el.isConnected) continue; // DOM에 없는 경우 무시

      const elementMap = eventsMap.get(eventType);
      if (!elementMap) continue;

      const handlers = elementMap.get(el);
      if (!handlers) continue;

      // 해당 엘리먼트의 모든 핸들러 호출
      handlers.forEach((handler) => handler(e));
      break; // 한 번 처리했으면 버블링 멈춤
    }
  });
}

/**
 * 특정 엘리먼트에 특정 이벤트 핸들러 등록
 * - 내부적으로 root에 해당 이벤트 타입이 등록되어 있는지도 확인
 */
export function addEvent(element, eventType, handler, root = document.body) {
  setupEventListeners(root, eventType); // 해당 이벤트 리스너 root에 자동 등록

  if (!eventsMap.has(eventType)) {
    eventsMap.set(eventType, new Map());
  }

  const elementMap = eventsMap.get(eventType);

  if (!elementMap.has(element)) {
    elementMap.set(element, new Set());
  }

  const handlers = elementMap.get(element);

  if (handlers.has(handler)) return;

  handlers.add(handler);
}

/**
 * 특정 엘리먼트의 특정 이벤트 핸들러 제거
 * - 핸들러가 모두 제거되면 관련 정보도 정리
 */
export function removeEvent(element, eventType, handler) {
  const elementMap = eventsMap.get(eventType);
  if (!elementMap) return;

  const handlers = elementMap.get(element);
  if (!handlers) return;

  handlers.delete(handler);

  // 핸들러가 모두 제거되면 엘리먼트 제거
  if (handlers.size === 0) {
    elementMap.delete(element);
  }

  // 엘리먼트 맵도 비면 전체 이벤트 타입 제거
  if (elementMap.size === 0) {
    eventsMap.delete(eventType);
  }
}
