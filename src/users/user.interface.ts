interface User {
  _id: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  password: string;
}

export default User;
