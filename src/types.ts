export interface Nutrition {
  protein: number; // 단백질 (g)
  carbs: number;   // 탄수화물 (g)
  fat: number;     // 지방 (g)
}

export interface DishDetail {
  name: string;
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
  category: "RICE" | "SOUP" | "SIDE" | "DESSERT";
}

export interface MealData {
  id: string;
  schoolName: string; // "씨마스고등학교"
  date: Date;
  dateKey: string;     // "YYYYMMDD"
  dayOfWeek: string;   // "월" | "화" | "수" | "목" | "금"
  mealType: "LUNCH" | "DINNER";
  title: string;
  dishes: string[];
  dishDetails: DishDetail[];
  totalCalories: number;
  nutrition: Nutrition;
  allergens: string[];
  description?: string;
  image?: string;
}

export type TabType = "HOME" | "SCHEDULE" | "NUTRITION" | "PROFILE";
