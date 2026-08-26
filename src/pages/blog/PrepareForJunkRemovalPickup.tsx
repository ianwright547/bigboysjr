import GuideArticle, { type GuideArticleData } from "./GuideArticle";

const data: GuideArticleData = {
  title: "How to Prepare for a Junk Removal Pickup",
  metaTitle: "How to Prepare for Junk Removal Pickup | Big Boys Atlanta",
  description: "Prepare for an Atlanta junk removal pickup with a clear item list, safe access, building instructions, protected valuables, and accurate job details.",
  path: "/blog/how-to-prepare-for-junk-removal-pickup",
  datePublished: "2026-08-24",
  dateLabel: "August 24, 2026",
  readTime: "7 min read",
  intro: "A little preparation makes pickup day faster and reduces confusion about what is staying, what is leaving, and how the crew should reach it. You do not need to move bulky items outside, but you should make the scope and access details easy to understand.",
  sections: [
    {
      heading: "Build one complete removal list",
      paragraphs: [
        "Walk every included room, closet, garage area, porch, shed, or storage space. Count standard items and describe mixed piles by approximate load size. Add photos for unusual, oversized, or hard-to-identify pieces when the booking process allows.",
        "Keep last-minute additions in one place and update the team before arrival when possible. Items added after the estimate can change labor, trailer space, and the final scope.",
      ],
      bullets: ["Item names and quantities", "Estimated mixed-pile or load size", "Heavy or oversized pieces", "Items requiring disassembly", "Materials that may need special review"],
    },
    {
      heading: "Protect everything that is staying",
      paragraphs: [
        "Move personal records, medication, jewelry, cash, electronics, keys, and sentimental items away from the removal area. Clearly label furniture, boxes, fixtures, or equipment that must remain, especially during a whole-room or property cleanout.",
        "If multiple people are involved, choose one authorized contact to answer questions. Conflicting instructions can slow the job and increase the risk of removing the wrong item.",
      ],
    },
    {
      heading: "Share access and building instructions",
      paragraphs: [
        "Tell the crew about stairs, elevators, narrow doors, long carries, gates, loading docks, parking restrictions, security desks, and required arrival procedures. Apartment and commercial properties may require elevator reservations or certificates before service.",
        "Keep pets and children away from active carrying paths. Remove small trip hazards where practical and make sure the authorized contact can answer the phone during the arrival window.",
      ],
      bullets: ["Gate and entry instructions", "Parking or loading location", "Elevator reservation", "Stair count and floor number", "On-site contact information"],
    },
    {
      heading: "Review restricted and connected items",
      paragraphs: [
        "Standard junk removal does not include many hazardous or regulated materials. Paint, solvents, asbestos, medical waste, some automotive fluids, and similar materials may require a specialized provider. Ask before placing uncertain items in the pickup area.",
        "Disconnect appliances and utilities when required and safe to do so. Gas lines, built-in equipment, hardwired fixtures, and structural removal may require an appropriately licensed trade before hauling can begin.",
      ],
    },
  ],
  faqs: [
    { q: "Do I have to carry furniture to the curb?", a: "No. The crew can remove approved furniture from the agreed location. Share stairs, tight access, and disassembly needs before arrival." },
    { q: "Should I bag loose household junk?", a: "Bagging small loose items can help, but ask before bagging sharp, heavy, liquid, or unknown materials. Bulky items generally do not need to be wrapped." },
    { q: "Can I add items on pickup day?", a: "You can ask, but added material may change trailer space, labor, timing, and price. The crew should confirm the revised scope before removal." },
    { q: "Does someone need to be present?", a: "An authorized adult should generally be available to identify the items, approve the scope, and provide property access unless another arrangement has been confirmed." },
  ],
  relatedLinks: [
    { label: "General junk removal", to: "/services/junk-removal" },
    { label: "What items can be removed", to: "/blog/what-items-can-be-recycled-or-removed" },
    { label: "Book online", to: "/book" },
  ],
};

const PrepareForJunkRemovalPickup = () => <GuideArticle data={data} />;
export default PrepareForJunkRemovalPickup;
