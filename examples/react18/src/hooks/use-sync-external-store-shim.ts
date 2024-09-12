/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useLayoutEffect, useState } from 'react'

const is = Object.is

export function useSyncExternalStore<T>(
  subscribe: (listener: () => void) => () => void,
  getSnapshot: () => T,
  getServerSnapshot?: () => T,
): T {
  const value = getSnapshot()
  const [{ inst }, forceUpdate] = useState({ inst: { value, getSnapshot } })

  useLayoutEffect(() => {
    inst.value = value
    inst.getSnapshot = getSnapshot
    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({ inst })
    }
  }, [subscribe, value, getSnapshot])

  useEffect(() => {
    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({ inst })
    }
    const handleStoreChange = () => {
      // 这里做了性能优化，会判断前后状态是否变化，如果没有变化则不会re-render
      if (checkIfSnapshotChanged(inst)) {
        forceUpdate({ inst })
      }
    }
    // 订阅，把handleStoreChange传入到订阅函数subscribe中，最终在状态管理库中会调用handleStoreChange来触发re-render
    // 这里是关键 外部store setState之后会执行handleStoreChange
    return subscribe(handleStoreChange)
  }, [subscribe])

  return value
}

function checkIfSnapshotChanged<T>(inst: {
  value: T
  getSnapshot: () => T
}): boolean {
  const latestGetSnapshot = inst.getSnapshot
  const prevValue = inst.value
  try {
    const nextValue = latestGetSnapshot()
    return !is(prevValue, nextValue)
  } catch (error) {
    console.log('error: ', error)
    return true
  }
}

//usage
interface State {
  count: number
}
interface Listener {
  (): void
}
const store = {
  state: { count: 0 },
  listeners: new Set<Listener>(),
  setState(newState: State) {
    this.state = newState
    // 触发订阅该store的组件re-render
    this.listeners.forEach((listener: Listener) => listener())
  },
  subscribe(listener: Listener) {
    this.listeners.add(listener)
    // 取消订阅
    return () => this.listeners.delete(listener)
  },
  getState() {
    return this.state
  },
}

function useStore() {
  const value = useSyncExternalStore(
    (listener) => store.subscribe(listener),
    store.getState,
    store.getState,
  )
}
