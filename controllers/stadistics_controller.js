var models =require ('../models/models.js');

exports.show = function(req,res){
  var statistics = {
    numero_preguntas: 0,
    numero_comentarios: 0,
    media_comentarios: 0,
    preguntas_sin_coment: 0,
    preguntas_con_coment: 0,
    };


  models.Quiz.count().then(function(preguntas){
      statistics.numero_preguntas = preguntas;
      models.Comment.count().then(function(comentarios) {
        statistics.numero_comentarios = comentarios;
        if (statistics.numero_preguntas!=0){
          statistics.media_comentarios = Math.round((comentarios/statistics.numero_preguntas)* 100)/100;
        } else {
          statistics.media_comentarios=0;
        }
        models.Sequelize.query('SELECT count(1) AS n FROM "Quizzes" WHERE "id" IN (SELECT DISTINCT "quizId" FROM "Comments")').then(function(cuenta_con){
            statistics.preguntas_con_coment = cuenta_con[0].n;
            models.Sequelize.query('SELECT count(1) AS n FROM "Quizzes" WHERE "id" not IN (SELECT DISTINCT "quizId" FROM "Comments")').then(function(cuenta_sin){
              statistics.preguntas_sin_coment = cuenta_sin[0].n;
              res.render('statistics/show', {statistics:statistics, errors:[]});
            });

        });
      });
  });


}
