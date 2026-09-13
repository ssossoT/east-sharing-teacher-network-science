export type Role = "admin" | "member";
export type Approval = "pending" | "approved" | "rejected";
export interface AppUser { uid:string; email:string; displayName:string; photoURL?:string; role:Role; approvalStatus:Approval; workspaceId:string; }
export interface BaseRecord { id:string; workspaceId:string; yearId:string; authorId:string; status:string; createdAt?:unknown; updatedAt?:unknown; isDeleted:boolean; }
export interface Meeting extends BaseRecord { title:string; month:number; round:number; startsAt:string; place:string; presenter:string; attendees?:string[]; }
export interface LessonCase extends BaseRecord { title:string; grade:string; unit:string; subject:string; tags:string[]; summary:string; authorName:string; }
export interface Announcement extends BaseRecord { title:string; body:string; type:string; pinned:boolean; deadline?:string; }
export interface Purchase extends BaseRecord { itemName:string; category:string; quantity:number; unitPrice:number; actualAmount?:number; requesterName:string; purpose:string; }
