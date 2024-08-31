import blessed from 'blessed';

const screen = blessed.screen({ smartCSR: true, title: 'memwatcher', fullUnicode: true });
const tabs = ['tab1', 'tab2', 'tab3'];

const showTabContent = index => {
  box1.setContent(`Content for ${tabs[index]}`);
  box2.setContent(`Additional info for ${tabs[index]}`);
  bottomBox.setContent(`Detailed view for ${tabs[index]}`);
  screen.render();
};

const updateLayout = () => {
  const [h, w] = [screen.height, screen.width];
  const topH = Math.max(Math.floor(h * 0.3), 5);
  const bottomH = Math.max(Math.floor(h * 0.1), 3); // Ensure minimum height for visibility
  const boxW = Math.floor(w * 0.45);
  const bottomW = Math.floor(w * 0.6);

  Object.assign(box1, { top: 3, left: Math.floor((w - 2 * boxW) / 4), height: topH, width: boxW });
  Object.assign(box2, { top: 3, left: Math.floor(w / 2 + (w - 2 * boxW) / 4), height: topH, width: boxW });
  Object.assign(bottomBox, { top: topH + 3, left: Math.floor((w - bottomW) / 2), height: bottomH, width: bottomW });
  
  screen.render();
};

const tabNav = blessed.listbar({
  top: 0, left: 'center', width: '75%', height: 3, mouse: true, keys: true, border: { type: 'line' },
  style: { bg: 'red', item: { bg: 'blue', fg: 'white', hover: { bg: 'green' } }, selected: { bg: 'green', fg: 'red' } },
  commands: tabs.reduce((cmds, tab, i) => ({ ...cmds, [tab]: { keys: [tab[0]], callback: () => showTabContent(i) } }), {})
});

const createBox = () => blessed.box({ border: { type: 'line' }, style: { bg: 'blue', border: { fg: 'yellow' } } });

const [box1, box2, bottomBox] = [createBox(), createBox(), createBox()];

[tabNav, box1, box2, bottomBox].forEach(el => screen.append(el));
updateLayout();
screen.on('resize', updateLayout);
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
