const pool = require('./db/db.js')

const getQuestions = async (id) => {
  try {
    const payload = {};
    payload.product_id = id;
    const questions = await pool.query(`SELECT question_id, question_body, question_date, asker_name, question_helpfulness, reported FROM questions WHERE questions.product_id = ${id};`)
    payload.results = questions.rows.map(q => {
      return {...q, answers: {}};
    });
    const answers = await Promise.all(questions.rows.map(q => pool.query(`SELECT answer_id, body, date, answerer_name, helpfulness FROM answers WHERE question_id = ${q.question_id};`)));
    const photos = [];
    answers.forEach((list,i) => list.rows.forEach(a => {
      photos.push(pool.query(`SELECT * FROM answers_photos WHERE answer_id = ${a.answer_id};`))
      a.id = a.answer_id;
      delete a.answer_id;
      payload.results[i].answers[a.id] = {...a, photos: []};
    }));
    const photosPromise = await Promise.all(photos);
    let counter = 0;
    photosPromise.forEach((list,i) => {
      list.rows.forEach((p) => {
        payload.results.forEach((q,index) => {
          for(let key in q.answers) {
            if(key == p.answer_id) {
              payload.results[index].answers[key].photos.push(p);
            }
          }
        })
      })
    })
    return payload;
  } catch(err) {
    console.log({err})
  }
}

const getAnswers = async (id) => {
  try {
    const payload = {};
    payload.question = id;
    payload.page = 0;
    payload.count = 5;
    const questions = await pool.query(`SELECT answer_id, body, date, answerer_name, helpfulness FROM answers WHERE answers.question_id = ${id};`)
    payload.results = questions.rows.map(q => {
      return {...q, photos: []};
    })
    const photos = await Promise.all(questions.rows.map(a => pool.query(`SELECT * FROM answers_photos WHERE answer_id = ${a.answer_id};`)));
    photos.forEach((list, i) => list.rows.forEach(p => {
      payload.results.forEach((a, i) => {
        if(a.answer_id == p.answer_id) {
          p.id = p.answer_id;
          delete p.answer_id;
          a.photos.push(p)
        }
      })
    }));
    return payload;
  } catch(err) {
    console.log({err})
  }
}

const addQuestion = async (payload) => {
  try {
    const { product_id, question_body, asker_name, asker_email, question_date } = payload;
    const insert = await pool.query(`INSERT INTO questions(product_id, question_body, asker_name, asker_email, question_date)
                                      VALUES (${product_id}, '${question_body}', '${asker_name}', '${asker_email}', '${question_date}');`);
    return insert;
  } catch(err) {
    console.log({err})
  }
}
const addAnswer = async (payload) => {
  try {
    const { question_id, body, answerer_name, answerer_email, date, photos } = payload;
    const insert = await pool.query(`INSERT INTO answers(question_id, body, answerer_name, answerer_email, date)
                                      VALUES (${question_id}, '${body}', '${answerer_name}', '${answerer_email}', '${date}') RETURNING answer_id;`);
    const { answer_id } = insert.rows[0];
    const parsePhotos = JSON.parse(photos);
    if(photos.length > 0) {
      const insertPhotos = parsePhotos.map(p => pool.query(`INSERT INTO answers_photos(answer_id, url) VALUES (${answer_id}, '${p}');`))
    }
    return insert;
  } catch(err) {
    console.log({err})
  }
}

const getPhotos = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM answers_photos WHERE answer_id = ${id}`, (err, results) => {
      if(err) {
        reject(err);
      }
      resolve(results);
    })
  })
}


const reportQuestion = (payload) => {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE questions SET reported = ${payload.reported} WHERE id = (${payload.id} )`, (err, results) => {
      if(err) {
        reject(err);
      }
      resolve(results);
    })
  })
}

const markQuestionHelpful = (payload) => {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE questions SET helpful = ${Number(payload.helpful)} WHERE id = (${payload.id} )`, (err, results) => {
      if(err) {
        reject(err);
      }
      resolve(results);
    })
  })
}

const markAnswerHelpful = (payload) => {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE answers SET helpful = ${Number(payload.helpful)} WHERE id = (${payload.id} )`, (err, results) => {
      if(err) {
        reject(err);
      }
      resolve(results);
    })
  })
}

const reportAnswer = (payload) => {
  console.log(payload)
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE answers SET reported = ${payload.reported} WHERE id = (${payload.id} )`, (err, results) => {
      if(err) {
        reject(err);
      }
      resolve(results);
    })
  })
}


module.exports = {
  getQuestions,
  getAnswers,
  getPhotos,
  addQuestion,
  addAnswer,
  reportQuestion,
  markQuestionHelpful,
  markAnswerHelpful,
  reportAnswer
}