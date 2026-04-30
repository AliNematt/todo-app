export function ClearAll({clear}){
    return (
        <div className="action-bar">
            <button className="clear-completed-btn" onClick={clear}>
                <span className="btn-icon">🗑️</span>
                <span className="btn-text">Clear Completed Tasks</span>
            </button>
        </div>

    )
}