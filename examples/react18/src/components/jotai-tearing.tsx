import { atom, useAtomValue, useSetAtom } from 'jotai'
import { startTransition } from 'react'

const store = atom({
  counter: 0,
})
function Controller() {
  const dispatch = useSetAtom(store)
  const add = () => {
    startTransition(() => {
      dispatch((state) => ({
        counter: state.counter + 1,
      }))
    })
  }
  return <button onClick={add}>+1</button>
}

function Counter() {
  const { counter } = useAtomValue(store)
  const start = performance.now()
  while (performance.now() - start < 20) {
    // TODO
  }
  return <div>{counter}</div>
}

export default function JotaiTearing() {
  return (
    <>
      <Controller />
      {Array(15)
        .fill(0)
        .map(() => (
          <Counter />
        ))}
    </>
  )
}
