import couch from "./couch.png";
import recliner from "./recliner.png";
import table from "./table.png";
import tvStand from "./tv-stand.png";
import bookshelf from "./bookshelf.png";
import mattress from "./mattress.png";
import dresser from "./dresser.png";
import mirror from "./mirror.png";
import fridge from "./fridge.png";
import washer from "./washer.png";
import dryer from "./dryer.png";
import dishwasher from "./dishwasher.png";
import oven from "./oven.png";
import microwave from "./microwave.png";
import waterHeater from "./water-heater.png";
import tv from "./tv.png";
import computer from "./computer.png";
import printer from "./printer.png";
import stereo from "./stereo.png";
import rug from "./rug.png";
import treadmill from "./treadmill.png";
import exercise from "./exercise.png";
import trashBag from "./trash-bag.png";
import box from "./box.png";
import truck from "./truck.png";
import lawnMower from "./lawn-mower.png";
import patio from "./patio.png";
import grill from "./grill.png";
import hotTub from "./hot-tub.png";
import bricks from "./bricks.png";
import wood from "./wood.png";
import flooring from "./flooring.png";
import officeChair from "./office-chair.png";
import filingCabinet from "./filing-cabinet.png";
import desk from "../desk-icon.png";
import yardWaste from "./yard-waste.png";
import treeBranch from "./tree-branch.png";
import chair from "./chair.png";
import cubicle from "./cubicle.png";
import piano from "./piano.png";
import safe from "./safe.png";
import crib from "./crib.png";
import stroller from "./stroller.png";
import shed from "./shed.png";
import carSeat from "./car-seat.png";
import tools from "./tools.png";

// Map item IDs to icon images
export const ITEM_ICONS: Record<string, string> = {
  // Couch variants
  "couch-basic": couch,
  "couch-futon": couch,
  "couch-reclining": couch,
  "couch-loveseat-reclining": couch,
  "couch-sleeper": couch,
  "couch-sectional-2": couch,
  "couch-sectional-3": couch,
  "couch-sectional-4": couch,
  "couch-sectional-5": couch,
  "couch-sectional-6": couch,
  "couch-sectional-sleeper": couch,
  "couch-sectional-recliner": couch,
  // Furniture
  "recliner": recliner,
  "coffee-table": table,
  "tv-stand": tvStand,
  "bookshelf": bookshelf,
  // Mattress/Bed variants
  "mattress-crib": mattress,
  "mattress-twin": mattress,
  "mattress-full": mattress,
  "mattress-queen": mattress,
  "mattress-king": mattress,
  "boxspring-twin": mattress,
  "boxspring-full": mattress,
  "boxspring-queen": mattress,
  "boxspring-king": mattress,
  "bed-frame": mattress,
  // Dresser variants
  "dresser-nightstand": dresser,
  "dresser-mirror": mirror,
  "dresser-lingerie": dresser,
  "dresser-vertical": dresser,
  "dresser-vertical-chest": dresser,
  "dresser-horizontal": dresser,
  "dresser-horizontal-chest": dresser,
  "dresser-double": dresser,
  "dresser-combo": dresser,
  "dresser-gentlemans": dresser,
  // Dining (legacy)
  "dining-table": table,
  "dining-chair": chair,
  // Table variants
  "table-coffee": table,
  "table-generic": table,
  "table-dining": table,
  "table-conference": table,
  // Vanity variants
  "vanity-small": mirror,
  "vanity-medium": mirror,
  "vanity-large": mirror,
  // Standalone furniture
  "chair-generic": chair,
  "stool": chair,
  "bench": chair,
  "ottoman": couch,
  "mirror": mirror,
  // Appliances
  "fridge": fridge,
  "mini-fridge": fridge,
  "freezer": fridge,
  "freezer-chest": fridge,
  "freezer-residential": fridge,
  "freezer-commercial": fridge,
  "washer": washer,
  "dryer": dryer,
  "dishwasher": dishwasher,
  "oven": oven,
  "microwave": microwave,
  "water-heater": waterHeater,
  "wine-cooler-small": fridge,
  "wine-cooler-large": fridge,
  "ice-machine": fridge,
  // Electronics
  "tv-small": tv,
  "tv-medium": tv,
  "tv-large": tv,
  "computer": computer,
  "printer": printer,
  "stereo": stereo,
  // Household
  "rug": rug,
  "exercise-equip": exercise,
  "treadmill": treadmill,
  "treadmill-residential": treadmill,
  "treadmill-commercial": treadmill,
  "elliptical": exercise,
  "exercise-bike": exercise,
  "rowing-machine": exercise,
  "stair-climber": exercise,
  "bag-of-junk": trashBag,
  "boxes": box,
  "storage-bin": box,
  // Bulk loads
  "load-small": truck,
  "load-medium": truck,
  "load-large": truck,
  "load-full": truck,
  // Outdoor
  "yard-waste": yardWaste,
  "tree-branch": treeBranch,
  "lawn-mower": lawnMower,
  "lawnmower-push": lawnMower,
  "lawnmower-riding": lawnMower,
  "patio-furniture": patio,
  "outdoor-furniture": patio,
  "outdoor-chair": chair,
  "outdoor-sectional": patio,
  "grill": grill,
  "hot-tub": hotTub,
  "shed": shed,
  "trampoline": exercise,
  // Construction
  "drywall": bricks,
  "wood-debris": wood,
  "flooring": flooring,
  "tiles-concrete": bricks,
  "countertop-laminate": bricks,
  "countertop-stone": bricks,
  // Office / Desk variants
  "desk-basic": desk,
  "desk-podium": desk,
  "desk-hutch": desk,
  "desk-l-shaped": desk,
  "desk-u-shaped": desk,
  "desk-motorized": desk,
  "desk-executive": desk,
  "desk-cubicle": cubicle,
  "office-chair": officeChair,
  "filing-cabinet": filingCabinet,
  // Heavy / Specialty
  "piano-upright": piano,
  "piano-grand": piano,
  "safe-small": safe,
  "safe-large": safe,
  "pool-table": table,
  // Baby items
  "baby-crib": crib,
  "baby-stroller": stroller,
  "baby-car-seat": carSeat,
  "baby-high-chair": chair,
  "baby-changing-table": dresser,
  // Miscellaneous
  "custom-xs": tools,
  "custom-s": tools,
  "custom-m": tools,
  "custom-l": tools,
  "mileage": truck,
  "lamp": box,
  "fan": box,
  "vacuum": box,
  "suitcase": box,
  "toolbox": tools,
  "toolbox-small": tools,
  "toolbox-freestanding": tools,
  "toolbox-large": tools,
  "misc-power-tools": tools,
  "ladder": tools,
  "misc-unlisted-small": box,
  "misc-unlisted-medium": box,
  "misc-unlisted-large": box,
};

// Virtual popular item icons
export const VIRTUAL_ICONS: Record<string, string> = {
  mattress,
  boxspring: mattress,
  couch,
  dresser,
  desk,
  table,
  freezer: fridge,
  toolbox: tools,
};
