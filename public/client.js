$(document).ready(() => {
  const socket = io('http://localhost:3000');
  let currentUser;

  // Load previous messages
  socket.on('load messages', (messages) => {
    console.log('Previous messages loaded:', messages);
  });

  // Set the current user when entering the chat
  window.setUsername = function () {
    currentUser = $('#username').val();
    if (currentUser.trim() !== '') {
      // Emit 'clear messages' event when entering the chat
      socket.emit('clear messages');
      $('#entry').hide();
      $('#chat-window').show();
    }
  };
  // Handle new messages
  $('#form').submit((event) => {
    event.preventDefault();
    const message = $('#message').val();
    if (message.trim() !== '') {
      socket.emit('chat message', { user: currentUser, message });
      $('#message').val('');
    }
    return false;
  });

  // Display new messages
  socket.on('chat message', (data) => {
    displayMessage(data);
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Clear previous messages from the screen
  socket.on('clear messages', () => {
    $('#messages').empty();
    console.log('Previous messages cleared from the screen');
  });

  function displayMessage(data) {
    $('#messages').append($('<li>').text(`${data.user}: ${data.message}`));
  }
})