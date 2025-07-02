console.log("Custom JS file loaded successfully!");

function formatPostedDate(secondsAgo) {
  // Define time constants in seconds
  const minute = 60;
  const hour = 3600;
  const day = 86400;
  const week = 604800;
  const month = 2592000; // 30 days
  const year = 31104000; // 360 days

  // Determine largest applicable unit
  switch (true) {
    case secondsAgo >= year:
      const years = Math.floor(secondsAgo / year);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    case secondsAgo >= month:
      const months = Math.floor(secondsAgo / month);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    case secondsAgo >= week:
      const weeks = Math.floor(secondsAgo / week);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    case secondsAgo >= day:
      const days = Math.floor(secondsAgo / day);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    case secondsAgo >= hour:
      const hours = Math.floor(secondsAgo / hour);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    case secondsAgo >= minute:
      const minutes = Math.floor(secondsAgo / minute);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    default:
      return "just now";
  }
}

const showNoVideosMessage = () => {
  const container = document.getElementById("videoContainer");
  container.innerHTML = "";
  container.className = ""; // Reset container class

  const noVideosMessage = document.createElement("div");
  noVideosMessage.className =
    "no-videos-message flex justify-center items-center w-full h-[100vh]";
  // Add a message
  noVideosMessage.innerHTML = `
        <div class="flex justify-center items-center gap-4 w-full h-full">
          <div class="flex flex-col items-center justify-center gap-4 w-[400px] ">
            <div class="w-[200px] h-[200]"><img class="w-full object-fit" src="Assets/image/Icon.png" alt="Icon of no videos" /></div>
            <div class="text-center flex justify-center items-center flex-col gap-4">
              <h1 class="text-3xl font-bold">No Videos Found</h1>
              <p class="text-gray-500 text-xl">Please try a different search term.</p>
            </div>
          </div>
        </div>
      `;
  container.appendChild(noVideosMessage);
  console.log("No videos found for this category.");
};

// Enable horizontal scrolling using mouse wheel and drag
const enableHorizontalScrolling = () => {
  const slider = document.getElementById("categories");

  // Scroll horizontally with mouse wheel
  slider.addEventListener("wheel", (e) => {
    e.preventDefault();
    slider.scrollLeft += e.deltaY;
  });

  // Drag to scroll
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  slider.addEventListener("mousedown", (e) => {
    isDragging = true;
    slider.classList.add("dragging");
    startX = e.pageX;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    slider.scrollLeft = scrollLeft - dx;
  });

  ["mouseup", "mouseleave"].forEach((event) => {
    slider.addEventListener(event, () => {
      isDragging = false;
      slider.classList.remove("dragging");
    });
  });
};

// Fetch and display categories from API
const loadCategories = async () => {
  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/phero-tube/categories"
    );
    const result = await response.json();
    displayCategories(result.categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  } finally {
    console.log("categories Fetch operation completed.");
  }
};

// Render category buttons inside the container
const displayCategories = (categories) => {
  if (Array.isArray(categories) && categories.length > 0) {
    const container = document.getElementById("categories");
    container.innerHTML = ""; // Clear previous content
    // container.innerHTML = `<button onclick="loadVideos()" class="btn category bg-[#25252526] text-[#252525B3] hover:bg-[#FF1F3D] hover:text-white"><span>All</span></button>`;

    const allBtn = document.createElement("button");
    allBtn.className =
      "btn category bg-[#25252526] text-[#252525B3] hover:bg-[#FF1F3DCC] hover:text-white";
    allBtn.textContent = "All";
    allBtn.addEventListener("click", () => {
      // Remove active class from all buttons
      document
        .querySelectorAll(".category")
        .forEach((btn) => btn.classList.remove("active"));
      allBtn.classList.add("active");
      loadVideos(); // Load all videos
    });
    container.appendChild(allBtn);

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.className =
        "btn category bg-[#25252526] text-[#252525B3] hover:bg-[#FF1F3DCC] hover:text-white";
      button.innerHTML = `<span>${category.category}</span>`;

      //Optional: Add click functionality
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        document
          .querySelectorAll(".category")
          .forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        // Load videos for this category
        loadVideosByCategories(category.category_id);
      });
      // Append the button to the container
      container.appendChild(button);

      // const buttonContiner = document.createElement("div");
      // buttonContiner.className =
      //  "flex justify-center items-center";
      // buttonContiner.innerHTML = `<button class="btn category bg-[#25252526] text-[#252525B3] hover:bg-[#FF1F3D] hover:text-white"><span>${category.category}</span></button>`;
      // //Optional: Add click functionality
      // buttonContiner.addEventListener("click", () => {
      //   loadVideosByCategories(category.category_id);
      // });
      // // Append the button to the container
      // container.appendChild(buttonContiner);
    });
  } else {
    console.error("No categories found or categories is not an array.");
  }
};

// Fetch and display videos from API
const loadVideosByCategories = async (cat_id) => {
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/category/${cat_id}`
    );
    const result = await response.json();
    displayVideos(result.category); // Call the function to display videos
  } catch (error) {
    console.error("Error fetching videos:", error);
  } finally {
    console.log("videos Fetch operation By Categories completed.");
  }
};

// Fetch and display videos from API
const loadVideos = async () => {
  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/phero-tube/videos"
    );
    const result = await response.json();
    displayVideos(result.videos); // Call the function to display videos
  } catch (error) {
    console.error("Error fetching videos:", error);
  } finally {
    console.log("videos Fetch operation completed.");
  }
};

const displayVideos = (videos) => {
  if (Array.isArray(videos) && videos.length > 0) {
    const container = document.getElementById("videoContainer");
    container.innerHTML = ""; // Clear previous content
    container.className = ""; // Reset container class
    container.classList.add(
      "videoContainer",
      "w-11/12",
      "mx-auto",
      "grid",
      "grid-cols-1",
      "md:grid-cols-2",
      "lg:grid-cols-4",
      "gap-6",
      "py-10"
    );

    videos.forEach((video) => {
      const videoDiv = document.createElement("div");
      videoDiv.className =
        "videocard flex flex-col gap-2 bg-white rounded-lg overflow-hidden";

      videoDiv.innerHTML = `
      <div class="thumbnail relative flex w-full h-40 overflow-hidden">
        <img src="${video.thumbnail}" alt="${
        video.title
      }" class="w-full h-full object-cover" />
    <div class="postedDate absolute right-2 bottom-1 text-white bg-black px-2 text-center text-xs rounded-lg flex justify-center items-center">
      ${
        video.others?.posted_date
          ? formatPostedDate(video.others.posted_date)
          : "Just Now"
      }
    </div>
      </div>
      <div class="details flex gap-2 p-2">
        <div class="channelProPic w-10 h-10 flex-shrink-0">
          <img src="${
            video.authors[0]?.profile_picture || "fallback.jpg"
          }" alt="Channel Profile Picture" class="rounded-full w-full h-full object-cover" />
        </div>
        <div class="info flex flex-col">
          <div class="title font-semibold text-sm leading-tight">${
            video.title
          }</div>
          <div class="subinfo text-gray-500 text-xs flex flex-col">
              <div class="channelName flex justify-start items-center gap-px capitalize"><span>${
                video.authors[0]?.profile_name || "Unknown"
              }</span>${
        video.authors[0]?.verified
          ? `<span class="verifyIcon flex justify-center items-center"><img src="Assets/image/verify-icon.png" alt="verify-Icon" class="w-8/12 h-8/12 object-cover"></span>`
          : ""
      }</div>
              <div class="views">${video.others?.views || "0"} views</div>
          </div>
        </div>
      </div>
    `;

      container.appendChild(videoDiv);
    });
  } else {
    // console.error(
    //   "No videos found for this category or result is not an array."
    // );
    showNoVideosMessage(); // Show no videos message
  }
};

// Initialize everything on page load
window.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  enableHorizontalScrolling();
  loadVideos();
});
