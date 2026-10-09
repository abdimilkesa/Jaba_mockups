export function Loading({ label = 'Loading mockups…' }) { return <div className="loading-state"><span className="spinner"/><p>{label}</p></div> }
export function EmptyState({ title = 'Nothing here yet', message = 'Try changing your search or check back soon.' }) { return <div className="empty-state"><div className="empty-icon">✳</div><h3>{title}</h3><p>{message}</p></div> }
