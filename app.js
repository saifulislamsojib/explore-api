const modalTitle = document.querySelector(".modal-title");
const cards = document.getElementById("cards");
const addMobileForm = document.getElementById("add-mobile-form");
const submitBtn = document.getElementById("submit-btn");

let newPhones = [];
let isEdit = false;
let phoneDetails = {};

const handleForm = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    memory: {},
    camera: {},
    display: {},
  };
  let valid = true;
  formData.forEach((value, name) => {
    if (!value) {
      valid = false;
    }

    if (name === "camera") {
      data[name]["back camera"] = value;
    } else if (name === "memory") {
      data[name].internal = value;
    } else if (name === "price") {
      data[name] = +value;
    } else if (name === "display") {
      data[name].type = value;
    } else {
      data[name] = value;
    }
  });

  if (!valid) return;

  showTost("Loading...");
  submitBtn.setAttribute("disabled", true);
  e.target.reset();

  if (isEdit) {
    // edit a phone
    fetch(`https://www.hero-open-api.ml/phone/edit-pixel/${phoneDetails._id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        showTost(result.message || "Success");
        submitBtn.removeAttribute("disabled", true);
        const index = newPhones.findIndex((it) => it._id === phoneDetails._id);
        const newData = [...newPhones];
        newData[index] = { ...newData[index], ...data };
        displayPhones(newData);
        hideModal();
      });
    return;
  }

  // add a phone
  fetch("https://www.hero-open-api.ml/phone/add-pixels", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      showTost(data.message || "Success");
      submitBtn.removeAttribute("disabled", true);
      const newData = [...newPhones];
      newData.push(data.data);
      displayPhones(newData);
      hideModal();
    });
};

addMobileForm.addEventListener("submit", handleForm);

// load phones
const loadPhones = () => {
  showSpinner(true);
  cards.innerHTML = "";
  fetch("https://www.hero-open-api.ml/phone/pixels")
    .then((res) => res.json())
    .then((data) => displayPhones(data.data));
};

// display phones
const displayPhones = (phonesData) => {
  cards.innerHTML = "";
  showSpinner();
  newPhones = phonesData;
  phonesData.forEach((phone) => {
    const { _id, price, brand, model, memory, camera, display } = phone;
    cards.innerHTML += `<div class="col-md-6">
          <div class="shadow rounded p-3 h-100 d-flex flex-column justify-content-between">
            <h5>Brand: ${brand}</h5>
            <p>Model: ${model}</p> 
            <p>Internal Memory: ${memory.internal}</p>
            <p>Back Camera: ${camera["back camera"]}</p>
            <p>Back Camera: ${display.type}</p>
            <h6>${price}</h6>
            <div class="text-end">
              <button onclick="handleEditData('${_id}')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                  Edit
              </button>
              <button onclick="handleDelete('${_id}')" type="button" class="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>`;
  });
};

const openAddPhone = () => {
  modalTitle.innerHTML = "Add A Phone";
  isEdit = false;
  const inputs = addMobileForm.getElementsByTagName("input");
  [...inputs].forEach((input) => {
    input.value = "";
  });
};

// set default phone edit data
const handleEditData = (id) => {
  phoneDetails = newPhones.find((it) => it._id === id);
  const { price, brand, model, memory, camera, display } = phoneDetails;

  isEdit = true;
  modalTitle.innerHTML = "Edit Phone";
  addMobileForm.innerHTML = `
  <div class="form-floating mb-3">
    <input
    type="text"
    class="form-control"
    id="brand"
    placeholder="Brand"
    name="brand"
    value='${brand}'
  />
  <label for="brand">Brand</label>
  </div>
  <div class="form-floating mb-3">
  <input
    type="text"
    class="form-control"
    id="model"
    placeholder="Model"
    name="model"
    value='${model}'
  />
  <label for="model">Model</label>
  </div>
  <div class="form-floating mb-3">
  <input
    type="number"
    class="form-control"
    id="price"
    placeholder="Price"
    name="price"
    value='${price}'
  />
  <label for="price">Price</label>
  </div>
  <div class="form-floating mb-3">
  <input
    type="text"
    class="form-control"
    id="memory"
    placeholder="Memory"
    name="memory"
    value='${memory.internal}'
  />
  <label for="memory">Memory</label>
  </div>
  <div class="form-floating mb-3">
  <input
    type="text"
    class="form-control"
    id="camera"
    placeholder="Camera"
    name="camera"
    value='${camera["back camera"]}'
  />
  <label for="camera">Camera</label>
  </div>
  <div class="form-floating mb-3">
  <input
    type="text"
    class="form-control"
    id="display"
    placeholder="Display Type"
    name="display"
    value='${display.type}'
  />
  <label for="display">Display Type</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>`;
};

// delete a phone
const handleDelete = (id) => {
  showTost("Loading...");
  fetch(`https://www.hero-open-api.ml/phone/delete-pixel/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      showTost(data.message);
      const newData = newPhones.filter((it) => it._id !== id);
      displayPhones(newData);
    });
};

// hide modal
const hideModal = () => {
  const myModalEl = document.getElementById("staticBackdrop");
  const modal = bootstrap.Modal.getInstance(myModalEl);
  modal.hide();
};

// show toast
const showTost = (test) => {
  const toastLiveExample = document.getElementById("liveToast");
  const tostBody = document.querySelector(".toast-body");
  tostBody.innerHTML = test;
  const toast = new bootstrap.Toast(toastLiveExample);
  toast.show();
};

// show spinner
const showSpinner = (isLoading = false) => {
  const spinner = document.getElementById("spinner");
  if (isLoading) {
    spinner.classList.add("d-block");
    spinner.classList.remove("d-none");
  } else {
    spinner.classList.remove("d-block");
    spinner.classList.add("d-none");
  }
};

loadPhones();
