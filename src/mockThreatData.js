/**
 * @deprecated Discarded in favor of src/services/liveDataFetcher.js
 * All components now fetch live social data using fetchLiveSocialData() and fetchAndAnalyzeLiveThreats().
 */
import { DEFAULT_CACHED_POSTS } from './services/liveDataFetcher';

export const mockThreatData = DEFAULT_CACHED_POSTS;
export default mockThreatData;
