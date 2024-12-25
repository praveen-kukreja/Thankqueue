claims (
  username VARCHAR,
  thankyou_id INT REFERENCES thankYous(thankyou_id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR DEFAULT 'pending', -- pending/approved/rejected
  updatedAt TIMESTAMP
);
