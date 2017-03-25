var express = require('express');
var router = express.Router();

let imgs = [
        'images/SavanahB.png',
        'images/ScottG.jpg',
        'images/SaraJ.png',
        'images/sa-rah-rah.jpg',
        'images/VictoriaH.png',
        'images/ShebbyP.jpg',
        'images/JuliaH.png',
        'images/TylerL.png',
        'images/AshkiaM.jpg',
    ],
    questions = [
        {
            question: '<h2>What is the Secret Sauce Ed uses in Good Burger?</h2>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="0" data-dismiss="modal">Pickles</button>',
                '<button type="button" class="btn btn-default submit-response" question="0" data-dismiss="modal">Cheezits</button>',
                '<button type="button" class="btn btn-default submit-response" question="0" data-dismiss="modal">bacon</button>',
                '<button type="button" class="btn btn-default submit-response" question="0" data-dismiss="modal">Pizza</button>'
            ]
        },
        {
            question: '<h2>Who is the Professor of this class?</h2><input id="user-answer" type="text"/>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="1" data-dismiss="modal">Make guess</button>'
            ]
        },
        {
            question: '<h2>Do you know the muffin man?</h2><input id="user-answer" type="text"/>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="2" data-dismiss="modal">Make guess</button>'
            ]
        },
        {
            question: '<h2>What is ((100 / 5) + 2) % 7?</h2><input id="user-answer" type="number"/>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="3" data-dismiss="modal">Make guess</button>'
            ]
        },
        {
            question: '<h2>What is the best flavor of wings at BWW?</h2>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="4" data-dismiss="modal">Thai Curry</button>',
                '<button type="button" class="btn btn-default submit-response" question="4" data-dismiss="modal">Mango Habanero</button>',
                '<button type="button" class="btn btn-default submit-response" question="4" data-dismiss="modal">Honey BBQ</button>',
                '<button type="button" class="btn btn-default submit-response" question="4" data-dismiss="modal">Asian Zing</button>'
            ]
        },
        {
            question: '<h2>Who is the Baddest of them all?</h2> Owen Wilson or Froggy Fresh?',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="5" data-dismiss="modal">Owen Wilson</button>',
                '<button type="button" class="btn btn-default submit-response" question="5" data-dismiss="modal">Froggy Fresh</button>'
            ]
        },
        {
            question: '<h2>Complete the lyrics</h2>Just ____ __!<br><input id="user-answer" type="text"/>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="6" data-dismiss="modal">Make guess</button>'
            ]
        },
        {
            question: '<h2>Complete the Following lines</h2><br><br>Billy ____ __ ___ __ _____' +
                        '<br><input id="user-answer" type="text"/>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="7" data-dismiss="modal">Make Guess</button>'
            ]
        },
        {
            question: '<h2>Who said the following?</h2>I know. It’s all wrong. By rights we shouldn\'t even be here. ' +
                    'But we are. It\'s like in the great stories... The ones that really mattered. Full of darkness and danger, they were. ' +
                    'And sometimes you didn\'t want to know the end. Because how could the end be happy? ' +
                    'How could the world go back to the way it was when so much bad had happened? ' +
                    'But in the end, it\'s only a passing thing, this shadow. Even darkness must pass. A new day will come. ' +
                    'And when the sun shines it will shine out the clearer. Those were the stories that stayed with you. ' +
                    'That meant something, even if you were too small to understand why. But I think... I do understand. I know now. ' +
                    'Folk in those stories had lots of chances of turning back, only they didn\'t. They kept going. ' +
                    'Because they were holding on to something. That there\'s some good in this world... and it’s worth fighting for.' +
                    '<br><input id="user-answer" type="text"/>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="8" data-dismiss="modal">Make guess</button>'
            ]
        }
    ],
    answers = [
        'Pickles',
        'Professor Conrad',
        'Who Lives on Drury Lane?',
        '1',
        'Asian Zing',
        'Froggy Fresh',
        'beat it',
        'jean is not my lover',
        'Sam'
    ]

/* GET home page. */
router.get('/', function(req, res, next) {
    /**
        to unrandomize the questions, comment out the line 'questions = shuffle(questions);'
        if the right answer is not working, this may be causing issues
    */
    questions = shuffle(questions);

    res.render('index', {
        title: 'Tic Tac Enzyme Toe!',
        imgs: imgs
    });
});

/**
    This returns a question, with the buttons that go with it.
    the req.query.q says look at the url, and if it contains '/question?q=*', grabs the *
    req.query.q should be a number referencing which question was asked
*/
router.get('/question', function(req, res, next) {
    res.setHeader('Content-type', 'application/json');

    var qNum = parseInt(req.query.q);

    res.send(questions[qNum]);
});

router.post('/answer', function(req, res, next) {
    /**
        req.body is set in the ajax call in main.js under the alias "data = { qNum: *someNumber*, userAnswer: *userAnswer* }"
        qNum = question number,
        userAnswer = the answer provided
    */
    var qNum = parseInt(req.body.qNum),
        userAnswer = req.body.userAnswer;

    /*
        a small check of whether the answers are number 8 or not. You will probably remove the
        '|| (qNum === 8 && userAnswer.toLowerCase().indexOf(answers[qNum].toLowerCase()) > -1)' part when you do this
        for your science class. In fact, you may change the buttons for each question to be a true or false, and the check
        which was returned in here instead of using the qNum and userAnswers
    */
    if ( (qNum < 8 && answers[qNum].toLowerCase() === userAnswer.toLowerCase()) ||
        (qNum === 8 && userAnswer.toLowerCase().indexOf(answers[qNum].toLowerCase()) > -1) ) {

        var respData = {
            token: 'success',
            message: 'Good Job!'
        }
    } else {
        var respData = {
            token: 'fail',
            message: 'Ooo... wrong answer, try again!'
        }
    }

    res.setHeader('Content-type', 'application/json');
    res.send(respData); //returns whether the user guessed right or not
});

// This function shuffles the contents of an array around, so the order is different
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = router;
