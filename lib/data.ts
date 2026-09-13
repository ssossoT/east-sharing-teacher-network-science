import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db, workspaceId } from "./firebase";

export async function saveRecord(collectionName:string, data:Record<string, unknown>, userId:string, yearId:string, id?:string) {
  if (!db) throw new Error("Firebase 환경 변수가 설정되지 않았습니다.");
  const payload = { ...data, workspaceId, yearId, authorId:userId, updatedAt:serverTimestamp(), isDeleted:false };
  if (id) { await updateDoc(doc(db, collectionName, id), payload); return id; }
  const created = await addDoc(collection(db, collectionName), { ...payload, createdAt:serverTimestamp() });
  return created.id;
}
export async function softDelete(collectionName:string, id:string) {
  if (!db) throw new Error("Firebase가 설정되지 않았습니다.");
  await updateDoc(doc(db, collectionName, id), { isDeleted:true, deletedAt:serverTimestamp(), updatedAt:serverTimestamp() });
}
export async function ensureUser(uid:string, user:Record<string, unknown>) {
  if (!db) return;
  await setDoc(doc(db,"users",uid), { ...user, uid, workspaceId, updatedAt:serverTimestamp() }, { merge:true });
}
