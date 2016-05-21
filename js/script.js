"use strict";
var questions = [{
    title: 'Что обозначает директива ‘use strict’?',
    answers: [
    'Код данного скрипта будет обработан по строгим правилам стандарта EcmaScript 5.',
    'Код данного скрипта будет обработан по строгим правилам, однако допускается использование нестрогих правил написания кода.',
    'Код данного скрипта будет обработан по строгим правилам стандарта EcmaScript 6.',
    'Код данного скрипта будет обработан по строгим правилам стандарта HTML5.'
  ],
    correct: 0
},
  {
    title: 'Какой из пунктов не верен по отношению к строгому режиму javascript?',
    answers: [
    'Запрещено удаление полей, имеющих свойство writable = false',
    'Запрещено дублирование полей объектов',
    'Запрещено дублирование параметров функции',
    'Запрещено использование директивы eval'
  ],
    correct: 3
},
  {
    title: 'К какому участку скрипта применяется строгие правила ‘use strict?',
    answers: [
    "Строгие правила работают между директивами ‘use strict’ и ‘strict end’",
    'Внутри блока {}',
    'Во всем скрипте.',
    'Либо во всем скрипте, либо в отдельной функции.'
  ],
    correct: 3,

}
                ]


$(function () {
  var testPassed = true;
  var tmpl = $('#tmplQuestion').html();
  var tmplFn = _.template(tmpl);
  var tmplResult = $('#tmplResult').html();
  var tmplResultFn = _.template(tmplResult);

  //  Проходимся по массиву вопросов и заполняем DOM
  questions.forEach(function (item, i) {
    item.questionIndex = i;
    var html = tmplFn(item);
    $('.questions').append(html);
    //  console.log($('#test').serializeArray());
  })

  //


  $('#submitTest').click(function (e) {
    var testResult = $('#test').serializeArray();

    //  Проверяем правильность ответов
    e.preventDefault();
    testResult.forEach(function (item, i) {
      var question = eval(item.name);
      questions[question.questionIndex].result = (question.correct == item.value) ? true : false;
    });

    //  Формирум body  модального окна
    questions.forEach(function (item, index) {
      switch (item.result) {
      case undefined:
        item.result = 'Вопрос не отвечен';
        testPassed = false;
        break
      case true:
        item.result = 'Правильно';
        break
      case false:
        item.result = 'Неправильно';
        testPassed = false;
        break
      }

      var html = tmplResultFn(item);
      $('#resultModal .modal-body ol').append(html);
    })

    var html = (testPassed) ? '<h3 class="result">Тест пройден!</h3>' : '<h3 class="result">Тест провален!</h3>'
    $('#resultModal .modal-footer').append(html);
    $('body').append('<div class="shadow"></div>');
    $('#resultModal').show();

  });

  //  Закрываем модальное окно
  $('[data-dismiss="modal"]').click(function () {
    $('.modal').hide();
    location.reload();
    localStorage.clear();
  });

  //Какустановить порядок вызова функции при возникновении события?
  //    $('[data-toggle="modal"]').click(function () {
  //
  //      $('#resultModal').show();
  //    })

  //Запоминаем варианты ответов в локальное хранилище
  $('.question input').change(function (e) {
    var value = e.target.value;
    var question = eval(e.target.name);
    var i = question.questionIndex;
    var answersStr = localStorage.getItem('answers');
    var answers = (answersStr) ? JSON.parse(answersStr) : [];

    answers[i] = value;
    console.log(answers);
    answersStr = JSON.stringify(answers);
    localStorage.setItem('answers', answersStr);
  })

  //Если тест уже отвечался считываю ответы
  function resumeTest() {
    var answersStr = localStorage.getItem('answers');
    if (answersStr == null)
      return
    var answers = JSON.parse(answersStr);
    answers.forEach(function (item, i) {
      if (!item) return;
      var $question = $('[name="questions[' + i + ']"][Value="' + item + '"]');
      $question.trigger('click');
    })
  };
  debugger
  resumeTest();
  //Запрет обнвление страницы при отправки формы
  $('#test').submit(function (e) {
    e.preventDefault();
  });
})

