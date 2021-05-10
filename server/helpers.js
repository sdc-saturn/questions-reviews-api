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
  // return new Promise((resolve, reject) => {
  //   pool.query(`INSERT INTO questions (product_id, question_body, asker_name, asker_email) VALUES (${product_id}, ${question_body}, ${asker_name}, ${asker_email});`, (err, results) => {
  //     if(err) {
  //       reject(err);
  //     }
  //     resolve(results);
  //   })
  // })
  try {
    const { question_body, asker_name, asker_email, product_id} = payload;
    const insert = await pool.query(`INSERT INTO questions(product_id, question_body, asker_name, asker_email)
                                      VALUES (${product_id}, ${question_body}, ${asker_name}, ${asker_email})
                                      RETURNING *;`);
    console.log(insert, 'ins')
    return insert;
  } catch(err) {
    console.log({err})
  }
}
const addAnswer = async (payload) => {
  try {
    const { body, name, email, question_id, photos} = payload;
    const insertAnswer = await pool.query(`INSERT INTO answers(question_id, body, answerer_name, answerer_email)
                                      VALUES (${question_id}, ${body}, ${answerer_name}, ${answerer_email})
                                      RETURNING answer_id;`);
    console.log(insert, 'ins')
    const insertPhotos = Promise.all(photos.map(p => pool.query(`INSERT INTO answer_photos anser_photos, url VALUES ${insertAnswer}, ${p};`)))
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