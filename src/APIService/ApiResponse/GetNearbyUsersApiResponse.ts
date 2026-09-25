export interface GetNearbyUsersApiResponse {
  users: User[];
  count: number;
}

export interface User {
  _id: string;
  email: string;
  phoneNumber: string;
  userName: string;
  dob: string;
  gender: string;
  interestedIn: string;
  photos: string[];
  location: Location;
  distance: number;
  distanceInKm: number;
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}
