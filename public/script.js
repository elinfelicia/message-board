async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }
  
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    try {
      const data = await fetchWithAuth('/users/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  });
  
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
      const data = await fetchWithAuth('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      console.log(data);
      loadMessages();
    } catch (error) {
      console.error('Error:', error);
    }
  });
  
  document.getElementById('message-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('message-content').value;
    try {
      const data = await fetchWithAuth('/messages', {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      console.log(data);
      loadMessages();
    } catch (error) {
      console.error('Error:', error);
    }
  });
  
  async function loadMessages() {
    try {
      const messages = await fetchWithAuth('/messages');
      const messagesList = document.getElementById('messages-list');
      messagesList.innerHTML = '';
      messages.forEach(message => {
        const li = document.createElement('li');
        li.className = 'message';
        li.innerHTML = `
          <strong>${message.user.email}:</strong> 
          <span class="content">${message.content}</span>
          <div class="actions">
            <button onclick="editMessage(${message.id})">Edit</button>
            <button onclick="deleteMessage(${message.id})">Delete</button>
          </div>
        `;
        messagesList.appendChild(li);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  async function editMessage(id) {
    const newContent = prompt('Enter new content:');
    if (!newContent) return;
    try {
      const data = await fetchWithAuth(`/messages/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ content: newContent }),
      });
      console.log(data);
      loadMessages();
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  async function deleteMessage(id) {
    try {
      const data = await fetchWithAuth(`/messages/${id}`, {
        method: 'DELETE',
      });
      console.log(data);
      loadMessages();
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  loadMessages();
  