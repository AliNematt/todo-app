export function Filters({filter, setFilter}) {
    return (
        <div className="filters">
            <span className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</span>
            <span className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>Pending</span>
            <span className={filter === "done" ? "active" : ""} onClick={() => setFilter("done")}>Done</span>
        </div>
    )
}