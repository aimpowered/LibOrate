import { ZoomApiWrapper, VideoDimensions } from "@/lib/zoomapi";

export interface EnabledNameTagBadge {
  visible: boolean;
  preferredName: string;
  pronouns: string;
  disclosure: string;
}
interface DisabledBadge {
  visible: false;
}
interface EnabledHandWaveBadge {
  visible: true;
  waveText: string;
}
export type NameTagBadge = DisabledBadge | EnabledNameTagBadge;
export type HandWaveBadge = DisabledBadge | EnabledHandWaveBadge;

const DISABLED_BADGE = { visible: false } as const;

export class DrawBadgeApi {
  private nametag: NameTagBadge = DISABLED_BADGE;
  private handwave: HandWaveBadge = DISABLED_BADGE;

  constructor(private zoomApiWrapper: ZoomApiWrapper) {}

  private forceDrawing() {
    return this.zoomApiWrapper.setDrawImageCallback((v) =>
      drawEverythingToImage(v, this.nametag, this.handwave),
    );
  }

  drawNameTag(nametag: NameTagBadge) {
    this.nametag = nametag;
    return this.forceDrawing();
  }

  drawHandWave(handwave: HandWaveBadge) {
    this.handwave = handwave;
    return this.forceDrawing();
  }
}

// Iteratively descrease font size until finding the right size that fits.
function findRightFontSize(
  text: string,
  fontType: string,
  maxWidth: number,
  maxHeight: number,
  context: CanvasRenderingContext2D,
): number {
  // set initial font size
  let fontSize = 60;
  context.font = fontSize + "px " + fontType;
  let textMetrics = context.measureText(text);

  // lower the font size until the text fits within the bounds
  do {
    fontSize = fontSize - 1;
    context.font = fontSize + "px " + fontType;
    textMetrics = context.measureText(text);
  } while (
    textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft >
      maxWidth ||
    textMetrics.fontBoundingBoxAscent - textMetrics.fontBoundingBoxDescent >
      maxHeight
  );
  return fontSize;
}

function renderNameTagBadge(
  nametag: EnabledNameTagBadge,
  canvasWidth: number,
  canvasHeight: number,
  context: CanvasRenderingContext2D,
): void {
  const nametagTopLeftX = 0.75 * canvasWidth; // badge X offset
  const nametagTopLeftY = 0.8 * canvasHeight; // badge Y offset
  const nametagWidth = 0.25 * canvasWidth; // badge width
  const nametagHeight = 0.2 * canvasHeight; // badge height
  const marginX = nametagWidth / 40; // badge X margin
  const marginY = nametagHeight / 10; // badge Y margin

  // Draw the background
  context.fillStyle = "white";
  context.roundRect(
    nametagTopLeftX,
    nametagTopLeftY,
    nametagWidth,
    nametagHeight,
    10,
  );
  context.fill();

  // Draw the line
  context.strokeStyle = "#FFD700"; // bright yellow
  context.lineWidth = nametagWidth / 50;
  context.beginPath();
  // Starting point of the line
  context.moveTo(nametagTopLeftX + marginX, nametagTopLeftY + marginY);
  // Ending point of the line
  context.lineTo(
    nametagTopLeftX + marginX,
    nametagTopLeftY + nametagHeight - marginY,
  );
  context.stroke(); // Apply the stroke

  // Draw the text

  // First set fontface
  const fontFace = "Arial";

  // Then calculate the position of text
  // all text have the same X offset
  const textOffsetX = nametagTopLeftX + marginX * 2;
  // calculate Y offset for bottom row (disclosure)
  const disclosureOffsetY = nametagTopLeftY + nametagHeight - marginY;
  // calculate the height for each row of text
  const textRowHeight = (nametagHeight - 2 * marginY) / 3;
  // calcualte Y offset for middle row (pronoun)
  const pronounOffsetY = disclosureOffsetY - textRowHeight;
  // calcualte Y offset for top row (preferredname)
  const nameOffsetY = pronounOffsetY - textRowHeight;

  // Pick the right font size to fit the text within the badge
  // preferredName and disclosure have the same font size
  const longestText =
    nametag.preferredName.length > nametag.disclosure.length
      ? nametag.preferredName
      : nametag.disclosure;
  const nameFontSize = findRightFontSize(
    longestText,
    fontFace,
    nametagWidth - 3 * marginX, // max width for each row of text
    textRowHeight - marginY, // max height for each row of text
    context,
  );

  // Draw preferred name
  context.font = nameFontSize + "px " + fontFace;
  context.fillStyle = "black";
  context.fillText(nametag.preferredName, textOffsetX, nameOffsetY);

  // Draw pronoun (slightly smaller - 75%)
  const pronounFontSize = 0.75 * nameFontSize;
  context.font = pronounFontSize + "px " + fontFace;
  context.fillText(nametag.pronouns, textOffsetX, pronounOffsetY);

  // Draw disclosure (same size as preferred name)
  const disclosureFontSize = nameFontSize;
  context.font = disclosureFontSize + "px " + fontFace;
  context.fillText(nametag.disclosure, textOffsetX, disclosureOffsetY);
}

// TODO: make sure the handwave badge scale and resize correctly based on window size.
function drawEverythingToImage(
  video: VideoDimensions,
  nametag: NameTagBadge,
  handWave: HandWaveBadge,
): ImageData {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  canvas.width = video.width; // Width of the canvas
  canvas.height = video.height; // Height of the canvas

  context.clearRect(0, 0, canvas.width, canvas.height);
  if (nametag.visible) {
    renderNameTagBadge(nametag, canvas.width, canvas.height, context);
  }

  if (handWave.visible) {
    context.font = "50px Arial"; // Font size and style
    context.fillStyle = "black"; // Text color

    const textLength = handWave.waveText.length;
    context.fillStyle = "#d68071"; // Set the background color to white
    context.roundRect(60, 70, textLength * 15 + 80, 100, 30);
    context.fill();
    context.fillStyle = "white"; // White text color

    context.font = "bold 80px Arial"; // Larger font size
    context.fillText(handWave.waveText.substring(0, 3), 70, 150); // Draw the first character
    context.font = "bold 30px Arial";
    context.fillText(handWave.waveText.substring(3), 160, 130);
  }

  const newImageData = context.getImageData(0, 0, canvas.width, canvas.height);
  return newImageData;
}
