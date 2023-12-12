$(document).ready(function () {
    const MAX_CHARACTERS = 140;

    // Function to create a tweet element
    function createTweetElement(tweetData) {
        const $tweet = $('<article>').addClass('tweet');
        const $header = $('<header>').addClass('tweet-header');
        const $avatar = $('<img>').attr('src', tweetData.user.avatars).addClass('avatar');
        const $name = $('<h2>').text(tweetData.user.name);
        const $handle = $('<span>').text(tweetData.user.handle);
        $header.append($avatar, $name, $handle);

        const $content = $('<div>').addClass('tweet-content').text(tweetData.content.text);
        const timeAgo = timeago.format(new Date(tweetData.created_at));
        const $footer = $('<footer>');
        const $timestamp = $('<span>').addClass('time-ago').text(timeAgo);

        const $actions = $('<div>').addClass('tweet-actions');
        const $flagIcon = $('<i>').addClass('fas fa-flag');
        const $retweetIcon = $('<i>').addClass('fas fa-retweet');
        const $likeIcon = $('<i>').addClass('fas fa-heart');
        $actions.append($flagIcon, $retweetIcon, $likeIcon);

        $footer.append($timestamp, $actions);
        $tweet.append($header, $content, $footer);
        
        return $tweet;
    }

    // Function to render tweets on the page
    function renderTweets(tweets) {
        const sortedTweets = tweets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const $tweetsContainer = $('#tweets-container');
        $tweetsContainer.empty();

        sortedTweets.forEach(tweet => {
            const $tweet = createTweetElement(tweet);
            $tweetsContainer.append($tweet);
        });
    }

    // Function to load tweets from the server
    function loadTweets() {
        $.ajax({
            method: 'GET',
            url: '/tweets',
            dataType: 'json',
            success: function (tweets) {
                renderTweets(tweets);
            },
            error: function (error) {
                console.error('Error loading tweets:', error);
            }
        });
    }

    // Function to display an error message
    function displayError(message) {
        const errorContainer = $(".new-tweet .error-message");
        errorContainer.text(message);
        errorContainer.parent().slideDown(); // Slide down the error message container
    }

    // Function to clear any existing error messages
    function clearError() {
        const errorContainer = $(".new-tweet .error-message");
        errorContainer.text('').slideUp();
        errorContainer.parent().slideUp();
    }

    // Function to update counter color based on characters remaining
    function updateCounterColor(counter, remaining) {
        counter.toggleClass('exceeded', remaining < 0);
    }

    // Event listener for textarea input
    $('#tweet-text').on('input', function () {
        const tweetLength = $(this).val().length;
        const remaining = MAX_CHARACTERS - tweetLength;
        const counter = $('.counter');
        counter.text(remaining);
        updateCounterColor(counter, remaining);
    });

    // Submit event listener for new tweet form
    $("#tweet-form").on('submit', function(event) {
        event.preventDefault();
    
        // Form submission logic
        const tweetContent = $("#tweet-text").val().trim();
        if(tweetContent.length === 0) {
          displayError("Tweet content cannot be empty!");
          return;
        } else if (tweetContent.length > MAX_CHARACTERS) {
          displayError("Tweet content exceeds the 140-character limit!");
          return;
        }
    
        $.ajax({
          method: 'POST',
          url: '/tweets',
          data: $(this).serialize(),
          success: function() {
            loadTweets();
            $("#tweet-text").val('');
            $(".counter").text(MAX_CHARACTERS);
            clearError();
          },
          error: function(xhr, status, error) {
            displayError(`Error: ${error.message}`);
          }
        });
      });
    
      // Call loadTweets on page load to populate tweets
      loadTweets();
    });


    $(document).ready(function () {
        // When the "Write a new tweet" link is clicked
        $(".new-tweet-link").on("click", function () {
          // Focus on the tweet-text textarea
          $("#tweet-text").focus();
        });
    });
    