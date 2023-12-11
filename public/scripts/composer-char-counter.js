$(document).ready(function () {
    const MAX_CHARACTERS = 140;

    $(".new-tweet textarea").on('input', function () {
        const inputLength = $(this).val().length;
        const charactersRemaining = MAX_CHARACTERS - inputLength;
        const counter = $(this).closest('.new-tweet').find('.counter');

        counter.text(charactersRemaining);
        updateCounterColor(counter, charactersRemaining);
        clearError(); // Clear error when user types
    });

    $(".new-tweet form").on('submit', function (event) {
        event.preventDefault();
        const tweetContent = $(this).find('textarea').val();
        const errorMessage = validateTweet(tweetContent);

        if (errorMessage) {
            displayError(errorMessage);
            return; // Stop the form submission if there is an error
        } 

        clearError();
        $.ajax({
            url: '/tweets',
            method: 'POST',
            data: { text: tweetContent }
        }).done(() => {
            displaySuccess('Tweet posted successfully');
            loadTweets(); // Refresh the tweets
            $(this).find('textarea').val('');
            $(this).find('.counter').text(MAX_CHARACTERS);
        }).fail((error) => {
            displayError(error.responseText || "An error occurred while posting the tweet.");
        });
    });

    // Additional functions
    function updateCounterColor(counter, remaining) {
        counter.toggleClass('exceeded', remaining < 0);
    }

    function validateTweet(content) {
        if (content.trim() === '') {
            return "Tweet must not be empty.";
        } else if (content.length > MAX_CHARACTERS) {
            return "Tweet must be 140 characters or less.";
        }
        return null; // No error
    }

    function displayError(message) {
        const errorContainer = $(".new-tweet .error-message");
        errorContainer.text(message).slideDown();
    }

    function displaySuccess(message) {
        const successContainer = $("#success-message"); // Make sure this element exists in your HTML
        successContainer.text(message).slideDown();
    }

    function clearError() {
        const errorContainer = $(".new-tweet .error-message");
        errorContainer.text('').slideUp();
    }
});
