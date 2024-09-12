import { CloseOutlined } from '@ant-design/icons'
import { a, useTransition } from '@react-spring/web'
import { Radio, RadioChangeEvent } from 'antd'
import { SyntheticEvent } from 'react'
import { create } from 'zustand'

type Todo = {
  title: string
  completed: boolean
  id: number
}
interface State {
  filter: string
  todos: Todo[]
  setFilter(filter: string): void
  setTodos(fn: (todos: Todo[]) => Todo[]): void
}

const useStore = create<State>((set) => ({
  filter: 'all',
  todos: [],
  setFilter(filter) {
    set({ filter })
  },
  setTodos(fn) {
    set((prev) => ({ todos: fn(prev.todos) }))
  },
}))

let keyCount = 0
function Zustand() {
  const { setTodos } = useStore()
  const add = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const title = e.currentTarget.inputTitle.value
    e.currentTarget.inputTitle.value = ''

    setTodos((prevTodos) => [
      ...prevTodos,
      { title, completed: false, id: keyCount++ },
    ])
  }
  return (
    <div>
      <form onSubmit={add}>
        <Filter />
        <input name="inputTitle" placeholder="Type ..." />
        <Filtered />
      </form>
    </div>
  )
}

const Filter = () => {
  const { filter, setFilter } = useStore()
  return (
    <Radio.Group
      onChange={(e: RadioChangeEvent) => setFilter(e.target.value)}
      value={filter}
    >
      <Radio value="all">All</Radio>
      <Radio value="completed">Completed</Radio>
      <Radio value="incompleted">Incompleted</Radio>
    </Radio.Group>
  )
}

const Filtered = () => {
  const { todos, filter } = useStore()
  const filterTodo = todos.filter((todo) => {
    if (filter === 'all') return true
    if (filter === 'completed') return todo.completed
    return !todo.completed
  })
  const transitions = useTransition(filterTodo, {
    keys: (todo) => todo.id,
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: 40 },
    leave: { opacity: 0, height: 0 },
  })
  return transitions((style, item) => (
    <a.div className="item" style={style}>
      <TodoItem item={item} />
    </a.div>
  ))
}

const TodoItem = ({ item }: { item: Todo }) => {
  const { setTodos } = useStore()
  const { title, completed, id } = item

  const toggleCompleted = () =>
    setTodos((prevTodos) =>
      prevTodos.map((prevItem) =>
        prevItem.id === id ? { ...prevItem, completed: !completed } : prevItem,
      ),
    )

  const remove = () => {
    setTodos((prevTodos) => prevTodos.filter((prevItem) => prevItem.id !== id))
  }

  return (
    <>
      <input type="checkbox" checked={completed} onChange={toggleCompleted} />
      <span style={{ textDecoration: completed ? 'line-through' : '' }}>
        {title}
      </span>
      <CloseOutlined onClick={remove} />
    </>
  )
}

export default Zustand
