// testimonials.js

// Replace this with your actual SheetDB API URL
const API_URL = 'https://sheetdb.io/api/v1/p08cl6kx28ts8';

// DOM Elements
const form = document.getElementById('testimonial-form');
const testimonialsContainer = document.getElementById('testimonials-container');

// 1. Fetch and Display Testimonials
async function loadTestimonials() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    testimonialsContainer.innerHTML = ''; // Clear the loading message

    // Check if sheet is empty
    if (data.length === 0 || (data.length === 1 && !data[0].Name)) {
      testimonialsContainer.innerHTML = '<p>No testimonials yet. Be the first to leave one!</p>';
      return;
    }

    // Reverse the array so the newest reviews (at the bottom of the sheet) appear first
    data.reverse().forEach(review => {
      // Skip empty rows
      if (!review.Name) return;

      // Create the card container
      const card = document.createElement('div');
      card.className = 'testimonial-card';

      // Header (Name and Stars)
      const headerDiv = document.createElement('div');
      headerDiv.className = 'testimonial-header';

      const nameEl = document.createElement('span');
      nameEl.className = 'reviewer-name';
      nameEl.textContent = review.Name; // Using textContent prevents XSS attacks

      const starsEl = document.createElement('span');
      starsEl.className = 'star-rating';
      starsEl.textContent = '⭐'.repeat(parseInt(review.Rating) || 5);

      headerDiv.appendChild(nameEl);
      headerDiv.appendChild(starsEl);

      // Review Message
      const messageEl = document.createElement('p');
      messageEl.className = 'review-text';
      messageEl.textContent = `"${review.Message}"`;

      // Date
      const dateEl = document.createElement('span');
      dateEl.className = 'review-date';
      dateEl.textContent = review.Date;

      // Assemble and inject the card
      card.appendChild(headerDiv);
      card.appendChild(messageEl);
      card.appendChild(dateEl);
      testimonialsContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching testimonials:", error);
    testimonialsContainer.innerHTML = '<p>Error loading testimonials. Please try again later.</p>';
  }
}

// 2. Handle Form Submission
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Stop page refresh

  const submitBtn = document.getElementById('submit-review-btn');
  const successMsg = document.getElementById('form-success-msg');
  
  // Show loading state
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  // Gather data to match your Google Sheet column names exactly
  const ratingChoice = form.querySelector('input[name="reviewer-rating"]:checked');

  const newReview = {
    Name: document.getElementById('reviewer-name').value.trim(),
    Rating: ratingChoice ? ratingChoice.value : '5',
    Message: document.getElementById('reviewer-message').value.trim(),
    Date: new Date().toLocaleDateString()
  };

  try {
    // Post data to the Google Sheet via SheetDB
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: [newReview] })
    });

    // Reset form and show success message
    form.reset();
    successMsg.classList.remove('hidden');
    setTimeout(() => {
      successMsg.classList.add('hidden');
    }, 4000);

    // Immediately reload the testimonials to show the new one
    await loadTestimonials();

  } catch (error) {
    console.error("Error saving testimonial:", error);
    alert("There was an error submitting your review. Please try again.");
  } finally {
    // Restore button state
    submitBtn.textContent = 'Submit Review';
    submitBtn.disabled = false;
  }
});

// 3. Load testimonials as soon as the page loads
loadTestimonials();