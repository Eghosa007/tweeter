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

    // When the "Write a new tweet" link is clicked
    $(".new-tweet-link").on("click", function () {
        // Focus on the tweet-text textarea
        $("#tweet-text").focus();
    });

    // Event listener for textarea input
    $('#tweet-text').on('input', function () {
        const tweetLength = $(this).val().length;
        const remaining = MAX_CHARACTERS - tweetLength;
        const counter = $('.counter');
        counter.text(remaining);
        updateCounterColor(counter, remaining);

        // Check if the tweet exceeds the character limit
        const errorMessage = validateTweet($(this).val());
        if (errorMessage) {
            displayError(errorMessage);
        } else {
            clearError();
        }
    });
});
