import { useState, useEffect } from "react";
import { 
  UtensilsCrossed, 
  Bell, 
  Home as HomeIcon, 
  Calendar as CalendarIcon, 
  Calculator as CalculatorIcon, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  Heart, 
  Flame, 
  Sun, 
  Moon, 
  AlertTriangle, 
  Plus, 
  ChevronRight, 
  LogOut, 
  Check, 
  Smile,
  Info
} from "lucide-react";
import { 
  getTodayKST, 
  formatKoreanDate, 
  getWeekDates, 
  getWeekOfMonth, 
  getDefaultSelectedDate, 
  getKoreanDayOfWeek,
  formatDateKey
} from "./utils/dateUtils";
import { generateMockMeals } from "./data/mockMeals";
import { MealData, TabType, DishDetail } from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("HOME");
  const [today] = useState<Date>(() => getTodayKST());
  const [selectedDate, setSelectedDate] = useState<Date>(() => getDefaultSelectedDate(today));
  const [meals, setMeals] = useState<MealData[]>([]);
  
  // 프로필 설정용 상태
  const [allergies, setAllergies] = useState<string[]>(["우유", "땅콩"]);
  const [warningEnabled, setWarningEnabled] = useState(true);
  const [dailyAlertEnabled, setDailyAlertEnabled] = useState(true);
  
  // 좋아요 상태 기록
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // 영양계션 화면용 상태
  const [selectedMealType, setSelectedMealType] = useState<"LUNCH" | "DINNER">("LUNCH");
  const [nutritionFilter, setNutritionFilter] = useState<"ALL" | "RICE" | "SOUP" | "SIDE" | "DESSERT">("ALL");
  const [checkedDishes, setCheckedDishes] = useState<Record<string, boolean>>({});
  
  // 주말 여부 판단 (0: 일요일, 6: 토요일)
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  // 컴포넌트 최초 로드 및 디바이스 초기화
  useEffect(() => {
    // KST 기준으로 구한 오늘의 주간 식단 로드
    const loadedMeals = generateMockMeals(today);
    setMeals(loadedMeals);

    // 기본 영양계산 아이템들을 오늘 식단(중식) 기준으로 자동 세팅
    // 오늘 요일이 주중이면 오늘, 주말이면 다음주 월요일의 중식 기준
    const baseDate = getDefaultSelectedDate(today);
    const dateKey = formatDateKey(baseDate);
    const todayLunch = loadedMeals.find(m => m.dateKey === dateKey && m.mealType === "LUNCH");
    
    if (todayLunch) {
      const initialChecked: Record<string, boolean> = {};
      todayLunch.dishDetails.forEach(dish => {
        // 밥, 국, 메인 반찬은 기본 선택 상태로 구성
        if (dish.category !== "DESSERT") {
          initialChecked[dish.name] = true;
        }
      });
      setCheckedDishes(initialChecked);
    }
  }, [today]);

  // 특정 날짜의 중식/석식 구하기
  const getMealsForDate = (date: Date) => {
    const key = formatDateKey(date);
    return meals.filter(m => m.dateKey === key);
  };

  // 홈 화면용 급식정보 결정
  // 오늘이 주말(토/일)인 경우, 방식 B에 따라 "다음 급식일(월요일)" 식단을 렌더링하고 "다음 급식일" 배지를 붙입니다.
  const displayDateForHome = isWeekend ? getDefaultSelectedDate(today) : today;
  const homeMeals = getMealsForDate(displayDateForHome);
  const homeLunch = homeMeals.find(m => m.mealType === "LUNCH");
  const homeDinner = homeMeals.find(m => m.mealType === "DINNER");

  // 현재 식단표 탭에서 보는 식사 리스트
  const scheduleMeals = getMealsForDate(selectedDate);
  const scheduleLunch = scheduleMeals.find(m => m.mealType === "LUNCH");
  const scheduleDinner = scheduleMeals.find(m => m.mealType === "DINNER");

  // 식단표 탭에 노출될 월~금 주간 날짜 버튼 배열
  const weekDates = getWeekDates(today);

  // 영양계산 탭에서 선택된 기준일 식단
  const nutritionBaseDate = isWeekend ? getDefaultSelectedDate(today) : today;
  const nutritionMeals = getMealsForDate(nutritionBaseDate);
  const nutritionMeal = nutritionMeals.find(m => m.mealType === selectedMealType);

  // 영양 계산 실시간 계산기
  const calculateTotalNutrition = () => {
    let totalKcal = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    if (nutritionMeal) {
      nutritionMeal.dishDetails.forEach(dish => {
        if (checkedDishes[dish.name]) {
          totalKcal += dish.kcal;
          totalProtein += dish.protein;
          totalCarbs += dish.carbs;
          totalFat += dish.fat;
        }
      });
    }

    return { kcal: totalKcal, protein: totalProtein, carbs: totalCarbs, fat: totalFat };
  };

  const currentNutrition = calculateTotalNutrition();

  const handleFavoriteToggle = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddAllerggy = () => {
    const input = prompt("추가할 알레르기 성분명을 입력하세요 (예: 계란, 메밀, 밀)");
    if (input && input.trim()) {
      const trimmed = input.trim();
      if (!allergies.includes(trimmed)) {
        setAllergies([...allergies, trimmed]);
      }
    }
  };

  const handleRemoveAllergy = (name: string) => {
    setAllergies(allergies.filter(a => a !== name));
  };

  // 급식 알레르기 유무 체크
  const checkAllergyWarning = (mealAllergens: string[] = []) => {
    if (!warningEnabled) return false;
    return mealAllergens.some(al => allergies.includes(al));
  };

  return (
    <div className="bg-[#FAF7EF] text-[#201b11] font-sans antialiased min-h-screen flex justify-center w-full">
      {/* 데스크탑 전용 사이드바 (넓은 화면 시 왼쪽 고정) */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 w-64 h-screen bg-[#ede1d1] border-r border-[#c4c9b4]/30 p-6 z-40">
        <div className="flex items-center gap-3 mb-10 text-[#4f6f00]">
          <UtensilsCrossed className="w-8 h-8" />
          <span className="font-bold text-xl">씨마스고교 급식</span>
        </div>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setCurrentTab("HOME")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${currentTab === "HOME" ? "bg-[#3c5500] text-white" : "text-[#444939] hover:bg-[#f3e6d7]"}`}
          >
            <HomeIcon className="w-5 h-5" />
            홈
          </button>
          <button 
            onClick={() => setCurrentTab("SCHEDULE")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${currentTab === "SCHEDULE" ? "bg-[#3c5500] text-white" : "text-[#444939] hover:bg-[#f3e6d7]"}`}
          >
            <CalendarIcon className="w-5 h-5" />
            식단표
          </button>
          <button 
            onClick={() => setCurrentTab("NUTRITION")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${currentTab === "NUTRITION" ? "bg-[#3c5500] text-white" : "text-[#444939] hover:bg-[#f3e6d7]"}`}
          >
            <CalculatorIcon className="w-5 h-5" />
            영양계산
          </button>
          <button 
            onClick={() => setCurrentTab("PROFILE")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors w-full text-left ${currentTab === "PROFILE" ? "bg-[#3c5500] text-white" : "text-[#444939] hover:bg-[#f3e6d7]"}`}
          >
            <UserIcon className="w-5 h-5" />
            프로필
          </button>
        </nav>
      </aside>

      {/* 모바일 래퍼 컨테이너 (390px 최대 가로폭, 데스크탑일 때는 오른쪽에 띄우지만 기본 레이아웃 미러링) */}
      <div className="w-full max-w-[390px] bg-[#fff8f3] min-h-screen relative flex flex-col md:ml-64 shadow-xl pb-24 overflow-x-hidden">
        
        {/* 공통 상단바 AppHeader */}
        <header className="flex justify-between items-center w-full px-5 h-16 bg-[#fff8f3]/80 backdrop-blur-md sticky top-0 z-40 border-b border-[#ede1d1]/20">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-[#3c5500]" />
            <h1 className="font-bold text-lg text-[#4f6f00]">씨마스고등학교 급식</h1>
          </div>
          <button className="text-[#747967] hover:opacity-80 transition-opacity p-2 rounded-full hover:bg-[#ede1d1]" onClick={() => alert("알림함이 비어있습니다.")}>
            <Bell className="w-5 h-5" />
          </button>
        </header>

        {/* 탭 라우터 메인 바디 */}
        <main className="flex-1 px-5 pt-3 pb-6 flex flex-col gap-6">
          
          {/*================ HOME TAB ================*/}
          {currentTab === "HOME" && (
            <div className="flex flex-col gap-6">
              {/* 주말 알림 배지 (방식 B 적용 시 배지 디스플레이) */}
              {isWeekend && (
                <div className="bg-[#d2ea7a] text-[#3e4c00] rounded-xl p-3 flex items-center gap-2.5 border border-[#b9d164] transition-all animate-pulse">
                  <Info className="w-5 h-5 shrink-0" />
                  <div className="text-xs font-semibold">
                    오늘은 주말이라 <span className="underline font-bold">다음 급식일(월요일)</span> 식단을 미리 보여드립니다.
                  </div>
                </div>
              )}

              {/* 히어로 카드 (오늘의 추천 급식) */}
              {homeLunch ? (
                <article className="bg-white rounded-[24px] shadow-[0_4px_15px_rgba(42,36,26,0.04)] overflow-hidden relative border border-[#ede1d1]/30">
                  <div className="relative h-48 w-full bg-[#e4d8c9]">
                    {homeLunch.image ? (
                      <img 
                        alt={homeLunch.title} 
                        className="w-full h-full object-cover" 
                        src={homeLunch.image}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#747967]">이미지 준비중</div>
                    )}
                    <div className="absolute top-4 right-4 bg-[#606a3f]/90 text-[#dfeab3] rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
                      오늘의 추천 급식
                    </div>
                    {isWeekend && (
                      <div className="absolute top-4 left-4 bg-[#3c5500] text-white rounded-md px-2.5 py-0.5 text-xs font-bold shadow-md">
                        다음 급식일
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-[#3c5500] mb-1">
                          {formatKoreanDate(displayDateForHome)}
                        </p>
                        <h2 className="text-xl font-bold text-[#201b11]">{homeLunch.title}</h2>
                      </div>
                      <button 
                        onClick={() => handleFavoriteToggle(homeLunch.id)}
                        className={`transition-colors p-2 -mr-2 -mt-2 ${favorites[homeLunch.id] ? "text-[#ba1a1a]" : "text-[#747967] hover:text-[#ba1a1a]"}`}
                      >
                        <Heart className="w-6 h-6" fill={favorites[homeLunch.id] ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1 text-[#444939] text-sm">
                      <Flame className="w-4 h-4 text-[#747967]" />
                      <span className="font-semibold">{homeLunch.totalCalories} kcal</span>
                    </div>

                    <p className="text-sm text-[#444939] leading-relaxed">
                      {homeLunch.description || "당해 일자 정성스레 조리해 제공하는 알차고 군침 도는 대표 식단표입니다."}
                    </p>

                    {checkAllergyWarning(homeLunch.allergens) && (
                      <div className="mt-2 bg-[#ffdad6] text-[#93000a] text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
                        <span>주의! 마이 설정 알레르기 물질 포함: {homeLunch.allergens.filter(a => allergies.includes(a)).join(", ")}</span>
                      </div>
                    )}
                  </div>
                </article>
              ) : (
                <div className="p-10 text-center text-[#747967] bg-white rounded-3xl border border-[#ede1d1]/20">급식 정보가 등록되어 있지 않습니다.</div>
              )}

              {/* 오늘의 급식 요약 섹션 */}
              <section className="flex flex-col gap-3">
                <h3 className="font-bold text-lg text-[#201b11] px-1">오늘의 급식 요약</h3>
                <div className="flex flex-col gap-4">
                  
                  {/* 중식 카드 */}
                  {homeLunch ? (
                    <div className="bg-white rounded-[24px] shadow-[0_4px_15px_rgba(42,36,26,0.04)] p-5 border border-[#ede1d1]/30 flex flex-col gap-3.5 relative overflow-hidden">
                      <div className="flex justify-between items-center border-b border-[#ede1d1]/40 pb-3">
                        <div className="flex items-center gap-2">
                          <Sun className="w-5 h-5 text-[#3c5500]" fill="currentColor" />
                          <h4 className="font-bold text-[#201b11]">중식</h4>
                        </div>
                        <span className="text-xs font-bold text-[#444939] bg-[#f8ecdc] px-3 py-1 rounded-full">{homeLunch.totalCalories} kcal</span>
                      </div>
                      <p className="text-sm leading-loose text-[#201b11] font-medium">
                        {homeLunch.dishes.join(", ")}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {homeLunch.allergens.map((alg, index) => {
                          const isMatch = allergies.includes(alg) && warningEnabled;
                          return (
                            <span 
                              key={index}
                              className={`px-2.5 py-0.5 font-semibold text-xs rounded-full ${isMatch ? "bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/20 animate-pulse" : "bg-[#dde8b2] text-[#414b23]"}`}
                            >
                              {alg}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {/* 석식 카드 */}
                  {homeDinner ? (
                    <div className="bg-white rounded-[24px] shadow-[0_4px_15px_rgba(42,36,26,0.04)] p-5 border border-[#ede1d1]/30 flex flex-col gap-3.5 relative overflow-hidden">
                      <div className="flex justify-between items-center border-b border-[#ede1d1]/40 pb-3">
                        <div className="flex items-center gap-2">
                          <Moon className="w-5 h-5 text-[#536500]" fill="currentColor" />
                          <h4 className="font-bold text-[#201b11]">석식</h4>
                        </div>
                        <span className="text-xs font-bold text-[#444939] bg-[#f8ecdc] px-3 py-1 rounded-full">{homeDinner.totalCalories} kcal</span>
                      </div>
                      <p className="text-sm leading-loose text-[#201b11] font-medium">
                        {homeDinner.dishes.join(", ")}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {homeDinner.allergens.map((alg, index) => {
                          const isMatch = allergies.includes(alg) && warningEnabled;
                          return (
                            <span 
                              key={index}
                              className={`px-2.5 py-0.5 font-semibold text-xs rounded-full ${isMatch ? "bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/20 animate-pulse" : "bg-[#dde8b2] text-[#414b23]"}`}
                            >
                              {alg}
                            </span>
                          );
                        })}
                      </div>
                      
                      {checkAllergyWarning(homeDinner.allergens) && (
                        <div className="mt-1 text-[11px] font-bold text-[#ba1a1a] flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          석식에 설정하신 알레르기 수식이 감지되었습니다!
                        </div>
                      )}
                    </div>
                  ) : null}

                </div>
              </section>
            </div>
          )}

          {/*================ SCHEDULE TAB ================*/}
          {currentTab === "SCHEDULE" && (
            <div className="flex flex-col gap-5">
              
              {/*주차 타이틀*/}
              <section className="flex flex-col gap-1">
                <p className="text-xs font-bold text-[#496800]">주간 식단표</p>
                <h2 className="text-2xl font-bold text-[#201b11]">{getWeekOfMonth(selectedDate)}</h2>
              </section>

              {/* 주간 날짜 선택기 WeekDateSelector */}
              <section className="flex justify-between items-center bg-white rounded-xl p-2 shadow-[0_4px_15px_rgba(42,36,26,0.04)] border border-[#ede1d1]/50">
                {weekDates.map((date, idx) => {
                  const dayName = getKoreanDayOfWeek(date);
                  const isSelected = formatDateKey(date) === formatDateKey(selectedDate);
                  const isThisDayToday = formatDateKey(date) === formatDateKey(today);

                  return (
                    <button 
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`flex flex-col items-center justify-center py-2.5 rounded-lg w-12 transition-all relative ${isSelected ? "bg-[#3c5500] text-white shadow-md scale-105" : "text-[#747967] hover:bg-[#f8ecdc]/40"}`}
                    >
                      <span className={`text-xs font-semibold ${isSelected ? "text-white/80" : "text-[#747967]"}`}>{dayName}</span>
                      <span className="text-base font-bold mt-0.5">{date.getDate()}</span>
                      
                      {/* 오늘 날짜 표시용 전용 마침표점 */}
                      {isThisDayToday && (
                        <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#d5ed7d]" : "bg-[#3c5500]"}`} />
                      )}
                    </button>
                  );
                })}
              </section>

              {/* 해당 날짜의 급식 정보 */}
              <div className="flex flex-col gap-4">
                
                {/* 중식 카드 */}
                {scheduleLunch ? (
                  <article className="bg-white rounded-[24px] p-5 shadow-[0_4px_15px_rgba(42,36,26,0.04)] flex flex-col gap-4 border border-[#ede1d1]/30 relative">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Sun className="w-5 h-5 text-[#3c5500]" fill="currentColor" />
                        <h3 className="text-lg font-bold text-[#201b11]">중식</h3>
                      </div>
                      <span className="bg-[#d2ea7a] text-[#576a00] font-bold text-xs px-3 py-1 rounded-full">{scheduleLunch.totalCalories} kcal</span>
                    </div>

                    <p className="text-sm text-[#444939] leading-loose font-medium">
                      {scheduleLunch.dishes.join(", ")}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {scheduleLunch.allergens.map((alg, index) => {
                        const isMatch = allergies.includes(alg) && warningEnabled;
                        return (
                          <span 
                            key={index}
                            className={`px-2.5 py-0.5 font-semibold text-xs rounded-full ${isMatch ? "bg-[#ffdad6] text-[#93000a] animate-pulse border border-[#ba1a1a]/10" : "bg-[#f8ecdc] text-[#444939]"}`}
                          >
                            {alg}
                          </span>
                        );
                      })}
                    </div>

                    {/* 단백질 달성률 프로그레스 바 연출 */}
                    <div className="mt-2 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#496800]">권장 단백질 섭취 기준 대비</span>
                        <span className="font-bold text-[#3c5500]">85% 달성</span>
                      </div>
                      <div className="h-2 w-full bg-[#f3e6d7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#3c5500] rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </article>
                ) : (
                  <div className="p-8 text-center bg-white rounded-3xl border text-[#747967]">선택하신 날짜의 급식이 등록되어 있지 않습니다.</div>
                )}

                {/* 석식 카드 */}
                {scheduleDinner ? (
                  <article className="bg-white rounded-[24px] p-5 shadow-[0_4px_15px_rgba(42,36,26,0.04)] flex flex-col gap-4 border border-[#ede1d1]/30 relative">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Moon className="w-5 h-5 text-[#747967]" fill="currentColor" />
                        <h3 className="text-lg font-bold text-[#201b11]">석식</h3>
                      </div>
                      <span className="bg-[#ede1d1] text-[#444939] font-bold text-xs px-3 py-1 rounded-full">{scheduleDinner.totalCalories} kcal</span>
                    </div>

                    <p className="text-sm text-[#444939] leading-loose font-medium">
                      {scheduleDinner.dishes.join(", ")}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {scheduleDinner.allergens.map((alg, index) => {
                        const isMatch = allergies.includes(alg) && warningEnabled;
                        return (
                          <span 
                            key={index}
                            className={`px-2.5 py-0.5 font-semibold text-xs rounded-full ${isMatch ? "bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/10 animate-pulse" : "bg-[#f8ecdc] text-[#444939]"}`}
                          >
                            {alg}
                          </span>
                        );
                      })}
                    </div>

                    {/* 단백질 달성률 프로그레스 바 */}
                    <div className="mt-2 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#747967]">권장 단백질 섭취 기준 대비</span>
                        <span className="font-bold text-[#444939]">60% 달성</span>
                      </div>
                      <div className="h-2 w-full bg-[#f3e6d7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#747967] rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                  </article>
                ) : null}

              </div>

            </div>
          )}

          {/*================ NUTRITION TAB ================*/}
          {currentTab === "NUTRITION" && (
            <div className="flex flex-col gap-5">
              
              {/* 영양 정보 누적 합계 카드 */}
              <section className="bg-white rounded-xl p-5 shadow-[0_15px_30px_-5px_rgba(42,36,26,0.04)] border border-[#ede1d1] flex flex-col gap-3">
                <div>
                  <h2 className="text-xl font-bold text-[#201b11]">오늘의 선택 영양</h2>
                  <p className="text-xs text-[#747967] mt-0.5">체크하여 나만의 섭취 칼로리를 완벽 환산해 보세요.</p>
                </div>
                
                <div className="flex items-end gap-1.5 mt-2 text-[#3c5500]">
                  <span className="text-3xl font-extrabold tracking-tight">{currentNutrition.kcal}</span>
                  <span className="text-sm font-semibold mb-1 col-span-1">kcal</span>
                </div>

                {/* 영양 지표 3대 분석 프로그레스 바 */}
                <div className="flex flex-col gap-3.5 mt-2">
                  {/* 단백질 */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#201b11]">단백질</span>
                      <span className="font-bold text-[#3c5500]">{currentNutrition.protein}g</span>
                    </div>
                    <div className="w-full bg-[#ede1d1] rounded-full h-2">
                      <div 
                        className="bg-[#3c5500] rounded-full h-2 transition-all duration-300"
                        style={{ width: `${Math.min((currentNutrition.protein / 60) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 탄수화물 */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#201b11]">탄수화물</span>
                      <span className="font-bold text-[#485229]">{currentNutrition.carbs}g</span>
                    </div>
                    <div className="w-full bg-[#ede1d1] rounded-full h-2">
                      <div 
                        className="bg-[#485229] rounded-full h-2 transition-all duration-300" 
                        style={{ width: `${Math.min((currentNutrition.carbs / 250) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 지방 */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#201b11]">지방</span>
                      <span className="font-bold text-[#536500]">{currentNutrition.fat}g</span>
                    </div>
                    <div className="w-full bg-[#ede1d1] rounded-full h-2">
                      <div 
                        className="bg-[#536500] rounded-full h-2 transition-all duration-300" 
                        style={{ width: `${Math.min((currentNutrition.fat / 70) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 중식 / 석식 토글 버튼 */}
              <div className="flex bg-[#ede1d1]/50 p-1.5 rounded-xl gap-2">
                <button 
                  onClick={() => setSelectedMealType("LUNCH")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${selectedMealType === "LUNCH" ? "bg-white text-[#3c5500] shadow-sm" : "text-[#747967]"}`}
                >
                  중식 메뉴 기준
                </button>
                <button 
                  onClick={() => setSelectedMealType("DINNER")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${selectedMealType === "DINNER" ? "bg-white text-[#536500] shadow-sm" : "text-[#747967]"}`}
                >
                  석식 메뉴 기준
                </button>
              </div>

              {/* 음식 분류 필터 칩스 */}
              <section className="flex gap-2 overflow-x-auto pb-1.5 -mx-5 px-5 no-scrollbar shrink-0">
                {[
                  { key: "ALL", label: "전체" },
                  { key: "RICE", label: "밥류" },
                  { key: "SOUP", label: "국/찌개" },
                  { key: "SIDE", label: "반찬" },
                  { key: "DESSERT", label: "디저트" }
                ].map((chip) => {
                  const isActive = nutritionFilter === chip.key;
                  return (
                    <button 
                      key={chip.key}
                      onClick={() => setNutritionFilter(chip.key as any)}
                      className={`shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all ${isActive ? "bg-[#3c5500] text-white border-[#3c5500]" : "bg-[#f8ecdc] text-[#444939] border-[#c4c9b4]/50 hover:bg-[#ede1d1]"}`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </section>

              {/* 선택 가능한 구성 메뉴 리스트 */}
              <section className="flex flex-col gap-3">
                {nutritionMeal ? (
                  nutritionMeal.dishDetails
                    .filter(dish => nutritionFilter === "ALL" || dish.category === nutritionFilter)
                    .map((dish, idx) => {
                      const isChecked = !!checkedDishes[dish.name];
                      return (
                        <div 
                          key={idx}
                          onClick={() => setCheckedDishes(prev => ({ ...prev, [dish.name]: !isChecked }))}
                          className={`rounded-lg p-4 flex items-center justify-between border-2 ambient-shadow cursor-pointer transition-all active:scale-95 bg-white ${isChecked ? "border-[#3c5500]" : "border-transparent"}`}
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-[#201b11]">{dish.name}</span>
                            <span className="text-xs text-[#747967] mt-0.5">{dish.kcal} kcal / 탄: {dish.carbs}g, 단: {dish.protein}g, 지: {dish.fat}g</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${isChecked ? "bg-[#3c5500] border-[#3c5500] text-white" : "border-[#c4c9b4]"}`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="p-8 text-center text-[#747967]">기준급식 메뉴가 미등록 상태입니다.</div>
                )}
              </section>

              {/* 결과 저장 액션 버튼 */}
              <button 
                onClick={() => alert(`칼로리 계산 결과(${currentNutrition.kcal} kcal)가 급식 리포트에 정상 기록되었습니다!`)}
                className="w-full bg-[#3c5500] hover:bg-[#3c5500]/90 text-white font-bold py-4 rounded-xl mt-2 active:scale-95 transition-transform shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                계산 결과 저장하기
              </button>

            </div>
          )}

          {/*================ PROFILE TAB ================*/}
          {currentTab === "PROFILE" && (
            <div className="flex flex-col gap-6">
              
              {/* 프로필 요약 카드 */}
              <section className="bg-gradient-to-br from-white to-[#dde8b2]/40 rounded-xl p-6 shadow-[0_4px_15px_rgba(42,36,26,0.04)] border border-[#ede1d1]/30 flex items-center justify-between relative overflow-hidden group hover:border-[#3c5500]/20 transition-colors">
                <div className="flex items-center gap-4 z-10">
                  <div className="w-16 h-16 rounded-full bg-[#f8ecdc] flex items-center justify-center shadow-inner border border-[#ede1d1]">
                    <Smile className="w-8 h-8 text-[#3c5500]" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-[#201b11]">김학생</h2>
                    <p className="text-xs font-semibold text-[#444939] mt-0.5">2학년 3반 15번</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert("개인 정보 수정 기능 준비중입니다.")}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#747967] hover:text-[#3c5500] transition-colors z-10 hover:shadow"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#d5ed7d]/20 rounded-full blur-2xl"></div>
              </section>

              {/* 알레르기 및 알람 인포 기교 설정 */}
              <section className="flex flex-col gap-3">
                <h3 className="font-bold text-[#4f6f00] text-sm px-2">설정</h3>
                <div className="bg-white rounded-xl p-5 shadow-[0_4px_15px_rgba(42,36,26,0.04)] flex flex-col gap-4 border border-[#ede1d1]/20">
                  
                  {/* 알레르기 경고 알림 토글 스위치 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col pr-4">
                        <span className="text-[#201b11] font-bold text-sm">알레르기 경고 알림</span>
                        <span className="text-xs text-[#444939] mt-1 leading-relaxed">식단에 설정 알레르기 유발 물질이 포함되면 표시됩니다.</span>
                      </div>
                      
                      {/* 스위치 토글 */}
                      <button 
                        onClick={() => setWarningEnabled(!warningEnabled)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${warningEnabled ? "bg-[#3c5500]" : "bg-[#c4c9b4]"}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${warningEnabled ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>

                    {/* 알레르기 칩스 목록 */}
                    <div className="flex flex-wrap gap-2 mt-1">
                      {allergies.map((alg) => (
                        <div 
                          key={alg} 
                          className="bg-[#dde8b2] text-[#414b23] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-[#c4c9b4]/30"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#414b23]" />
                          <span>{alg}</span>
                          <button 
                            onClick={() => handleRemoveAllergy(alg)}
                            className="ml-1 text-[#414b23] hover:text-[#ba1a1a] p-0.5 hover:bg-[#fff]/30 rounded-full text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      
                      <button 
                        onClick={handleAddAllerggy}
                        className="bg-[#f8ecdc] text-[#444939] px-3 py-1 rounded-full text-xs font-bold flex items-center slot gap-1 border border-[#c4c9b4] border-dashed hover:bg-[#ede1d1] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        추가
                      </button>
                    </div>

                  </div>

                  <hr className="border-[#ede1d1]/60" />

                  {/* 일일 급식 알림 토글 */}
                  <div className="flex justify-between items-start pt-1">
                    <div className="flex flex-col pr-4">
                      <span className="text-[#201b11] font-bold text-sm">일일 식단 알림</span>
                      <span className="text-xs text-[#444939] mt-1 leading-relaxed">매일 아침 8시에 스마트 기기 알람으로 오늘의 식단이 도착합니다.</span>
                    </div>

                    <button 
                      onClick={() => setDailyAlertEnabled(!dailyAlertEnabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${dailyAlertEnabled ? "bg-[#3c5500]" : "bg-[#c4c9b4]"}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${dailyAlertEnabled ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>

                </div>
              </section>

              {/* 부가 메뉴 링크 센터 */}
              <section className="flex flex-col bg-white rounded-xl shadow-[0_4px_15px_rgba(42,36,26,0.04)] border border-[#ede1d1]/30 overflow-hidden">
                <button 
                  onClick={() => alert("고객센터 연락처: 02-1234-5678")}
                  className="flex items-center justify-between p-4 w-full text-left bg-transparent hover:bg-[#f8ecdc]/30 transition-colors border-b border-[#ede1d1] active:bg-[#f8ecdc]/50"
                >
                  <span className="text-[#201b11] text-sm font-semibold">고객센터 / 문의하기</span>
                  <ChevronRight className="w-5 h-5 text-[#747967]" />
                </button>
                <button 
                  onClick={() => alert("씨마스고등학교 급식앱은 교육 행정 시스템과 연동되어 안전하고 보양이 되는 식단을 무료 수혜하는 것을 원칙으로 하는 학업 전용 앱입니다.")}
                  className="flex items-center justify-between p-4 w-full text-left bg-transparent hover:bg-[#f8ecdc]/30 transition-colors border-b border-[#ede1d1] active:bg-[#f8ecdc]/50"
                >
                  <span className="text-[#201b11] text-sm font-semibold">이용약관 및 고지</span>
                  <ChevronRight className="w-5 h-5 text-[#747967]" />
                </button>
                <button 
                  onClick={() => alert("김학생 님, 로그아웃이 무력화되어 항시 안전 연동 상태를 유지합니다.")}
                  className="flex items-center justify-between p-4 w-full text-left bg-transparent hover:bg-[#ffdad6]/20 transition-colors active:bg-[#ffdad6]/40"
                >
                  <span className="text-[#ba1a1a] text-sm font-semibold">로그아웃</span>
                  <LogOut className="w-5 h-5 text-[#ba1a1a]" />
                </button>
              </section>

              {/* 카피라이트 로고 */}
              <footer className="mt-8 flex flex-col items-center justify-center text-center opacity-70 pb-4">
                <p className="text-xs text-[#747967] mb-1">건강하고 맛있는 학교 식단을 지원합니다.</p>
                <p className="text-xs text-[#c4c9b4] font-semibold">© 2026 씨마스고등학교 급식</p>
              </footer>

            </div>
          )}

        </main>

        {/* 모바일 하단 내비게이션 바 BottomNavBar */}
        <nav className="fixed bottom-0 left-0 w-full max-w-[390px] mx-auto flex justify-around items-center px-1 pb-safe h-20 bg-[#fff8f3]/95 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.03)] z-50 rounded-t-2xl border-t border-[#ede1d1]/30">
          
          {/* 홈 버튼 */}
          <button 
            onClick={() => setCurrentTab("HOME")}
            className={`flex flex-col items-center justify-center text-xs font-semibold w-16 transition-all duration-200 ${currentTab === "HOME" ? "bg-[#3c5500] text-white rounded-full py-1.5 shadow-sm scale-105" : "text-[#747967] hover:bg-[#ede1d1]/30 py-1"}`}
          >
            <HomeIcon className="w-5 h-5 mb-0.5" />
            <span>홈</span>
          </button>

          {/* 식단표 버튼 */}
          <button 
            onClick={() => setCurrentTab("SCHEDULE")}
            className={`flex flex-col items-center justify-center text-xs font-semibold w-16 transition-all duration-200 ${currentTab === "SCHEDULE" ? "bg-[#3c5500] text-white rounded-full py-1.5 shadow-sm scale-105" : "text-[#747967] hover:bg-[#ede1d1]/30 py-1"}`}
          >
            <CalendarIcon className="w-5 h-5 mb-0.5" />
            <span>식단표</span>
          </button>

          {/* 영양계산 버튼 */}
          <button 
            onClick={() => setCurrentTab("NUTRITION")}
            className={`flex flex-col items-center justify-center text-xs font-semibold w-16 transition-all duration-200 ${currentTab === "NUTRITION" ? "bg-[#3c5500] text-white rounded-full py-1.5 shadow-sm scale-105" : "text-[#747967] hover:bg-[#ede1d1]/30 py-1"}`}
          >
            <CalculatorIcon className="w-5 h-5 mb-0.5" />
            <span>영양계산</span>
          </button>

          {/* 프로필 버튼 */}
          <button 
            onClick={() => setCurrentTab("PROFILE")}
            className={`flex flex-col items-center justify-center text-xs font-semibold w-16 transition-all duration-200 ${currentTab === "PROFILE" ? "bg-[#3c5500] text-white rounded-full py-1.5 shadow-sm scale-105" : "text-[#747967] hover:bg-[#ede1d1]/30 py-1"}`}
          >
            <UserIcon className="w-5 h-5 mb-0.5" />
            <span>프로필</span>
          </button>

        </nav>

      </div>
    </div>
  );
}
