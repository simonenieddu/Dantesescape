# Design Guidelines: Dante's Labyrinth Game

## Design Approach

**Reference-Based Approach**: Drawing inspiration from classic Pac-Man arcade aesthetics while incorporating Italian Renaissance and medieval literary themes from Dante's Divine Comedy. The design balances nostalgic retro gaming with cultural richness.

## Core Design Principles

1. **Retro Arcade Modernized**: Classic pixel-art inspired visuals with contemporary polish and smooth animations
2. **Literary Elegance**: Medieval Italian aesthetic with parchment textures, illuminated manuscript influences, and classical typography
3. **Clear Readability**: High contrast between game elements and maze for optimal playability
4. **Atmospheric Storytelling**: Visual elements that evoke the journey through Dante's Inferno

## Typography

**Primary Font**: "Cinzel" (Google Fonts) - Medieval serif for headings and UI labels
**Secondary Font**: "Crimson Text" (Google Fonts) - Readable serif for body text and instructions
**Game Font**: "Press Start 2P" (Google Fonts) - Retro pixel font for score and game status

**Hierarchy**:
- Game Title: Cinzel Bold, 48px (lg: 64px)
- UI Labels: Cinzel Regular, 20px (lg: 24px)
- Score/Stats: Press Start 2P, 16px (lg: 18px)
- Instructions: Crimson Text Regular, 16px (lg: 18px)

## Layout System

**Spacing Units**: Tailwind units of 2, 4, 8, and 16 for consistent rhythm
- Game container padding: p-4 (mobile), p-8 (desktop)
- UI element spacing: gap-4 between components
- Section margins: mb-8 for separation

**Game Canvas Layout**:
- Center-aligned game board with max-width container
- Fixed aspect ratio maze (square or 4:3) that scales responsively
- HUD elements positioned above or beside the game board
- Mobile: Vertical stack (HUD → Game → Controls)
- Desktop: Horizontal layout (HUD left → Game center → Stats right)

## Component Library

### Game Interface Components

**Start Screen**:
- Full-screen centered overlay with parchment texture background
- Large ornate title "DANTE'S LABYRINTH" with decorative flourishes
- Subtitle: "Fuggi dalle Fiere" (Escape from the Beasts)
- Prominent "INIZIA PARTITA" (Start Game) button
- How to play section with key controls visualization
- High score display in decorative frame

**Game Canvas**:
- Bordered maze with stone/brick texture treatment
- Grid-based pathways with medieval floor patterns
- Walls rendered as ancient stone blocks or manuscript borders

**Character Design**:
- **Dante**: Red circular marker with subtle laurel wreath detail, animated movement
- **Lupo (Wolf)**: Gray with fierce eyes, prowling animation
- **Leone (Lion)**: Golden/tan with mane detail, stalking animation  
- **Leopardo (Leopard)**: Spotted pattern, swift movement animation
- All characters: Sprite-based with directional facing and smooth transitions

**Collectibles**:
- **Puntini (Dots)**: Small golden coins or manuscript dots scattered throughout maze
- **Corona d'Alloro (Laurel Crown)**: Glowing golden wreath, larger and prominent, pulsing animation

**HUD Elements**:
- Score counter in decorative medieval frame (top left)
- Lives indicator showing Dante icons (top center)
- Power-up timer with circular countdown (when active)
- Level indicator in ornate badge
- All HUD elements use parchment or stone texture backgrounds

**Game Over/Victory Screen**:
- Overlay modal with dramatic announcement
- Victory: "SALVATO!" with triumphant imagery
- Defeat: "PERDUTO!" with somber aesthetic
- Final score in large decorative numerals
- "RIPROVA" (Try Again) and "MENU" buttons
- Background darkened with vignette effect

### Visual Treatments

**Power-Up State**:
- Dante glows with golden aura when powered by laurel crown
- Enemies change to fleeing state (blue-tinted, scared expression)
- Maze lighting subtly brightens

**Animation Guidelines**:
- Character movement: Smooth 60fps transitions between grid cells
- Collectible gathering: Quick scale-up and fade-out on collection
- Enemy AI: Distinct movement patterns per beast (wolf aggressive, lion strategic, leopard fast)
- Power-up activation: Brief flash and character transformation
- Game events: Celebratory particles for wins, dramatic for defeats

### Responsive Behavior

**Mobile (< 768px)**:
- Game canvas scales to fit screen width with 16px margins
- Touch controls: Virtual D-pad overlaid on bottom
- HUD elements stack vertically above game
- Simplified animations for performance

**Desktop (≥ 768px)**:
- Larger game canvas (600-800px square)
- Keyboard controls prominently displayed
- Side panels for stats and upcoming features
- Enhanced particle effects and shadows

## Accessibility

- High contrast maze elements for visibility
- WASD and Arrow key support for controls
- Pause functionality with Spacebar or P
- Clear visual feedback for all game states
- Screen reader announcements for score and game events

## Images

**Background Texture**: Subtle parchment or aged paper texture overlay on game container, low opacity (10-15%) to maintain playability

**Character Sprites**: Use Font Awesome or Material Icons as placeholders:
- Dante: Circle with "D" or user icon in red
- Lupo: Wolf icon or paw print
- Leone: Lion head icon
- Leopardo: Cat/leopard icon

**Start Screen Hero**: Decorative illustration of Dante in the dark forest with the three beasts (wolf, lion, leopard) in background, dramatic lighting - OR - ornate manuscript-style border frame with title

No large hero image needed; focus on game canvas as primary visual

## Technical Notes

- Game loop at 60fps for smooth animations
- Sprite-based rendering for character movement
- Grid-based collision detection
- Local storage for high score persistence
- Sound effects: Retro blips for collection, power-up jingle, chase music (optional)

This design creates an immersive retro gaming experience with rich Italian literary theming, ensuring both nostalgic appeal and cultural depth.