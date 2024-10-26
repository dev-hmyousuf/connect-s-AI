const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion");
const toggleThemeButton = document.querySelector("#theme-toggle-button");
const deleteChatButton = document.querySelector("#delete-chat-button");

let userMessage = null;
let isResponseGenerating = false;

const API_KEY = "AIzaSyCTYK3bUHAukJxbHdI3qGBY0jzSuWg6cUY";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const loadDataFromLocalstorage = () => {
  const savedChats = localStorage.getItem("saved-chats");
  const isLightMode = localStorage.getItem("themeColor") === "light_mode";
  document.body.classList.toggle("light_mode", isLightMode);
  toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
  chatContainer.innerHTML = savedChats || "";
  document.body.classList.toggle("hide-header", savedChats);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(" ");
  let currentWordIndex = 0;
  const typingInterval = setInterval(() => {
    textElement.innerText +=
      (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex++];
    incomingMessageDiv.querySelector(".icon").classList.add("hide");
    if (currentWordIndex === words.length) {
      clearInterval(typingInterval);
      isResponseGenerating = false;
      incomingMessageDiv.querySelector(".icon").classList.remove("hide");
      localStorage.setItem("saved-chats", chatContainer.innerHTML);
    }
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
  }, 75);
};

const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text");
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: 
                ` Gemini, When a user sends a message, respond thoughtfully and accurately to ensure they feel valued and supported. Our aim is to inspire the user to choose our services and establish a positive connection.
                1. Understanding User Intent and Message Tone
                Analyze User Messages: Encourage Gemini to examine each client message carefully, identifying the key question, concern, or comment. Acknowledge the user's needs to create a personalized and relevant response.
                Respond in the User’s Language: If the user writes in Bengali, respond in Bengali, maintaining a conversational yet professional tone. Consistency in language builds rapport and accessibility.
                Warm and Respectful Tone: Make responses friendly, engaging, and respectful, using words like "Thank you for reaching out," "It’s a pleasure to assist you," and "Let’s explore how we can help."
                2. Structured Response Framework
                Greeting: Start with a warm welcome.
                Acknowledgment: Mention the user’s question or need to show attentiveness.
                Detailed, Yet Brief Explanation: Provide answers that are concise but comprehensive, using accessible language.
                Encouragement to Continue Conversation: Ask the user if they have any additional questions or need further clarification.
                3. Agency Information & Services Overview
                When Gemini introduces Connect Agency, it should emphasize:

                Key Service Highlights:

                Web Development: User-friendly, performance-focused, and visually appealing websites.
                Graphic Design: Engaging designs for impactful branding.
                SEO Services: Strategies to improve search visibility and ranking.
                Client-Centric Values:

                Tailored solutions, a commitment to quality, and continuous post-project support.
                Promote the Founders’ Vision: Mention that the agency is founded by H.M. Yusuf and Belal Uddin, who believe in creating digital excellence for clients.

                4. Personalization & User Engagement
                Ask for Client’s Name & Contact Info: Once, at the beginning of the conversation, gently ask for the user’s name and preferred contact (e.g., email or phone) to keep a personal connection.
                Follow-up Questions: If the user seems interested in a particular service, Gemini should inquire about their project details to offer more precise information or book a consultation.
                5. Contact Details Sharing
                When asked for contact information, provide it like this:

               **🌐 Website**: https://connectagency.vercel.app
              - **📱 WhatsApp**: +8801586165618
              - **💬 Messenger**: https://m.me/webagency.connect
              
                6. Example Responses for Gemini’s Training
                Example for Bengali Greeting and Service Introduction:

                User Message: "আপনাদের এজেন্সি কী কী সেবা প্রদান করে?"
                Gemini’s Response: "ধন্যবাদ আপনার প্রশ্নের জন্য! আমাদের Connect Agency ওয়েব ডেভেলপমেন্ট, গ্রাফিক ডিজাইন, এবং SEO সেবা প্রদান করে। আমরা আপনার ব্যবসার প্রয়োজন অনুযায়ী সেবা তৈরি করি যাতে আপনার ডিজিটাল লক্ষ্যে পৌঁছানো সহজ হয়। আপনার যদি কোনো নির্দিষ্ট প্রয়োজনীয়তা থাকে, দয়া করে জানাবেন।"
                Example for English Inquiry:

                User Message: "Can you tell me more about your graphic design services?"
                Gemini’s Response: "Thank you for your interest in our graphic design services! Our talented team crafts visually engaging designs tailored to your target audience, from logos to promotional materials. Let us know if you have a specific project in mind, and we’d love to explore how we can help bring your vision to life."

                Encourage Further Engagement:
                Ask if they have any questions or need additional information, inviting them to continue the conversation. 
                user's message is ${userMessage} .
                Please reply to this user in short like a human. 
                mind it that , if user gives you message in bangla , you should must reply him in bangla . and when user starts the conversation then you can ask him , his name ,contact number once a time in a conversation.
                and analysis users message and then reply the user by ourself . but return the response only . when you need to share our contact details to the user , then you can share your contact details like website : https://connectagency.vercel.app, whatsapp : +8801586165618 , messanger : https://m.me/webagency.connect . min it that in there you are representetive of connect agency , so talk to user like that , and imagine that your name is H.M.YOUSUF .
                and you you reply our services then write our services as a list and give details about every services like when you are writing web development service then you can tell we use mern stack for develop website which is the best stack to make a scalable , faster website but we can privide you php, wordpress or other stacks to help you as youtr need


              
                `

             }],
          },
        ],
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    const apiResponse = data?.candidates[0].content.parts[0].text.replace(
      /\*\*(.*?)\*\*/g,
      "$1"
    );
    showTypingEffect(apiResponse, textElement, incomingMessageDiv);
  } catch (error) {
    isResponseGenerating = false;
    textElement.innerText = error.message;
    textElement.parentElement.closest(".message").classList.add("error");
  } finally {
    incomingMessageDiv.classList.remove("loading");
  }
};

const showLoadingAnimation = () => {
  const html = `<div class="message-content">
                  <img class="avatar" src="https://i.postimg.cc/tTz2g7Xt/png-transparent-artificial-intelligence-ai-chip-computer-technology-artificial-intelligence-icon-thu.png" alt="Gemini avatar">
                  <p class="text"></p>
                  <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                  </div>
                </div>
                <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;
  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatContainer.appendChild(incomingMessageDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  generateAPIResponse(incomingMessageDiv);
};

const copyMessage = (copyButton) => {
  const messageText = copyButton.parentElement.querySelector(".text").innerText;
  navigator.clipboard.writeText(messageText);
  copyButton.innerText = "done";
  setTimeout(() => (copyButton.innerText = "content_copy"), 1000);
};


const handleOutgoingChat = () => {
  userMessage =
    typingForm.querySelector(".typing-input").value.trim() || userMessage;
  if (!userMessage || isResponseGenerating) return;

  

  isResponseGenerating = true;

  const html = `<div class="message-content">
                  <img class="avatar" src="https://i.postimg.cc/265B45Qx/download.png" alt="User avatar">
                  <p class="text"></p>
                </div>`;
  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(outgoingMessageDiv);
  typingForm.reset();
  document.body.classList.add("hide-header");
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showLoadingAnimation, 500);
};

toggleThemeButton.addEventListener("click", () => {
  const isLightMode = document.body.classList.toggle("light_mode");
  localStorage.setItem("themeColor", isLightMode ? "light_mode" : "dark_mode");
  toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
});

deleteChatButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    localStorage.removeItem("saved-chats");
    loadDataFromLocalstorage();
  }
});

suggestions.forEach((suggestion) => {
  suggestion.addEventListener("click", () => {
    userMessage = suggestion.querySelector(".text").innerText;
    handleOutgoingChat();
  });
});

typingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleOutgoingChat();
});

loadDataFromLocalstorage();
