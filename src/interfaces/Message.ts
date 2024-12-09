export interface Message {
    phoneNumber: string;
    content: string;
    type: "incoming" | "outgoing";
    createdAt: Date;
  }