export interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization?: string;
  designation?: string;
  gender?: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
}
