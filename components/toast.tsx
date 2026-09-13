"use client";
import { createContext,useContext,useState } from "react";
const Context=createContext<(message:string,type?:"ok"|"error")=>void>(()=>{});
export function ToastProvider({children}:{children:React.ReactNode}){const [toast,setToast]=useState<{message:string,type:string}|null>(null);const show=(message:string,type="ok")=>{setToast({message,type});setTimeout(()=>setToast(null),3000)};return <Context.Provider value={show}>{children}{toast&&<div role="status" className={`toast ${toast.type}`}>{toast.message}</div>}</Context.Provider>}
export const useToast=()=>useContext(Context);
