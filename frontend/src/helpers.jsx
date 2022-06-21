export const apiFetch = (method, path, token, body) => {
  const requestOptions = {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };

  if (token !== null) {
    requestOptions.headers.Authorization = `Bearer ${token}`;
  }
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:5005/${path}`, requestOptions)
      .then((response) => {
        if (response.status === 400 || response.status === 403) {
          response.json().then((errorMsg) => {
            reject(errorMsg.error);
          });
        } else if (response.status === 200) {
          response.json().then((data) => {
            resolve(data);
          });
        }
      })
      .catch((err) => {
        alert(err);
      });
  });
};

export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}
