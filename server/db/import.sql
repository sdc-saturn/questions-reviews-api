COPY questions(question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
FROM '/Users/demarkus/Desktop/questions.csv'
DELIMITER ','
CSV HEADER
;

COPY answers(answer_id, question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
FROM '/Users/demarkus/Desktop/answers.csv'
DELIMITER ','
CSV HEADER
;

COPY answers_photos(id, answer_id, url)
FROM '/Users/demarkus/Desktop/answers_photos.csv'
DELIMITER ','
CSV HEADER
;

CREATE INDEX question_index
ON questions(product_id);

CREATE INDEX answer_index
ON answers(question_id);

CREATE INDEX photo_index
ON answers_photos(answer_id);