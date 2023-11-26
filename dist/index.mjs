// src/constants.ts
var constants_default = {
  languageCode: {
    en: {
      lang: "en",
      name: "English"
    },
    de: {
      lang: "de",
      name: "Deutsch"
    },
    es: {
      lang: "es",
      name: "Espa\xF1ol"
    },
    fr: {
      lang: "fr",
      name: "Fran\xE7ais"
    },
    hi: {
      lang: "hi",
      name: "\u0939\u093F\u0928\u094D\u0926\u0940 / Hind\u012B"
    },
    id: {
      lang: "id",
      name: "Indonesian"
    },
    it: {
      lang: "it",
      name: "Italiano"
    },
    jp: {
      lang: "jp",
      name: "\u65E5\u672C\u8A9E"
    },
    kr: {
      lang: "kr",
      name: "\uD55C\uAD6D\uC5B4"
    },
    mm: {
      lang: "mm",
      name: "Myanmar (\u1019\u103C\u1014\u103A\u1019\u102C)"
    },
    my: {
      lang: "my",
      name: "Malay"
    },
    ph: {
      lang: "ph",
      name: "Filipino"
    },
    pt: {
      lang: "pt",
      name: "Portugu\xEAs"
    },
    ru: {
      lang: "ru",
      name: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"
    },
    th: {
      lang: "th",
      name: "\u0E44\u0E17\u0E22"
    },
    tr: {
      lang: "tr",
      name: "T\xFCrk\xE7e"
    },
    vi: {
      lang: "vi",
      name: "Ti\u1EBFng Vi\u1EC7t"
    },
    "zh-cn": {
      lang: "zh-cn",
      name: "\u7B80\u4F53\u4E2D\u6587"
    },
    "zh-tw": {
      lang: "zh-tw",
      name: "\u7E41\u9AD4\u4E2D\u6587"
    },
    sa: {
      lang: "sa",
      name: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
    },
    bn: {
      lang: "bn",
      name: "\u09AC\u09BE\u0999\u09BE\u09B2\u09BF"
    }
  },
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  regex: /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/u
};

// src/index.ts
import fetch from "node-fetch";

// src/struct.ts
import formatDuration from "format-duration";
var PartialY2MateVideoDetail = class {
  constructor(client, data) {
    Object.defineProperty(this, "client", { value: client });
    this.title = data.t;
    this.videoId = data.v;
  }
  /**
   * Fetch the detail of the video
   * @returns {Promise<Y2MateVideoDetail>}
   */
  fetch() {
    return this.client.getFromURL(`https://www.youtube.com/watch?v=${this.videoId}`);
  }
  /**
   * Thumbnail URL of the video
   * @type {string}
   */
  get thumbnail() {
    return `https://i.ytimg.com/vi/${this.videoId}/0.jpg`;
  }
};
var Y2MateVideoDetail = class {
  constructor(client, data) {
    Object.defineProperty(this, "client", { value: client });
    this.status = data.status;
    this.message = data.mess;
    this.page = data.page;
    this.videoId = data.vid;
    this.extractor = data.extractor;
    this.title = data.title;
    this.timestamp = data.t * 1e3;
    this.author = data.a;
    this.linksVideo = /* @__PURE__ */ new Map();
    this.linksAudio = /* @__PURE__ */ new Map();
    this.related = data.related ? data.related[0].contents.map((o) => new PartialY2MateVideoDetail(this.client, o)) : null;
    this._setupLinks(data.links);
  }
  _setupLinks(links) {
    if (!links)
      return;
    const video = links.mp4;
    const audio = links.mp3;
    for (const [key, value] of Object.entries(video)) {
      this.linksVideo.set(key, new Y2MateDownloadLink(this.client, this.videoId, value));
    }
    for (const [key, value] of Object.entries(audio)) {
      this.linksAudio.set(key, new Y2MateDownloadLink(this.client, this.videoId, value));
    }
  }
  /**
   * Formatted duration string (hh:mm:ss, mm:ss).
   * @type {string}
   */
  get formattedDuration() {
    return formatDuration(this.timestamp);
  }
  /**
   * Thumbnail URL of the video
   * @type {string}
   */
  get thumbnail() {
    return `https://i.ytimg.com/vi/${this.videoId}/0.jpg`;
  }
};
var Y2MateDownloadLink = class {
  constructor(client, id, data) {
    Object.defineProperty(this, "client", { value: client });
    this.size = data.size;
    this.format = data.f;
    this.quality = data.q;
    this.name = data.q_text;
    this.videoId = id;
    this.key = data.k;
  }
  /**
   * Fetch the download link of the video
   * @returns {Promise<Y2MateDownload>}
   */
  fetch() {
    return this.client.fetchDownloadLink(this.videoId, this.key);
  }
  /**
   * Thumbnail URL of the video
   * @type {string}
   */
  get thumbnail() {
    return `https://i.ytimg.com/vi/${this.videoId}/0.jpg`;
  }
};
var Y2MateSearchResult = class {
  constructor(client, data) {
    Object.defineProperty(this, "client", { value: client });
    this.page = data.page;
    this.status = data.status;
    this.keyword = data.keyword;
    this.results = data.vitems.map((o) => new PartialY2MateVideoDetail(client, o));
  }
};
var Y2MateDownload = class {
  constructor(data) {
    this.status = data.status;
    this.message = data.mess;
    this.conversionStatus = data.c_status;
    this.videoId = data.vid;
    this.title = data.title;
    this.fileType = data.ftype;
    this.fileQuality = data.fquality;
    this.downloadLink = data.dlink;
  }
  /**
   * Thumbnail URL of the video
   * @type {string}
   */
  get thumbnail() {
    return `https://i.ytimg.com/vi/${this.videoId}/0.jpg`;
  }
};
var Y2MatePlaylist = class {
  constructor(client, data) {
    Object.defineProperty(this, "client", { value: client });
    this.status = data.status;
    this.message = data.mess;
    this.videos = data.vitems.map((o) => new PartialY2MateVideoDetail(client, o));
    this.keyword = data.keyword;
    this.title = data.title;
    this.thumbnail = data.thumbnail;
    this.page = data.page;
    this.playlistId = data.playlistId;
  }
};

// src/index.ts
var Y2MateClient = class {
  constructor(userAgent = constants_default.userAgent) {
    this.userAgent = typeof userAgent === "string" ? userAgent : constants_default.userAgent;
  }
  getFromURL(url, languageCode = "en") {
    if (typeof url !== "string")
      throw new Error("URL is required");
    if (!constants_default.regex.test(url))
      throw new Error("Invalid URL " + url);
    return this._info(url, languageCode);
  }
  searchVideo(keyword, languageCode = "en") {
    if (typeof keyword !== "string")
      throw new Error("Keyword is required");
    if (constants_default.regex.test(keyword))
      throw new Error("Invalid keyword (URL is not allowed)");
    return this._info(keyword, languageCode);
  }
  /**
   * Fetch information of a video
   * @param {string} keyword
   * @param {string} languageCode
   * @returns {Promise<Y2MateSearchResult|Y2MateVideoDetail|Y2MatePlaylist>}
   */
  _info(keyword, languageCode = "en") {
    if (typeof keyword !== "string")
      throw new Error("Keyword is required");
    if (typeof languageCode !== "string")
      throw new Error("Language code is required");
    if (!constants_default.languageCode[languageCode])
      throw new Error(
        `Language code ${languageCode} is not supported. Please use one of these: ${Object.keys(
          constants_default.languageCode
        ).join(", ")}`
      );
    return new Promise((resolve, reject) => {
      fetch("https://www.y2mate.com/mates/analyzeV2/ajax", {
        method: "POST",
        headers: {
          "User-Agent": this.userAgent,
          "x-requested-with": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams({
          k_query: keyword,
          k_page: "home",
          hl: languageCode,
          q_auto: "1"
        })
      }).then((res) => {
        if (!res.ok)
          return reject(new Error(`HTTP Error ${res.status}`));
        return res.json();
      }).then((d) => {
        const data = d;
        if (data.status !== "ok")
          return reject(new Error(`${JSON.stringify(data, null, 2)}`));
        switch (data.page) {
          case "detail": {
            return resolve(new Y2MateVideoDetail(this, data));
          }
          case "search": {
            return resolve(new Y2MateSearchResult(this, data));
          }
          case "playlist": {
            return resolve(new Y2MatePlaylist(this, data));
          }
          default: {
            throw new Error(`${JSON.stringify(data, null, 2)}`);
          }
        }
      }).catch((err) => reject(err));
    });
  }
  /**
   * Fetch download link of a video
   * @param {string} videoId
   * @param {string} key
   * @returns {Promise<Y2MateDownload>}
   */
  fetchDownloadLink(videoId, key) {
    if (typeof videoId !== "string")
      throw new Error("Video ID is required");
    if (typeof key !== "string")
      throw new Error("Key is required");
    return new Promise((resolve, reject) => {
      fetch("https://www.y2mate.com/mates/convertV2/index", {
        method: "POST",
        headers: {
          "User-Agent": this.userAgent,
          "x-requested-with": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams({
          vid: videoId,
          k: key
        })
      }).then((res) => {
        if (!res.ok)
          return reject(new Error(`HTTP Error ${res.status}`));
        return res.json();
      }).then((d) => {
        const data = d;
        return resolve(new Y2MateDownload(data));
      }).catch((err) => reject(err));
    });
  }
};
var src_default = Y2MateClient;
export {
  Y2MateClient,
  Y2MateDownload,
  Y2MatePlaylist,
  Y2MateSearchResult,
  Y2MateVideoDetail,
  src_default as default
};
//# sourceMappingURL=index.mjs.map