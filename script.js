const API_BASE = "http://localhost:8080/api/clip";

async function generateToken() {
  const text = document.getElementById('text-input').value.trim();
  if (!text) {
    alert('Please enter some text first.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text })
    });

    const token = await response.text();
    if (response.ok) {
      document.getElementById('token-display').innerText = `ID to retrieve text is: ${token}`;
    } else {
      alert('Something went wrong.');
    }
  } catch (error) {
    alert('Failed to send to clipboard.');
    console.error(error);
  }
}

async function retrieveClipboard() {
  const token = document.getElementById('retrieve-id').value.trim();
  if (!token) {
    alert('Please enter a valid ID.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/get/${token}`);
    const content = await response.text();

    if (response.ok) {
      document.getElementById('retrieved-text').innerText = content;
    } else {
      alert('Content not found.');
      document.getElementById('retrieved-text').innerText = '';
    }
  } catch (error) {
    alert('Error retrieving content.');
    console.error(error);
  }
}

// New: Copy event handler on retrieved-text box
const retrievedTextBox = document.getElementById('retrieved-text');

retrievedTextBox.addEventListener('copy', (e) => {
  const selection = window.getSelection();
  // If no selection inside retrieved box, copy whole content instead of whole page
  if (selection.isCollapsed) {
    e.preventDefault();
    const textToCopy = retrievedTextBox.innerText;
    e.clipboardData.setData('text/plain', textToCopy);
  }
});
