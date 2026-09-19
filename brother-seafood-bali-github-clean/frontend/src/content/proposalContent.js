export const BRAND = {
  name: "BROTHER SEAFOOD BALI",
  taglineEn: "Authentic Beachfront Seafood Experience in Kedonganan",
  taglineZh: "巴厘岛肯东加南海滩正宗海鲜体验",
  docTitle: "BUSINESS PROPOSAL",
  docSubtitle: "商务合作提案 · PROPOSAL KERJASAMA",
  address: "Jl. Pantai Kedonganan No. 12, Badung, Bali, Indonesia",
  whatsapp: "+62 813-6345-6600",
  wechat: "KOABY805",
  instagram: "@brother.seafood.bali",
  owner: "HENDRI (KO ABY)",
  preparedBy: "Hendri (Ko Aby) — Owner, Brother Seafood Bali",
};

export const ABOUT = {
  EN: "Brother Seafood Bali is a premium beachfront seafood restaurant located directly on Kedonganan Beach, Bali's most iconic sunset dining destination. We serve fresh daily-caught seafood, prepared with authentic Balinese and Chinese-friendly flavors, in a vibrant open-air setting with capacity for up to 800 guests. Perfect for tour groups, private events, weddings, birthdays, corporate meetings, and celebrations.",
  中文: "Brother Seafood Bali 是位于巴厘岛肯东加南海滩的高端海边海鲜餐厅，是巴厘岛最具标志性的日落用餐胜地。我们提供每日新鲜捕捞的海鲜，以正宗的巴厘岛和中式风味烹制，露天用餐环境热闹活泼，最多可容纳 800 位客人。非常适合旅游团、私人活动、婚礼、生日、公司会议和庆典。",
  ID: "Brother Seafood Bali adalah restoran seafood premium di tepi Pantai Kedonganan, destinasi kuliner sunset paling ikonik di Bali. Kami menyajikan seafood segar hasil tangkapan harian, dengan cita rasa autentik Bali dan ramah lidah Asia, di suasana open-air yang meriah dengan kapasitas hingga 800 tamu. Cocok untuk rombongan wisata, private event, wedding, ulang tahun, meeting perusahaan, dan perayaan lainnya.",
};

export const LOCATION = [
  { icon: "MapPin", text: "Jl. Pantai Kedonganan No. 12, Badung, Bali, Indonesia" },
  { icon: "Clock", text: "Open Daily · 每日营业 · Buka Setiap Hari" },
  { icon: "Users", text: "Capacity · 容量 · Kapasitas: 800 Pax" },
  { icon: "Plane", text: "10 minutes from Ngurah Rai International Airport · 距机场 10 分钟 · 10 menit dari Bandara Ngurah Rai" },
];

export const PACKAGES = [
  { name: "A", fish: "200 gr", calamari: "100 gr", prawn: "2 pcs", clam: "2 pcs", price: 150000 },
  { name: "B", fish: "200 gr", calamari: "150 gr", prawn: "3 pcs", clam: "3 pcs", price: 180000 },
  { name: "C", fish: "250 gr", calamari: "200 gr", prawn: "4 pcs", clam: "4 pcs", price: 220000 },
];

export const MENU_HIGHLIGHTS = [
  { name: "Brotherhood Sunset Package", price: "IDR 1,750,000", pax: "4 pax", detail: "Seafood sharing set with seafood menu, vegetable menu, side dish and beverage." },
  { name: "Brotherhood Flamboyan Package", price: "IDR 2,550,000", pax: "8 pax", detail: "Group seafood experience with seafood, vegetables, side dishes, beverages and dessert." },
  { name: "Brotherhood Family Package", price: "IDR 5,500,000", pax: "Group / family", detail: "Family-style seafood feast with fish, vegetables, rice, beverages and fresh fruit." },
  { name: "Moonlight Dinner Couple Package", price: "IDR 1,200,000", pax: "Couple", detail: "Special dinner set for a private sunset / evening experience." },
  { name: "Seafood Tumpah", price: "From IDR 980,000", pax: "Sharing", detail: "Seafood sharing experience with sauce selection; size options available." },
  { name: "Alaska King Crab", price: "From IDR 288,000 / 100 gr", pax: "A la carte", detail: "Imported Alaska King Crab selection." },
  { name: "Kelapa Muda", price: "IDR 35,000", pax: "Per serving", detail: "Fresh young coconut." },
  { name: "Vegetarian Menu", price: "From IDR 55,000", pax: "A la carte", detail: "Vegetarian selections are available." },
  { name: "Beverage & Bar Menu", price: "Various", pax: "A la carte", detail: "Juice, soft drinks, beer, wine, spirits and other beverage selections." },
];

export const MENU_GALLERY = Array.from({ length: 23 }, (_, i) => {
  const page = String(i + 1).padStart(2, "0");
  return { id: `menu-${page}`, path: `/menu-gallery/p-${page}.webp`, caption: `Brother Seafood Bali Menu — Page ${i + 1}` };
});

export const EVENT_BOOKING_DETAILS = [
  { icon: "Gem", title: "Wedding / Wedding Dinner", detail: "Custom dining setup, guest count, menu/package selection, decoration, entertainment, beverage arrangement, seating/table plan and event timing. Final quotation follows the selected requirements." },
  { icon: "Cake", title: "Birthday Party", detail: "Guest count, birthday setup, decoration/theme, cake arrangement, menu/package, beverages, music/entertainment and special requests can be arranged." },
  { icon: "Users", title: "Gathering / Family Gathering", detail: "Suitable for family, community and tour groups. Booking can include pax count, package selection, table arrangement, group decoration, beverages and entertainment." },
  { icon: "Briefcase", title: "Corporate Event / Meeting", detail: "Company name, PIC, pax, event schedule, seating arrangement, meal package, beverage package, AV/sound needs and branding/decor can be discussed for a custom quotation." },
  { icon: "Heart", title: "Anniversary / Private Dinner", detail: "Private dining arrangement, preferred date/time, number of guests, menu, decoration and special requests can be prepared in advance." },
  { icon: "Star", title: "Other Events / Custom Event", detail: "Proposal, celebration, group dinner and other special occasions are welcome. Tell us the event concept, date, pax and requested facilities for a tailored arrangement." },
];

export const BOOKING_CHECKLIST = [
  "Event type and event date",
  "Arrival / start time and estimated duration",
  "Number of guests / pax",
  "Guest contact / PIC and WhatsApp",
  "Selected menu, package or seafood preference",
  "Guide / Travel Agent (if applicable)",
  "Table / seating or private-area preference",
  "Decoration / theme requirements",
  "Entertainment or sound-system requirements",
  "Food allergies, dietary restrictions and other special requests",
  "Payment / quotation arrangement and booking confirmation",
];

export const PACKAGE_NOTES = [
  "Above package prices include Mineral Water, Steam Rice, Boiled Water Spinach, Extra Sauces and Fruit in Season.",
  "以上套餐价格包含矿泉水、米饭、空心菜、额外酱料及时令水果。",
  "Harga paket di atas sudah termasuk Mineral Water, Steam Rice, Boiled Water Spinach, Extra Sauces dan Fruit in Season.",
];

export const INCLUDES = [
  "Welcome Drink · 欢迎饮料 · Welcome Drink",
  "Corn Soup · 玉米汤 · Sup Jagung",
  "Mineral Water · 矿泉水 · Air Mineral",
  "Steamed Rice · 白米饭 · Nasi Putih",
  "Boiled Water Spinach (Kangkung) · 水煮空心菜 · Kangkung Rebus",
  "Extra Sauces (Balinese Sambal, Sweet Soy, Chili) · 特色酱料 · Aneka Sambal",
  "Seasonal Fresh Fruits · 时令水果 · Buah Segar Musiman",
];

export const COMMISSION = [
  { item: "Contract Rate Packages A / B / C · 团餐套餐 A / B / C · Paket Contract Rate A / B / C", value: "IDR 5,000 / pax", bold: true },
  { item: "À la carte Seafood outside Contract Rate (pre-tax) · 合同套餐以外的单点海鲜（税前）· Seafood di luar Contract Rate (sebelum pajak)", value: "35%" },
  { item: "Premium Bottled Beverages · 高端瓶装饮料 · Minuman Botol Premium", value: "10%" },
  { item: "\"Uang Hadir\" (Cash Attendance Fee) for à la carte groups — paid directly to Tour Guide / Driver on arrival · 单点团现金到场费（直接支付给导游/司机）· Uang Hadir cash untuk group à la carte, langsung ke Guide/Driver", value: "IDR 80,000", bold: true },
];

export const COMMISSION_NOTES = [
  "Contract rate packages: fixed IDR 5,000 commission per pax. Purchases outside contract rate: 35% food + 10% beverages (pre-tax) + Uang Hadir.",
  "团餐套餐：每位客人固定佣金 IDR 5,000。合同套餐以外的消费：餐费 35% + 饮料 10%（税前）+ 到场费。",
  "Paket contract rate: komisi tetap IDR 5.000 per pax. Pembelian di luar contract rate: 35% makanan + 10% minuman (sebelum pajak) + Uang Hadir.",
];

export const COMPLIMENTARY = [
  "1 complete Seafood Package (same as guest package) with beverage · 1 份完整海鲜套餐 + 饮料 · 1 porsi paket seafood lengkap + minuman",
  "Free-flow coffee & tea in dedicated air-conditioned driver lounge · 司机专用空调休息室免费茶水咖啡 · Kopi & teh gratis di ruang driver ber-AC",
  "Smoking area available · 提供吸烟区 · Smoking area tersedia",
];

export const FACILITIES = [
  { icon: "Umbrella", text: "Beachfront Dining on Kedonganan Beach · 肯东加南海滩边用餐 · Makan di Tepi Pantai" },
  { icon: "Sparkles", text: "Balinese Welcome Dance — traditional greeting performance · 巴厘岛欢迎舞 · Tari Penyambutan Bali" },
  { icon: "Music", text: "Live Music performances · 现场音乐表演 · Live Music" },
  { icon: "Disc3", text: "DJ Performance — full sound system · DJ 表演 · Penampilan DJ" },
  { icon: "Mic2", text: "Karaoke available · 卡拉OK · Karaoke" },
  { icon: "Sunset", text: "Horse Riding on the Beach at sunset · 日落海滩骑马 · Naik Kuda di Pantai" },
  { icon: "PartyPopper", text: "Red-themed Group & Event Decoration — signature setup · 红色主题团餐装饰 · Dekorasi Tema Merah" },
  { icon: "Cake", text: "Custom Event Decoration (birthday, wedding, proposal, corporate) · 定制活动装饰 · Dekorasi Custom" },
];

export const FACILITIES_NOTES = [
  "Selected facilities are complimentary for group bookings — please inquire for details.",
  "部分设施对团餐免费，请咨询详情。",
  "Beberapa fasilitas gratis untuk group booking — silakan hubungi kami.",
];

export const EVENTS = [
  { icon: "Cake", text: "Birthday Party · 生日派对 · Ulang Tahun" },
  { icon: "Gem", text: "Wedding & Reception · 婚礼与婚宴 · Pernikahan" },
  { icon: "Flower2", text: "Marriage Proposal · 求婚 · Lamaran" },
  { icon: "Briefcase", text: "Corporate Meeting & Gala Dinner · 公司会议与晚宴 · Meeting Perusahaan" },
  { icon: "Heart", text: "Anniversary & Family Gathering · 周年纪念与家庭聚会 · Anniversary & Gathering" },
  { icon: "Star", text: "Custom Private Events · 定制私人活动 · Acara Private Custom" },
];

export const TERMS = [
  "Minimum booking: 5 pax per group · 最少 5 人 · Minimum 5 pax per group",
  "Reservation: Advance booking required at least 24 hours before arrival · 至少提前 24 小时预订 · Reservasi minimum H-1",
  "Payment: Cash / Bank Transfer accepted upon completion of service · 服务结束后现金/转账付款 · Pembayaran cash/transfer setelah selesai",
  "Commission: IDR 5,000 per pax for contract rate packages; 35% food & 10% beverages (pre-tax) + Uang Hadir for purchases outside contract rate · 佣金：团餐套餐每人 IDR 5,000；合同套餐以外消费按税前餐费 35% + 饮料 10% + 到场费 · Komisi: IDR 5.000/pax untuk paket contract rate; 35% makanan & 10% minuman (sebelum pajak) + Uang Hadir untuk pembelian di luar contract rate",
  "Cancellation: Please notify us at least 6 hours before arrival · 请至少提前 6 小时取消 · Pembatalan minimum 6 jam sebelumnya",
  "Rates are subject to revision with 30 days prior written notice · 价格调整将提前 30 天书面通知 · Harga dapat direvisi dengan pemberitahuan tertulis 30 hari sebelumnya",
  "All packages are non-transferable and non-refundable once consumed · 套餐一经使用不可转让、不可退款 · Paket tidak dapat dipindahtangankan / dikembalikan setelah dikonsumsi",
];

export const CLOSING = {
  title: "SELAMAT DATANG · WELCOME · 欢迎",
  en: "Let's grow together — Brother Seafood Bali welcomes your guests as our family.",
  zh: "让我们共同成长 — Brother Seafood Bali 欢迎您的客人如家人。",
};

export const SECTIONS = {
  about: "1. ABOUT US · 关于我们 · TENTANG KAMI",
  location: "2. LOCATION · 地址 · LOKASI",
  packages: "3. CONTRACT RATE PACKAGES · 团餐套餐 · PAKET GROUP",
  menu: "4. MENU HIGHLIGHTS · 菜单精选 · PILIHAN MENU",
  events: "5. EVENT RESERVATIONS · 活动预订 · RESERVASI ACARA",
  booking: "6. EVENT BOOKING DETAILS · 活动预订详情 · RINCIAN BOOKING ACARA",
  commission: "7. TRAVEL AGENT COMMISSION & BENEFITS · 旅行社佣金与优惠 · KOMISI & BENEFIT TRAVEL AGENT",
  facilities: "8. FACILITIES & ENTERTAINMENT · 设施与娱乐 · FASILITAS & HIBURAN",
  terms: "9. TERMS & CONDITIONS · 条款与条件 · SYARAT & KETENTUAN",
  contact: "10. CONTACT PERSON · 联系人 · KONTAK",
  gallery: "11. GALLERY · 相册 · GALERI",
};

export const GALLERY_PLACEHOLDERS = [
  "Beachfront dinner setup — red decor & balloons",
  "Balinese welcome dance",
  "Horse riding at sunset",
  "Night ambience — red neon lighting",
  "Team & Owner Mr. Hendri (Ko Aby)",
];
