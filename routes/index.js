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
            question: '<h2>Chymosin, naturally found in rennet, is an enzyme used in cheese making. What is the traditional source of rennet?</h2>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="0" data-dismiss="modal">correct</button>',
                '<button type="button" class="btn btn-default submit-response" question="0" data-dismiss="modal">incorrect</button>',
            ]
        },
        {
            question: '<h2>What is the role of enzymes in fermentation?</h2>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="1" data-dismiss="modal">correct</button>',
                '<button type="button" class="btn btn-default submit-response" question="1" data-dismiss="modal">incorrect</button>',
            ]
        },
        {
            question: '<h2>How do irreversible inhibitors prevent substrates from binding with the active site?</h2>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="2" data-dismiss="modal">correct</button>',
                '<button type="button" class="btn btn-default submit-response" question="2" data-dismiss="modal">incorrect</button>',
            ]
        },
        {
            question: '<h2>Draw the structure of niacin?</h2>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="3" data-dismiss="modal">correct</button>',
                '<button type="button" class="btn btn-default submit-response" question="3" data-dismiss="modal">incorrect</button>',
            ]
        },
        {
            question: '<h2>How does penicillin, an antibiotic, stop bacterial growth?</h2>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="4" data-dismiss="modal">correct</button>',
                '<button type="button" class="btn btn-default submit-response" question="4" data-dismiss="modal">incorrect</button>',
            ]
        },
        {
            question: '<h2>What is the official method used to determine the vitamin C content of food?</h2>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="5" data-dismiss="modal">correct</button>',
                '<button type="button" class="btn btn-default submit-response" question="5" data-dismiss="modal">incorrect</button>',
            ]
        },
        {
            question: '<h2>What is an enzyme inhibitor retrieved from almonds?</h2>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="6" data-dismiss="modal">correct</button>',
                '<button type="button" class="btn btn-default submit-response" question="6" data-dismiss="modal">incorrect</button>',
            ]
        },
        {
            question: '<h2>Which food is a good source of vitamin A?</h2>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="7" data-dismiss="modal">correct</button>',
                '<button type="button" class="btn btn-default submit-response" question="7" data-dismiss="modal">incorrect</button>',
            ]
        },
        {
            question: '<h2>Eating many blackberries can give you what?</h2>',
            btns: [
                '<button type="button" class="btn btn-default submit-response" question="8" data-dismiss="modal">correct</button>',
                '<button type="button" class="btn btn-default submit-response" question="8" data-dismiss="modal">incorrect</button>',
            ]
        }
    ],
    answers = [
        'correct',
        'correct',
        'correct',
        'correct',
        'correct',
        'correct',
        'correct',
        'correct',
        'correct'
    ]

/* GET home page. */
router.get('/', function(req, res, next) {
    /**
        to unrandomize the questions, comment out the line 'questions = shuffle(questions);'
        if the right answer is not working, this may be causing issues
    questions = shuffle(questions);
    */

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
