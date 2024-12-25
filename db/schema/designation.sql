designation (
  designationId SERIAL PRIMARY KEY,
  designation VARCHAR NOT NULL,
  grade VARCHAR UNIQUE NOT NULL
);
