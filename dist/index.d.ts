type Y2MateType = "detail" | "search" | "playlist";
interface Y2MateVideoPartialRaw {
    t: string;
    v: string;
}
declare class PartialY2MateVideoDetail {
    client: Y2MateClient;
    title: string;
    videoId: string;
    constructor(client: Y2MateClient, data: Y2MateVideoPartialRaw);
    /**
     * Fetch the detail of the video
     * @returns {Promise<Y2MateVideoDetail>}
     */
    fetch(): Promise<Y2MateVideoDetail>;
    /**
     * Thumbnail URL of the video
     * @type {string}
     */
    get thumbnail(): string;
}
interface Y2MateVideoDetailRaw {
    status: string;
    mess: string;
    page: Y2MateType;
    vid: string;
    extractor: string;
    title: string;
    t: number;
    a: string;
    links: {
        mp3: {
            [key: string]: Y2MateVideoDownloadLinkRaw;
        };
        mp4: {
            [key: string]: Y2MateVideoDownloadLinkRaw;
        };
        other: {
            [key: string]: Y2MateVideoDownloadLinkRaw;
        };
    };
    related?: [{
        title: string;
        contents: Y2MateVideoPartialRaw[];
    }];
}
declare class Y2MateVideoDetail {
    client: Y2MateClient;
    status: string;
    message: string;
    page: Y2MateType;
    videoId: string;
    extractor: string;
    title: string;
    timestamp: number;
    author: string;
    linksVideo: Map<string, Y2MateDownloadLink>;
    linksAudio: Map<string, Y2MateDownloadLink>;
    related: Array<PartialY2MateVideoDetail> | null;
    constructor(client: Y2MateClient, data: Y2MateVideoDetailRaw);
    _setupLinks(links: Y2MateVideoDetailRaw["links"]): void;
    /**
     * Formatted duration string (hh:mm:ss, mm:ss).
     * @type {string}
     */
    get formattedDuration(): string;
    /**
     * Thumbnail URL of the video
     * @type {string}
     */
    get thumbnail(): string;
}
interface Y2MateVideoDownloadLinkRaw {
    size: string;
    f: string;
    q: string;
    q_text: string;
    k: string;
}
declare class Y2MateDownloadLink {
    client: Y2MateClient;
    size: string;
    format: string;
    quality: string;
    name: string;
    videoId: string;
    private key;
    constructor(client: Y2MateClient, id: string, data: Y2MateVideoDownloadLinkRaw);
    /**
     * Fetch the download link of the video
     * @returns {Promise<Y2MateDownload>}
     */
    fetch(): Promise<Y2MateDownload>;
    /**
     * Thumbnail URL of the video
     * @type {string}
     */
    get thumbnail(): string;
}
interface Y2MateVideoSearchResultRaw {
    page: Y2MateType;
    status: string;
    keyword: string;
    vitems: Array<Y2MateVideoPartialRaw>;
    mess?: string;
}
declare class Y2MateSearchResult {
    client: Y2MateClient;
    page: Y2MateType;
    status: string;
    keyword: string;
    results: Array<PartialY2MateVideoDetail>;
    constructor(client: Y2MateClient, data: Y2MateVideoSearchResultRaw);
}
interface Y2MateVideoDownloadRaw {
    status: string;
    mess: string;
    c_status: string;
    vid: string;
    title: string;
    ftype: string;
    fquality: string;
    dlink: string;
}
declare class Y2MateDownload {
    status: string;
    message: string;
    conversionStatus: string;
    videoId: string;
    title: string;
    fileType: string;
    fileQuality: string;
    downloadLink: string;
    constructor(data: Y2MateVideoDownloadRaw);
    /**
     * Thumbnail URL of the video
     * @type {string}
     */
    get thumbnail(): string;
}
interface Y2MatePlaylistRaw {
    status: string;
    mess: string;
    vitems: Array<Y2MateVideoPartialRaw>;
    keyword: string;
    title: string;
    thumbnail: string;
    page: Y2MateType;
    playlistId: string;
}
declare class Y2MatePlaylist {
    client: Y2MateClient;
    status: string;
    message: string;
    videos: Array<PartialY2MateVideoDetail>;
    keyword: string;
    title: string;
    thumbnail: string;
    page: Y2MateType;
    playlistId: string;
    constructor(client: Y2MateClient, data: Y2MatePlaylistRaw);
}

declare class Y2MateClient {
    private userAgent;
    constructor(userAgent?: any);
    getFromURL(url: string, languageCode?: string): Promise<Y2MateVideoDetail | Y2MatePlaylist>;
    searchVideo(keyword: string, languageCode?: string): Promise<Y2MateSearchResult>;
    /**
     * Fetch information of a video
     * @param {string} keyword
     * @param {string} languageCode
     * @returns {Promise<Y2MateSearchResult|Y2MateVideoDetail|Y2MatePlaylist>}
     */
    private _info;
    /**
     * Fetch download link of a video
     * @param {string} videoId
     * @param {string} key
     * @returns {Promise<Y2MateDownload>}
     */
    fetchDownloadLink(videoId: string, key: string): Promise<Y2MateDownload>;
}

export { Y2MateClient, Y2MateDownload, Y2MatePlaylist, Y2MatePlaylistRaw, Y2MateSearchResult, Y2MateVideoDetail, Y2MateVideoDetailRaw, Y2MateVideoDownloadRaw, Y2MateVideoSearchResultRaw, Y2MateClient as default };
