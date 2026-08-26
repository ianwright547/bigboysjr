export interface JobProject {
  title: string;
  description: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}

export const JOB_PROJECTS: JobProject[] = [
  {
    title: "Patio and backyard cleanout",
    description: "Outdoor furniture, a trampoline, boxes, and mixed household items cleared in one visit.",
    before: "/photos/jobs/patio-cleanout-before.jpg",
    after: "/photos/jobs/patio-cleanout-after.jpg",
    beforeAlt: "Patio and backyard filled with furniture and household junk before removal",
    afterAlt: "Clear patio and backyard after Big Boys junk removal",
  },
  {
    title: "Driveway pickup",
    description: "Cabinets, carpet, metal pieces, and remodeling leftovers removed without a dumpster.",
    before: "/photos/jobs/driveway-pickup-before.jpg",
    after: "/photos/jobs/driveway-pickup-after.jpg",
    beforeAlt: "Mixed renovation debris staged in a driveway before pickup",
    afterAlt: "Clean driveway after renovation debris removal",
  },
  {
    title: "Paint and garage cleanup",
    description: "Old paint containers collected and the pickup area left clear and ready to use.",
    before: "/photos/jobs/paint-removal-before.jpg",
    after: "/photos/jobs/paint-removal-after.jpg",
    beforeAlt: "Paint cans and buckets awaiting removal beside a garage",
    afterAlt: "Clear garage pickup area after paint container removal",
  },
  {
    title: "Household cleanout",
    description: "A mattress, boxes, bags, and general household clutter loaded and hauled away.",
    before: "/photos/jobs/household-cleanout-before.jpg",
    after: "/photos/jobs/household-cleanout-after.jpg",
    beforeAlt: "Mattress, boxes, and bags before a household junk pickup",
    afterAlt: "Clear outdoor pickup area after a household cleanout",
  },
  {
    title: "Tire and outdoor debris removal",
    description: "A large stack of tires removed so the yard could be reclaimed and maintained.",
    before: "/photos/jobs/tire-removal-before.jpg",
    after: "/photos/jobs/tire-removal-after.jpg",
    beforeAlt: "Large stack of old tires in a yard before removal",
    afterAlt: "Cleared yard after tire and outdoor debris removal",
  },
  {
    title: "Curbside furniture pickup",
    description: "Bulky seating and outdoor pieces picked up quickly from the curbside staging area.",
    before: "/photos/jobs/curbside-pickup-before.jpg",
    after: "/photos/jobs/curbside-pickup-after.jpg",
    beforeAlt: "Furniture and outdoor items staged at the curb before pickup",
    afterAlt: "Clear curb and driveway after furniture pickup",
  },
  {
    title: "Bagged junk and boxes",
    description: "Boxes, bagged clutter, and leftover paint removed from a tight side-yard pickup area.",
    before: "/photos/jobs/bagged-junk-before.jpg",
    after: "/photos/jobs/bagged-junk-after.jpg",
    beforeAlt: "Bagged junk, boxes, and paint containers before removal",
    afterAlt: "Clear side-yard concrete pad after junk removal",
  },
  {
    title: "Outdoor family items",
    description: "Bikes, toys, and outdoor equipment removed to reopen the side yard.",
    before: "/photos/jobs/outdoor-items-before.jpg",
    after: "/photos/jobs/outdoor-items-after.jpg",
    beforeAlt: "Bikes, toys, and outdoor items before junk removal",
    afterAlt: "Clear side yard after outdoor item removal",
  },
];

export const getProjectsForPath = (path: string, count = 3) => {
  const seed = [...path].reduce((total, character) => total + character.charCodeAt(0), 0) % JOB_PROJECTS.length;
  return Array.from({ length: Math.min(count, JOB_PROJECTS.length) }, (_, index) => JOB_PROJECTS[(seed + index) % JOB_PROJECTS.length]);
};

