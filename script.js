const channelData = {
  whatsapp: {
    title: "WhatsApp closes the sale with product cards and discount codes.",
    benefits: [
      {
        heading: "Personalized selling",
        copy: "Understands gifting intent, budget, and preferences before recommending products."
      },
      {
        heading: "Offer automation",
        copy: "Applies discount nudges when buyers hesitate or ask for the best price."
      },
      {
        heading: "Lead capture",
        copy: "Collects phone numbers and buying intent before the customer drops off."
      }
    ],
    messages: [
      { role: "user", type: "text", text: "Suggest a gift under ₹800 for my sister." },
      { role: "agent", type: "text", text: "Absolutely. I found 3 options that are gift-ready and available for delivery this week." },
      {
        role: "agent",
        type: "products",
        items: [
          { name: "Handcrafted wallet set", detail: "Festive gift box · ready to ship", price: "₹749", chip: "10% off applied" },
          { name: "Rose gold watch set", detail: "Popular for gifting · 2 colors", price: "₹799", chip: "Free shipping" }
        ]
      },
      { role: "agent", type: "text", text: "If you'd like, I can reserve the wallet set and share checkout with coupon FESTIVE10." }
    ]
  },
  instagram: {
    title: "Instagram handles visual discovery when shoppers do not know the product name.",
    benefits: [
      {
        heading: "Image-led browsing",
        copy: "Matches reference images to the closest catalog options and sends alternatives."
      },
      {
        heading: "Voice-friendly",
        copy: "Continues the same conversation with Hindi or English voice notes."
      },
      {
        heading: "DM-native experience",
        copy: "Feels like a real shopping assistant inside Instagram, not a redirected support flow."
      }
    ],
    messages: [
      { role: "user", type: "text", text: "I want something like this for my desk setup." },
      {
        role: "user",
        type: "image",
        title: "Reference image received",
        detail: "Matching similar products from the catalog"
      },
      { role: "agent", type: "text", text: "Found 3 close matches. The first one is the closest in style and fits your stated budget." },
      {
        role: "agent",
        type: "products",
        items: [
          { name: "Closest match", detail: "Matte finish · ready stock", price: "₹1,299", chip: "Best match" },
          { name: "Budget option", detail: "Similar silhouette · lower price", price: "₹999", chip: "Save 23%" }
        ]
      }
    ]
  },
  website: {
    title: "Website chat removes support friction with instant order help and policy answers.",
    benefits: [
      {
        heading: "Order support",
        copy: "Tracks shipments, confirms statuses, and handles routine post-purchase requests instantly."
      },
      {
        heading: "FAQ automation",
        copy: "Answers delivery, return, refund, and troubleshooting questions 24/7."
      },
      {
        heading: "Human escalation",
        copy: "Moves edge cases to the team with order context and conversation history attached."
      }
    ],
    messages: [
      { role: "user", type: "text", text: "Where is my order AWY-4821?" },
      {
        role: "agent",
        type: "order",
        title: "Order AWY-4821",
        detail: "Out for delivery · expected today by 7:30 PM",
        chip: "Tracking updated 2 min ago"
      },
      { role: "user", type: "text", text: "If it does not arrive, can I start a support request here?" },
      { role: "agent", type: "text", text: "Yes. I can open a support ticket, schedule a callback, or route this to a human with your full order history." }
    ]
  }
};

const pricingPlans = {
  starter: { base: 1999, included: 500, overage: 1.2, annualDiscount: 0.2 },
  growth: { base: 6999, included: 3000, overage: 0.8, annualDiscount: 0.2 },
  pro: { base: 13999, included: 8000, overage: 0.65, annualDiscount: 0.2, extraVoicePerMinute: 4, includedVoice: 500 }
};

function formatCurrency(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function createMessageNode(message) {
  const senderLabel = message.role === "user" ? "Customer" : "Awaylable AI";

  if (message.type === "text") {
    const bubble = document.createElement("div");
    bubble.className = `widget-message ${message.role}`;
    bubble.innerHTML = `<span class="bubble-sender">${senderLabel}</span>${message.text}`;
    return bubble;
  }

  if (message.type === "products") {
    const row = document.createElement("div");
    row.className = "widget-card-row";

    message.items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "widget-product-card";
      card.innerHTML = `
        <div class="widget-product-thumb"></div>
        <div class="widget-product-meta">
          <span class="bubble-sender">${senderLabel}</span>
          <strong>${item.name}</strong>
          <span>${item.detail}</span>
          <div class="widget-price-row">
            <strong>${item.price}</strong>
            <span class="widget-chip">${item.chip}</span>
          </div>
        </div>
      `;
      row.appendChild(card);
    });

    return row;
  }

  if (message.type === "image") {
    const card = document.createElement("div");
    card.className = "widget-image-card";
    card.innerHTML = `
      <div class="widget-image-thumb"></div>
      <div>
        <span class="bubble-sender">${senderLabel}</span>
        <strong>${message.title}</strong>
        <span>${message.detail}</span>
      </div>
    `;
    return card;
  }

  if (message.type === "order") {
    const card = document.createElement("div");
    card.className = "widget-order-card";
    card.innerHTML = `
      <div class="widget-product-thumb"></div>
      <div>
        <span class="bubble-sender">${senderLabel}</span>
        <strong>${message.title}</strong>
        <span>${message.detail}</span>
        <div class="widget-price-row">
          <span class="widget-chip">${message.chip}</span>
        </div>
      </div>
    `;
    return card;
  }

  return document.createElement("div");
}

function renderChannel(channelKey) {
  const conversation = document.getElementById("channelConversation");
  const title = document.getElementById("channelTitle");
  const benefits = document.getElementById("channelBenefits");
  const channel = channelData[channelKey];
  const frame = document.querySelector(".widget-frame");

  if (!conversation || !title || !benefits || !channel || !frame) {
    return;
  }

  frame.classList.remove("channel-whatsapp", "channel-instagram", "channel-website");
  frame.classList.add(`channel-${channelKey}`);

  document.querySelectorAll("[data-channel-tab]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.channelTab === channelKey);
  });

  title.textContent = channel.title;
  benefits.innerHTML = "";

  channel.benefits.forEach((benefit) => {
    const card = document.createElement("div");
    card.className = "benefit-card";
    card.innerHTML = `<strong>${benefit.heading}</strong><p>${benefit.copy}</p>`;
    benefits.appendChild(card);
  });

  conversation.innerHTML = "";
  const stack = document.createElement("div");
  stack.className = "conversation-stack";

  channel.messages.forEach((message) => {
    stack.appendChild(createMessageNode(message));
  });

  conversation.appendChild(stack);
}

function updateCostCalculator() {
  const planSelect = document.getElementById("planSelect");
  const conversationRange = document.getElementById("conversationRange");
  const annualBilling = document.getElementById("annualBilling");
  const starterWhatsAppAddon = document.getElementById("starterWhatsAppAddon");
  const voiceMinutes = document.getElementById("voiceMinutes");
  const total = document.getElementById("costTotal");
  const breakdown = document.getElementById("costBreakdown");
  const conversationValue = document.getElementById("conversationValue");
  const voiceMinutesValue = document.getElementById("voiceMinutesValue");

  if (!planSelect || !conversationRange || !total || !breakdown) {
    return;
  }

  const plan = pricingPlans[planSelect.value];
  const conversations = Number(conversationRange.value);
  const overageCount = Math.max(0, conversations - plan.included);
  const annualMultiplier = annualBilling.checked ? 1 - plan.annualDiscount : 1;
  const overageCost = overageCount * plan.overage;
  const starterAddon = planSelect.value === "starter" && starterWhatsAppAddon.checked ? 1000 : 0;
  const extraVoiceMinutes = planSelect.value === "pro" ? Number(voiceMinutes.value) : 0;
  const extraVoiceCost = planSelect.value === "pro" ? extraVoiceMinutes * plan.extraVoicePerMinute : 0;
  const monthlyBase = plan.base * annualMultiplier;
  const totalCost = monthlyBase + overageCost + starterAddon + extraVoiceCost;

  conversationValue.textContent = `${conversations.toLocaleString("en-IN")} conversations`;
  voiceMinutesValue.textContent = `${extraVoiceMinutes.toLocaleString("en-IN")} extra minutes`;
  total.textContent = formatCurrency(totalCost);

  const notes = [
    `Base plan: ${formatCurrency(monthlyBase)}${annualBilling.checked ? " after 20% annual discount" : ""}`,
    `Overage: ${overageCount.toLocaleString("en-IN")} × ${formatCurrency(plan.overage)} = ${formatCurrency(overageCost)}`
  ];

  if (planSelect.value === "starter") {
    notes.push(`WhatsApp add-on: ${starterAddon ? formatCurrency(starterAddon) : "Not selected"}`);
  }

  if (planSelect.value === "pro") {
    notes.push(`Extra voice minutes: ${extraVoiceMinutes.toLocaleString("en-IN")} × ₹4 = ${formatCurrency(extraVoiceCost)}`);
  }

  notes.push("Unified inbox included. No per-agent seat cost.");
  breakdown.innerHTML = notes.map((note) => `<div>${note}</div>`).join("");
}

function updateRoiCalculator() {
  const visitorsRange = document.getElementById("visitorsRange");
  const conversionRange = document.getElementById("conversionRange");
  const aovRange = document.getElementById("aovRange");
  const liftSelect = document.getElementById("liftSelect");
  const roiTotal = document.getElementById("roiTotal");
  const roiBreakdown = document.getElementById("roiBreakdown");
  const visitorsValue = document.getElementById("visitorsValue");
  const conversionValue = document.getElementById("conversionValue");
  const aovValue = document.getElementById("aovValue");

  if (!visitorsRange || !conversionRange || !aovRange || !liftSelect || !roiTotal || !roiBreakdown) {
    return;
  }

  const visitors = Number(visitorsRange.value);
  const conversionRate = Number(conversionRange.value) / 100;
  const aov = Number(aovRange.value);
  const lift = Number(liftSelect.value);

  const currentOrders = visitors * conversionRate;
  const improvedOrders = visitors * conversionRate * (1 + lift);
  const incrementalOrders = improvedOrders - currentOrders;
  const additionalRevenue = incrementalOrders * aov;

  visitorsValue.textContent = `${visitors.toLocaleString("en-IN")} visitors`;
  conversionValue.textContent = `${(conversionRate * 100).toFixed(1)}%`;
  aovValue.textContent = formatCurrency(aov);
  roiTotal.textContent = formatCurrency(additionalRevenue);

  roiBreakdown.innerHTML = [
    `<div>Current monthly orders: ${Math.round(currentOrders).toLocaleString("en-IN")}</div>`,
    `<div>Expected conversion lift: ${(lift * 100).toFixed(0)}%</div>`,
    `<div>Incremental monthly orders: ${Math.round(incrementalOrders).toLocaleString("en-IN")}</div>`,
    `<div>Additional revenue at AOV ${formatCurrency(aov)}: ${formatCurrency(additionalRevenue)}</div>`
  ].join("");
}

function setupCalculatorTabs() {
  const tabs = document.querySelectorAll("[data-calculator-tab]");
  const panels = document.querySelectorAll("[data-calculator-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.calculatorPanel === tab.dataset.calculatorTab);
      });
    });
  });
}

function setupNavigation() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  const navActions = document.querySelector(".nav-actions");

  if (!toggle || !menu || !navActions) {
    return;
  }

  const closeMenu = () => {
    menu.classList.remove("open");
    navActions.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    menu.classList.toggle("open", !isOpen);
    navActions.classList.toggle("open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  [...menu.querySelectorAll("a"), ...navActions.querySelectorAll("a")].forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeMenu();
    }
  });

  window.addEventListener("orientationchange", closeMenu);
}

function setupRevealAnimations() {
  const revealTargets = document.querySelectorAll(".section, .proof-strip, .footer");
  revealTargets.forEach((target) => target.setAttribute("data-reveal", ""));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

function setupChannelInteractions() {
  const tabs = document.querySelectorAll("[data-channel-tab]");
  const input = document.getElementById("channelInput");
  const send = document.getElementById("channelSend");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => renderChannel(tab.dataset.channelTab));
  });

  const sendHandler = () => {
    if (!input || !input.value.trim()) {
      return;
    }

    const conversation = document.getElementById("channelConversation");
    const stack = conversation ? conversation.querySelector(".conversation-stack") : null;

    if (!stack) {
      return;
    }

    const userBubble = document.createElement("div");
    userBubble.className = "widget-message user";
    userBubble.innerHTML = `<span class="bubble-sender">Customer</span>${input.value.trim()}`;
    stack.appendChild(userBubble);

    const agentBubble = document.createElement("div");
    agentBubble.className = "widget-message agent";
    agentBubble.innerHTML = `<span class="bubble-sender">Awaylable AI</span>Awaylable would answer from your catalog, policies, and order systems here, then continue the journey on the same channel.`;
    stack.appendChild(agentBubble);

    input.value = "";
    conversation.scrollTop = conversation.scrollHeight;
  };

  if (send) {
    send.addEventListener("click", sendHandler);
  }

  if (input) {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        sendHandler();
      }
    });
  }

  renderChannel("whatsapp");
}

function setupInputs() {
  [
    "conversationRange",
    "planSelect",
    "annualBilling",
    "starterWhatsAppAddon",
    "voiceMinutes"
  ].forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("input", updateCostCalculator);
      element.addEventListener("change", updateCostCalculator);
    }
  });

  ["visitorsRange", "conversionRange", "aovRange", "liftSelect"].forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("input", updateRoiCalculator);
      element.addEventListener("change", updateRoiCalculator);
    }
  });
}

function setupNeuronLines() {
  const svg = document.getElementById("neuronSvg");
  const brainMap = document.getElementById("heroBrainMap");
  const core = document.getElementById("brainCore");
  const branches = [
    { el: document.getElementById("branchCall"), delay: "0s" },
    { el: document.getElementById("branchChat"), delay: "0.7s" },
    { el: document.getElementById("branchVideo"), delay: "1.4s" }
  ];

  if (!svg || !brainMap || !core || branches.some(b => !b.el)) return;

  function drawLines() {
    const mapRect = brainMap.getBoundingClientRect();
    const coreRect = core.getBoundingClientRect();

    // Core center in map-local coordinates
    const cx = coreRect.left - mapRect.left + coreRect.width / 2;
    const cy = coreRect.top - mapRect.top + coreRect.height / 2;

    svg.setAttribute("viewBox", `0 0 ${mapRect.width} ${mapRect.height}`);
    svg.innerHTML = "";

    const svgNS = "http://www.w3.org/2000/svg";

    // Central core node
    const coreCircle = document.createElementNS(svgNS, "circle");
    coreCircle.setAttribute("class", "neuron-node neuron-node-core");
    coreCircle.setAttribute("cx", cx);
    coreCircle.setAttribute("cy", cy);
    coreCircle.setAttribute("r", "5");
    svg.appendChild(coreCircle);

    branches.forEach(({ el, delay }) => {
      const bRect = el.getBoundingClientRect();
      const bx = bRect.left - mapRect.left;
      const by = bRect.top - mapRect.top;
      const bw = bRect.width;
      const bh = bRect.height;

      // Find closest point on branch box to core center
      const nearX = Math.max(bx, Math.min(cx, bx + bw));
      const nearY = Math.max(by, Math.min(cy, by + bh));

      // Use the closest horizontal edge midpoint for top boxes, vertical midpoint for bottom box
      let tx, ty;
      if (nearY === by) {
        // core is above box bottom → connect to top edge
        tx = bx + bw / 2;
        ty = by;
      } else if (nearY === by + bh) {
        // core is below box top → connect to bottom edge
        tx = bx + bw / 2;
        ty = by + bh;
      } else if (nearX === bx) {
        // core is to the left → connect to left edge
        tx = bx;
        ty = by + bh / 2;
      } else {
        // core is to the right → connect to right edge
        tx = bx + bw;
        ty = by + bh / 2;
      }

      // Control points for a smooth curve
      const midX = (cx + tx) / 2;
      const midY = (cy + ty) / 2;
      const dx = tx - cx;
      const dy = ty - cy;
      // Curve control: bend gently toward target
      const cpx1 = cx + dx * 0.3;
      const cpy1 = cy + dy * 0.5;
      const cpx2 = tx - dx * 0.3;
      const cpy2 = ty - dy * 0.3;

      const d = `M${cx} ${cy} C${cpx1} ${cpy1} ${cpx2} ${cpy2} ${tx} ${ty}`;

      // Base line
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("class", "neuron-path");
      path.setAttribute("d", d);
      svg.appendChild(path);

      // Animated pulse on top
      const pulse = document.createElementNS(svgNS, "path");
      pulse.setAttribute("class", "neuron-path neuron-pulse");
      pulse.setAttribute("d", d);
      pulse.style.animationDelay = delay;
      svg.appendChild(pulse);

      // Endpoint node on branch box
      const endNode = document.createElementNS(svgNS, "circle");
      endNode.setAttribute("class", "neuron-node neuron-node-end");
      endNode.setAttribute("cx", tx);
      endNode.setAttribute("cy", ty);
      endNode.setAttribute("r", "4");
      endNode.style.animationDelay = delay;
      svg.appendChild(endNode);
    });
  }

  // Draw on load and whenever layout changes
  drawLines();
  window.addEventListener("resize", drawLines);

  // Re-draw after images have loaded (logo can affect layout)
  const logo = core.querySelector(".core-logo");
  if (logo) {
    logo.addEventListener("load", drawLines);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupRevealAnimations();
  setupCalculatorTabs();
  setupChannelInteractions();
  setupInputs();
  updateCostCalculator();
  updateRoiCalculator();
  setupNeuronLines();
});
