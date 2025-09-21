document.addEventListener("DOMContentLoaded", function () {
  // --- Homepage Elements ---
  const hamburger = document.querySelector(".hamburger");
  const sideMenu = document.querySelector(".side-menu");
  const closeMenuBtn = document.querySelector(".side-menu .close-btn");
  const mainLoginBtn = document.querySelector(".side-menu .login-btn");
  const mainSignupLink = document.querySelector(".side-menu .signup-link");
  const heroText = document.querySelector(".hero-text");
  const navLinks = document.querySelector(".nav-links");

  // --- Login Modal Elements ---
  const loginModal = document.getElementById("login-modal");
  const closeLoginBtn = document.querySelectorAll(".close-login-btn");
  const bypassLoginBtn = document.getElementById("bypass-login-btn");
  const loginContainer = document.querySelector(".login-container");
  const roleTabs = document.querySelectorAll(".tabs button");
  const roleForms = document.querySelectorAll(".form-content");
  const passwordToggles = document.querySelectorAll(".password-toggle");
  const toggleFormLinks = document.querySelectorAll(".toggle-form a");

  // --- Signup Form Elements ---
  const roleSelect = document.getElementById("role-select");
  const addressGroup = document.querySelector(".address-group");

  // --- Auth State Elements ---
  const loginSignupSection = document.querySelector(".login-signup");
  const userInfoSection = document.querySelector(".user-info");

  // --- Homepage Logic ---
  hamburger.addEventListener("click", () => sideMenu.classList.add("open"));
  closeMenuBtn.addEventListener("click", () =>
    sideMenu.classList.remove("open")
  );
  document.addEventListener("click", (event) => {
    if (
      !sideMenu.contains(event.target) &&
      !hamburger.contains(event.target) &&
      sideMenu.classList.contains("open")
    ) {
      sideMenu.classList.remove("open");
    }
  });

  // --- Modal Logic ---
  function showLoginModal(showSignup = false) {
    sideMenu.classList.remove("open");
    loginModal.classList.add("show");
    heroText.classList.add("hidden");
    navLinks.classList.add("hidden");
    if (showSignup) {
      loginContainer.classList.add("flipped");
    } else {
      loginContainer.classList.remove("flipped");
    }
  }

  function hideLoginModal() {
    loginModal.classList.remove("show");
    heroText.classList.remove("hidden");
    navLinks.classList.remove("hidden");
  }

  mainLoginBtn.addEventListener("click", () => showLoginModal(false));
  mainSignupLink.addEventListener("click", () => showLoginModal(true));

  closeLoginBtn.forEach((btn) => btn.addEventListener("click", hideLoginModal));

  loginModal.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      hideLoginModal();
    }
  });

  toggleFormLinks.forEach((link) => {
    link.addEventListener("click", () => {
      loginContainer.classList.toggle("flipped");
    });
  });

  // --- Login Simulation & Bypass ---
  function performLogin() {
    hideLoginModal();
    loginSignupSection.style.display = "none";
    userInfoSection.style.display = "flex";
  }

  bypassLoginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    performLogin();
  });

  const allForms = document.querySelectorAll("#login-modal form");
  allForms.forEach((form) => {
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector(".btn");
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span>';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = originalBtnHTML;
          submitBtn.disabled = false;
          performLogin();
        }, 1500);
      });
    }
  });

  // --- Form Internal Logic ---
  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      roleTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      roleForms.forEach((f) => f.classList.remove("active"));
      document
        .getElementById(`${tab.dataset.role}-form`)
        .classList.add("active");
    });
  });

  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const passwordInput =
        toggle.parentElement.querySelector(".password-input");
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      toggle.querySelector("i").classList.toggle("fa-eye");
      toggle.querySelector("i").classList.toggle("fa-eye-slash");
    });
  });

  // --- Conditional Signup Fields ---
  roleSelect.addEventListener("change", () => {
    if (roleSelect.value === "vendor") {
      addressGroup.classList.add("show");
    } else {
      addressGroup.classList.remove("show");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generate-btn");
  const mainContent = document.getElementById("main-content");
  const preferencesContainer = document.getElementById("preferences-container");
  const itineraryContainer = document.getElementById("itinerary-container");
  const itineraryPlaceholder = document.getElementById("itinerary-placeholder");
  const itineraryContent = document.getElementById("itinerary-content");

  // --- Date Picker Logic ---
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const durationInput = document.getElementById("trip-duration");
  let tripDays = 0;

  if (startDateInput) {
    // Check if element exists before initializing
    const dateOptions = {
      altInput: true,
      altFormat: "F j, Y",
      dateFormat: "Y-m-d",
      onChange: function (selectedDates, dateStr, instance) {
        updateDuration();
      },
    };
    const startDatePicker = flatpickr(startDateInput, dateOptions);
    const endDatePicker = flatpickr(endDateInput, dateOptions);

    function updateDuration() {
      const start = startDatePicker.selectedDates[0];
      const end = endDatePicker.selectedDates[0];
      if (start && end && end >= start) {
        const diffTime = Math.abs(end - start);
        tripDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        durationInput.value = `${tripDays} Day(s) / ${tripDays - 1} Night(s)`;
      } else {
        tripDays = 0;
        durationInput.value = "";
      }
    }
  }

  // --- Custom Interests Dropdown Logic ---
  const interestSelector = document.getElementById("interest-selector");
  if (interestSelector) {
    // Check if element exists
    const interestMenu = document.getElementById("interest-menu");
    const interestCheckboxes = interestMenu.querySelectorAll(
      'input[type="checkbox"]'
    );

    interestSelector.addEventListener("click", () => {
      interestMenu.style.display =
        interestMenu.style.display === "block" ? "none" : "block";
    });

    function updateSelectedInterests() {
      const selected = Array.from(interestCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);
      interestSelector.innerHTML = "";
      if (selected.length === 0) {
        interestSelector.innerHTML =
          '<span class="text-gray-400">Select your interests...</span>';
      } else {
        selected.forEach((interest) => {
          const tag = document.createElement("span");
          tag.className = "tag";
          tag.textContent = interest;
          interestSelector.appendChild(tag);
        });
      }
    }
    interestCheckboxes.forEach((cb) =>
      cb.addEventListener("change", updateSelectedInterests)
    );
    document.addEventListener("click", (e) => {
      if (!interestSelector.parentElement.contains(e.target)) {
        interestMenu.style.display = "none";
      }
    });
  }

  // --- Itinerary Generation Logic ---
  function generateItineraryHTML(days) {
    const highlights = [
      "Sunrise at Netarhat Hill Station",
      "Tribal village homestay experience",
      "Wildlife safari at Betla National Park",
      "Rock climbing at Patratu Valley",
      "Temple visit at Deoghar",
    ];
    let highlightsHTML = highlights
      .slice(0, days > 2 ? 5 : 3)
      .map(
        (h) => `
                    <li class="flex items-center text-gray-600">
                        <svg class="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        ${h}
                    </li>`
      )
      .join("");

    let dailyItineraryHTML = "";
    for (let i = 1; i <= days; i++) {
      dailyItineraryHTML += `
                        <div class="itinerary-day border border-gray-200 rounded-xl p-4" style="animation-delay: ${
                          i * 0.15
                        }s;">
                            <div class="flex items-center">
                                <div class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">${i}</div>
                                <h3 class="text-xl font-bold text-gray-800">Day ${i}: ${
        i === 1
          ? "Arrival & Exploration"
          : i === days
          ? "Culture & Departure"
          : "Adventure Awaits"
      }</h3>
                            </div>
                            <div class="pl-12 mt-2 text-sm space-y-2">
                                <p><strong>Activities:</strong> Sample activity 1, Sample activity 2</p>
                                <p><strong>Stay:</strong> Recommended Hotel Name</p>
                                <p><strong>Meals:</strong> Breakfast, Dinner included</p>
                            </div>
                        </div>
                    `;
    }

    return `
                    <div class="space-y-6">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-900">Personalized Jharkhand Adventure</h2>
                            <div class="flex items-center justify-between mt-1">
                               <p class="text-gray-500">${days} Days, ${
      days - 1
    } Nights</p>
                               <p class="text-2xl font-bold text-green-600">₹${(
                                 days * 5000 +
                                 3500
                               ).toLocaleString()}</p>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-gray-800 mb-2">Trip Highlights</h3>
                            <ul class="space-y-1">${highlightsHTML}</ul>
                        </div>
                        <div>
                           <h3 class="text-xl font-bold text-gray-800 mb-3">Daily Itinerary</h3>
                           <div class="space-y-4">${dailyItineraryHTML}</div>
                        </div>
                        <button class="w-full mt-4 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                           Book This Itinerary
                        </button>
                    </div>
                `;
  }
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      if (tripDays <= 0) {
        alert("Please select a valid date range.");
        return;
      }
      mainContent.classList.remove("grid-cols-1");
      mainContent.classList.add("lg:grid-cols-2");
      preferencesContainer.classList.remove("max-w-4xl", "mx-auto");
      itineraryContainer.classList.remove("hidden");
      itineraryPlaceholder.classList.remove("hidden");
      itineraryPlaceholder.innerHTML = `
                        <div class="flex flex-col items-center justify-center h-full">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p class="mt-4 text-gray-600 font-semibold">Crafting your perfect trip...</p>
                        </div>
                    `;
      itineraryContent.classList.add("hidden");
      setTimeout(() => {
        itineraryPlaceholder.classList.add("hidden");
        itineraryContent.innerHTML = generateItineraryHTML(tripDays);
        itineraryContent.classList.remove("hidden");
        document
          .querySelectorAll(".itinerary-day")
          .forEach((el) => el.classList.add("animate-fadeInUp"));
      }, 2000);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("map")) return; // Exit if map element doesn't exist

  const divisionData = {
    "palamu-division": {
      title: "Palamu",
      description:
        "Known as the gateway to Chotanagpur, Palamu is a land of dense forests, ancient forts, and thriving wildlife. It is home to the famous Betla National Park and the Palamu Tiger Reserve.",
      places: [
        {
          img: "https://latehartourism.com/wp-content/uploads/2018/10/maim-59.jpg",
          caption: "Betla National Park",
          coords: [23.88, 84.19],
        },
        {
          img: "https://d3sftlgbtusmnv.cloudfront.net/blog/wp-content/uploads/2024/09/Palamu-Fort-Cover-Photo-840x425.jpg",
          caption: "Palamu Fort",
          coords: [23.97, 84.23],
        },
        {
          img: "https://s7ap1.scene7.com/is/image/incredibleindia/lodh-waterfalls-ranchi-jharkhand-1-attr-hero?qlt=82&ts=1727010942220",
          caption: "Lodh Falls",
          coords: [23.63, 84.24],
        },
      ],
    },
    "north-chotanagpur-division": {
      title: "North Chotanagpur",
      description:
        "The most populous division, a hub of industries and mineral wealth. It holds deep spiritual significance with landmarks like Parasnath Hills, the highest peak in the state and a major Jain pilgrimage site.",
      places: [
        {
          img: "https://travelsetu.com/apps/uploads/new_destinations_photos/destination/2024/01/08/9b09e4f561e8dd2954b42774ecb0bae8_1000x1000.jpg",
          caption: "Parasnath Hills",
          coords: [24.17, 86.12],
        },
        {
          img: "https://www.mappls.com/place/5TE7SA_1695386009677_1.png",
          caption: "Konar Dam",
          coords: [23.95, 85.76],
        },
        {
          img: "https://travelsetu.com/apps/uploads/new_destinations_photos/destination/2024/01/08/f4c9b45efb189acc78e27fa743cbd813_1000x1000.jpg",
          caption: "Hazaribagh Lake",
          coords: [24.0, 85.36],
        },
      ],
    },
    "south-chotanagpur-division": {
      title: "South Chotanagpur",
      description:
        'The heart of Jharkhand, this division includes the capital city, Ranchi. It is famously called the "City of Waterfalls," boasting spectacular natural wonders like Hundru, Jonha, and Dassam falls.',
      places: [
        {
          img: "https://thumbs.dreamstime.com/b/hudru-waterfall-jharkhand-hundru-falls-waterfall-located-ranchi-district-indian-state-jharkhand-122775833.jpg",
          caption: "Hundru Falls",
          coords: [23.45, 85.65],
        },
        {
          img: "https://scontent.fbho4-4.fna.fbcdn.net/v/t1.6435-9/179556421_1142220682866978_5600512962822181990_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=3a1ebe&_nc_ohc=5DoAL3Ki8JcQ7kNvwHm2UOp&_nc_oc=Adm8m82p9VZSe4WNPSTzkdkm1921rcA_dmsefEZvXVUO6cKf1pWm5TDhr-uvBAq9by-sjhNOl3izjftaTMje4R-1&_nc_zt=23&_nc_ht=scontent.fbho4-4.fna&_nc_gid=Ff2daibyXHqZ29NowLk-eA&oh=00_AfYj2kMnSdOc6QUKDsV4wrTor7E1TfJ-fYXWxKAYtMY96g&oe=68F28709",
          caption: "Patratu Valley",
          coords: [23.67, 85.3],
        },
        {
          img: "https://media-cdn.tripadvisor.com/media/photo-s/04/56/6e/a7/jagannath-temple.jpg",
          caption: "Jagannath Temple",
          coords: [23.31, 85.27],
        },
      ],
    },
    "kolhan-division": {
      title: "Kolhan",
      description:
        'Situated in southern Jharkhand, Kolhan is rich in tribal culture and dense Saranda forests. It is an industrial powerhouse with cities like Jamshedpur, known as the "Steel City of India."',
      places: [
        {
          img: "https://thumbs.dreamstime.com/b/jubilee-park-covers-large-area-acres-located-middle-city-was-gifted-tata-steel-company-76031726.jpg",
          caption: "Jubilee Park",
          coords: [22.81, 86.18],
        },
        {
          img: "https://assets.telegraphindia.com/telegraph/2021/Jun/1622883398_jha7.jpg",
          caption: "Dalma Wildlife Sanctuary",
          coords: [22.9, 86.22],
        },
        {
          img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Jharkhand_Hirni_fall.jpg/1200px-Jharkhand_Hirni_fall.jpg",
          caption: "Hirni Falls",
          coords: [22.78, 85.12],
        },
      ],
    },
    "santhal-pargana-division": {
      title: "Santhal Pargana",
      description:
        "This division is a land of ancient temples and vibrant Santhali culture. It is a major Hindu pilgrimage destination, home to the famous Baidyanath Jyotirlinga temple in Deoghar.",
      places: [
        {
          img: "https://thumbs.dreamstime.com/b/baidyanath-temple-deoggar-god-shib-thakurs-other-god-godes-temple-baidyanath-temple-deoghar-india-322565426.jpg ",
          caption: "Baidyanath Temple",
          coords: [24.49, 86.69],
        },
        {
          img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Trikut_Hills.jpg/1920px-Trikut_Hills.jpg",
          caption: "Trikut Pahar",
          coords: [24.4, 86.84],
        },
        {
          img: "https://cdn.tripuntold.com/media/photos/location/2018/11/16/b5085819-68bb-41fe-b515-7dc40349b6c7.jpg",
          caption: "Massanjore Dam",
          coords: [24.08, 87.32],
        },
      ],
    },
  };
  const jharkhandDivisionsGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { division: "palamu-division" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [84, 24.5],
              [83.5, 24],
              [84.3, 23.5],
              [85, 24.2],
              [84.5, 24.8],
              [84, 24.5],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { division: "north-chotanagpur-division" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [85, 24.2],
              [85.5, 24.7],
              [86.5, 24.5],
              [86.3, 23.8],
              [85.3, 23.5],
              [85, 24.2],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { division: "santhal-pargana-division" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [86.5, 24.5],
              [87.8, 25.2],
              [87.5, 24],
              [86.5, 23.9],
              [86.5, 24.5],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { division: "kolhan-division" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [85.0, 23.1],
              [86.6, 23.1],
              [86.5, 22.0],
              [85.0, 22.4],
              [85.0, 23.1],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { division: "south-chotanagpur-division" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [84.3, 23.8],
              [85.8, 23.8],
              [85.8, 22.8],
              [85.0, 22.5],
              [84.0, 22.8],
              [84.3, 23.8],
            ],
          ],
        },
      },
    ],
  };

  const map = L.map("map", {
    zoomAnimation: true,
    fadeAnimation: true,
  }).setView([23.6, 85.3], 7.5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const defaultStyle = {
    fillColor: "#E0E0E0",
    weight: 1.5,
    opacity: 1,
    color: "#FFFFFF",
    fillOpacity: 0.6,
  };
  const highlightStyle = {
    fillColor: "#ff9933",
    weight: 2,
    color: "#e68a2e",
    fillOpacity: 0.5,
  };

  let divisionLayers = {};
  let markerGroup = L.layerGroup().addTo(map);

  L.geoJSON(jharkhandDivisionsGeoJSON, {
    style: defaultStyle,
    onEachFeature: (feature, layer) => {
      const divisionKey = feature.properties.division;
      divisionLayers[divisionKey] = layer;
      const divisionTitle = divisionData[divisionKey].title;
      layer
        .bindTooltip(divisionTitle, {
          permanent: true,
          direction: "center",
          className: "division-label",
        })
        .openTooltip();
      layer.on("click", (e) => {
        updateContent(divisionKey);
        map.fitBounds(e.target.getBounds());
      });
    },
  }).addTo(map);

  const buttons = document.querySelectorAll(".region-selector button");
  const contentWrapper = document.querySelector(
    ".places-to-go-section .content-wrapper"
  );
  const divisionNameEl = document.getElementById("division-name");
  const divisionDescriptionEl = document.getElementById("division-description");
  const imageElements = [
    {
      img: document.getElementById("image1"),
      cap: document.getElementById("caption1"),
    },
    {
      img: document.getElementById("image2"),
      cap: document.getElementById("caption2"),
    },
    {
      img: document.getElementById("image3"),
      cap: document.getElementById("caption3"),
    },
  ];
  const cardElements = document.querySelectorAll(
    ".places-to-go-section .image-gallery .card"
  );

  function updateContent(divisionKey) {
    const data = divisionData[divisionKey];
    if (!data) return;

    markerGroup.clearLayers();
    data.places.forEach((place, index) => {
      L.circle(place.coords, {
        radius: 8000,
        color: "#e68a2e",
        weight: 1,
        fillColor: "#ff9933",
        fillOpacity: 0.2,
      }).addTo(markerGroup);

      const iconHtml = `<div class="location-pin-wrapper"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff0000'%3E%3Cpath d='M12 0C7.31 0 3.5 3.81 3.5 8.5c0 5.25 8.5 15.5 8.5 15.5s8.5-10.25 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 11.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'/%3E%3C/svg%3E" class="location-pin-icon"></div>`;
      const customIcon = L.divIcon({
        html: iconHtml,
        className: "",
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40],
      });

      const marker = L.marker(place.coords, { icon: customIcon })
        .bindTooltip(place.caption, { offset: [0, -28], direction: "top" })
        .addTo(markerGroup);

      marker.on("click", () => {
        const cardToHighlight = cardElements[index];
        if (cardToHighlight) {
          cardElements.forEach((c) =>
            c.classList.remove("highlight-animation")
          );
          setTimeout(() => {
            cardToHighlight.classList.add("highlight-animation");
          }, 10);
          cardToHighlight.addEventListener(
            "animationend",
            () => {
              cardToHighlight.classList.remove("highlight-animation");
            },
            { once: true }
          );
        }
        const pinElement = marker._icon.querySelector(".location-pin-icon");
        if (pinElement) {
          pinElement.classList.add("pin-animation");
          pinElement.addEventListener(
            "animationend",
            () => {
              pinElement.classList.remove("pin-animation");
            },
            { once: true }
          );
        }
      });
    });

    contentWrapper.classList.add("fade-out");
    setTimeout(() => {
      divisionNameEl.textContent = data.title;
      divisionDescriptionEl.textContent = data.description;
      data.places.forEach((place, index) => {
        if (imageElements[index]) {
          imageElements[index].img.src = place.img;
          imageElements[index].img.alt = place.caption;
          imageElements[index].cap.textContent = place.caption;
        }
      });
      contentWrapper.classList.remove("fade-out");
    }, 400);

    for (const key in divisionLayers) {
      divisionLayers[key].setStyle(defaultStyle);
    }
    if (divisionLayers[divisionKey]) {
      divisionLayers[divisionKey].setStyle(highlightStyle);
      divisionLayers[divisionKey].bringToFront();
    }

    buttons.forEach((b) => b.classList.remove("active"));
    document
      .querySelector(
        `.places-to-go-section button[data-region="${divisionKey}"]`
      )
      .classList.add("active");
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const divisionKey = button.dataset.region;
      updateContent(divisionKey);

      if (divisionLayers[divisionKey]) {
        map.fitBounds(divisionLayers[divisionKey].getBounds(), {
          padding: [50, 50],
        });
      }
    });
  });

  updateContent("palamu-division");
});
document.addEventListener("DOMContentLoaded", () => {
  // === LOGIC FOR STORIES.HTML ===
  if (document.getElementById("slider-card")) {
    // --- DATA ---
    const testimonials = [
      {
        name: "Ananya Reddy",
        location: "Bengaluru, Karnataka",
        date: "September 2025",
        rating: 5,
        tripType: "Weekend Getaway",
        destination: "Netarhat Hill Station",
        review:
          "The user experience of this platform is as beautiful as Jharkhand itself! From booking to the actual trip, everything was seamless. The AI recommendations were incredibly accurate – it suggested the perfect balance of adventure and relaxation for my weekend getaway. I bought authentic Dokra art directly from artisans and learned about their techniques. This is sustainable tourism done right!",
        tags: [
          "UI/UX Excellence",
          "AI Accuracy",
          "Handicraft Shopping",
          "Sustainable Tourism",
        ],
        images: [
          "https://i.pinimg.com/1200x/11/24/f8/1124f8adaa1aef8b20dc41ddaf64e82d.jpg",
          "https://i.pinimg.com/1200x/d8/5c/1b/d85c1b3262d70604b5adf4c03ed4666d.jpg",
        ],
      },
      {
        name: "Rajiv Malhotra",
        location: "Mumbai, Maharashtra",
        date: "August 2025",
        rating: 4,
        tripType: "Adventure Trip",
        destination: "Patratu & Betla",
        review:
          "An absolutely thrilling adventure. The drive through Patratu Valley was breathtaking, and the wildlife safari in Betla National Park was an experience I'll never forget. The platform helped plan all the logistics flawlessly. Highly recommended for adventure seekers!",
        tags: ["Adventure", "Road Trip", "Wildlife", "Seamless Planning"],
        images: [
          "https://i.pinimg.com/1200x/a0/e9/98/a0e9989c49ca7b15910d9816f4d342a9.jpg",
          "https://i.pinimg.com/1200x/c3/9f/5d/c39f5d2c3258978fe21c9fd932bd6bd0.jpg",
        ],
      },
      {
        name: "Priya Sharma",
        location: "Delhi, NCR",
        date: "July 2025",
        rating: 5,
        tripType: "Spiritual Journey",
        destination: "Deoghar",
        review:
          "My spiritual trip to Deoghar was serene and deeply moving. The AI itinerary included not just the main Baidyanath temple but also smaller, peaceful ashrams nearby that I wouldn't have found otherwise. It was a truly blessed and well-organized pilgrimage.",
        tags: [
          "Pilgrimage",
          "Spiritual",
          "Cultural Insight",
          "AI Recommendations",
        ],
        images: [
          "https://thumbs.dreamstime.com/b/baidyanath-temple-deoggar-god-shib-thakurs-other-god-godes-temple-baidyanath-temple-deoghar-india-322565426.jpg ",
          "https://i.pinimg.com/1200x/70/0c/63/700c63c2ad1d616f12c3a73ea2566df6.jpg",
        ],
      },
    ];

    // --- SLIDER LOGIC ---
    let currentTestimonial = 0;
    const container = document.getElementById("testimonial-content-container");
    const dotsContainer = document.getElementById("slider-dots");
    const sliderCard = document.getElementById("slider-card");

    function renderTestimonial(index) {
      const t = testimonials[index];
      container.innerHTML = `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div>
                                <div class="flex items-center mb-4">
                                    <img src="https://i.pravatar.cc/60?u=${t.name.replace(
                                      /\s/g,
                                      ""
                                    )}" alt="${
        t.name
      }" class="w-14 h-14 rounded-full mr-4">
                                    <div><h3 class="font-bold text-lg text-gray-800">${
                                      t.name
                                    }</h3><p class="text-sm text-gray-500">${
        t.location
      }</p></div>
                                </div>
                                <div class="flex items-center justify-between text-sm text-gray-500 border-b pb-4 mb-4">
                                    <span>${
                                      "⭐".repeat(t.rating) +
                                      "✩".repeat(5 - t.rating)
                                    }</span>
                                    <span>${t.date}</span>
                                </div>
                                <div class="flex space-x-8 mb-6">
                                    <div><p class="text-xs text-gray-400 font-semibold uppercase">Trip Type</p><p class="font-medium text-gray-700">${
                                      t.tripType
                                    }</p></div>
                                    <div><p class="text-xs text-gray-400 font-semibold uppercase">Destination</p><p class="font-medium text-gray-700">${
                                      t.destination
                                    }</p></div>
                                </div>
                                <p class="text-gray-600 leading-relaxed mb-6">${
                                  t.review
                                }</p>
                                <div class="flex flex-wrap gap-2">${t.tags
                                  .map(
                                    (tag) =>
                                      `<span class="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">${tag}</span>`
                                  )
                                  .join("")}</div>
                            </div>
                            <div class="grid grid-cols-2 gap-3 h-64">${t.images
                              .map(
                                (img) =>
                                  `<div class="overflow-hidden rounded-lg shadow-md"><img src="${img}" class="testimonial-image w-full h-full object-cover"></div>`
                              )
                              .join("")}</div>
                        </div>`;
      dotsContainer.innerHTML = testimonials
        .map(
          (_, i) =>
            `<button data-index="${i}" class="w-2.5 h-2.5 rounded-full ${
              i === index ? "bg-gray-800" : "bg-gray-300"
            } transition-colors"></button>`
        )
        .join("");
    }
    function switchTestimonial(index) {
      container.classList.add("fade-out");
      setTimeout(() => {
        currentTestimonial = index;
        renderTestimonial(currentTestimonial);
        container.classList.remove("fade-out");
      }, 300);
    }
    dotsContainer.addEventListener("click", (e) => {
      if (e.target.dataset.index)
        switchTestimonial(parseInt(e.target.dataset.index));
    });
    const next = () =>
      switchTestimonial((currentTestimonial + 1) % testimonials.length);
    const prev = () =>
      switchTestimonial(
        (currentTestimonial - 1 + testimonials.length) % testimonials.length
      );
    document.getElementById("next-btn").addEventListener("click", next);
    document.getElementById("prev-btn").addEventListener("click", prev);
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    // Mouse Drag Interactivity
    let isDown = false,
      startX,
      walk;
    sliderCard.addEventListener("mousedown", (e) => {
      isDown = true;
      sliderCard.classList.add("dragging");
      startX = e.pageX;
    });
    sliderCard.addEventListener("mouseleave", () => {
      isDown = false;
      sliderCard.classList.remove("dragging");
    });
    sliderCard.addEventListener("mouseup", () => {
      isDown = false;
      sliderCard.classList.remove("dragging");
      if (Math.abs(walk) > 100) {
        if (walk < 0) next();
        else prev();
      }
    });
    sliderCard.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      walk = e.pageX - startX;
    });

    // Initial render
    renderTestimonial(0);
  }

  // === LOGIC FOR FAQ.HTML ===
  if (document.getElementById("faq-container")) {
    const faqData = [
      {
        category: "trip-planning",
        question: "How does the AI-powered itinerary planning work?",
        answer: `
                            <p class="mb-4">Our AI analyzes multiple factors to create your perfect trip:</p>
                            <ol class="list-decimal list-inside space-y-2 mb-6">
                                <li><strong>Personal Preferences:</strong> Adventure level, interests, budget.</li>
                                <li><strong>Real-time Data:</strong> Weather, local events, crowd levels.</li>
                                <li><strong>Historical Patterns:</strong> What similar travelers enjoyed.</li>
                                <li><strong>Local Insights:</strong> Guide recommendations and hidden gems.</li>
                            </ol>
                            <p>The system continuously learns and improves recommendations. You can modify suggestions anytime, and our AI adapts accordingly.</p>
                        `,
        expert: { name: "Rahul Tech", title: "AI Systems Expert" },
        tags: ["#AI", "#itinerary", "#planning", "#technology"],
      },
      {
        category: "trip-planning",
        question: "What's the best time to visit Jharkhand?",
        answer:
          "<p>The best time to visit Jharkhand is during the winter months, from <strong>October to March</strong>. The weather is pleasant and cool, ideal for sightseeing, trekking, and exploring national parks. Monsoons (July to September) bring lush greenery but can disrupt travel, while summers (April to June) can be very hot.</p>",
        expert: { name: "Sunita Kumari", title: "Local Guide" },
        tags: ["#weather", "#best-time", "#planning"],
      },
      {
        category: "safety",
        question:
          "Is it safe to travel to Jharkhand, especially in remote areas?",
        answer:
          "<p>Jharkhand is generally safe for tourists. Major tourist destinations like Ranchi, Jamshedpur, Netarhat, and Deoghar are well-policed and welcome travelers. However, like any travel, it's wise to be cautious. For remote or forested areas, it is highly recommended to travel during the day and hire a local guide who is familiar with the region.</p>",
        expert: { name: "Amit Singh", title: "Travel Safety Advisor" },
        tags: ["#safety", "#travel-tips", "#remote-areas"],
      },
      {
        category: "accommodation",
        question: "What are the accommodation options like in Jharkhand?",
        answer:
          "<p>Jharkhand offers a range of accommodations. Major cities have everything from luxury hotels to budget-friendly guesthouses. In tourist spots like Netarhat, you will find government-run tourist lodges and private resorts. For a unique experience, consider a village homestay to immerse yourself in the local culture.</p>",
        expert: { name: "Priya Agarwal", title: "Hospitality Manager" },
        tags: ["#hotels", "#homestay", "#accommodation"],
      },
      {
        category: "activities",
        question: "What are some must-try local experiences or cuisines?",
        answer:
          "<p>You must experience the vibrant tribal culture through local festivals and dance forms like Chhau. Visit a Sohrai painting village to see the traditional art form. For food, try local delicacies like <strong>Dhuska</strong> (a fried rice pancake), <strong>Litti Chokha</strong>, and <strong>Thekua</strong> (a sweet snack). Don't miss the refreshing taste of Handia, a local rice brew.</p>",
        expert: { name: "Ramesh Mahto", title: "Cultural Expert" },
        tags: ["#culture", "#food", "#activities", "#art"],
      },
      {
        category: "transport",
        question: "How do I get around Jharkhand?",
        answer:
          "<p>Jharkhand has a decent road network connecting major cities. You can hire private taxis or use app-based services in cities like Ranchi and Jamshedpur. For inter-city travel, buses and trains are common. The state has an airport in Ranchi (Birsa Munda Airport) with connections to major Indian cities.</p>",
        expert: { name: "Sanjay Yadav", title: "Transport Coordinator" },
        tags: ["#transport", "#travel", "#getting-around"],
      },
    ];

    const faqContainer = document.getElementById("faq-container");
    const faqTabs = document.getElementById("faq-tabs");

    function renderFAQs(category = "all") {
      faqContainer.innerHTML = "";
      const filteredData =
        category === "all"
          ? faqData
          : faqData.filter((item) => item.category === category);

      if (filteredData.length === 0) {
        faqContainer.innerHTML = `<p class="text-center text-gray-500">No questions found for this category.</p>`;
        return;
      }

      filteredData.forEach((item) => {
        const faqItem = document.createElement("div");
        faqItem.className =
          "faq-item border border-gray-200 rounded-lg bg-white";
        faqItem.innerHTML = `
                            <button class="faq-question w-full flex justify-between items-center text-left p-5">
                                <h3 class="font-semibold text-gray-800">${
                                  item.question
                                }</h3>
                                <svg class="chevron w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <div class="faq-answer px-5">
                                <div class="pb-5 border-t border-gray-200 pt-4">
                                    <div class="text-gray-600 leading-relaxed">${
                                      item.answer
                                    }</div>
                                    <div class="bg-gray-50 p-4 rounded-lg mt-6 flex justify-between items-center">
                                        <div class="flex items-center">
                                            <img src="https://i.pravatar.cc/40?u=${item.expert.name.replace(
                                              /\s/g,
                                              ""
                                            )}" class="w-10 h-10 rounded-full mr-3" alt="${
          item.expert.name
        }">
                                            <div>
                                                <p class="font-semibold text-sm text-gray-800">${
                                                  item.expert.name
                                                }</p>
                                                <p class="text-xs text-gray-500">${
                                                  item.expert.title
                                                }</p>
                                            </div>
                                        </div>
                                        <button class="text-sm font-semibold text-blue-600 hover:text-blue-800 hidden md:block">▶ Watch Video</button>
                                    </div>
                                    <div class="mt-4 flex flex-wrap gap-2 items-center justify-between text-sm">
                                        <div class="flex flex-wrap gap-2">
                                            ${item.tags
                                              .map(
                                                (tag) =>
                                                  `<span class="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded">${tag}</span>`
                                              )
                                              .join("")}
                                        </div>
                                        <div class="flex items-center space-x-4 text-gray-500">
                                            <button class="hover:text-green-600 flex items-center gap-1">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM12 16v-1a1 1 0 112 0v1a1 1 0 11-2 0z"></path></path><path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-4-4a2 2 0 112.828-2.828L8 5.172l.586-.586z"></path></svg>
                                                Helpful
                                            </button>
                                            <button class="hover:text-blue-600 flex items-center gap-1">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path></svg>
                                                Share
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
        faqContainer.appendChild(faqItem);
      });
    }

    faqContainer.addEventListener("click", (e) => {
      const questionButton = e.target.closest(".faq-question");
      if (questionButton) {
        const faqItem = questionButton.parentElement;

        faqContainer.querySelectorAll(".faq-item").forEach((item) => {
          if (item !== faqItem && item.classList.contains("open")) {
            item.classList.remove("open");
          }
        });

        faqItem.classList.toggle("open");
      }
    });

    faqTabs.addEventListener("click", (e) => {
      const tabButton = e.target.closest(".tab-btn");
      if (tabButton) {
        const category = tabButton.dataset.category;

        faqTabs.querySelectorAll(".tab-btn").forEach((btn) => {
          btn.classList.remove("bg-orange-500", "text-white", "shadow");
          btn.classList.add("bg-white", "text-gray-600");
        });

        tabButton.classList.add("bg-orange-500", "text-white", "shadow");
        tabButton.classList.remove("bg-white", "text-gray-600");

        renderFAQs(category);
      }
    });

    // Initial render
    renderFAQs("trip-planning");
  }

  // --- COMMON ANIMATION ON SCROLL ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
});
