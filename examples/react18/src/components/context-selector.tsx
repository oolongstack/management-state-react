// 注意 use-context-selector 在react18.3.1中表现不一致
import { useState } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'
interface PersonContextType {
  firstName: string
  lastName: string
  setFirstName: (firstName: string) => void
  setLastName: (lastName: string) => void
}
const PersonContext = createContext<PersonContextType>({
  firstName: '',
  lastName: '',
  setFirstName: () => {},
  setLastName: () => {},
})
function ContextSelector() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  return (
    <PersonContext.Provider
      value={{ firstName, lastName, setFirstName, setLastName }}
    >
      <ComponentA />
      <ComponentB />
    </PersonContext.Provider>
  )
}

function ComponentA() {
  console.log('ComponentA rerender')

  const setFirstName = useContextSelector(
    PersonContext,
    (context) => context.setFirstName,
  )

  const firstName = useContextSelector(
    PersonContext,
    (context) => context.firstName,
  )

  return (
    <div>
      ComponentA
      <br />
      <div>firstName: {firstName}</div>
      <button onClick={() => setFirstName('John')}>set firstName</button>
    </div>
  )
}

function ComponentB() {
  console.log('ComponentB rerender')
  const lastName = useContextSelector(
    PersonContext,
    (context) => context.lastName,
  )
  return (
    <div>
      ComponentB
      <br />
      <div>lastName: {lastName}</div>
    </div>
  )
}

export default ContextSelector
