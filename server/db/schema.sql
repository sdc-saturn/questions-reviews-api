
CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY NOT NULL,
  product_id INT,
  question_body VARCHAR,
  question_date DATE,
  asker_name VARCHAR(100),
  asker_email VARCHAR(100),
  reported BOOLEAN,
  question_helpfulness INT
);

CREATE TABLE answers (
  answer_id SERIAL PRIMARY KEY NOT NULL,
  question_id INT REFERENCES questions(question_id),
  body VARCHAR,
  date DATE,
  answerer_name VARCHAR(100),
  answerer_email VARCHAR(100),
  reported BOOLEAN,
  helpfulness INT
);


CREATE TABLE answers_photos (
  id SERIAL PRIMARY KEY NOT NULL,
  answer_id INT REFERENCES answers(answer_id),
  url VARCHAR
);
