import { getTemplateStyle } from "@/components/template-preview"
import { allInvitations } from "./invitations"
import { flyerTemplates } from "./flyers"

export interface TemplateCard {
  id: string
  title: string
  category: string
  premium: boolean
  popular: boolean
  downloads: number
  color: string
  style: ReturnType<typeof getTemplateStyle>
  image?: string
}

const styleMap: Record<string, ReturnType<typeof getTemplateStyle>> = {
  wedding: "wedding", birthday: "birthday", business: "business",
  social: "social", education: "education", music: "music",
  travel: "travel", fashion: "fashion", tech: "tech",
  festival: "festival", food: "food", fitness: "fitness",
  sports: "sports", baby: "baby", certificate: "certificate",
}

const flyerCategoryColor: Record<string, string> = {
  Wedding: "from-pink-500/30 to-rose-500/30",
  Birthday: "from-purple-500/30 to-indigo-500/30",
  Music: "from-orange-500/30 to-red-500/30",
  Sports: "from-green-500/30 to-emerald-500/30",
  Party: "from-fuchsia-500/30 to-pink-500/30",
  Holiday: "from-red-500/30 to-amber-500/30",
  "Food & Drink": "from-amber-500/30 to-orange-500/30",
  Religious: "from-sky-500/30 to-blue-500/30",
  Seasonal: "from-teal-500/30 to-cyan-500/30",
  Business: "from-indigo-500/30 to-purple-500/30",
  Education: "from-green-500/30 to-teal-500/30",
  Baby: "from-rose-500/30 to-pink-500/30",
  Events: "from-blue-500/30 to-violet-500/30",
  Fitness: "from-lime-500/30 to-green-500/30",
}

const invitationTemplates: TemplateCard[] = allInvitations
  .filter((inv) => inv.category === "Wedding" || inv.category === "Birthday")
  .map((inv, i) => ({
    id: `template_img_${i + 1}`,
    title: inv.title,
    category: inv.category,
    premium: true,
    popular: true,
    downloads: Math.floor(Math.random() * 5000) + 100,
    color: inv.category === "Wedding" ? "from-pink-500/30 to-rose-500/30" : "from-purple-500/30 to-indigo-500/30",
    style: getTemplateStyle(inv.category),
    image: inv.image,
  }))

const flyerTemplateCards: TemplateCard[] = flyerTemplates
  .map((flyer) => ({
    id: flyer.id,
    title: flyer.title,
    category: flyer.category,
    premium: true,
    popular: false,
    downloads: Math.floor(Math.random() * 3000) + 50,
    color: flyerCategoryColor[flyer.category] || "from-blue-500/30 to-violet-500/30",
    style: styleMap[flyer.style] || "social",
    image: flyer.image,
  }))

export const allTemplates: TemplateCard[] = [...invitationTemplates, ...flyerTemplateCards]

export const templateCategories = [
  "All",
  "Wedding",
  "Birthday",
  "Music",
  "Sports",
  "Party",
  "Holiday",
  "Food & Drink",
  "Seasonal",
  "Business",
  "Education",
  "Baby",
  "Religious",
  "Events",
  "Fitness",
]

export const categoryCategoryColors: Record<string, string> = {
  Wedding: "from-pink-500 to-rose-500",
  Birthday: "from-purple-500 to-indigo-500",
  Music: "from-orange-500 to-red-500",
  Sports: "from-green-500 to-emerald-500",
  Party: "from-fuchsia-500 to-pink-500",
  Holiday: "from-red-500 to-amber-500",
  "Food & Drink": "from-amber-500 to-orange-500",
  Religious: "from-sky-500 to-blue-500",
  Seasonal: "from-teal-500 to-cyan-500",
  Business: "from-indigo-500 to-purple-500",
  Education: "from-green-500 to-teal-500",
  Baby: "from-rose-500 to-pink-500",
  Events: "from-blue-500 to-violet-500",
  Fitness: "from-lime-500 to-green-500",
}
