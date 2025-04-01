export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (Array.isArray(vNode)) {
    return vNode
      .map((item) => normalizeVNode(item))
      .flat()
      .filter(
        (child) =>
          child !== null && child !== undefined && typeof child !== "boolean",
      );
  }

  if (typeof vNode.type === "function") {
    const props = { children: vNode.children, ...(vNode.props ?? {}) };
    const renderedVNode = vNode.type(props);
    return normalizeVNode(renderedVNode);
  }

  if (typeof vNode === "object" && "children" in vNode) {
    return {
      ...vNode,
      children: normalizeVNode(vNode.children),
    };
  }

  return vNode;
}
