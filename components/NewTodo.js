import { useRouter } from 'next/router'
import { useState } from 'react'

export default function NewTodo({ project_id }) {
  const router = useRouter()
  const [name, setName] = useState('')

  return (
    <form
      className='mt-5 flex flex-row justify-center text-sm'
      onSubmit={async (e) => {
        e.preventDefault()
        await fetch('/api/todo', {
          body: JSON.stringify({
            name,
            project_id,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })

        router.reload()
      }}
    >
      <input
        onChange={(e) => setName(e.target.value)}
        className='border p-1 text-black outline-none'
        required
        placeholder='New todo'
      />

      <button
        disabled={name ? false : true}
        className={`border px-4 py-0 font-bold  ${
          name ? '' : 'cursor-not-allowed text-gray-400 border-gray-400'
        }`}
      >
        Add
      </button>
    </form>
  )
}