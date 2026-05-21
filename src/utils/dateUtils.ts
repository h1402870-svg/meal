/**
 * 날짜 도우미 유틸리티 (KST 기준)
 */

export function getTodayKST(): Date {
  const now = new Date();
  // 타임존 보정: UTC 시간에서 KST 속성 추출용
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const kst = new Date(utc + (9 * 60 * 60 * 1000));
  kst.setHours(0, 0, 0, 0);
  return kst;
}

export function formatKoreanDate(date: Date): string {
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = days[date.getDay()];
  return `${month}월 ${day}일 ${dayName}`;
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export function getWeekDates(date: Date): Date[] {
  const currentDay = date.getDay(); // 0(일) ~ 6(토)
  // 월요일을 주의 시작으로 잡음
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(date);
  monday.setDate(date.getDate() + distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const weekDates: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d);
  }
  return weekDates;
}

export function getWeekOfMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 이번 달 1일 생성
  const firstDayOfMonth = new Date(year, date.getMonth(), 1);
  // 1일의 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // 월요일 기준 오프셋 계산 (월요일=1, ..., 일요일=7)
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const week = Math.ceil((day + offset) / 7);
  
  return `${month}월 ${week}주차`;
}

export function getDefaultSelectedDate(today: Date): Date {
  const day = today.getDay(); // 0: 일, 6: 토
  const res = new Date(today);
  res.setHours(0, 0, 0, 0);
  if (day === 0) { // 일요일 -> 다음 월요일 (+1)
    res.setDate(today.getDate() + 1);
    return res;
  } else if (day === 6) { // 토요일 -> 다음 월요일 (+2)
    res.setDate(today.getDate() + 2);
    return res;
  }
  return res;
}

export function getKoreanDayOfWeek(date: Date): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
}
