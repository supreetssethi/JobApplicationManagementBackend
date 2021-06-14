export interface DataStoredInToken {
  _id: string;
  email: string;
  name: {
    first: string;
    last: string;
  };
}

// export interface DataStoredInRefreshToken {
//   _id: string;
// }
