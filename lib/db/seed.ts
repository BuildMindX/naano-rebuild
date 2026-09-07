import { config } from "dotenv";
config({ path: ".env.local" });

const creators = [
  { name: "Thomas Higadere", headline: "Creator - B2B & AI - 34K followers", niche: "AI & SaaS", country: "France", followers: 34000, price: 890, impressions: 42800, clicks: 312, leads: 18, tags: "AI,SaaS,GTM", bio: "I write about how AI is changing B2B prospecting and sales workflows for founders and revenue teams." },
  { name: "Robin Tempe", headline: "Creator - Sales & AI - 12K followers", niche: "Sales & AI", country: "France", followers: 12000, price: 420, impressions: 9000, clicks: 100, leads: 50, tags: "Sales,AI,Automation", bio: "I run my entire prospecting workflow through AI agents and document the exact playbook for sales leaders." },
  { name: "Eric Djavid", headline: "Sales Leader - B2B - 40K followers", niche: "Sales Leadership", country: "USA", followers: 40000, price: 950, impressions: 20000, clicks: 350, leads: 80, tags: "Sales,Leadership,Pipeline", bio: "Former VP Sales writing about where sales teams waste time and how to fix pipeline quality." },
  { name: "Marina Panova", headline: "Content Creator - B2B - 34K followers", niche: "Content & Growth", country: "Netherlands", followers: 34000, price: 780, impressions: 100000, clicks: 1600, leads: 320, tags: "Content,Growth,LinkedIn", bio: "I teach founders and marketers my 30-day LinkedIn content system for B2B growth." },
  { name: "Aya Nakamura-Cole", headline: "Founder - GTM Strategy - 22K followers", niche: "GTM Strategy", country: "UK", followers: 22000, price: 650, impressions: 31000, clicks: 240, leads: 40, tags: "GTM,Founders,Strategy", bio: "Ex-operator sharing frameworks for go-to-market strategy at early-stage B2B startups." },
  { name: "Nada El Amrani", headline: "RevOps Lead - B2B SaaS - 15K followers", niche: "RevOps", country: "Morocco", followers: 15000, price: 480, impressions: 18000, clicks: 190, leads: 35, tags: "RevOps,Data,SaaS", bio: "Breaking down revenue operations systems that actually hold up at scale." },
  { name: "Raphael Costa", headline: "Founder - Dev Tools - 28K followers", niche: "Dev Tools & Infra", country: "Brazil", followers: 28000, price: 700, impressions: 26000, clicks: 210, leads: 30, tags: "DevTools,Engineering,Infra", bio: "Writing for engineering leaders evaluating developer tools and infrastructure vendors." },
  { name: "Priya Raman", headline: "CMO Advisor - B2B Marketing - 51K followers", niche: "B2B Marketing", country: "India", followers: 51000, price: 1100, impressions: 58000, clicks: 480, leads: 95, tags: "Marketing,CMO,Brand", bio: "Fractional CMO writing about positioning, demand gen, and marketing-led growth for B2B." },
  { name: "Lucas Ferreira", headline: "Founder - Fintech - 9K followers", niche: "Fintech", country: "Portugal", followers: 9000, price: 320, impressions: 7200, clicks: 85, leads: 14, tags: "Fintech,Payments,B2B", bio: "Nano creator sharing lessons from building and selling into finance teams." },
  { name: "Sofia Bergstrom", headline: "HR Tech Voice - People Ops - 19K followers", niche: "HR Tech", country: "Sweden", followers: 19000, price: 540, impressions: 21000, clicks: 175, leads: 28, tags: "HRTech,PeopleOps,SaaS", bio: "Covering the people-ops stack and what HR leaders actually evaluate before buying." },
  { name: "Daniel Okafor", headline: "Cybersecurity Analyst - 26K followers", niche: "Cybersecurity", country: "Nigeria", followers: 26000, price: 690, impressions: 24500, clicks: 205, leads: 33, tags: "Security,IT,Compliance", bio: "Explaining enterprise security buying decisions for CISOs and IT leaders." },
  { name: "Camille Rousseau", headline: "Procurement & Ops - 8K followers", niche: "Procurement", country: "France", followers: 8000, price: 280, impressions: 6100, clicks: 62, leads: 11, tags: "Procurement,Ops,B2B", bio: "Nano voice on vendor selection and procurement processes inside mid-market companies." },
];

async function main() {
  const { db } = await import("./index");
  const { users, creatorProfiles } = await import("./schema");
  const bcrypt = (await import("bcryptjs")).default;

  console.log("Seeding creators...");
  for (const c of creators) {
    const email = c.name.toLowerCase().replace(/[^a-z]+/g, ".") + "@creators.naano.demo";
    const passwordHash = await bcrypt.hash("demo-password-not-usable", 10);
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        role: "creator",
        name: c.name,
      })
      .onConflictDoNothing({ target: users.email })
      .returning();

    if (!user) continue;

    await db.insert(creatorProfiles).values({
      userId: user.id,
      headline: c.headline,
      bio: c.bio,
      niche: c.niche,
      country: c.country,
      followerCount: c.followers,
      pricePerPost: String(c.price),
      linkedinHandle: "linkedin.com/in/" + c.name.toLowerCase().replace(/\s+/g, "-"),
      avgImpressions: c.impressions,
      avgClicks: c.clicks,
      avgLeads: c.leads,
      tags: c.tags,
    }).onConflictDoNothing();
  }
  console.log("Done.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
