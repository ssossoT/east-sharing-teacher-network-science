"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, firebaseConfigured, workspaceId } from "@/lib/firebase";
import type { AppUser } from "@/lib/types";

type AuthValue = { firebaseUser:User|null; profile:AppUser|null; loading:boolean; demo:boolean; login:(name:string,password:string,register?:boolean)=>Promise<void>; logout:()=>Promise<void>; enterDemo:()=>void };
const AuthContext=createContext<AuthValue|null>(null);
export function AuthProvider({children}:{children:React.ReactNode}) {
  const [firebaseUser,setFirebaseUser]=useState<User|null>(null), [profile,setProfile]=useState<AppUser|null>(null);
  const [loading,setLoading]=useState(firebaseConfigured), [demo,setDemo]=useState(false);
  useEffect(()=>{
    if(!auth||!db){setLoading(false);return;}
    const authInstance=auth;
    const dbInstance=db;
    return onAuthStateChanged(authInstance,async user=>{
      setFirebaseUser(user);
      if(!user){setProfile(null);setLoading(false);return;}
      const ref=doc(dbInstance,"users",user.uid), snap=await getDoc(ref);
      if(!snap.exists()) await setDoc(ref,{uid:user.uid,email:user.email||"",displayName:user.displayName||"선생님",photoURL:user.photoURL||"",role:"member",approvalStatus:"pending",workspaceId,createdAt:serverTimestamp(),updatedAt:serverTimestamp(),isDeleted:false});
      const fresh=await getDoc(ref); setProfile(fresh.data() as AppUser);setLoading(false);
    });
  },[]);
  const login=async(name:string,password:string,register=false)=>{
    if(!auth) throw new Error("먼저 Firebase 환경 변수를 설정해 주세요.");
    const cleanName=name.trim();
    if(!cleanName||!password) throw new Error("이름과 비밀번호를 모두 입력해 주세요.");
    if(register&&password!=="0000") throw new Error("최초 가입 비밀번호는 0000을 입력해 주세요.");
    const encodedName=Array.from(new TextEncoder().encode(cleanName)).map(byte=>byte.toString(16).padStart(2,"0")).join("");
    const email=`${encodedName}@science-members.invalid`;
    const firebasePassword=password.length<6?`${password}00`:password;
    if(register){
      const credential=await createUserWithEmailAndPassword(auth,email,firebasePassword);
      await updateProfile(credential.user,{displayName:cleanName});
      await setDoc(doc(db!,"users",credential.user.uid),{uid:credential.user.uid,email,displayName:cleanName,photoURL:"",role:"member",approvalStatus:"pending",workspaceId,createdAt:serverTimestamp(),updatedAt:serverTimestamp(),isDeleted:false});
      return;
    }
    await signInWithEmailAndPassword(auth,email,firebasePassword);
  };
  const logout=async()=>{setDemo(false);if(auth)await signOut(auth)};
  const enterDemo=()=>{setDemo(true);setProfile({uid:"preview",email:"",displayName:"미리보기",role:"admin",approvalStatus:"approved",workspaceId:"default"})};
  return <AuthContext.Provider value={{firebaseUser,profile,loading,demo,login,logout,enterDemo}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>{const value=useContext(AuthContext);if(!value)throw new Error("AuthProvider가 필요합니다.");return value};
