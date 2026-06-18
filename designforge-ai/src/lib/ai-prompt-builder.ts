import type { InvitationTemplate } from "@/data/invitation-templates";

export interface FormValues {
  eventName: string;
  hostName: string;
  date: string;
  time: string;
  venue: string;
  rsvp: string;
  [key: string]: string;
}

export function buildAIPrompt(
  template: InvitationTemplate,
  values: FormValues,
  style?: string
): { imagePrompt: string; textPrompt: string } {
  const eventName = values.eventName || template.fields.find((f) => f.id === "event-name")?.default || "";
  const hostName = values.hostName || template.fields.find((f) => f.id === "host-name")?.default || "";
  const date = values.date || template.fields.find((f) => f.id === "date")?.default || "";
  const time = values.time || template.fields.find((f) => f.id === "time")?.default || "";
  const venue = values.venue || template.fields.find((f) => f.id === "venue")?.default || "";

  const cat = template.category;
  const colors = template.colors;

  const styleDesc = style || template.style || "elegant";
  const orientationDesc = template.orientation === "portrait" ? "portrait" : template.orientation === "square" ? "square" : "landscape";

  const imagePrompt = `Create a premium ${cat.toLowerCase()} invitation card design in ${orientationDesc} orientation, ${styleDesc} style. ` +
    `Background with ${colors.primary} and ${colors.accent} color scheme, ` +
    `featuring decorative borders, elegant typography layout, ` +
    `and a sophisticated ${cat.toLowerCase()} theme. ` +
    `The design should have placeholders for: "${eventName}", hosted by "${hostName}", ` +
    `on "${date}" at "${time}", venue: "${venue}". ` +
    `Make it look like a high-end Canva or Adobe Express premium invitation template. ` +
    `Clean composition, professional finish, print-ready at 300 DPI.`;

  const textPrompt = `Write a warm and inviting ${cat.toLowerCase()} invitation message for "${eventName}". ` +
    `Hosted by "${hostName}". Event on ${date} at ${time} at ${venue}. ` +
    `Include RSVP details. Tone: ${cat === "Wedding" ? "romantic and formal" :
      cat === "Birthday" ? "fun and celebratory" :
      cat === "Festival" ? "joyful and welcoming" :
      "warm and inviting"}.`;

  return { imagePrompt, textPrompt };
}

export async function generateInvitationImage(
  prompt: string,
  template: InvitationTemplate
): Promise<string | null> {
  try {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        type: "image",
        style: template.style || "elegant",
        width: template.width,
        height: template.height,
      }),
    });
    if (!res.ok) throw new Error("Generation failed");
    const data = await res.json();
    return data.imageUrl || data.result || null;
  } catch (err) {
    console.error("AI generation failed:", err);
    return null;
  }
}
