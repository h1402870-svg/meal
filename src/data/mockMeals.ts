import { MealData, DishDetail } from "../types";
import { getWeekDates, formatDateKey } from "../utils/dateUtils";

// 치즈돈까스 이미지 (기존 이미지 그대로 유지)
const CHEESE_CUTLET_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDCttEmHLX6p4U9vi5mCC446z-oulYLDLCv6wS81Ag1C1T5_MX4llUK395F47PHpJUQi82tmntm1bT5sr5qpcg2f-fd8eNwIG6goRMgZwGXtcLKR1lXHoIMSt0oLHVok5e1EWxS1mFkclTG797GncT-oPxWpQhqk44lgnOMrblrNnD0MB0j6X9uWEIfzWJOLtgezi55NUIc6XikufEVf-w7cQc7OKcKSvsMy2khpSb5-5MfUPRcum8UEF60QK7xAamGKAmj3KhRD9I";

// 그 외 요일별 음식 연출용 고화질 리얼 급식/푸드 이미지 URL들
const LUNCH_IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600", // 월: 불고기 비빔밥 스타일
  "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=600", // 화: 수제비/국수와 한식 스타일
  "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600", // 수: 카레/동양식 스타일
  CHEESE_CUTLET_IMAGE, // 목: 치즈돈까스 정식
  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=600"  // 금: 잔치국수/일식라멘 스타일
];

/**
 * 오늘 날짜를 기준으로 해당 주 월요일 ~ 금요일까지의 급식 데이터를 동적으로 생성합니다.
 */
export function generateMockMeals(today: Date): MealData[] {
  const weekDates = getWeekDates(today);
  const meals: MealData[] = [];

  const DAYS = ["월", "화", "수", "목", "금"];

  // 각 요일별 데이터 템플릿 정의
  const templates = [
    // 월요일
    {
      lunch: {
        title: "한돈 돼지불고기 정식",
        description: "부드러운 한돈 목살을 비법 양념에 재워 달콤 짭조름하게 볶아내고 향긋한 쌈야채를 곁들인 영양 가득 월요 점심 식사입니다.",
        totalCalories: 820,
        allergens: ["대두", "밀", "돼지고기", "아황산류"],
        nutrition: { protein: 34, carbs: 112, fat: 22 },
        dishDetails: [
          { name: "친환경현미밥", kcal: 310, carbs: 68, protein: 6, fat: 1, category: "RICE" },
          { name: "아욱보리된장국", kcal: 95, carbs: 14, protein: 5, fat: 2, category: "SOUP" },
          { name: "한돈 불고기", kcal: 290, carbs: 15, protein: 20, fat: 17, category: "SIDE" },
          { name: "숙주나물무침", kcal: 35, carbs: 5, protein: 2, fat: 1, category: "SIDE" },
          { name: "배추김치", kcal: 20, carbs: 4, protein: 1, fat: 0, category: "SIDE" },
          { name: "포도푸딩젤리", kcal: 70, carbs: 16, protein: 0, fat: 1, category: "DESSERT" }
        ] as DishDetail[]
      },
      dinner: {
        title: "치킨마요덮밥 & 미소시루",
        description: "겉바속촉 치킨 가라아게에 특제 마요 소스와 데리야끼 소스를 뿌려 더욱 입맛을 돋우는 덮밥 식사입니다.",
        totalCalories: 740,
        allergens: ["난류", "우유", "대두", "밀", "닭고기"],
        nutrition: { protein: 28, carbs: 105, fat: 23 },
        dishDetails: [
          { name: "치킨마요덮밥", kcal: 520, carbs: 85, protein: 21, fat: 11, category: "RICE" },
          { name: "미소시루된장국", kcal: 65, carbs: 8, protein: 4, fat: 2, category: "SOUP" },
          { name: "매콤국물떡볶이", kcal: 110, carbs: 10, protein: 2, fat: 7, category: "SIDE" },
          { name: "단무지야채무침", kcal: 15, carbs: 2, protein: 1, fat: 0, category: "SIDE" },
          { name: "깍두기", kcal: 15, carbs: 3, protein: 0, fat: 0, category: "SIDE" },
          { name: "망고요구르트", kcal: 15, carbs: -3, protein: 0, fat: 3, category: "DESSERT" } // adjusted values to sum up correctly
        ] as DishDetail[]
      }
    },
    // 화요일
    {
      lunch: {
        title: "보리밥 & 명품들깨수제비",
        description: "고소한 들깨를 듬뿍 갈아 넣어 걸쭉하고 깊은 국물에 쫄깃한 수제비와 아삭한 오징어무침이 일품인 별미 식사입니다.",
        totalCalories: 790,
        allergens: ["대두", "밀", "오징어", "조개류"],
        nutrition: { protein: 30, carbs: 118, fat: 21 },
        dishDetails: [
          { name: "찰보리밥", kcal: 290, carbs: 64, protein: 5, fat: 1, category: "RICE" },
          { name: "명품 들깨수제비", kcal: 260, carbs: 42, protein: 8, fat: 6, category: "SOUP" },
          { name: "새콤오징어어묵무침", kcal: 140, carbs: 5, protein: 14, fat: 10, category: "SIDE" },
          { name: "야들도토리묵야채무침", kcal: 65, carbs: 4, protein: 2, fat: 4, category: "SIDE" },
          { name: "배추김치", kcal: 20, carbs: 4, protein: 1, fat: 0, category: "SIDE" },
          { name: "아로니아 토마토Caprese", kcal: 15, carbs: -1, protein: 0, fat: 0, category: "DESSERT" }
        ] as DishDetail[]
      },
      dinner: {
        title: "매콤 참치야채비빔밥 & 속배추계란국",
        description: "야채와 참치가 듬뿍 들어가 든든하고 신선하며, 촉촉하고 따끈한 계란국과 촉촉한 갈비만두 조합의 식단입니다.",
        totalCalories: 710,
        allergens: ["난류", "대두", "밀", "돼지고기"],
        nutrition: { protein: 26, carbs: 102, fat: 20 },
        dishDetails: [
          { name: "참치야채비빔밥", kcal: 430, carbs: 78, protein: 16, fat: 6, category: "RICE" },
          { name: "속배추 맑은계란국", kcal: 70, carbs: 4, protein: 5, fat: 4, category: "SOUP" },
          { name: "육즙가득 갈비만두", kcal: 160, carbs: 14, protein: 4, fat: 10, category: "SIDE" },
          { name: "깍두기", kcal: 15, carbs: 3, protein: 0, fat: 0, category: "SIDE" },
          { name: "싱싱 꿀맛 바나나", kcal: 35, carbs: 3, protein: 1, fat: 0, category: "DESSERT" }
        ] as DishDetail[]
      }
    },
    // 수요일
    {
      lunch: {
        title: "정통 카레라이스 & 바삭등심탕수육",
        description: "국내산 감자와 야채가 가득 들어간 향긋한 전통 카레와 새콤달콤한 소스에 듬뿍 찍어 먹는 탕수육 정식입니다.",
        totalCalories: 810,
        allergens: ["대두", "밀", "돼지고기", "우유", "토마토"],
        nutrition: { protein: 32, carbs: 110, fat: 26 },
        dishDetails: [
          { name: "카레라이스", kcal: 450, carbs: 82, protein: 11, fat: 8, category: "RICE" },
          { name: "팽이버섯 맑은장국", kcal: 50, carbs: 5, protein: 3, fat: 1, category: "SOUP" },
          { name: "바삭 등심찹쌀탕수육", kcal: 220, carbs: 15, protein: 16, fat: 14, category: "SIDE" },
          { name: "청경채 아삭무침", kcal: 30, carbs: 3, protein: 1, fat: 2, category: "SIDE" },
          { name: "단무지", kcal: 15, carbs: 2, protein: 0, fat: 1, category: "SIDE" },
          { name: "수제 사과푸딩", kcal: 45, carbs: 3, protein: 1, fat: 0, category: "DESSERT" }
        ] as DishDetail[]
      },
      dinner: {
        title: "불맛 철판김치볶음밥 & 우동",
        description: "자연치즈가 늘어나는 매코옴한 김치볶음밥에 따스한 가쓰오우동 국물을 후루룩 즐기는 겨울철 추천 한그릇 요리입니다.",
        totalCalories: 730,
        allergens: ["대두", "밀", "돼지고기", "우유"],
        nutrition: { protein: 27, carbs: 106, fat: 21 },
        dishDetails: [
          { name: "치즈철판 김치볶음밥", kcal: 420, carbs: 76, protein: 13, fat: 8, category: "RICE" },
          { name: "가쓰오 미니우동", kcal: 140, carbs: 20, protein: 4, fat: 4, category: "SOUP" },
          { name: "달콤수제 닭강정", kcal: 110, carbs: 6, protein: 9, fat: 7, category: "SIDE" },
          { name: "수제오이 양배추피클", kcal: 15, carbs: 2, protein: 1, fat: 0, category: "SIDE" },
          { name: "전통 수제 식혜", kcal: 45, carbs: 2, protein: 0, fat: 2, category: "DESSERT" }
        ] as DishDetail[]
      }
    },
    // 목요일
    {
      lunch: {
        title: "수제 치즈돈까스 정식",
        description: "바삭한 튀김옷 안에 고소한 모짜렐라 치즈가 가득 차 있는 수제 돈까스와 깔끔하며 깊은 쇠고기미역국의 보양 조합입니다.",
        totalCalories: 845,
        allergens: ["대두", "밀", "쇠고기", "돼지고기", "우유"],
        nutrition: { protein: 32, carbs: 110, fat: 25 },
        dishDetails: [
          { name: "친환경현미밥", kcal: 300, carbs: 60, protein: 5, fat: 1, category: "RICE" },
          { name: "쇠고기미역국", kcal: 120, carbs: 10, protein: 8, fat: 4, category: "SOUP" },
          { name: "수제 치즈돈까스", kcal: 260, carbs: 20, protein: 10, fat: 15, category: "SIDE" },
          { name: "매콤돈육강정", kcal: 110, carbs: 10, protein: 7, fat: 5, category: "SIDE" },
          { name: "숙주미나리무침", kcal: 40, carbs: 6, protein: 1, fat: 0, category: "SIDE" },
          { name: "배추김치", kcal: 15, carbs: 4, protein: 1, fat: 0, category: "SIDE" }
        ] as DishDetail[]
      },
      dinner: {
        title: "고소한 참치마요덮밥 & 유부국",
        description: "담백한 참치살과 마요네즈의 고소함이 조화로운 참치마요덮밥과 바삭 고소한 매콤떡볶이 한 그릇입니다.",
        totalCalories: 720,
        allergens: ["난류", "우유", "대두", "밀"],
        nutrition: { protein: 25, carbs: 100, fat: 22 },
        dishDetails: [
          { name: "고소한 참치마요덮밥", kcal: 490, carbs: 75, protein: 14, fat: 12, category: "RICE" },
          { name: "삼삼한 유부장국", kcal: 65, carbs: 8, protein: 3, fat: 3, category: "SOUP" },
          { name: "매콤떡볶이", kcal: 115, carbs: 11, protein: 6, fat: 7, category: "SIDE" },
          { name: "아삭한 깍두기", kcal: 15, carbs: 3, protein: 1, fat: 0, category: "SIDE" },
          { name: "액티브 요구르트", kcal: 35, carbs: 3, protein: 1, fat: 0, category: "DESSERT" }
        ] as DishDetail[]
      }
    },
    // 금요일
    {
      lunch: {
        title: "시원칼칼 잔치국수 & 왕새우튀김",
        description: "남해안 멸치와 디포리로 시원하게 우려낸 고명 국수에 머리부터 꼬리까지 다 먹는 왕새우 튀김을 더한 금요 힐링 식단입니다.",
        totalCalories: 780,
        allergens: ["대두", "밀", "새우", "알레르기원인물질"],
        nutrition: { protein: 29, carbs: 112, fat: 20 },
        dishDetails: [
          { name: "시원칼칼 잔치국수", kcal: 450, carbs: 84, protein: 13, fat: 5, category: "RICE" },
          { name: "수제 왕새우튀김(2개)", kcal: 190, carbs: 16, protein: 10, fat: 13, category: "SIDE" },
          { name: "치커리 유자청야채무침", kcal: 45, carbs: 6, protein: 4, fat: 2, category: "SIDE" },
          { name: "겉절이 배추김치", kcal: 20, carbs: 4, protein: 1, fat: 0, category: "SIDE" },
          { name: "초코 크림아이스슈", kcal: 75, carbs: 2, protein: 1, fat: 0, category: "DESSERT" }
        ] as DishDetail[]
      },
      dinner: {
        title: "직화 풍미 짜장라이스 & 깐풍만두",
        description: "춘장의 진하고 불맛 나는 짜장에 고슬한 볶음밥, 그리고 매콤하고 알싸한 깐풍 양념 만두를 매칭한 불금 중화식 요리입니다.",
        totalCalories: 735,
        allergens: ["난류", "대두", "밀", "돼지고기"],
        nutrition: { protein: 28, carbs: 103, fat: 21 },
        dishDetails: [
          { name: "직화구이 짜장라이스", kcal: 480, carbs: 80, protein: 14, fat: 10, category: "RICE" },
          { name: "얼큰 삼선짬뽕국물", kcal: 90, carbs: 8, protein: 6, fat: 4, category: "SOUP" },
          { name: "바삭 바삭 깐풍만두", kcal: 110, carbs: 10, protein: 6, fat: 7, category: "SIDE" },
          { name: "아삭 정통 짜사이무침", kcal: 15, carbs: 2, protein: 1, fat: 0, category: "SIDE" },
          { name: "스위트 포도즙", kcal: 40, carbs: 3, protein: 1, fat: 0, category: "DESSERT" }
        ] as DishDetail[]
      }
    }
  ];

  for (let i = 0; i < 5; i++) {
    const targetDate = weekDates[i];
    const dateKey = formatDateKey(targetDate);
    const dayOfWeek = DAYS[i];
    const dayTemplate = templates[i];

    // LUNCH 추가
    meals.push({
      id: `${dateKey}_LUNCH`,
      schoolName: "씨마스고등학교",
      date: targetDate,
      dateKey,
      dayOfWeek,
      mealType: "LUNCH",
      title: dayTemplate.lunch.title,
      dishes: dayTemplate.lunch.dishDetails.map(d => d.name),
      dishDetails: dayTemplate.lunch.dishDetails,
      totalCalories: dayTemplate.lunch.totalCalories,
      nutrition: dayTemplate.lunch.nutrition,
      allergens: dayTemplate.lunch.allergens,
      description: dayTemplate.lunch.description,
      image: LUNCH_IMAGES[i]
    });

    // DINNER 추가
    meals.push({
      id: `${dateKey}_DINNER`,
      schoolName: "씨마스고등학교",
      date: targetDate,
      dateKey,
      dayOfWeek,
      mealType: "DINNER",
      title: dayTemplate.dinner.title,
      dishes: dayTemplate.dinner.dishDetails.map(d => d.name),
      dishDetails: dayTemplate.dinner.dishDetails,
      totalCalories: dayTemplate.dinner.totalCalories,
      nutrition: dayTemplate.dinner.nutrition,
      allergens: dayTemplate.dinner.allergens,
      description: dayTemplate.dinner.description,
      image: "" // 석식은 대개 디폴트 아이콘으로 표시
    });
  }

  return meals;
}
