interface DataStoredInToken {
  _id: string;
  email: string;
  name: {
    first: string;
    last: string;
  };
}

export default DataStoredInToken;
