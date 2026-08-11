export function createImageUploader(container) {
  const section = document.createElement('div');
  section.className = 'image-uploader-wrapper';
  section.innerHTML = `
    <div class="image-uploader">
      <div class="card">
        <h2 class="section-title"><i data-lucide="camera" style="width:20px;height:20px;"></i> Upload Crop Image</h2>
        <p class="section-subtitle">Take a photo of your crop leaf and let AI analyze its health</p>
        <div class="image-uploader__dropzone" id="dropzone">
          <div class="image-uploader__icon"><i data-lucide="image-plus" style="width:40px;height:40px;color:var(--color-primary);opacity:0.6;"></i></div>
          <p class="image-uploader__text">Drag & drop your crop image here</p>
          <p class="image-uploader__hint">or click to browse • JPG, JPEG, PNG</p>
          <input type="file" id="file-input" accept=".jpg,.jpeg,.png" hidden>
        </div>
        <div class="image-uploader__preview hidden" id="preview-container">
          <img id="preview-image" alt="Uploaded crop image">
          <div class="image-uploader__preview-overlay">
            <button class="btn btn--secondary" id="replace-btn"><i data-lucide="refresh-cw" style="width:14px;height:14px;"></i> Replace</button>
            <button class="btn btn--danger" id="remove-btn"><i data-lucide="trash-2" style="width:14px;height:14px;"></i> Remove</button>
          </div>
          <div class="image-uploader__file-info" id="file-info"></div>
        </div>
        <div class="image-uploader__actions hidden" id="upload-actions">
          <button class="btn btn--primary image-uploader__analyze-btn" id="analyze-btn" disabled>
            <i data-lucide="scan-line" style="width:18px;height:18px;"></i> Analyze Crop
          </button>
        </div>
      </div>
    </div>
  `;
  container.appendChild(section);
  if (window.lucide) lucide.createIcons();

  const dropzone = section.querySelector('#dropzone');
  const fileInput = section.querySelector('#file-input');
  const previewContainer = section.querySelector('#preview-container');
  const previewImage = section.querySelector('#preview-image');
  const fileInfo = section.querySelector('#file-info');
  const uploadActions = section.querySelector('#upload-actions');
  const analyzeBtn = section.querySelector('#analyze-btn');
  const replaceBtn = section.querySelector('#replace-btn');
  const removeBtn = section.querySelector('#remove-btn');

  let currentFile = null;

  function showToast(message, type) {
    document.dispatchEvent(new CustomEvent('agriai:toast', { detail: { message, type } }));
  }

  function handleFile(file) {
    if (!file) return;
    
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      showToast('Please upload a JPG or PNG image', 'error');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image size should be less than 10MB', 'error');
      return;
    }

    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      fileInfo.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
      
      dropzone.classList.add('hidden');
      previewContainer.classList.remove('hidden');
      uploadActions.classList.remove('hidden');
      analyzeBtn.disabled = false;
      
      document.dispatchEvent(new CustomEvent('agriai:image-uploaded', { 
        detail: { file, previewUrl: e.target.result } 
      }));
      showToast('Image uploaded successfully', 'success');
    };
    reader.readAsDataURL(file);
  }

  dropzone.addEventListener('click', () => fileInput.click());
  
  fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
    e.target.value = ''; // reset
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  replaceBtn.addEventListener('click', () => fileInput.click());

  removeBtn.addEventListener('click', () => {
    currentFile = null;
    previewImage.src = '';
    dropzone.classList.remove('hidden');
    previewContainer.classList.add('hidden');
    uploadActions.classList.add('hidden');
    document.dispatchEvent(new CustomEvent('agriai:image-removed'));
  });

  analyzeBtn.addEventListener('click', () => {
    if (currentFile) {
      document.dispatchEvent(new CustomEvent('agriai:analyze-requested', { detail: { file: currentFile } }));
    }
  });

  function update(data) {
    if (!data) return;
    if (data.analyzing) {
      analyzeBtn.disabled = true;
      analyzeBtn.innerHTML = '<span class="loading-spinner" style="width:18px;height:18px;"></span> Analyzing...';
    } else if (data.analyzed) {
      analyzeBtn.disabled = true;
      analyzeBtn.innerHTML = '<i data-lucide="check-circle" style="width:18px;height:18px;"></i> Analysis Complete';
    } else if (data.reset) {
      currentFile = null;
      previewImage.src = '';
      dropzone.classList.remove('hidden');
      previewContainer.classList.add('hidden');
      uploadActions.classList.add('hidden');
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = '<i data-lucide="scan-line" style="width:18px;height:18px;"></i> Analyze Crop';
    }
    if (window.lucide) lucide.createIcons();
  }

  function show() { section.classList.remove('hidden'); }
  function hide() { section.classList.add('hidden'); }

  return { element: section, update, show, hide };
}
