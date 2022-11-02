export type User = {
  uid: string
}

export type Lab = {
  id: number,
  local: string,
  size: number
}

export type Schedule = {
  lab: number,
  dateStart: Date,
  dateEnd: Date,
  teacher: String
}
