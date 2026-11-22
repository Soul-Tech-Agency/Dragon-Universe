/**
 * Extra buttons of the Star Navigator menu, without imports: space_planets.js reads this list and the modules that add a
 * button (world_landmarks.js) never have to be imported by space_planets.js, so no import cycle is created.
 * Each extra: { label: RawMessage, open: async (player) => void }.
 */
const extras = [];

export function addNavigatorExtra(extra) {
  extras.push(extra);
}

export function navigatorExtras() {
  return extras;
}
