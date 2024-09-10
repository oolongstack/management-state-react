interface Props {
  count: number
}
function PropDrilling() {
  return <ComponentA />
}

function ComponentA() {
  const count = 10
  return <ComponentB count={count} />
}

function ComponentB({ count }: Props) {
  return <ComponentC count={count} />
}

function ComponentC({ count }: Props) {
  return <ComponentD count={count} />
}

function ComponentD({ count }: Props) {
  return <ComponentE count={count} />
}

function ComponentE({ count }: Props) {
  return <div>{count}</div>
}

export default PropDrilling
