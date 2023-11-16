import { handleSubmit } from './js/formHandler';
import { updateUI, showPopupImage, updateUIWithError, clearPopup } from './js/updateUI';


import './styles/base.scss';
import './styles/header.scss';
import './styles/form.scss';
import './styles/data.scss';
import './styles/footer.scss';
import './styles/resets.scss';

// Register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service worker registered: ', registration);
        })
        .catch(registrationError => {
          console.log('Service worker registration failed: ', registrationError);
        });
    });
  }


  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('trip-form').addEventListener('submit', handleSubmit);
});
