export function MsgBox({ noCompleted, isEmpty }) {
  if (isEmpty) {
    return <p>Any tasks to add ? ...</p>
  }

  if (noCompleted) {
    return <p>No completed tasks found!</p>
  }

  return null
}
