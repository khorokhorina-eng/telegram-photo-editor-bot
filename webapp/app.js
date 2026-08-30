const cards = [
  { action: "photoshoot:art_portrait", category: "photoshoot", title: "Арт-портрет", description: "Глянцевый кадр в чёрном платье, ветер и песчаная арка.", price: "1 генерация", image: 0 },
  { action: "photoshoot:peonies_mountains", category: "photoshoot", title: "Пионы в горах", description: "Нежная фотосессия с цветами и горным пейзажем.", price: "1 генерация", image: 1 },
  { action: "photoshoot:golden_autumn", category: "photoshoot", title: "Золотая осень", description: "Тёплый осенний fashion-кадр в золотом свете.", price: "1 генерация", image: 2 },
  { action: "photoshoot:flash_party", category: "photoshoot", title: "Flash-вечеринка", description: "Клубная съёмка со вспышкой, бликами и эффектным образом.", price: "1 генерация", image: 3 },
  { action: "photoshoot:italian_summer", category: "photoshoot", title: "Итальянское лето", description: "Солнечный средиземноморский кадр у старинного дома.", price: "1 генерация", image: "birthday-crown-cover" },
  { action: "photoshoot:city_motion", category: "photoshoot", title: "Городской кадр", description: "Парижский street-style с динамикой и модным силуэтом.", price: "1 генерация", image: 5 },
  { action: "photoshoot:magazine_cover", category: "photoshoot", title: "Обложка журнала", description: "Люксовая travel-fashion съёмка в тропиках.", price: "1 генерация", image: 6 },
  { action: "photoshoot:heart_hair", category: "photoshoot", title: "Закат", description: "Тёплый летний кадр на скамейке в лучах заката.", price: "1 генерация", image: "sunset-cover-v2" },
  { action: "photoshoot:birthday", category: "photoshoot", title: "День рождения", description: "Игривый студийный кадр с большим праздничным тортом.", price: "1 генерация", image: "italian-summer-cover" },
  { action: "photoshoot:polaroid", category: "photoshoot", title: "Polaroid", description: "Аналоговое настроение и мягкая вспышка.", price: "1 генерация", image: "polaroid-cover-v2" },
  { action: "photoshoot:sweater", category: "photoshoot", title: "В свитере", description: "Уютный редакционный портрет в трикотаже.", price: "1 генерация", image: "sweater-cover" },
  { action: "photoshoot:sea_escape", category: "photoshoot", title: "На море", description: "Люксовая фотосессия у моря.", price: "1 генерация", image: "sea-cover" },
  { action: "photoshoot:modest_sage_studio", category: "modest", title: "Шалфейный свет", description: "Мягкий студийный свет и воздушные шалфейные оттенки.", price: "1 генерация", image: "modest-sage-studio" },
  { action: "photoshoot:modest_car_style", category: "modest", title: "За стеклом", description: "Элегантный образ в автомобиле премиум-класса.", price: "1 генерация", image: "modest-car-style" },
  { action: "photoshoot:modest_heritage_light", category: "modest", title: "Свет узоров", description: "Архитектурный свет, зелёный оттенок и золото.", price: "1 генерация", image: "modest-heritage-light" },
  { action: "photoshoot:modest_pearl_satin", category: "modest", title: "Жемчужный атлас", description: "Светлый атлас, современный жемчуг и мягкий свет.", price: "1 генерация", image: "modest-pearl-satin" },
  { action: "photoshoot:modest_white_architecture", category: "modest", title: "Белая архитектура", description: "Летящий светлый образ у современной архитектуры.", price: "1 генерация", image: "modest-white-architecture" },
  { action: "photoshoot:modest_lake_escape", category: "modest", title: "На озере", description: "Кинематографичный кадр на деревянной лодке у гор.", price: "1 генерация", image: "modest-lake-escape" },
  { action: "avatar:ai_glamour", category: "avatar", title: "AI-гламур", description: "Яркий fashion-аватар с модной стилизацией.", price: "1 генерация", image: 9 },
  { action: "avatar:business", category: "avatar", title: "Деловой", description: "Современный профессиональный портрет.", price: "1 генерация", image: 10 },
  { action: "avatar:editorial", category: "avatar", title: "Редакционный", description: "Воздушный fashion-портрет с журнальным настроением.", price: "1 генерация", image: 11 },
  { action: "avatar:cinematic", category: "avatar", title: "Кинематографичный", description: "Стильный кадр как из модного фильма.", price: "1 генерация", image: 12 },
  { action: "avatar:black_white", category: "avatar", title: "Чёрно-белый", description: "Контрастный редакционный портрет.", price: "1 генерация", image: 13 },
  { action: "avatar:y2k", category: "avatar", title: "Y2K-стиль", description: "Яркая эстетика нулевых и глянцевый флеш.", price: "1 генерация", image: 14 },
  { action: "avatar:art", category: "avatar", title: "Арт", description: "Иллюстративный портрет с сохранением ваших черт.", price: "1 генерация", image: 15 },
  { action: "avatar:anime", category: "avatar", title: "Аниме", description: "Аниме-версия с узнаваемыми чертами лица.", price: "1 генерация", image: 16 },
  { action: "avatar:business", category: "men", title: "Деловой", description: "Современный профессиональный портрет.", price: "1 генерация", image: "men-business-cover" },
  { action: "avatar:black_white", category: "men", title: "Чёрно-белый", description: "Контрастный редакционный портрет.", price: "1 генерация", image: "men-black-white-cover" },
  { action: "avatar:male_classic", category: "men", title: "Классический", description: "Лаконичный современный портрет в пиджаке.", price: "1 генерация", image: "men-classic" },
  { action: "avatar:male_street", category: "men", title: "Городской стиль", description: "Современный образ для соцсетей и профиля.", price: "1 генерация", image: "men-street" },
  { action: "avatar:male_cinematic", category: "men", title: "Кино-портрет", description: "Атмосферный портрет в творческом пространстве.", price: "1 генерация", image: "men-cinematic" },
  { action: "avatar:male_black_white_studio", category: "men", title: "Студийный ч/б", description: "Чистый чёрно-белый студийный портрет.", price: "1 генерация", image: "men-bw" },
  { action: "enhance", category: "tools", title: "Ретушь и качество", description: "Естественно освежить фото и улучшить его качество.", price: "1 генерация", image: "retouch-before-after" },
  { action: "background:studio", category: "tools", title: "Студийный фон", description: "Аккуратный нейтральный фон и мягкий свет.", price: "1 генерация", image: 18 },
  { action: "background:sea", category: "tools", title: "Фон: море", description: "Морской пейзаж с гармоничным светом.", price: "1 генерация", image: 19 },
  { action: "background:city", category: "tools", title: "Фон: город", description: "Современный городской фон для вашего фото.", price: "1 генерация", image: 20 },
  { action: "background:white", category: "tools", title: "Фон: белый", description: "Чистый белый фон без изменения человека.", price: "1 генерация", image: 21 },
  { action: "background:office", category: "tools", title: "Фон: офис", description: "Современный нейтральный офисный интерьер.", price: "1 генерация", image: "office-background" },
  { action: "background:mountains", category: "tools", title: "Фон: горы", description: "Горный пейзаж с естественным светом.", price: "1 генерация", image: 23 },
  { action: "background:sunset", category: "tools", title: "Фон: закат", description: "Тёплый закатный свет и новый фон.", price: "1 генерация", image: "sunset-background" },
  { action: "background:remove_only", category: "tools", title: "Удалить фон", description: "Аккуратно отделить человека от фона.", price: "1 генерация", image: 25 },
  { action: "documents", category: "tools", title: "Фото на документы", description: "Нейтральный свет, ровный фон и аккуратный портрет.", price: "1 генерация", image: 17 }
];

const categoryLabels = { photoshoot: "Фотосессия", avatar: "Аватарка", modest: "Скромный стиль", men: "Мужской стиль", tools: "Инструмент" };
const gallery = document.querySelector("#gallery");
const sheet = document.querySelector("#sheet");
const toast = document.querySelector("#toast");
const sheetStatus = document.querySelector("#sheet-status");
let selected = null;

const webApp = window.Telegram?.WebApp;
webApp?.ready();
webApp?.expand();

function imageStyle(image) {
  return `--template-image:url('./assets/templates/${image}.webp')`;
}

function render(filter = "all") {
  document.querySelector("#tools-note").hidden = filter !== "tools";
  gallery.innerHTML = "";
  cards.filter((card) => filter === "all" || card.category === filter).forEach((card) => {
    const button = document.createElement("button");
    button.className = "card";
    button.innerHTML = `<div class="image tile" style="${imageStyle(card.image)}"><span>${categoryLabels[card.category]}</span></div><div class="card-copy"><strong>${card.title}</strong><small>${card.price}</small></div>`;
    button.addEventListener("click", () => openCard(card));
    gallery.append(button);
  });
}

function openCard(card) {
  selected = card;
  setSheetStatus("");
  document.querySelector("#sheet-preview").style = imageStyle(card.image);
  document.querySelector("#sheet-category").textContent = categoryLabels[card.category];
  document.querySelector("#sheet-title").textContent = card.title;
  document.querySelector("#sheet-description").textContent = card.description;
  document.querySelector("#sheet-price").textContent = card.price;
  sheet.showModal();
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function setSheetStatus(text, isError = false) {
  sheetStatus.hidden = !text;
  sheetStatus.textContent = text;
  sheetStatus.classList.toggle("error", isError);
}

function templateDeepLink(photoMode) {
  const payload = `${photoMode === "new" ? "studio_new_" : "studio_"}${btoa(unescape(encodeURIComponent(selected.action))).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")}`;
  return `https://t.me/gpt_photoeditor_bot?start=${payload}`;
}

document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => {
  document.querySelector(".filter.active")?.classList.remove("active");
  button.classList.add("active");
  render(button.dataset.filter);
}));

document.querySelector("#close").addEventListener("click", () => sheet.close());
sheet.addEventListener("click", (event) => { if (event.target === sheet) sheet.close(); });
async function selectTemplate(photoMode) {
  if (!selected) return;
  const button = document.querySelector(photoMode === "last" ? "#select-last" : "#select");
  button.textContent = "Переходим в чат…";
  button.disabled = true;
  setSheetStatus("Подготавливаем выбранный шаблон…");
  try {
    if (!webApp?.initData) throw new Error("Telegram Mini App is unavailable");
    const response = await fetch("./api/select", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ initData: webApp.initData, action: selected.action, photoMode })
    });
    if (!response.ok) throw new Error("Selection request failed");
    const result = await response.json();
    // The server has already posted the next step to the bot chat. On some
    // iOS versions close() may be ignored after an awaited request, so leave
    // an explicit success state instead of looking frozen.
    sheet.close();
    window.setTimeout(() => webApp?.close(), result.chatReady ? 150 : 500);
  } catch {
    // Direct Telegram navigation is a safe fallback for unstable in-app
    // networking on some iOS versions. The bot receives the template from
    // the start payload and opens the right next step in the chat.
    try {
      setSheetStatus("Открываем чат с выбранным шаблоном…");
      if (webApp?.openTelegramLink) {
        webApp.openTelegramLink(templateDeepLink(photoMode));
      } else {
        window.location.assign(templateDeepLink(photoMode));
      }
    } catch {
      button.disabled = false;
      button.textContent = photoMode === "last" ? "Использовать последнее фото" : "Выбрать и загрузить фото";
      setSheetStatus("Не удалось открыть чат. Закройте фотостудию и попробуйте ещё раз.", true);
    }
  }
}

document.querySelector("#select").addEventListener("click", () => {
  selectTemplate("new");
});

document.querySelector("#select-last").addEventListener("click", () => {
  selectTemplate("last");
});

render();
