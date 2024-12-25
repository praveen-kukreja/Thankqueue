employee (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  grade VARCHAR REFERENCES designation(grade)
);
