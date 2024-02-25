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