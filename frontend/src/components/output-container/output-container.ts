const div: HTMLElement = document.querySelector("chat-history")!;

const c_event = new CustomEvent("build", { detail: 3 });

div.addEventListener("build",(e:CustomEventInit<number>) => {
    // `detail` is properly typed as `number` here!
    console.log(e.detail);
});

div.dispatchEvent(c_event);

// CUSTOM EVENT VERARBEITEN
