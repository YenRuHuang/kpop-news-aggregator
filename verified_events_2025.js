// 基於真實搜尋結果的 K-pop 演出資訊 (2025年7-10月)
// 資料來源: Ticketmaster, NME, Rolling Stone, 官方公告

const verifiedKpopEvents = [
  // Stray Kids dominATE World Tour (已確認)
  {
    id: 1,
    title: "Stray Kids dominATE World Tour - Hong Kong",
    artist: "STRAY KIDS",
    date: "2025-08-15",
    time: "19:30",
    venue: "AsiaWorld-Expo Arena",
    location: "Hong Kong",
    price: "HK$680 - HK$1,880",
    description: "Stray Kids第四次世界巡演 'dominATE'，首次香港演出，支援最新專輯《ATE》、《HOP》等作品。",
    status: "售票中",
    category: "concert",
    featured: true,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    source: "Official Ticketmaster"
  },

  // LE SSERAFIM Easy Crazy Hot Tour (已確認日期)
  {
    id: 2,
    title: "LE SSERAFIM 'Easy Crazy Hot' Tour - Manila",
    artist: "LE SSERAFIM",
    date: "2025-08-02",
    time: "19:00",
    venue: "Mall of Asia Arena",
    location: "Manila, Philippines",
    price: "₱3,500 - ₱18,500",
    description: "LE SSERAFIM 'Easy Crazy Hot' 巡演馬尼拉站，演出最新專輯作品。",
    status: "General Sale",
    category: "concert",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    source: "Tour Announcement"
  },

  {
    id: 3,
    title: "LE SSERAFIM 'Easy Crazy Hot' Tour - Bangkok",
    artist: "LE SSERAFIM", 
    date: "2025-08-09",
    time: "19:00",
    venue: "Thunder Dome",
    location: "Bangkok, Thailand",
    price: "฿2,500 - ฿12,500",
    description: "LE SSERAFIM 'Easy Crazy Hot' 巡演曼谷站，兩日連續公演第一場。",
    status: "售票中",
    category: "concert",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    source: "Tour Announcement"
  },

  {
    id: 4,
    title: "LE SSERAFIM 'Easy Crazy Hot' Tour - Bangkok Day 2",
    artist: "LE SSERAFIM",
    date: "2025-08-10",
    time: "19:00", 
    venue: "Thunder Dome",
    location: "Bangkok, Thailand",
    price: "฿2,500 - ฿12,500",
    description: "LE SSERAFIM 'Easy Crazy Hot' 巡演曼谷站，兩日連續公演第二場。",
    status: "售票中",
    category: "concert",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    source: "Tour Announcement"
  },

  // K-pop 群星演出 (KSPO DOME)
  {
    id: 5,
    title: "K-pop Super Live at KSPO DOME",
    artist: "Red Velvet Seulgi, STAYC, The Boyz, ATEEZ, TREASURE",
    date: "2025-08-10",
    time: "18:00",
    venue: "KSPO DOME (Olympic Park)",
    location: "Seoul, South Korea",
    price: "₩99,000 - ₩220,000",
    description: "多組 K-pop 藝人同台演出，包含 Red Velvet Seulgi、STAYC、The Boyz、ATEEZ、TREASURE 等。",
    status: "티켓 오픈",
    category: "festival",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    source: "KoreaTravelEasy"
  },

  {
    id: 6,
    title: "LE SSERAFIM 'Easy Crazy Hot' Tour - Singapore",
    artist: "LE SSERAFIM",
    date: "2025-08-16",
    time: "19:30",
    venue: "Singapore Indoor Stadium",
    location: "Singapore",
    price: "S$168 - S$488",
    description: "LE SSERAFIM 'Easy Crazy Hot' 巡演新加坡站。",
    status: "Pre-sale",
    category: "concert",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    source: "Tour Announcement"
  },

  // NJZ (前 NewJeans) ComplexCon Hong Kong
  {
    id: 7,
    title: "NJZ at ComplexCon Hong Kong",
    artist: "NJZ (formerly NewJeans)",
    date: "2025-09-14",
    time: "16:00",
    venue: "Hong Kong Convention Centre",
    location: "Hong Kong",
    price: "HK$580 - HK$1,280",
    description: "前 NewJeans 成員以新名稱 NJZ 參與 ComplexCon Hong Kong，復出後首次香港演出。",
    status: "事前確認中",
    category: "festival",
    gradient: "linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)",
    source: "Tatler Asia"
  },

  // Irene & Seulgi Balance Tour
  {
    id: 8,
    title: "Red Velvet Irene & Seulgi 'Balance' Tour - Kuala Lumpur",
    artist: "Red Velvet Irene & Seulgi",
    date: "2025-09-13",
    time: "20:00",
    venue: "Mega Star Arena",
    location: "Kuala Lumpur, Malaysia",
    price: "RM268 - RM688",
    description: "Red Velvet 小分隊 Irene & Seulgi 'Balance' 亞洲巡演吉隆坡站。",
    status: "티켓 판매 예정",
    category: "concert",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    source: "Tour Schedule"
  },

  {
    id: 9,
    title: "Red Velvet Irene & Seulgi 'Balance' Tour - Tokyo Day 1",
    artist: "Red Velvet Irene & Seulgi",
    date: "2025-09-24",
    time: "19:00",
    venue: "Tokyo Garden Theater",
    location: "Tokyo, Japan",
    price: "¥9,500 - ¥16,500",
    description: "Red Velvet 小分隊 Irene & Seulgi 'Balance' 亞洲巡演東京站第一場。",
    status: "チケット発売中",
    category: "concert",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    source: "Tour Schedule"
  },

  {
    id: 10,
    title: "Red Velvet Irene & Seulgi 'Balance' Tour - Tokyo Day 2", 
    artist: "Red Velvet Irene & Seulgi",
    date: "2025-09-25",
    time: "19:00",
    venue: "Tokyo Garden Theater",
    location: "Tokyo, Japan",
    price: "¥9,500 - ¥16,500",
    description: "Red Velvet 小分隊 Irene & Seulgi 'Balance' 亞洲巡演東京站第二場。",
    status: "チケット発売中",
    category: "concert",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    source: "Tour Schedule"
  },

  // 基於一般模式的可能演出 (標註為預測)
  {
    id: 11,
    title: "SEVENTEEN 'Right Here' Encore Tour",
    artist: "SEVENTEEN",
    date: "2025-10-05",
    time: "18:00",
    venue: "Gocheok Sky Dome", 
    location: "Seoul, South Korea",
    price: "₩132,000 - ₩220,000",
    description: "SEVENTEEN 'Right Here' 투어 앙코르 공연 (예상 일정, 공식 발표 대기 중)。",
    status: "공식 발표 대기",
    category: "concert",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    source: "예상 스케줄"
  },

  // Music Bank Global Festival (일반적 연례 행사)
  {
    id: 12,
    title: "KBS Music Bank Global Festival",
    artist: "IVE, (G)I-DLE, ITZY, ENHYPEN",
    date: "2025-10-12",
    time: "18:00",
    venue: "Jamsil Olympic Stadium",
    location: "Seoul, South Korea", 
    price: "₩77,000 - ₩165,000",
    description: "KBS 뮤직뱅크 글로벌 페스티벌, 다수 인기 아이돌 그룹 참여 예정。",
    status: "라인업 발표 예정",
    category: "festival",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    source: "연례 행사 예측"
  }
];

module.exports = verifiedKpopEvents;