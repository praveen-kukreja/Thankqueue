CREATE TABLE thankYous (
  thankyou_id SERIAL PRIMARY KEY,
  sender VARCHAR,
  receiver VARCHAR,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  status VARCHAR DEFAULT 'sent', -- sent/reviewed/claimed
  amount INT DEFAULT 0
);