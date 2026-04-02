export function iniciarTimeline() {
  const timelineItems = document.querySelectorAll(".timeline-item");
  const storyDisplay = document.getElementById("story-display");
  const timelineTrack = document.querySelector(".timeline-track");

  if (!timelineTrack || !storyDisplay) return;

  const storyTitle = storyDisplay.querySelector("h3");
  const storyTextElement = storyDisplay.querySelector("p");

  timelineItems.forEach((item) => {
    item.addEventListener("click", () => {
      const jaEstavaAtivo = item.classList.contains("active");

      timelineItems.forEach((i) => i.classList.remove("active"));

      if (jaEstavaAtivo) {
        timelineTrack.classList.remove("has-active");
        storyDisplay.classList.remove("active");

        setTimeout(() => {
          if (storyTitle) storyTitle.style.display = "block";
          if (storyTextElement) storyTextElement.innerText = "";
        }, 300);
      } else {
        item.classList.add("active");
        timelineTrack.classList.add("has-active");

        const storyText = item.getAttribute("data-story");
        if (storyTextElement) storyTextElement.innerText = storyText;
        if (storyTitle) storyTitle.style.display = "none";

        storyDisplay.classList.add("active");
      }
    });
  });
}
