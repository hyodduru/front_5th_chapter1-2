// ✅ 이벤트 중복 등록을 방지하기 위해 root 기준으로 관리
const registeredRoots = new WeakSet();

export function setupEventListeners(root) {
  if (registeredRoots.has(root)) return;
  registeredRoots.add(root);

  const supportedEvents = ["click", "input", "change", "submit"];

  supportedEvents.forEach((eventType) => {
    root.addEventListener(eventType, (e) => {
      const path = e.composedPath();

      for (const el of path) {
        if (el === root) break;
        if (!el.isConnected) continue;

        const elementMap = eventsMap.get(eventType);
        if (!elementMap) continue;

        const handlers = elementMap.get(el);
        if (!handlers) continue;

        handlers.forEach((handler) => handler(e));
        break; // 버블링 멈추기
      }
    });
  });
}

const eventsMap = new Map();

export function addEvent(element, eventType, handler) {
  if (!eventsMap.has(eventType)) {
    eventsMap.set(eventType, new Map());
  }

  const elementMap = eventsMap.get(eventType);

  if (!elementMap.has(element)) {
    elementMap.set(element, new Set());
  }

  const handlers = elementMap.get(element);

  // ✅ 중복 등록 방지
  if (handlers.has(handler)) return;

  handlers.add(handler);
}

export function removeEvent(element, eventType, handler) {
  const elementMap = eventsMap.get(eventType);
  if (!elementMap) return;

  const handlers = elementMap.get(element);
  if (!handlers) return;

  handlers.delete(handler);

  if (handlers.size === 0) {
    elementMap.delete(element);
  }

  if (elementMap.size === 0) {
    eventsMap.delete(eventType);
  }
}
