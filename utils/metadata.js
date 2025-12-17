// Regular expressions for common patterns
const EPISODE_PATTERNS = [
    /[sS](\d+)[eE](\d+)/,           // S01E01
    /(\d+)x(\d+)/,                  // 1x01
    /[sS]eason\s*(\d+).*?[eE]pisode\s*(\d+)/i, // Season 1 Episode 1
];

export function extractMetadata(filename, text) {
    let cleanTitle = filename;
    let season = '';
    let episode = '';

    // Remove extension
    cleanTitle = cleanTitle.replace(/\.[^/.]+$/, "");

    // 1. Try to find S/E in filename
    for (let pattern of EPISODE_PATTERNS) {
        const match = cleanTitle.match(pattern);
        if (match) {
            season = match[1];
            episode = match[2];
            // Usually the title is before the S/E
            cleanTitle = cleanTitle.substring(0, match.index).trim();
            break;
        }
    }

    // 2. If not found, try text (message caption)
    if ((!season || !episode) && text) {
        for (let pattern of EPISODE_PATTERNS) {
            const match = text.match(pattern);
            if (match) {
                season = match[1];
                episode = match[2];
                // Use text as fallback title if filename was weird, but usually filename is better for title
                break;
            }
        }
    }

    // 3. Clean common junk
    cleanTitle = cleanTitle.replace(/[._]/g, " "); // Replace dots/underscores
    cleanTitle = cleanTitle.replace(/\[.*?\]/g, ""); // Remove [Group]
    cleanTitle = cleanTitle.replace(/\(.*?\)/g, ""); // Remove (Year) or info
    cleanTitle = cleanTitle.replace(/(1080p|720p|480p|WEB-DL|BluRay|x264|x265|HEVC|AAC).*/i, ""); // Remove junk
    cleanTitle = cleanTitle.trim();

    return {
        title: cleanTitle,
        season,
        episode
    };
}
