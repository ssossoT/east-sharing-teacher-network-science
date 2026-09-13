import { Atom, BookOpen, Boxes, CalendarDays, ChartNoAxesCombined, FileText, GraduationCap, Home, Library, Megaphone, Settings, Sparkles } from "lucide-react";
export const menuItems=[
  {id:"home",label:"홈",icon:Home},{id:"meetings",label:"월별 모임",icon:CalendarDays},{id:"lessons",label:"수업 사례",icon:BookOpen},
  {id:"growth",label:"개인 성장 기록",icon:ChartNoAxesCombined},{id:"lectures",label:"강의·연수",icon:GraduationCap},{id:"purchases",label:"도서·물품",icon:Boxes},
  {id:"resources",label:"자료실",icon:Library},{id:"booklet",label:"자료집 제작",icon:FileText},{id:"notices",label:"공지사항",icon:Megaphone},{id:"admin",label:"관리자 설정",icon:Settings,admin:true}
];
export {Atom,Sparkles};
