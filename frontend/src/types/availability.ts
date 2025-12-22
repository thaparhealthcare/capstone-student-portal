export interface TimeRange {
  startTime: string; // HH:mm
  endTime: string;
}

export interface Availability {
  _id: string;
  date: string; // YYYY-MM-DD
  isLeave: boolean;
  timeRanges: TimeRange[];
}
