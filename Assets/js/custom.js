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
    //console.log(result.categories); // Log the categories for debugging
    displayCategories(result.categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  } finally {
    console.log("categories Fetch operation completed.");
  }
};

// Render category buttons inside the container
const displayCategories = (categories) => {
        console.log("Displaying categories:", categories); // Log categories for debugging
  if (Array.isArray(categories) && categories.length > 0) {
    const container = document.getElementById("categories");
    container.innerHTML = ""; // Clear previous content

    categories.forEach((category) => {

      const button = document.createElement("button");
      button.className =
        "btn category bg-[#25252526] text-[#252525B3] hover:bg-[#FF1F3D] hover:text-white";
      button.innerHTML = `<span>${category.category}</span>`;

      //Optional: Add click functionality
      button.addEventListener("click", () => {
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
  const container = document.getElementById("videoContiner");
  container.innerHTML = ""; // Clear previous content

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
};

// Initialize everything on page load
window.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  enableHorizontalScrolling();
  loadVideos();
});
