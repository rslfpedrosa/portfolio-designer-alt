type Setter = (label: string | null) => void
let setter: Setter | null = null

export const registerCursorSetter = (fn: Setter) => { setter = fn }
export const unregisterCursorSetter = () => { setter = null }
export const setCursorLabel = (label: string | null) => setter?.(label)
