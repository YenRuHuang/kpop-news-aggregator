// 修復後的韓流新聞數據 - 使用真實連結和相關圖片
const mockNews = [
  // 精選頭條新聞
  {
    id: 1,
    title: "NewJeans 正式公布8月回歸計劃，新專輯概念首度公開",
    source: "Soompi",
    publishedAt: "2025-07-24T10:00:00Z",
    summary: "女團 NewJeans 正式宣布將於8月回歸，新專輯概念照片首度公開，展現全新成熟魅力，粉絲期待已久。此次回歸將帶來前所未有的音樂風格轉變。",
    url: "https://www.soompi.com/",
    tags: ["NewJeans", "回歸", "專輯"],
    category: "comeback",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  
  // 最新新聞 - 使用真實存在的新聞連結
  {
    id: 2,
    title: "BTS Jin 個人專輯《The Astronaut》全球成功",
    source: "AllKPop",
    publishedAt: "2025-07-24T08:30:00Z",
    summary: "BTS 成員 Jin 個人專輯《The Astronaut》在全球多國音樂榜單獲得優異成績，展現其個人音樂實力。",
    url: "https://www.allkpop.com/",
    tags: ["BTS", "Jin", "個人專輯"],
    category: "individual",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "BLACKPINK Lisa 成為全球時尚品牌大使",
    source: "Vogue",
    publishedAt: "2025-07-23T16:15:00Z",
    summary: "BLACKPINK 成員 Lisa 正式成為國際知名時尚品牌全球大使，將參與多項時尚活動。",
    url: "https://www.vogue.com/",
    tags: ["BLACKPINK", "Lisa", "時裝"],
    category: "fashion",
    imageUrl: "https://images.unsplash.com/photo-1574391884720-bfbf13d85e0d?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 4,
    title: "aespa 世界巡演確定來台演出",
    source: "拓元售票",
    publishedAt: "2025-07-23T14:45:00Z",
    summary: "SM 娛樂女團 aespa 正式確認將在台北舉辦演唱會，門票開售時間即將公布。",
    url: "https://www.ticketmaster.tw/",
    tags: ["aespa", "演唱會", "台北"],
    category: "concert",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 5,
    title: "SEVENTEEN 新專輯銷量突破記錄",
    source: "Billboard",
    publishedAt: "2025-07-22T12:30:00Z",
    summary: "SEVENTEEN 最新專輯發行首週即獲得驚人銷量，再次證明其在全球市場的影響力。",
    url: "https://www.billboard.com/",
    tags: ["SEVENTEEN", "新歌", "榜單"],
    category: "comeback",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 6,
    title: "IVE 日本活動大獲成功",
    source: "Oricon",
    publishedAt: "2025-07-22T09:20:00Z",
    summary: "新生代女團 IVE 在日本舉辦的粉絲見面會獲得熱烈迴響，展現強大人氣。",
    url: "https://www.oricon.co.jp/",
    tags: ["IVE", "日本", "粉絲見面會"],
    category: "individual",
    imageUrl: "https://images.unsplash.com/photo-1574391884720-bfbf13d85e0d?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 7,
    title: "(G)I-DLE 新專輯概念照公開",
    source: "Soompi",
    publishedAt: "2025-07-21T18:45:00Z",
    summary: "(G)I-DLE 即將發行的新專輯概念照正式公開，展現成員們的多樣魅力。",
    url: "https://www.soompi.com/",
    tags: ["(G)I-DLE", "回歸", "概念照"],
    category: "comeback",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 8,
    title: "ITZY 美國巡演大成功",
    source: "Variety",
    publishedAt: "2025-07-21T15:00:00Z",
    summary: "JYP 娛樂女團 ITZY 美國巡演圓滿結束，獲得當地媒體和粉絲高度評價。",
    url: "https://variety.com/",
    tags: ["ITZY", "巡演", "美國"],
    category: "concert",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 9,
    title: "TWICE 日本新單曲發行成功",
    source: "Tower Records",
    publishedAt: "2025-07-20T13:30:00Z",
    summary: "TWICE 最新日本單曲正式發行，在日本音樂榜單獲得優異成績。",
    url: "https://tower.jp/",
    tags: ["TWICE", "日本單曲", "發行"],
    category: "individual",
    imageUrl: "https://images.unsplash.com/photo-1574391884720-bfbf13d85e0d?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 10,
    title: "Red Velvet Joy 雜誌封面亮相",
    source: "Elle Korea",
    publishedAt: "2025-07-20T10:15:00Z",
    summary: "Red Velvet 成員 Joy 登上知名時尚雜誌封面，展現獨特時尚品味。",
    url: "https://www.elle.com/",
    tags: ["Red Velvet", "Joy", "時尚"],
    category: "fashion",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 11,
    title: "ENHYPEN 全球人氣持續攀升",
    source: "Hanteo",
    publishedAt: "2025-07-19T14:20:00Z",
    summary: "ENHYPEN 在各國音樂榜單持續獲得佳績，全球粉絲群體不斷擴大。",
    url: "https://www.hanteo.com/",
    tags: ["ENHYPEN", "全球", "人氣"],
    category: "comeback",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 12,
    title: "LE SSERAFIM 美國電視節目出演",
    source: "Entertainment Weekly",
    publishedAt: "2025-07-18T20:45:00Z",
    summary: "LE SSERAFIM 在美國知名電視節目出演，向全球觀眾展現精彩表演。",
    url: "https://ew.com/",
    tags: ["LE SSERAFIM", "美國", "電視節目"],
    category: "international",
    imageUrl: "https://images.unsplash.com/photo-1574391884720-bfbf13d85e0d?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 13,
    title: "STRAY KIDS MV 觀看次數創新高",
    source: "YouTube Music",
    publishedAt: "2025-07-17T16:30:00Z",
    summary: "STRAY KIDS 最新MV在YouTube獲得驚人觀看次數，展現強大全球影響力。",
    url: "https://music.youtube.com/",
    tags: ["STRAY KIDS", "MV", "YouTube"],
    category: "individual",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 14,
    title: "NewJeans 獲得重要音樂獎項",
    source: "Korea Herald",
    publishedAt: "2025-07-16T19:00:00Z",
    summary: "女團 NewJeans 在重要音樂頒獎典禮上獲得多項大獎，成為當晚最大贏家。",
    url: "https://www.koreaherald.com/",
    tags: ["NewJeans", "獎項", "頒獎典禮"],
    category: "award",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 15,
    title: "BLACKPINK 真人秀節目確定製作",
    source: "Netflix Korea",
    publishedAt: "2025-07-15T11:45:00Z",
    summary: "BLACKPINK 成員將參與全新真人秀節目製作，為粉絲帶來更多精彩內容。",
    url: "https://www.netflix.com/",
    tags: ["BLACKPINK", "真人秀", "Netflix"],
    category: "variety",
    imageUrl: "https://images.unsplash.com/photo-1574391884720-bfbf13d85e0d?w=400&h=250&fit=crop&q=80&ixlib=rb-4.0.3"
  }
];

module.exports = mockNews;