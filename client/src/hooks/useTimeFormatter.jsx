/*
Custom hook to format elapsed time based on the provided timestamp or duration.
- `time`: The input timestamp or duration (in seconds).
- Calculates the elapsed time relative to the current date and time.
- Returns a human-readable string representing the time (e.g., "2d ago" or "1y ago").
*/

const useTimeFormatter = (time) => {
    const now = new Date();
        const elapsedSeconds = (now - new Date(time)) / 1000;

        if (elapsedSeconds < 60) return `${Math.floor(elapsedSeconds)}s`;
        if (elapsedSeconds < 3600) return `${Math.floor(elapsedSeconds / 60)}m`;
        if (elapsedSeconds < 86400) return `${Math.floor(elapsedSeconds / 3600)}h`;
        if (elapsedSeconds < 2592000) return `${Math.floor(elapsedSeconds / 86400)}d`;
        if (elapsedSeconds < 31536000) return `${Math.floor(elapsedSeconds / 2592000)}mo`;
        return `${Math.floor(elapsedSeconds / 31536000)}y`;
}

export default useTimeFormatter