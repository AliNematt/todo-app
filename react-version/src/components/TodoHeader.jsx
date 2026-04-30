export function TodoHeader({time}) {
    return (
        <header>
            <h1>Any tasks for today?</h1>
            <div className="date">{time}</div>
        </header>
    )
}