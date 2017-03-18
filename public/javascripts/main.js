var xTurn = true;

// on the click of a given box, get the question associated with it
$('.info-card').click(function() {
    if ($(this).hasClass('free-box')) { //the classname 'free-box' is an indicator that an x or o has not been set for the given box
        getQuestion($(this));
    }
});

/*
    retrieves the questions, and prepares for an answer from the user
    $cardSelected is a jquery object referencing which box was clicked on.
        It is needed in order to know which box to flip to an x/o when the time comes
*/
function getQuestion($cardSelected) {
    /*
        ajax call to the '/question' route. the ?q=*, * should be some numeric value representing which question to get
    */
    $.get('/question?q='+$cardSelected.attr('position'), function(data) {
        /*
            This sets up some data on opening a bootstrap modal with the id '#questionModal'.
            A modal is simply a dialog/pop up box
        */
        $('#questionModal').off().on('show.bs.modal', function() {
            $('#questionModal .modal-body').html(data.question); //This is filling the body of the modal with the question to be asked

            var btnsHtml = '';

            //we are getting all the buttons associated with a given question and passing them into the footer of the modal, to be clicked
            for (var i = 0; i < data.btns.length; i++) {
                btnsHtml += data.btns[i];
            }
            $('#questionModal .modal-footer').html(btnsHtml);


               //all buttons have a class submit-response this click event listener is catching which button is clicked
            $('.submit-response').off().click(function() {

                /*
                    if the button we clicked contains the attribute 'question' with values 0, 4, or 5,
                    then the user's button has some text in it that we need to grab.
                    otherwise, the user had to manually input some data in a textbox
                 */
                if (parseInt($(this).attr('question')) === 0 || parseInt($(this).attr('question')) === 4 ||
                    parseInt($(this).attr('question')) === 5) {
                    var userAnswer = $(this).html();
                } else {
                    var userAnswer = $('#user-answer').val();
                }

                //setting up the request body for the '/answer' route.
                var data = {
                    qNum: $(this).attr('question'),
                    userAnswer: userAnswer
                }

                /*
                    the ajax request for the '/answer' route.
                    returns whether the user answer was correct or not
                */
                $.post('/answer', data, function(result) {
                    var player = xTurn ? 'x' : 'o'; // determines who the current guesser is if xTurn is true, it is player X's turn

                    /*
                        if the user guessed correctly, then result.token === success is true
                    */
                    if (result.token === 'success') {
                        $cardSelected.removeClass('free-box');
                        $cardSelected.children('.back').children('#' + player + '-img').css('display', 'block');
                        $cardSelected.children('.front').css('-webkit-transform', 'rotateY(180deg)');
                        $cardSelected.children('.back').css('-webkit-transform', 'rotateY(0)');
                        $cardSelected.attr('x-or-o', player);
                    }

                    //function isWin() is defined outside of the getQuestion function
                    var playerWins = isWin(player);

                    /*
                        if the player has 3 in a row, he/she wins, a dialog box notifying which player won pops up,
                            and the game is reset on closing that dialog box
                        the 'else if (xTurn){...} else {...} says if the player who just guessed did not make a winning point,
                            the other player's turn is up, and an alert pops open to display which user's turn it is
                    */
                    if (playerWins) {
                        $('#resultModal').off().on('show.bs.modal', function() {
                            $('#result').html('Congratulations! ' + player.toUpperCase() + ' wins!');
                            $('#resultModal .modal-body p').html('');

                            $('#resultModal').on('hide.bs.modal', function() {
                                resetGame();
                            })
                        });

                        $('#resultModal').modal('show');
                        xTurn = true;
                    } else if (xTurn) {
                        $('#x-turn-alert').slideUp();
                        setTimeout(function() {
                            $('#o-turn-alert').slideDown();
                        }, 400);

                        xTurn = !xTurn;
                    } else {
                        $('#o-turn-alert').slideUp();
                        setTimeout(function() {
                            $('#x-turn-alert').slideDown();
                        }, 400);
                        xTurn = !xTurn;

                        setTimeout(function() {

                        }, 5000);
                    }
                });
            })
        });

        //once the onShow() function is defined, we will now actually show the modal/dialog box
        $('#questionModal').modal('show');
    });
}

//determines if the player wins
function isWin(player) {
    var rows = [],
        rowVals = [];

    //gets all the boxes that are 'x's, and 'o's. if a space has no 'x' or 'o', it is a '-'.
    $('.info-card').each(function() {
        rowVals.push($(this).attr('x-or-o'));

        if (rowVals.length === 3) {
            rows.push(rowVals);
            rowVals = [];
        }
    });

    //returns a boolean of whether the player wins or not
    return threeInARow(rows, player);
}

//checks each possible combination by which a player can win.
function threeInARow(rows, player) {
    if (rows[0][0] === player && rows[0][1] === player && rows[0][2] === player) {
        return true;
    } else if (rows[0][0] === player && rows[1][0] === player && rows[2][0] === player) {
        return true;
    } else if (rows[0][0] === player && rows[1][1] === player && rows[2][2] === player) {
        return true;
    } else if (rows[0][1] === player &&  rows[1][1] === player && rows[2][1] === player) {
        return true;
    } else if (rows[0][2] === player &&  rows[1][2] === player && rows[2][2] === player) {
        return true;
    } else if (rows[0][2] === player && rows[1][1] === player && rows[2][0] === player) {
        return true;
    } else if (rows[1][0] === player && rows[1][1] === player && rows[1][2] === player) {
        return true;
    } else if (rows[2][0] === player && rows[2][1] === player && rows[2][2] === player) {
        return true;
    } else {
        return false;
    }
}

// resets the game data so that players can play again.
function resetGame() {
    $('.info-card').each(function() {
        $(this).attr('x-or-o', '-');

        $(this).children('.front').css('-webkit-transform', 'rotateY(0)');
        $(this).children('.back').css('-webkit-transform', 'rotateY(180deg)');

        $(this).addClass('free-box');
    });

    $('#o-turn-alert').slideUp();
    setTimeout(function() {
        $('#x-turn-alert').slideDown();
    }, 400);
}


resetGame();