const $ = (id) => document.getElementById(id);

const form = $('requestForm');
const formView = $('formView');
const confirmView = $('confirmView');
const formAlert = $('formAlert');
const urgencyError = $('urgency-error');
const urgencyOptions = form.querySelectorAll('.option');

// Fields that share the same input + "<id>-error" message pattern
const fields = ['unit', 'category', 'description'].map((id) => ({
  input: $(id),
  error: $(`${id}-error`),
}));

/* ---------- Validation ---------- */

function setFieldError({ input, error }, show) {
  input.classList.toggle('invalid', show);
  input.setAttribute('aria-invalid', String(show));
  error.hidden = !show;
}

function setUrgencyError(show) {
  urgencyError.hidden = !show;
  urgencyOptions.forEach((option) => option.classList.toggle('invalid', show));
}

/** Validates every field and returns the invalid inputs, in DOM order. */
function validate() {
  const invalid = [];

  fields.forEach((field) => {
    const isEmpty = field.input.value.trim() === '';
    setFieldError(field, isEmpty);
    if (isEmpty) invalid.push(field.input);
  });

  const urgencyChosen = form.querySelector('input[name="urgency"]:checked');
  setUrgencyError(!urgencyChosen);
  if (!urgencyChosen) invalid.push(form.querySelector('input[name="urgency"]'));

  return invalid;
}

function clearErrors() {
  fields.forEach((field) => setFieldError(field, false));
  setUrgencyError(false);
  formAlert.hidden = true;
}

/* ---------- Events ---------- */

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const invalid = validate();

  if (invalid.length) {
    formAlert.textContent = 'Please complete the highlighted fields before submitting.';
    formAlert.hidden = false;
    invalid[0].focus();
    return;
  }

  formAlert.hidden = true;
  showConfirmation();
});

// Clear a field's error as soon as the user fixes it
fields.forEach((field) => {
  ['input', 'change'].forEach((type) =>
    field.input.addEventListener(type, () => {
      if (field.input.value.trim() !== '') setFieldError(field, false);
    })
  );
});

form.querySelectorAll('input[name="urgency"]').forEach((radio) =>
  radio.addEventListener('change', () => setUrgencyError(false))
);

$('resetBtn').addEventListener('click', () => {
  form.reset();
  clearErrors();
  confirmView.hidden = true;
  formView.hidden = false;
  $('unit').focus();
});

/* ---------- Confirmation ---------- */

// Simulated submission: no backend, so the reference number is random
function generateRequestNumber() {
  return 1000 + Math.floor(Math.random() * 9000);
}

function showConfirmation() {
  const data = new FormData(form);

  $('refNum').textContent = generateRequestNumber();
  $('outUnit').textContent = data.get('unit').trim();
  $('outCategory').textContent = data.get('category');
  $('outUrgency').textContent = data.get('urgency');
  $('outDescription').textContent = data.get('description').trim();

  formView.hidden = true;
  confirmView.hidden = false;
  $('confirmHeading').focus();
  window.scrollTo(0, 0);
}