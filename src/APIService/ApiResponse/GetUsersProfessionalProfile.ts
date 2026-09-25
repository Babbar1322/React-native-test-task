

export interface ProfessionalProfile {
  location: Location
  preferences: Preferences
  rating: Rating
  _id: string
  user: User
  role: string
  stageName: string
  about: string
  contactPhoneNumber: string
  siretNumber: string
  photoUrl: string[]
  videosUrl: string[]
  packages: Package[]
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Location {
  type: string
  coordinates: number[]
  address: string
}

export interface Preferences {
  musicTypes: string[]
  eventTypes: string[]
  venueTypes: string[]
}

export interface Rating {
  average: number
  count: number
}

export interface User {
  location: Location2
  unlimitedLikesExpiry: any
  _id: string
  identifier: string
  email: string
  phoneNumber: string
  countryCode: string
  password: string
  userName: string
  dob: string
  gender: string
  interestedIn: string
  photos: string[]
  isEmailVerified: boolean
  authType: string
  referredBy: string
  fcmToken: string
  tempEmail: any
  tempPhoneNumber: any
  accountType: string
  zodiacSign: string
  language: string[]
  pushNotification: boolean
  newsLetterNotification: boolean
  eventsNotification: boolean
  chatNotification: boolean
  twoFactorAuthentication: boolean
  about: string
  drinking: string
  smoke: string
  marijuana: string
  drugs: string
  stripeCustomerId: string
  interestCategories: string[]
  musicStyles: string[]
  atmosphereVibes: string[]
  eventTypes: string[]
  height: string
  totalLikes: number
  totalSuperLikes: number
  work: string
  totalBoosts: number
  createdAt: string
  updatedAt: string
  __v: number
  token: string
  status: string
  unlimitedLikes: boolean
  selectedSquad: string
}

export interface Location2 {
  type: string
  coordinates: number[]
  address: string
}

export interface Package {
  name: string
  pricePerHour: number
  details: string
  _id: string
  createdAt: string
  updatedAt: string
}
