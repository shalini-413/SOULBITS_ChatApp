document.addEventListener('DOMContentLoaded', function(){
    // Remove the Typed instance for welcome message
    document.querySelector('.loading-overlay').style.display = 'flex'; // Display the loading overlay
    document.body.classList.remove('loading');

    // Trigger smooth fade-in for the chat window and entry section after a short delay
    setTimeout(function() {
        document.querySelector('.loading-overlay').style.display = 'none';
        document.getElementById('chat-window').style.opacity = '1';
        document.getElementById('entry').style.opacity = '1';
    }, 1000); // Adjust the delay as needed
});
