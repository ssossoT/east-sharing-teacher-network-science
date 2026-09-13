import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { ToastProvider } from "@/components/toast";
export const metadata:Metadata={title:"동부 과학 수업나눔 기록실",description:"동부 수업평가나눔교사단 과학분임의 함께 쌓는 수업 연구 기록"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body><AuthProvider><ToastProvider>{children}</ToastProvider></AuthProvider></body></html>}
