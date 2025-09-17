async function uploadVideo() {
    const fileInput = document.getElementById('videoInput');
    if (!fileInput.files.length) return alert('Select a video first');

    const formData = new FormData();
    formData.append('video', fileInput.files[0]);

    const res = await fetch('/upload', { method:'POST', body: formData });
    const data = await res.json();

    const container = document.getElementById('playerContainer');
    container.innerHTML = `
      <video controls>
        <source src="${data.video}" type="video/mp4">
        <track src="${data.subtitles}" kind="subtitles" srclang="en" label="English" default>
      </video>
    `;
}
